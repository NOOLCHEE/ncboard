import type { D1Database, D1PreparedStatement, Fetcher } from '@cloudflare/workers-types';

export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
}

type BoardType = 'general' | 'docs' | 'bookmarks';

interface Attachment {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
}

interface BookmarkLink {
  id: string;
  label: string;
  url: string;
}

interface Post {
  id: string;
  number: number;
  boardType: BoardType;
  title: string;
  content: string;
  attachments: Attachment[];
  links?: BookmarkLink[];
  linkUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface PostRow {
  id: string;
  number: number;
  board_type: BoardType;
  title: string;
  content: string;
  links_json: string | null;
  link_url: string | null;
  created_at: string;
  updated_at: string;
}

interface AttachmentRow {
  id: string;
  post_id: string;
  original_name: string;
  mime_type: string;
  size: number;
}

const CHUNK_SIZE = 256 * 1024;
const MAX_FILES_PER_POST = 10;
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const MAX_FILE_NAME_LENGTH = 255;

// 브라우저에서 바로 열어도(inline) 안전한 형식만 허용합니다.
const INLINE_SAFE_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'image/avif',
  'image/bmp',
  'image/x-icon',
  'image/vnd.microsoft.icon',
  'application/pdf',
]);
// SVG는 <img>로는 보여주되, 주소로 직접 열면 항상 다운로드되게 합니다. (스크립트 실행 방지)
const IMAGE_ONLY_MIME_TYPES = new Set(['image/svg+xml']);

class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

let schemaPromise: Promise<void> | null = null;

async function ensureSchema(db: D1Database): Promise<void> {
  if (!schemaPromise) {
    schemaPromise = db
      .batch([
        db.prepare(
          `CREATE TABLE IF NOT EXISTS posts (
            id TEXT PRIMARY KEY,
            number INTEGER NOT NULL,
            board_type TEXT NOT NULL,
            title TEXT NOT NULL,
            content TEXT NOT NULL DEFAULT '',
            links_json TEXT,
            link_url TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
          )`
        ),
        db.prepare(
          `CREATE INDEX IF NOT EXISTS idx_posts_board_created ON posts (board_type, created_at DESC)`
        ),
        db.prepare(
          `CREATE TABLE IF NOT EXISTS attachments (
            id TEXT PRIMARY KEY,
            post_id TEXT NOT NULL,
            original_name TEXT NOT NULL,
            mime_type TEXT NOT NULL,
            size INTEGER NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
          )`
        ),
        db.prepare(`CREATE INDEX IF NOT EXISTS idx_attachments_post ON attachments (post_id)`),
        db.prepare(
          `CREATE TABLE IF NOT EXISTS file_chunks (
            attachment_id TEXT NOT NULL,
            chunk_index INTEGER NOT NULL,
            data BLOB NOT NULL,
            PRIMARY KEY (attachment_id, chunk_index),
            FOREIGN KEY (attachment_id) REFERENCES attachments(id) ON DELETE CASCADE
          )`
        ),
      ])
      .then(() => undefined)
      .catch((err) => {
        schemaPromise = null;
        throw err;
      });
  }
  await schemaPromise;
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

function isValidBoardType(value: unknown): value is BoardType {
  return value === 'general' || value === 'docs' || value === 'bookmarks';
}

function isSafeId(id: string): boolean {
  return /^[a-zA-Z0-9_-]{1,128}$/.test(id);
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    throw new HttpError(400, '잘못된 요청 주소입니다.');
  }
}

async function readFormData(request: Request): Promise<FormData> {
  try {
    return await request.formData();
  } catch {
    throw new HttpError(400, '요청 형식이 올바르지 않습니다.');
  }
}

function parseJsonArray<T>(raw: unknown): T[] {
  if (typeof raw !== 'string' || !raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function normalizeBookmarkLinks(rawLinks: unknown): BookmarkLink[] {
  const arr = parseJsonArray<Partial<BookmarkLink>>(rawLinks);
  const result: BookmarkLink[] = [];
  for (const item of arr) {
    if (!item || typeof item.url !== 'string') continue;
    const url = item.url.trim();
    if (!url || /^https?:\/\/$/i.test(url)) continue;
    const safeUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    result.push({
      id: typeof item.id === 'string' && item.id.trim() ? item.id.trim() : crypto.randomUUID(),
      label: typeof item.label === 'string' ? item.label.trim() : '',
      url: safeUrl,
    });
  }
  return result;
}

function toUint8Array(value: unknown): Uint8Array {
  if (value instanceof Uint8Array) return value;
  if (value instanceof ArrayBuffer) return new Uint8Array(value);
  if (Array.isArray(value)) return new Uint8Array(value);
  return new Uint8Array(0);
}

// ---------------------------------------------------------------------------
// 파일 이름 / 다운로드 헤더
// ---------------------------------------------------------------------------

function sanitizeFileName(raw: unknown, fallback: string): string {
  const base = typeof raw === 'string' ? raw : '';
  const cleaned = base
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .replace(/[\\/]/g, '_')
    .trim()
    .slice(0, MAX_FILE_NAME_LENGTH);
  return cleaned || fallback || 'file';
}

function buildContentDisposition(type: 'inline' | 'attachment', filename: string): string {
  // 구형 클라이언트용 ASCII 대체 이름 + RFC 5987 인코딩 이름
  const fallback = filename.replace(/[^\x20-\x7e]/g, '_').replace(/["\\]/g, '_');
  const encoded = encodeURIComponent(filename).replace(
    /['()*]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`
  );
  return `${type}; filename="${fallback}"; filename*=UTF-8''${encoded}`;
}

// ---------------------------------------------------------------------------
// 문서(docs) HTML 서버 측 정화 (클라이언트 sanitizeDocHtml과 같은 규칙, 2차 방어선)
// ---------------------------------------------------------------------------

const DOC_ALLOWED_TAGS = new Set([
  'p', 'div', 'br', 'h1', 'h2', 'h3', 'strong', 'b', 'em', 'i',
  'u', 's', 'strike', 'ul', 'ol', 'li', 'hr', 'a', 'span', 'font', 'input',
]);

// 내용까지 통째로 제거할 태그. textarea/title 등은 내용이 "원시 텍스트"라서
// 태그만 벗기면 안쪽 문자열이 다시 HTML로 해석될 수 있어 함께 제거합니다.
const DOC_DROP_TAGS = new Set([
  'script', 'style', 'iframe', 'object', 'embed', 'svg', 'math',
  'textarea', 'title', 'xmp', 'noembed', 'noframes', 'noscript', 'plaintext', 'template',
]);

function isSafeHref(href: string): boolean {
  const trimmed = String(href || '').trim();
  if (!trimmed) return false;
  if (trimmed.startsWith('/') || trimmed.startsWith('#')) return true;
  return /^(https?:|mailto:)/i.test(trimmed);
}

function sanitizeStyle(styleText: string): string {
  const safe: string[] = [];
  for (const decl of styleText.split(';')) {
    const idx = decl.indexOf(':');
    if (idx === -1) continue;
    const prop = decl.slice(0, idx).trim().toLowerCase();
    const val = decl.slice(idx + 1).trim();
    if (!val || /url\(|expression\(|[\\<>]/i.test(val)) continue;
    if (prop === 'font-size' || prop === 'color' || prop === 'background-color') {
      safe.push(`${prop}: ${val}`);
    }
  }
  return safe.join('; ');
}

function sanitizeDocElement(el: Element): void {
  const tag = el.tagName.toLowerCase();
  if (DOC_DROP_TAGS.has(tag)) {
    el.remove();
    return;
  }
  if (!DOC_ALLOWED_TAGS.has(tag)) {
    el.removeAndKeepContent();
    return;
  }

  // 허용 목록 방식: 기존 속성을 전부 지우고, 검증을 통과한 것만 다시 설정합니다.
  const attrs = new Map<string, string>();
  for (const [name, value] of Array.from(el.attributes)) attrs.set(name.toLowerCase(), value);
  for (const name of attrs.keys()) el.removeAttribute(name);

  if (tag === 'input') {
    if ((attrs.get('type') ?? '').toLowerCase() !== 'checkbox') {
      el.remove();
      return;
    }
    el.setAttribute('type', 'checkbox');
    if (attrs.has('checked')) el.setAttribute('checked', '');
    return;
  }

  if (tag === 'div' && attrs.get('data-checklist') === 'true') {
    el.setAttribute('data-checklist', 'true');
  }
  if (tag === 'a') {
    const href = (attrs.get('href') ?? '').trim();
    if (isSafeHref(href)) {
      el.setAttribute('href', href);
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
    }
  }
  if (tag === 'font') {
    const color = attrs.get('color');
    const size = attrs.get('size');
    if (color) el.setAttribute('color', color);
    if (size) el.setAttribute('size', size);
  }
  const rawStyle = attrs.get('style');
  if (rawStyle) {
    const cleaned = sanitizeStyle(rawStyle);
    if (cleaned) el.setAttribute('style', cleaned);
  }
}

async function sanitizeDocContent(html: string): Promise<string> {
  // 태그가 없는 예전 일반 텍스트는 그대로 둡니다. (화면에서 이스케이프되어 표시됨)
  if (!html || !/<[a-z][\s\S]*>/i.test(html)) return html;
  try {
    const rewriter = new HTMLRewriter()
      .onDocument({
        comments(comment) {
          comment.remove();
        },
      })
      .on('*', {
        element(el) {
          sanitizeDocElement(el);
        },
      });
    // HTMLRewriter는 Content-Type이 text/html인 응답만 변환합니다.
    const res = rewriter.transform(
      new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
    );
    return await res.text();
  } catch (err) {
    console.error('doc sanitize failed', err);
    throw new HttpError(400, '문서 내용을 처리할 수 없습니다. 내용을 확인해 주세요.');
  }
}

// ---------------------------------------------------------------------------
// DB 조회
// ---------------------------------------------------------------------------

function buildPost(row: PostRow, attachments: Attachment[]): Post {
  const links = row.links_json ? parseJsonArray<BookmarkLink>(row.links_json) : undefined;
  return {
    id: row.id,
    number: row.number,
    boardType: row.board_type,
    title: row.title,
    content: row.content,
    attachments,
    ...(links && links.length > 0 ? { links, linkUrl: row.link_url ?? links[0]?.url } : {}),
    ...(row.link_url && (!links || links.length === 0) ? { linkUrl: row.link_url } : {}),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toAttachment(row: AttachmentRow): Attachment {
  return {
    id: row.id,
    originalName: row.original_name,
    mimeType: row.mime_type,
    size: row.size,
  };
}

async function listAllPosts(db: D1Database): Promise<Post[]> {
  const postsRes = await db.prepare('SELECT * FROM posts ORDER BY created_at DESC').all<PostRow>();
  const attRes = await db
    .prepare('SELECT id, post_id, original_name, mime_type, size FROM attachments ORDER BY created_at ASC')
    .all<AttachmentRow>();

  const attMap = new Map<string, Attachment[]>();
  for (const row of attRes.results ?? []) {
    const list = attMap.get(row.post_id) ?? [];
    list.push(toAttachment(row));
    attMap.set(row.post_id, list);
  }

  return (postsRes.results ?? []).map((row) => buildPost(row, attMap.get(row.id) ?? []));
}

async function getPostById(db: D1Database, postId: string): Promise<Post | null> {
  const row = await db.prepare('SELECT * FROM posts WHERE id = ?').bind(postId).first<PostRow>();
  if (!row) return null;

  const attRes = await db
    .prepare('SELECT id, post_id, original_name, mime_type, size FROM attachments WHERE post_id = ? ORDER BY created_at ASC')
    .bind(postId)
    .all<AttachmentRow>();

  return buildPost(row, (attRes.results ?? []).map(toAttachment));
}

async function readAttachmentBytes(db: D1Database, attachmentId: string): Promise<Uint8Array | null> {
  const res = await db
    .prepare('SELECT data FROM file_chunks WHERE attachment_id = ? ORDER BY chunk_index ASC')
    .bind(attachmentId)
    .all<{ data: unknown }>();
  const rows = res.results ?? [];
  if (rows.length === 0) return null;

  const chunks = rows.map((r) => toUint8Array(r.data));
  const totalLen = chunks.reduce((sum, c) => sum + c.byteLength, 0);
  const merged = new Uint8Array(totalLen);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return merged;
}

// ---------------------------------------------------------------------------
// 첨부 파일 처리
// ---------------------------------------------------------------------------

function extractFiles(formData: FormData): File[] {
  return formData
    .getAll('files')
    .filter((f): f is File => typeof f === 'object' && f !== null && 'arrayBuffer' in f);
}

// existingCount: 이번 요청 이후에도 남아 있을 기존 첨부 개수
function validateNewFiles(files: File[], existingCount: number): void {
  if (existingCount + files.length > MAX_FILES_PER_POST) {
    throw new HttpError(400, `첨부 파일은 게시글당 최대 ${MAX_FILES_PER_POST}개까지만 올릴 수 있습니다.`);
  }
  for (const file of files) {
    if (file.size > MAX_FILE_SIZE) {
      throw new HttpError(400, '파일당 최대 1MB까지만 업로드할 수 있습니다.');
    }
  }
}

function buildAttachmentStatements(
  db: D1Database,
  postId: string,
  att: Attachment,
  bytes: Uint8Array,
  now: string
): D1PreparedStatement[] {
  const statements: D1PreparedStatement[] = [
    db
      .prepare(
        'INSERT INTO attachments (id, post_id, original_name, mime_type, size, created_at) VALUES (?, ?, ?, ?, ?, ?)'
      )
      .bind(att.id, postId, att.originalName, att.mimeType, att.size, now),
  ];

  const totalChunks = Math.max(1, Math.ceil(bytes.byteLength / CHUNK_SIZE));
  for (let i = 0; i < totalChunks; i += 1) {
    const slice = bytes.subarray(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
    statements.push(
      db
        .prepare('INSERT INTO file_chunks (attachment_id, chunk_index, data) VALUES (?, ?, ?)')
        .bind(att.id, i, slice)
    );
  }
  return statements;
}

async function prepareNewAttachments(
  db: D1Database,
  postId: string,
  files: File[],
  customNames: string[],
  now: string
): Promise<D1PreparedStatement[]> {
  const statements: D1PreparedStatement[] = [];
  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    const bytes = new Uint8Array(await file.arrayBuffer());
    const att: Attachment = {
      id: crypto.randomUUID(),
      originalName: sanitizeFileName(customNames[i], sanitizeFileName(file.name, 'file')),
      mimeType: file.type || 'application/octet-stream',
      size: file.size,
    };
    statements.push(...buildAttachmentStatements(db, postId, att, bytes, now));
  }
  return statements;
}

// ---------------------------------------------------------------------------
// 요청 처리
// ---------------------------------------------------------------------------

export async function handleApiRequest(request: Request, env: Env): Promise<Response> {
  if (!env?.DB) {
    return json(
      { error: 'Cloudflare D1 바인딩(DB)이 설정되지 않았습니다. Worker Settings → Bindings에서 DB를 연결해 주세요.' },
      500
    );
  }

  const url = new URL(request.url);
  const pathname = url.pathname;
  const method = request.method.toUpperCase();

  try {
    await ensureSchema(env.DB);

    // 1. GET /api/posts
    if (method === 'GET' && pathname === '/api/posts') {
      const posts = await listAllPosts(env.DB);
      return json({ posts });
    }

    // 2. POST /api/posts
    if (method === 'POST' && pathname === '/api/posts') {
      const formData = await readFormData(request);
      const boardType = formData.get('boardType');
      const titleRaw = formData.get('title');
      const contentRaw = formData.get('content');

      const title = typeof titleRaw === 'string' ? titleRaw.trim() : '';
      let content = typeof contentRaw === 'string' ? contentRaw : '';

      if (!isValidBoardType(boardType)) {
        return json({ error: '유효하지 않은 게시판 유형입니다.' }, 400);
      }
      if (!title) {
        return json({ error: '제목을 입력해 주세요.' }, 400);
      }

      const links =
        boardType === 'bookmarks' ? normalizeBookmarkLinks(formData.get('links')) : undefined;
      if (boardType === 'bookmarks' && (!links || links.length === 0)) {
        return json({ error: '최소 1개 이상의 링크 주소를 입력해 주세요.' }, 400);
      }

      if (boardType === 'docs') {
        content = await sanitizeDocContent(content);
      }

      const fileEntries = boardType === 'general' ? extractFiles(formData) : [];
      validateNewFiles(fileEntries, 0);

      const postId = crypto.randomUUID();
      const now = new Date().toISOString();

      // 글 번호 계산과 INSERT를 한 문장으로 처리해서 동시 작성 시 번호가 겹치지 않게 합니다.
      const insertPost = env.DB
        .prepare(
          `INSERT INTO posts (id, number, board_type, title, content, links_json, link_url, created_at, updated_at)
           SELECT ?, COALESCE(MAX(number), 0) + 1, ?, ?, ?, ?, ?, ?, ?
           FROM posts WHERE board_type = ?`
        )
        .bind(
          postId,
          boardType,
          title,
          content,
          links ? JSON.stringify(links) : null,
          links ? links[0]?.url ?? null : null,
          now,
          now,
          boardType
        );

      const customNames = parseJsonArray<string>(formData.get('fileNames'));
      const attachmentStatements = await prepareNewAttachments(
        env.DB,
        postId,
        fileEntries,
        customNames,
        now
      );

      // 글 + 첨부를 한 번에(전부 성공하거나 전부 취소) 저장합니다.
      await env.DB.batch([insertPost, ...attachmentStatements]);

      const created = await getPostById(env.DB, postId);
      return json({ post: created }, 201);
    }

    // 3. PUT /api/posts/:id
    const postMatch = pathname.match(/^\/api\/posts\/([^/]+)$/);
    if (method === 'PUT' && postMatch) {
      const postId = safeDecode(postMatch[1]);
      const existing = await getPostById(env.DB, postId);
      if (!existing) {
        return json({ error: '게시글을 찾을 수 없습니다.' }, 404);
      }

      const formData = await readFormData(request);
      const titleField = formData.get('title');
      const contentField = formData.get('content');
      const linksField = formData.get('links');

      const nextTitle = typeof titleField === 'string' ? titleField.trim() : existing.title;
      if (!nextTitle) {
        return json({ error: '제목을 입력해 주세요.' }, 400);
      }
      let nextContent = typeof contentField === 'string' ? contentField : existing.content;
      if (existing.boardType === 'docs' && typeof contentField === 'string') {
        nextContent = await sanitizeDocContent(nextContent);
      }

      let nextLinksJson = existing.links ? JSON.stringify(existing.links) : null;
      let nextLinkUrl = existing.linkUrl ?? null;
      if (existing.boardType === 'bookmarks' && linksField !== null) {
        const parsedLinks = normalizeBookmarkLinks(linksField);
        if (parsedLinks.length === 0) {
          return json({ error: '최소 1개 이상의 링크 주소를 입력해 주세요.' }, 400);
        }
        nextLinksJson = JSON.stringify(parsedLinks);
        nextLinkUrl = parsedLinks[0]?.url ?? null;
      }

      const isGeneral = existing.boardType === 'general';
      const fileEntries = isGeneral ? extractFiles(formData) : [];

      // 이 게시글에 실제로 속한 첨부만 삭제 대상으로 인정합니다.
      const requestedRemoveIds = new Set(
        isGeneral ? parseJsonArray<string>(formData.get('removeFileIds')).filter(isSafeId) : []
      );
      const ownedRemoveIds = existing.attachments
        .map((a) => a.id)
        .filter((id) => requestedRemoveIds.has(id));

      validateNewFiles(fileEntries, existing.attachments.length - ownedRemoveIds.length);

      const now = new Date().toISOString();
      const statements: D1PreparedStatement[] = [
        env.DB
          .prepare(
            'UPDATE posts SET title = ?, content = ?, links_json = ?, link_url = ?, updated_at = ? WHERE id = ?'
          )
          .bind(nextTitle, nextContent, nextLinksJson, nextLinkUrl, now, postId),
      ];

      for (const attId of ownedRemoveIds) {
        statements.push(
          env.DB
            .prepare(
              'DELETE FROM file_chunks WHERE attachment_id IN (SELECT id FROM attachments WHERE id = ? AND post_id = ?)'
            )
            .bind(attId, postId),
          env.DB
            .prepare('DELETE FROM attachments WHERE id = ? AND post_id = ?')
            .bind(attId, postId)
        );
      }

      if (isGeneral) {
        const customNames = parseJsonArray<string>(formData.get('fileNames'));
        statements.push(
          ...(await prepareNewAttachments(env.DB, postId, fileEntries, customNames, now))
        );
      }

      await env.DB.batch(statements);

      const updated = await getPostById(env.DB, postId);
      return json({ post: updated });
    }

    // 4. DELETE /api/posts/:id
    if (method === 'DELETE' && postMatch) {
      const postId = safeDecode(postMatch[1]);
      const exists = await env.DB
        .prepare('SELECT id FROM posts WHERE id = ?')
        .bind(postId)
        .first<{ id: string }>();
      if (!exists) {
        return json({ error: '게시글을 찾을 수 없습니다.' }, 404);
      }

      await env.DB.batch([
        env.DB
          .prepare(
            'DELETE FROM file_chunks WHERE attachment_id IN (SELECT id FROM attachments WHERE post_id = ?)'
          )
          .bind(postId),
        env.DB.prepare('DELETE FROM attachments WHERE post_id = ?').bind(postId),
        env.DB.prepare('DELETE FROM posts WHERE id = ?').bind(postId),
      ]);
      return json({ success: true });
    }

    // 5. GET /api/files/:id/(preview|download)
    const fileMatch = pathname.match(/^\/api\/files\/([^/]+)\/(preview|download)$/);
    if (method === 'GET' && fileMatch) {
      const fileId = safeDecode(fileMatch[1]);
      const mode = fileMatch[2];
      if (!isSafeId(fileId)) {
        return json({ error: '잘못된 파일 요청입니다.' }, 400);
      }

      const meta = await env.DB
        .prepare('SELECT original_name, mime_type FROM attachments WHERE id = ?')
        .bind(fileId)
        .first<{ original_name: string; mime_type: string }>();
      if (!meta) {
        return json({ error: '파일을 찾을 수 없습니다.' }, 404);
      }

      const bytes = await readAttachmentBytes(env.DB, fileId);
      if (!bytes) {
        return json({ error: '파일 데이터를 찾을 수 없습니다.' }, 404);
      }

      // 저장된 MIME은 업로드한 사람이 정한 값이라 그대로 믿지 않습니다.
      const storedMime = (meta.mime_type || '').split(';')[0].trim().toLowerCase();
      const inlineSafe = INLINE_SAFE_MIME_TYPES.has(storedMime);
      const knownType = inlineSafe || IMAGE_ONLY_MIME_TYPES.has(storedMime);
      const disposition = mode === 'preview' && inlineSafe ? 'inline' : 'attachment';

      const headers: Record<string, string> = {
        'Content-Type': knownType ? storedMime : 'application/octet-stream',
        'Content-Disposition': buildContentDisposition(disposition, meta.original_name),
        'X-Content-Type-Options': 'nosniff',
      };
      // PDF는 브라우저 뷰어가 sandbox CSP에서 동작하지 않아 제외합니다.
      if (storedMime !== 'application/pdf') {
        headers['Content-Security-Policy'] = "sandbox; default-src 'none'";
      }

      const arrayBuf = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
      return new Response(arrayBuf, { headers });
    }

    return json({ error: 'Not Found' }, 404);
  } catch (err) {
    if (err instanceof HttpError) {
      return json({ error: err.message }, err.status);
    }
    // 내부 오류 내용은 로그에만 남기고, 응답에는 노출하지 않습니다.
    console.error('API error', err);
    return json({ error: '서버 오류가 발생했습니다.' }, 500);
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) {
      return handleApiRequest(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};