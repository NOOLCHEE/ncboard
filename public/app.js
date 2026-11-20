(() => {
  const BOARDS = ['general', 'docs', 'bookmarks'];
  const BOARD_LABELS = {
    general: '자유게시판',
    docs: '문서',
    bookmarks: '즐겨찾기',
  };
  const PAGE_SIZE_OPTIONS = [10, 20, 50];
  const MAX_FILES_PER_POST = 10;
  const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

  const FONT_SIZES = [
    { label: '12px (작게)', value: '12px' },
    { label: '14px', value: '14px' },
    { label: '15px (기본)', value: '15px' },
    { label: '18px (조금 크게)', value: '18px' },
    { label: '22px (크게)', value: '22px' },
    { label: '28px (제목 크기)', value: '28px' },
  ];
  const TEXT_COLORS = [
    { label: '검정 (기본)', value: '#171717' },
    { label: '회색', value: '#737373' },
    { label: '빨강', value: '#DC2626' },
    { label: '주황', value: '#EA580C' },
    { label: '초록', value: '#16A34A' },
    { label: '파랑', value: '#2563EB' },
    { label: '보라', value: '#7C3AED' },
  ];
  const BG_COLORS = [
    { label: '없음', value: 'transparent' },
    { label: '노랑', value: '#FEF08A' },
    { label: '연두', value: '#DCFCE7' },
    { label: '하늘', value: '#DBEAFE' },
    { label: '분홍', value: '#FCE7F3' },
    { label: '보라', value: '#EDE9FE' },
    { label: '회색', value: '#F3F4F6' },
  ];
  const SPECIAL_SYMBOLS = [
    '→', '←', '↑', '↓', '↔', '⇒', '•', '◦',
    '▪', '▫', '★', '☆', '♥', '✓', '✔', '✕',
    '※', '◎', '○', '●', '□', '■', '△', '▲',
    '①', '②', '③', '④', '⑤', '℃', '₩', '±',
    '×', '÷', '≠', '≤', '≥', '∞', '·', '…',
    '「', '」', '『', '』', '⚠', '☎', '✉', '☑',
  ];

  const ICONS = {
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
    search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
    penLine: '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4Z"/>',
    chevronLeft: '<polyline points="15 18 9 12 15 6"/>',
    chevronRight: '<polyline points="9 18 15 12 9 6"/>',
    chevronsLeft: '<polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/>',
    chevronsRight: '<polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/>',
    chevronDown: '<polyline points="6 9 12 15 18 9"/>',
    externalLink: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',
    paperclip: '<path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>',
    arrowLeft: '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
    pencil: '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>',
    trash2: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>',
    fileText: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
    plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
    x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    checkCircle2: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    alertCircle: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
    type: '<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>',
    baseline: '<path d="M4 20h16"/><path d="m6 16 6-12 6 12"/><path d="M8 12h8"/>',
    highlighter: '<path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/>',
    bold: '<path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"/>',
    italic: '<line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/>',
    underline: '<path d="M6 4v6a6 6 0 0 0 12 0V4"/><line x1="4" y1="20" x2="20" y2="20"/>',
    strikethrough: '<path d="M16 4H9a3 3 0 0 0-2.83 4"/><path d="M14 12a4 4 0 0 1 0 8H6"/><line x1="4" y1="12" x2="20" y2="12"/>',
    list: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>',
    listOrdered: '<line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>',
    checkSquare: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="m9 12 2 2 4-4"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    minus: '<line x1="5" y1="12" x2="19" y2="12"/>',
  };

  function svgIcon(name, extraClass = '') {
    const body = ICONS[name] || '';
    return `<svg class="icon ${extraClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  }

  // 소스에 HTML 엔티티가 글자 그대로 남지 않도록 앰퍼샌드를 \u0026으로 씁니다.
  // (복사·붙여넣기나 에디터에서 엔티티가 풀려 문법 오류가 나는 것을 막기 위함)
  const HTML_ESCAPES = {
    '&': '\u0026amp;',
    '<': '\u0026lt;',
    '>': '\u0026gt;',
    '"': '\u0026quot;',
    "'": '\u0026#39;',
  };

  function escapeHtml(str) {
    return String(str ?? '').replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);
  }

  function formatDate(isoString) {
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) return '-';
    const yy = String(d.getFullYear()).slice(-2);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yy}.${mm}.${dd}`;
  }

  function formatDateTime(isoString) {
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) return '-';
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
  }

  function formatBytes(bytes) {
    if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    let v = bytes;
    let i = 0;
    while (v >= 1024 && i < units.length - 1) {
      v /= 1024;
      i += 1;
    }
    const formatted = i === 0 ? String(Math.round(v)) : v.toFixed(1).replace(/\.0$/, '');
    return `${formatted} ${units[i]}`;
  }

  function isImageAttachment(mimeType, filename) {
    if (mimeType && mimeType.toLowerCase().startsWith('image/')) return true;
    return /\.(png|jpe?g|gif|webp|svg|bmp|avif|ico)$/i.test(filename || '');
  }

  function isSafeHref(href) {
    const trimmed = String(href || '').trim();
    if (!trimmed) return false;
    if (trimmed.startsWith('/') || trimmed.startsWith('#')) return true;
    return /^(https?:|mailto:)/i.test(trimmed);
  }

  function safeExternalUrl(url) {
    const trimmed = String(url || '').trim();
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return '#';
  }

  // HTML Sanitizer for WYSIWYG Docs
  const ALLOWED_TAGS = new Set([
    'p', 'div', 'br', 'h1', 'h2', 'h3', 'strong', 'b', 'em', 'i',
    'u', 's', 'strike', 'ul', 'ol', 'li', 'hr', 'a', 'span', 'font', 'input',
  ]);
  const DROP_TAGS = new Set(['script', 'style', 'iframe', 'object', 'embed', 'svg', 'math']);

  function sanitizeStyle(styleText) {
    const safe = [];
    for (const decl of styleText.split(';')) {
      const idx = decl.indexOf(':');
      if (idx === -1) continue;
      const prop = decl.slice(0, idx).trim().toLowerCase();
      const val = decl.slice(idx + 1).trim();
      if (!val || /url\(|expression\(/i.test(val)) continue;
      if (prop === 'font-size' || prop === 'color' || prop === 'background-color') {
        safe.push(`${prop}: ${val}`);
      }
    }
    return safe.join('; ');
  }

  function cleanDomNode(node, doc) {
    if (node.nodeType === Node.TEXT_NODE) {
      return doc.createTextNode(node.textContent || '');
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return null;
    const tag = node.tagName.toLowerCase();
    if (DROP_TAGS.has(tag)) return null;

    if (!ALLOWED_TAGS.has(tag)) {
      const frag = doc.createDocumentFragment();
      for (const child of Array.from(node.childNodes)) {
        const cleaned = cleanDomNode(child, doc);
        if (cleaned) frag.appendChild(cleaned);
      }
      return frag;
    }

    if (tag === 'input') {
      if ((node.getAttribute('type') || '').toLowerCase() !== 'checkbox') return null;
      const input = doc.createElement('input');
      input.setAttribute('type', 'checkbox');
      if (node.hasAttribute('checked')) input.setAttribute('checked', '');
      return input;
    }

    const out = doc.createElement(tag);
    if (tag === 'div' && node.getAttribute('data-checklist') === 'true') {
      out.setAttribute('data-checklist', 'true');
    }
    if (tag === 'a') {
      const href = node.getAttribute('href') || '';
      if (isSafeHref(href)) {
        out.setAttribute('href', href.trim());
        out.setAttribute('target', '_blank');
        out.setAttribute('rel', 'noopener noreferrer');
      }
    }
    if (tag === 'font') {
      if (node.getAttribute('color')) out.setAttribute('color', node.getAttribute('color'));
      if (node.getAttribute('size')) out.setAttribute('size', node.getAttribute('size'));
    }
    const rawStyle = node.getAttribute('style');
    if (rawStyle) {
      const cleanedStyle = sanitizeStyle(rawStyle);
      if (cleanedStyle) out.setAttribute('style', cleanedStyle);
    }
    for (const child of Array.from(node.childNodes)) {
      const cleaned = cleanDomNode(child, doc);
      if (cleaned) out.appendChild(cleaned);
    }
    return out;
  }

  function sanitizeDocHtml(html) {
    if (!html) return '';
    const parser = new DOMParser();
    const parsed = parser.parseFromString(html, 'text/html');
    const container = parsed.createElement('div');
    for (const child of Array.from(parsed.body.childNodes)) {
      const cleaned = cleanDomNode(child, parsed);
      if (cleaned) container.appendChild(cleaned);
    }
    return container.innerHTML;
  }

  function ensureDocHtml(raw) {
    if (!raw || !raw.trim()) return '';
    if (!/<[a-z][\s\S]*>/i.test(raw)) {
      return raw
        .split(/\r?\n/)
        .map((line) => (line.trim() ? `<p>${escapeHtml(line)}</p>` : '<p><br></p>'))
        .join('');
    }
    return sanitizeDocHtml(raw);
  }

  function isDocHtmlEmpty(html) {
    if (!html || !html.trim()) return true;
    if (/<input\b/i.test(html) || /<hr\b/i.test(html)) return false;
    const textOnly = html
      .replace(/<[^>]*>/g, '')
      .replace(/\u0026nbsp;|\u00A0/gi, ' ')
      .replace(/\u200B/g, '')
      .trim();
    return textOnly.length === 0;
  }

  function getPostLinks(post) {
    if (post.links && post.links.length > 0) return post.links;
    if (post.linkUrl) return [{ id: 'legacy', label: '', url: post.linkUrl }];
    return [];
  }

  function cleanTypedUrl(value) {
    return value.replace(/^https?:\/\/(https?:\/\/)/i, '$1');
  }

  function finalizeUrlInput(value) {
    const trimmed = value.trim();
    if (!trimmed || /^https?:\/\/$/i.test(trimmed)) return 'https://';
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  }

  function hasValidUrlContent(url) {
    const trimmed = url.trim();
    return trimmed.length > 0 && !/^https?:\/\/$/i.test(trimmed);
  }

  // Application State
  const state = {
    activeBoard: 'general',
    view: { type: 'list' }, // 'list' | 'detail' | 'create' | 'edit'
    posts: [],
    postsLoading: true,
    postsError: null,
    searchOpen: false,
    searchQuery: '',
    pageSize: 10,
    currentPage: 1,
    notice: null,
    noticeTimer: null,
    confirmDelete: false,
    deleting: false,
    deleteError: null,
    editor: null,
  };

  const headerEl = document.getElementById('site-header');
  const mainEl = document.getElementById('site-main');
  const footerEl = document.getElementById('site-footer');
  const modalRootEl = document.getElementById('modal-root');

  function showNotice(type, text) {
    if (state.noticeTimer) clearTimeout(state.noticeTimer);
    state.notice = { type, text };
    state.noticeTimer = setTimeout(() => {
      state.notice = null;
      renderMain();
    }, 5000);
    renderMain();
  }

  async function fetchPosts() {
    state.postsLoading = true;
    state.postsError = null;
    renderMain();
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '목록을 불러오지 못했습니다.');
      state.posts = data.posts || [];
    } catch (err) {
      state.postsError = err instanceof Error ? err.message : '목록을 불러오지 못했습니다.';
    } finally {
      state.postsLoading = false;
      render();
    }
  }

  function initEditorState(boardType, initialPost) {
    const effectiveBoard = initialPost ? initialPost.boardType : boardType;
    let initialLinks = [{ id: crypto.randomUUID(), label: '', url: 'https://' }];
    if (initialPost && initialPost.links && initialPost.links.length > 0) {
      initialLinks = initialPost.links.map((l) => ({ ...l }));
    } else if (initialPost && initialPost.linkUrl) {
      initialLinks = [{ id: crypto.randomUUID(), label: '', url: initialPost.linkUrl }];
    }
    state.editor = {
      isEdit: Boolean(initialPost),
      initialPost: initialPost || null,
      boardType: effectiveBoard,
      title: initialPost ? initialPost.title : '',
      content: initialPost ? initialPost.content : '',
      links: initialLinks,
      removedFileIds: [],
      newFiles: [],
      dragging: false,
      submitting: false,
      error: null,
      openPopover: null,
      currentTextColor: '#171717',
      currentBgColor: 'transparent',
      savedRange: null,
    };
  }

  function openCreateView() {
    initEditorState(state.activeBoard, null);
    state.view = { type: 'create' };
    render();
  }

  function openEditView(post) {
    initEditorState(post.boardType, post);
    state.view = { type: 'edit', post };
    render();
  }

  function openDetailView(postId) {
    state.confirmDelete = false;
    state.deleting = false;
    state.deleteError = null;
    state.view = { type: 'detail', postId };
    render();
  }

  function selectBoard(board) {
    state.activeBoard = board;
    state.currentPage = 1;
    state.view = { type: 'list' };
    render();
  }

  function getVisiblePosts() {
    const q = state.searchQuery.trim().toLowerCase();
    return state.posts.filter((post) => {
      if (post.boardType !== state.activeBoard) return false;
      if (!q) return true;
      const matchTitle = (post.title || '').toLowerCase().includes(q);
      const matchContent = (post.content || '').toLowerCase().includes(q);
      const matchLink = post.linkUrl ? post.linkUrl.toLowerCase().includes(q) : false;
      const matchLinks = post.links
        ? post.links.some(
            (l) => (l.label || '').toLowerCase().includes(q) || (l.url || '').toLowerCase().includes(q)
          )
        : false;
      const matchFile = (post.attachments || []).some((a) =>
        (a.originalName || '').toLowerCase().includes(q)
      );
      return matchTitle || matchContent || matchLink || matchLinks || matchFile;
    });
  }

  function renderHeader() {
    const hasActiveSearch = state.searchQuery.trim().length > 0;
    const searchActive = state.searchOpen || hasActiveSearch;

    headerEl.innerHTML = `
      <div class="container header-inner">
        <button type="button" id="brand-home-btn" class="brand-btn">
          <img src="/favicon.png" alt="" aria-hidden="true" class="brand-logo" />
          <span>NOOLCHEE</span>
        </button>

        <nav class="header-nav" aria-label="게시판 메뉴">
          ${BOARDS.map(
            (board) => `
              <button type="button" data-board="${board}" class="nav-tab ${
                state.activeBoard === board ? 'is-active' : ''
              }">
                ${BOARD_LABELS[board]}
              </button>
            `
          ).join('')}
        </nav>

        <div class="header-actions">
          <button type="button" id="hdr-search-btn" class="btn ${
            searchActive ? 'btn-dark-active' : ''
          }" aria-label="검색" aria-expanded="${state.searchOpen}">
            ${svgIcon('search')}
            <span class="btn-label-md">검색</span>
          </button>

          <button type="button" id="hdr-write-btn" class="btn btn-primary">
            ${svgIcon('penLine')}
            <span>글쓰기</span>
          </button>
        </div>
      </div>
    `;

    headerEl.querySelector('#brand-home-btn').onclick = () => selectBoard('general');
    headerEl.querySelectorAll('[data-board]').forEach((btn) => {
      btn.onclick = () => selectBoard(btn.dataset.board);
    });
    headerEl.querySelector('#hdr-search-btn').onclick = () => {
      if (state.view.type !== 'list') {
        state.view = { type: 'list' };
        state.searchOpen = true;
      } else {
        state.searchOpen = !state.searchOpen;
      }
      renderMain();
      renderHeader();
      if (state.searchOpen) {
        const inp = document.getElementById('search-input');
        if (inp) inp.focus();
      }
    };
    headerEl.querySelector('#hdr-write-btn').onclick = openCreateView;
  }

  function renderFooter() {
    footerEl.innerHTML = `
      <div class="container footer-inner">
        <span>NOOLCHEE</span>
      </div>
    `;
  }

  function renderNoticeHtml() {
    if (!state.notice) return '';
    const isSuccess = state.notice.type === 'success';
    return `
      <div role="status" class="notice ${isSuccess ? 'notice-success' : 'notice-error'}">
        <div class="notice-left">
          ${svgIcon(isSuccess ? 'checkCircle2' : 'alertCircle')}
          <span class="notice-text">${escapeHtml(state.notice.text)}</span>
        </div>
        <button type="button" id="notice-close-btn" class="icon-btn-plain" aria-label="알림 닫기">
          ${svgIcon('x', 'icon-sm')}
        </button>
      </div>
    `;
  }

  function renderBoardListHtml() {
    const posts = getVisiblePosts();
    const isGeneral = state.activeBoard === 'general';
    const isBookmarks = state.activeBoard === 'bookmarks';

    const totalPages = Math.max(1, Math.ceil(posts.length / state.pageSize));
    if (state.currentPage > totalPages) state.currentPage = totalPages;
    const safePage = state.currentPage;
    const startIndex = (safePage - 1) * state.pageSize;
    const pagedPosts = posts.slice(startIndex, startIndex + state.pageSize);

    const maxVisible = 5;
    let startPage = Math.max(1, safePage - Math.floor(maxVisible / 2));
    const endPage = Math.min(totalPages, startPage + maxVisible - 1);
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    const pageNumbers = [];
    for (let p = startPage; p <= endPage; p += 1) pageNumbers.push(p);

    let cardContent = '';
    if (state.postsError) {
      cardContent = `<div class="empty-state"><p style="color:#DC2626;font-size:14px">${escapeHtml(
        state.postsError
      )}</p></div>`;
    } else if (state.postsLoading) {
      cardContent = [1, 2, 3, 4]
        .map(
          () => `
          <div class="skeleton-row">
            <div style="display:flex;align-items:center;gap:12px;flex:1">
              <div class="skeleton-bar" style="width:28px"></div>
              <div class="skeleton-bar" style="width:65%"></div>
            </div>
            <div class="skeleton-bar" style="width:56px"></div>
          </div>`
        )
        .join('');
    } else if (posts.length === 0) {
      const hasSearch = Boolean(state.searchQuery.trim());
      cardContent = `
        <div class="empty-state">
          <p class="empty-title">${hasSearch ? '검색 결과가 없습니다.' : '아직 등록된 글이 없습니다.'}</p>
          <p class="empty-sub">${
            hasSearch
              ? '다른 검색어로 다시 시도해 보세요.'
              : isBookmarks
                ? '자주 방문하는 링크를 즐겨찾기로 추가해 보세요.'
                : '첫 번째 글을 작성해 보세요.'
          }</p>
          ${
            !hasSearch
              ? `<button type="button" id="empty-new-btn" class="btn btn-primary" style="margin-top:20px">
                  ${isBookmarks ? '첫 링크 추가하기' : '첫 글 작성하기'}
                </button>`
              : ''
          }
        </div>
      `;
    } else {
      cardContent = `
        <table class="board-table">
          <thead>
            <tr>
              <th class="col-num">번호</th>
              <th>제목</th>
              ${isGeneral ? '<th class="col-att">첨부</th>' : ''}
              ${isBookmarks ? '<th class="col-links">링크</th>' : ''}
              <th class="col-date">작성일</th>
            </tr>
          </thead>
          <tbody>
            ${pagedPosts
              .map((post) => {
                const postLinks = isBookmarks ? getPostLinks(post) : [];
                const desktopVisible = postLinks.slice(0, 2);
                const extraCount = Math.max(0, postLinks.length - 2);
                const firstLink = postLinks[0];

                let middleCol = '';
                if (isGeneral) {
                  middleCol = `
                    <td class="col-att">
                      ${
                        post.attachments && post.attachments.length > 0
                          ? `<span class="att-badge font-mono-tabular" title="첨부파일 ${post.attachments.length}개">${svgIcon(
                              'paperclip',
                              'icon-sm'
                            )}${post.attachments.length}</span>`
                          : '<span class="muted-dash">-</span>'
                      }
                    </td>`;
                } else if (isBookmarks) {
                  middleCol = `
                    <td class="col-links" data-stop-row="true">
                      ${
                        postLinks.length > 0
                          ? `
                            <div class="links-mobile">
                              ${
                                firstLink
                                  ? `<a href="${escapeHtml(
                                      safeExternalUrl(firstLink.url)
                                    )}" target="_blank" rel="noopener noreferrer" class="link-pill-mobile" aria-label="${escapeHtml(
                                      firstLink.label || post.title
                                    )} 바로가기" title="${escapeHtml(firstLink.url)}">
                                      ${svgIcon('externalLink', 'icon-sm')}
                                      ${
                                        postLinks.length > 1
                                          ? `<span class="font-mono-tabular">+${postLinks.length - 1}</span>`
                                          : ''
                                      }
                                    </a>`
                                  : ''
                              }
                            </div>
                            <div class="links-desktop">
                              ${desktopVisible
                                .map(
                                  (link) => `
                                  <a href="${escapeHtml(
                                    safeExternalUrl(link.url)
                                  )}" target="_blank" rel="noopener noreferrer" title="${escapeHtml(
                                    link.url
                                  )}" class="link-pill">
                                    <span class="link-pill-label">${escapeHtml(
                                      link.label || '바로가기'
                                    )}</span>
                                    ${svgIcon('externalLink', 'icon-xs')}
                                  </a>`
                                )
                                .join('')}
                              ${
                                extraCount > 0
                                  ? `<button type="button" class="link-extra-btn font-mono-tabular" data-open-post="${escapeHtml(
                                      post.id
                                    )}" title="전체 링크 보기">+${extraCount}</button>`
                                  : ''
                              }
                            </div>
                          `
                          : '<span class="muted-dash">-</span>'
                      }
                    </td>`;
                }

                return `
                  <tr data-post-id="${escapeHtml(post.id)}" tabindex="0">
                    <td class="col-num font-mono-tabular">${String(post.number).padStart(2, '0')}</td>
                    <td class="col-title">
                      <span class="post-title-text">${escapeHtml(post.title)}</span>
                    </td>
                    ${middleCol}
                    <td class="col-date font-mono-tabular">${formatDate(post.createdAt)}</td>
                  </tr>
                `;
              })
              .join('')}
          </tbody>
        </table>
      `;
    }

    const paginationHtml =
      !state.postsLoading && !state.postsError && posts.length > 0
        ? `
          <div class="pagination-bar">
            <div class="page-size-wrap">
              <select id="page-size-select" class="page-size-select" aria-label="페이지당 게시글 수">
                ${PAGE_SIZE_OPTIONS.map(
                  (size) =>
                    `<option value="${size}" ${
                      state.pageSize === size ? 'selected' : ''
                    }>${size}개씩 보기</option>`
                ).join('')}
              </select>
              <span class="font-mono-tabular" style="color:#A3A3A3">총 ${posts.length}건</span>
            </div>

            <nav class="page-nav" aria-label="페이지 이동">
              <button type="button" class="page-btn" data-page="1" ${
                safePage === 1 ? 'disabled' : ''
              } title="처음" aria-label="처음 페이지">
                ${svgIcon('chevronsLeft', 'icon-sm')}
                <span class="hide-xs">처음</span>
              </button>
              <button type="button" class="page-btn" data-page="${Math.max(1, safePage - 1)}" ${
                safePage === 1 ? 'disabled' : ''
              } title="이전" aria-label="이전 페이지">
                ${svgIcon('chevronLeft', 'icon-sm')}
              </button>
              ${pageNumbers
                .map(
                  (num) => `
                  <button type="button" class="page-btn font-mono-tabular ${
                    num === safePage ? 'is-current' : ''
                  }" data-page="${num}" ${
                    num === safePage ? 'aria-current="page"' : ''
                  }>${num}</button>`
                )
                .join('')}
              <button type="button" class="page-btn" data-page="${Math.min(
                totalPages,
                safePage + 1
              )}" ${safePage === totalPages ? 'disabled' : ''} title="다음" aria-label="다음 페이지">
                ${svgIcon('chevronRight', 'icon-sm')}
              </button>
              <button type="button" class="page-btn" data-page="${totalPages}" ${
                safePage === totalPages ? 'disabled' : ''
              } title="끝" aria-label="끝 페이지">
                <span class="hide-xs">끝</span>
                ${svgIcon('chevronsRight', 'icon-sm')}
              </button>
            </nav>
          </div>
        `
        : '';

    const searchVisible = state.searchOpen || state.searchQuery.trim().length > 0;
    return `
      <div class="mobile-tabs" role="tablist" aria-label="게시판 전환">
        ${BOARDS.map(
          (b) => `
          <button type="button" role="tab" aria-selected="${
            state.activeBoard === b
          }" data-mobile-board="${b}" class="mobile-tab ${
            state.activeBoard === b ? 'is-active' : ''
          }">${BOARD_LABELS[b]}</button>`
        ).join('')}
      </div>

      ${
        searchVisible
          ? `
            <div class="search-bar">
              ${svgIcon('search', 'search-bar-icon')}
              <input id="search-input" type="text" class="search-input" value="${escapeHtml(
                state.searchQuery
              )}" placeholder="${BOARD_LABELS[state.activeBoard]} 내 검색..." aria-label="게시글 검색" />
              <button type="button" id="search-close-btn" class="search-close-btn" aria-label="검색 닫기">
                ${svgIcon('x')}
              </button>
            </div>
          `
          : ''
      }

      <section aria-label="게시글 목록">
        <div class="card">${cardContent}</div>
        ${paginationHtml}
      </section>
    `;
  }

  function bindBoardListEvents() {
    mainEl.querySelectorAll('[data-mobile-board]').forEach((btn) => {
      btn.onclick = () => selectBoard(btn.dataset.mobileBoard);
    });

    const searchInput = mainEl.querySelector('#search-input');
    if (searchInput) {
      searchInput.oninput = (e) => {
        state.searchQuery = e.target.value;
        state.currentPage = 1;
        renderMain();
        const nextInput = document.getElementById('search-input');
        if (nextInput) {
          nextInput.focus();
          nextInput.setSelectionRange(nextInput.value.length, nextInput.value.length);
        }
        renderHeader();
      };
      searchInput.onkeydown = (e) => {
        if (e.key === 'Escape') {
          state.searchQuery = '';
          state.searchOpen = false;
          renderHeader();
          renderMain();
        }
      };
    }

    const searchClose = mainEl.querySelector('#search-close-btn');
    if (searchClose) {
      searchClose.onclick = () => {
        state.searchQuery = '';
        state.searchOpen = false;
        renderHeader();
        renderMain();
      };
    }

    const emptyNewBtn = mainEl.querySelector('#empty-new-btn');
    if (emptyNewBtn) emptyNewBtn.onclick = openCreateView;

    mainEl.querySelectorAll('[data-stop-row="true"]').forEach((td) => {
      td.onclick = (e) => e.stopPropagation();
    });

    mainEl.querySelectorAll('[data-open-post]').forEach((btn) => {
      btn.onclick = () => openDetailView(btn.dataset.openPost);
    });

    mainEl.querySelectorAll('tr[data-post-id]').forEach((row) => {
      row.onclick = () => openDetailView(row.dataset.postId);
      row.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openDetailView(row.dataset.postId);
        }
      };
    });

    const pageSizeSelect = mainEl.querySelector('#page-size-select');
    if (pageSizeSelect) {
      pageSizeSelect.onchange = (e) => {
        state.pageSize = Number(e.target.value);
        state.currentPage = 1;
        renderMain();
      };
    }

    mainEl.querySelectorAll('.page-btn[data-page]').forEach((btn) => {
      btn.onclick = () => {
        state.currentPage = Number(btn.dataset.page);
        renderMain();
      };
    });
  }

  function renderDetailHtml(post) {
    if (!post) {
      return `
        <div class="narrow-wrap card" style="padding:40px;text-align:center">
          <p style="font-size:14px;color:#525252">게시글을 찾을 수 없습니다.</p>
          <button type="button" id="detail-back-btn" class="btn btn-sm" style="margin-top:16px">목록으로 돌아가기</button>
        </div>
      `;
    }

    const isGeneral = post.boardType === 'general';
    const isDocs = post.boardType === 'docs';
    const isBookmarks = post.boardType === 'bookmarks';
    const attachments = post.attachments || [];
    const imageAttachments = isGeneral
      ? attachments.filter((att) => isImageAttachment(att.mimeType, att.originalName))
      : [];
    const postLinks = isBookmarks ? getPostLinks(post) : [];

    const docHtml = isDocs ? ensureDocHtml(post.content) : '';
    const docEmpty = isDocs ? isDocHtmlEmpty(docHtml) : false;

    return `
      <article class="narrow-wrap">
        <div class="top-bar">
          <button type="button" id="detail-back-btn" class="back-link">
            ${svgIcon('arrowLeft')}
            <span>목록으로</span>
          </button>

          <div style="display:flex;align-items:center;gap:8px">
            <button type="button" id="detail-edit-btn" class="btn btn-sm">
              ${svgIcon('pencil', 'icon-sm')}
              <span>수정</span>
            </button>
            ${
              !state.confirmDelete
                ? `<button type="button" id="detail-del-btn" class="btn btn-sm btn-danger-outline">
                    ${svgIcon('trash2', 'icon-sm')}
                    <span>삭제</span>
                  </button>`
                : `<div style="display:inline-flex;align-items:center;gap:6px">
                    <button type="button" id="detail-del-confirm-btn" class="btn btn-sm btn-danger" ${
                      state.deleting ? 'disabled' : ''
                    }>${state.deleting ? '삭제 중...' : '삭제 확인'}</button>
                    <button type="button" id="detail-del-cancel-btn" class="btn btn-sm" ${
                      state.deleting ? 'disabled' : ''
                    }>취소</button>
                  </div>`
            }
          </div>
        </div>

        ${state.deleteError ? `<div class="error-box" style="margin-bottom:16px">${escapeHtml(state.deleteError)}</div>` : ''}

        <div class="detail-card">
          <header class="detail-header">
            <div class="detail-meta">
              <span>${BOARD_LABELS[post.boardType]}</span>
              <span aria-hidden="true">·</span>
              <span class="font-mono-tabular">글 ${String(post.number).padStart(2, '0')}</span>
              <span aria-hidden="true">·</span>
              <span class="font-mono-tabular">${formatDateTime(post.createdAt)}</span>
              ${
                isGeneral && attachments.length > 0
                  ? `<span aria-hidden="true">·</span><span class="font-mono-tabular">첨부파일 ${attachments.length}개</span>`
                  : ''
              }
            </div>
            <h1 class="detail-title font-serif-editorial">${escapeHtml(post.title)}</h1>
          </header>

          ${
            isBookmarks && postLinks.length > 0
              ? `
                <section class="bookmark-section" aria-label="바로가기 링크 목록">
                  <h2 class="section-label">바로가기 (${postLinks.length})</h2>
                  <ul class="sub-list row-sm">
                    ${postLinks
                      .map(
                        (item) => `
                        <li>
                          <div style="min-width:0">
                            ${
                              item.label
                                ? `<div style="font-size:12px;font-weight:600;color:#262626;margin-bottom:2px">${escapeHtml(
                                    item.label
                                  )}</div>`
                                : ''
                            }
                            <a href="${escapeHtml(
                              safeExternalUrl(item.url)
                            )}" target="_blank" rel="noopener noreferrer" style="font-size:14px;color:#1D4ED8;word-break:break-all;text-decoration:none">${escapeHtml(
                              item.url
                            )}</a>
                          </div>
                          <a href="${escapeHtml(
                            safeExternalUrl(item.url)
                          )}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="align-self:flex-start">
                            <span>바로가기</span>
                            ${svgIcon('externalLink', 'icon-sm')}
                          </a>
                        </li>`
                      )
                      .join('')}
                  </ul>
                </section>
              `
              : ''
          }

          ${
            isDocs
              ? `<div style="padding:28px 0">${
                  docEmpty
                    ? '<p style="font-size:14px;color:#A3A3A3;font-style:italic">문서 내용이 없습니다.</p>'
                    : `<div id="doc-detail-prose" class="doc-prose">${docHtml}</div>`
                }</div>`
              : `<div class="detail-body-plain">${
                  post.content
                    ? escapeHtml(post.content)
                    : `<span style="color:#A3A3A3;font-style:italic">${
                        isBookmarks ? '등록된 메모가 없습니다.' : '본문 내용이 없습니다.'
                      }</span>`
                }</div>`
          }

          ${
            isGeneral && imageAttachments.length > 0
              ? `<div class="image-preview-list">
                  ${imageAttachments
                    .map(
                      (img) => `
                      <figure class="image-figure">
                        <img src="/api/files/${encodeURIComponent(img.id)}/preview" alt="${escapeHtml(
                          img.originalName
                        )}" />
                        <figcaption class="image-figcaption">
                          <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml(
                            img.originalName
                          )}</span>
                          <span class="font-mono-tabular" style="flex-shrink:0">${formatBytes(
                            img.size
                          )}</span>
                        </figcaption>
                      </figure>`
                    )
                    .join('')}
                </div>`
              : ''
          }

          ${
            isGeneral && attachments.length > 0
              ? `
                <section style="padding-top:24px;border-top:1px solid var(--border-soft)" aria-label="첨부파일 목록">
                  <h2 class="section-label">첨부파일 (${attachments.length})</h2>
                  <ul class="sub-list row-always">
                    ${attachments
                      .map(
                        (att) => `
                        <li>
                          <div class="att-left">
                            ${svgIcon('fileText')}
                            <span class="att-name">${escapeHtml(att.originalName)}</span>
                            <span class="font-mono-tabular" style="font-size:12px;color:#A3A3A3;flex-shrink:0">${formatBytes(
                              att.size
                            )}</span>
                          </div>
                          <a href="/api/files/${encodeURIComponent(att.id)}/download" download="${escapeHtml(
                            att.originalName
                          )}" class="btn btn-sm btn-blue-soft">
                            ${svgIcon('download', 'icon-sm')}
                            <span>다운로드</span>
                          </a>
                        </li>`
                      )
                      .join('')}
                  </ul>
                </section>
              `
              : ''
          }
        </div>
      </article>
    `;
  }

  function bindDetailEvents(post) {
    const backBtn = mainEl.querySelector('#detail-back-btn');
    if (backBtn) {
      backBtn.onclick = () => {
        state.view = { type: 'list' };
        render();
      };
    }
    if (!post) return;

    mainEl.querySelector('#detail-edit-btn').onclick = () => openEditView(post);

    const delBtn = mainEl.querySelector('#detail-del-btn');
    if (delBtn) {
      delBtn.onclick = () => {
        state.confirmDelete = true;
        renderMain();
      };
    }

    const cancelDelBtn = mainEl.querySelector('#detail-del-cancel-btn');
    if (cancelDelBtn) {
      cancelDelBtn.onclick = () => {
        state.confirmDelete = false;
        renderMain();
      };
    }

    const confirmDelBtn = mainEl.querySelector('#detail-del-confirm-btn');
    if (confirmDelBtn) {
      confirmDelBtn.onclick = async () => {
        state.deleting = true;
        state.deleteError = null;
        renderMain();
        try {
          const res = await fetch(`/api/posts/${encodeURIComponent(post.id)}`, {
            method: 'DELETE',
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || '게시글 삭제에 실패했습니다.');
          state.view = { type: 'list' };
          await fetchPosts();
        } catch (err) {
          state.deleteError = err instanceof Error ? err.message : '삭제에 실패했습니다.';
          state.deleting = false;
          renderMain();
        }
      };
    }

    const docProse = mainEl.querySelector('#doc-detail-prose');
    if (docProse) {
      docProse.onclick = async (e) => {
        const target = e.target;
        if (target && target.tagName === 'INPUT' && target.type === 'checkbox') {
          if (target.checked) target.setAttribute('checked', '');
          else target.removeAttribute('checked');

          const fd = new FormData();
          fd.append('content', docProse.innerHTML);
          const res = await fetch(`/api/posts/${encodeURIComponent(post.id)}`, {
            method: 'PUT',
            body: fd,
          });
          const data = await res.json();
          if (res.ok && data.post) {
            state.posts = state.posts.map((p) => (p.id === post.id ? data.post : p));
          }
        }
      };
    }
  }

  function renderEditorHtml() {
    const ed = state.editor;
    if (!ed) return '';
    const isGeneral = ed.boardType === 'general';
    const isDocs = ed.boardType === 'docs';
    const isBookmarks = ed.boardType === 'bookmarks';

    return `
      <section class="narrow-wrap" aria-label="${ed.isEdit ? '게시글 수정' : '새 글 작성'}">
        <div class="top-bar">
          <button type="button" id="ed-back-btn" class="back-link">
            ${svgIcon('arrowLeft')}
            <span>돌아가기</span>
          </button>
          <h1 style="margin:0;font-size:14px;font-weight:600;color:#171717">
            ${BOARD_LABELS[ed.boardType]} · ${ed.isEdit ? '수정하기' : '새 글 작성'}
          </h1>
        </div>

        <form id="post-editor-form" class="editor-card">
          <div id="ed-error-wrap">${
            ed.error ? `<div class="error-box">${escapeHtml(ed.error)}</div>` : ''
          }</div>

          <div>
            <label for="post-title" class="field-label">${
              isBookmarks ? '즐겨찾기 제목' : '제목'
            }</label>
            <input
              id="post-title"
              type="text"
              class="text-input title-input"
              value="${escapeHtml(ed.title)}"
              placeholder="${
                isBookmarks
                  ? '예: 자주 쓰는 개발 참고 사이트'
                  : isDocs
                    ? '문서 제목을 입력하세요'
                    : '글 제목을 입력하세요'
              }"
              required
            />
          </div>

          ${
            isBookmarks
              ? `
                <div>
                  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
                    <span class="field-label" style="margin:0">바로가기 사이트 목록 (<span id="bm-count">${ed.links.length}</span>)</span>
                    <button type="button" id="bm-add-btn" class="btn btn-sm" style="background:#F5F5F5;border-color:transparent">
                      ${svgIcon('plus', 'icon-sm')}
                      <span>링크 추가</span>
                    </button>
                  </div>
                  <div id="bm-links-list" style="display:flex;flex-direction:column;gap:10px"></div>
                </div>
              `
              : ''
          }

          ${
            isDocs
              ? `
                <div>
                  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
                    <span class="field-label" style="margin:0">문서 내용</span>
                    <span style="font-size:11px;color:#A3A3A3">서식이 즉시 적용됩니다</span>
                  </div>
                  <div class="rich-wrap">
                    <div id="rich-toolbar" class="rich-toolbar" role="toolbar" aria-label="문서 서식 도구"></div>
                    <div id="rich-link-bar" class="link-bar hidden">
                      <input id="rich-link-input" type="text" class="text-input" style="padding:5px 10px;font-size:12px" placeholder="https://..." />
                      <button type="button" id="rich-link-apply" class="btn btn-primary btn-sm">적용</button>
                      <button type="button" id="rich-link-cancel" class="btn btn-sm">취소</button>
                    </div>
                    <div
                      id="rich-canvas"
                      contenteditable="true"
                      role="textbox"
                      aria-multiline="true"
                      aria-label="문서 본문 편집"
                      data-placeholder="여기에 내용을 입력하세요. 상단 버튼으로 글씨 크기, 색상, 배경색, 체크리스트, 특수문자를 바로 적용할 수 있습니다."
                      class="doc-prose doc-canvas"
                    ></div>
                  </div>
                </div>
              `
              : `
                <div>
                  <label for="post-content" class="field-label">${
                    isBookmarks ? '간단한 설명 (선택)' : '내용'
                  }</label>
                  <textarea
                    id="post-content"
                    rows="${isBookmarks ? 4 : 10}"
                    class="textarea-input"
                    placeholder="${
                      isBookmarks
                        ? '모아둔 사이트들에 대한 간단한 메모를 남길 수 있습니다.'
                        : '남기고 싶은 메모나 설명을 자유롭게 적어주세요.'
                    }"
                  >${escapeHtml(ed.content)}</textarea>
                </div>
              `
          }

          ${
            isGeneral
              ? `
                <div>
                  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
                    <span class="field-label" style="margin:0">파일 첨부</span>
                    <span class="font-mono-tabular" style="font-size:12px;color:#A3A3A3">최대 ${MAX_FILES_PER_POST}개 · 파일당 1MB</span>
                  </div>
                  <div id="file-dropzone" class="dropzone" role="button" tabindex="0">
                    <input id="file-input" type="file" multiple class="hidden" />
                    ${svgIcon('upload', 'icon-lg')}
                    <p style="margin:8px 0 0;font-size:14px;font-weight:500;color:#404040">여기를 클릭하거나 파일을 끌어다 놓으세요</p>
                    <p style="margin:4px 0 0;font-size:12px;color:#A3A3A3">파일당 최대 1MB까지 첨부할 수 있습니다.</p>
                  </div>
                  <ul id="ed-file-list" class="sub-list row-always hidden" style="margin-top:12px"></ul>
                </div>
              `
              : ''
          }

          <div class="editor-actions">
            <button type="button" id="ed-cancel-btn" class="btn">취소</button>
            <button type="submit" id="ed-submit-btn" class="btn btn-primary">
              ${ed.isEdit ? '수정 완료' : '저장하기'}
            </button>
          </div>
        </form>
      </section>
    `;
  }

  function bindEditorEvents() {
    const ed = state.editor;
    if (!ed) return;

    const goBack = () => {
      if (ed.isEdit && ed.initialPost) {
        openDetailView(ed.initialPost.id);
      } else {
        state.view = { type: 'list' };
        render();
      }
    };

    mainEl.querySelector('#ed-back-btn').onclick = goBack;
    mainEl.querySelector('#ed-cancel-btn').onclick = goBack;

    const titleEl = mainEl.querySelector('#post-title');
    titleEl.oninput = (e) => {
      ed.title = e.target.value;
    };

    const contentArea = mainEl.querySelector('#post-content');
    if (contentArea) {
      contentArea.oninput = (e) => {
        ed.content = e.target.value;
      };
    }

    function setEdError(msg) {
      ed.error = msg;
      const wrap = mainEl.querySelector('#ed-error-wrap');
      if (wrap) {
        wrap.innerHTML = msg ? `<div class="error-box">${escapeHtml(msg)}</div>` : '';
      }
    }

    // Bookmarks list rendering
    if (ed.boardType === 'bookmarks') {
      const listContainer = mainEl.querySelector('#bm-links-list');
      const countSpan = mainEl.querySelector('#bm-count');

      function renderBookmarkRows() {
        countSpan.textContent = String(ed.links.length);
        listContainer.innerHTML = ed.links
          .map(
            (item, idx) => `
            <div class="bookmark-row" data-bm-id="${escapeHtml(item.id)}">
              <input
                type="text"
                class="text-input bookmark-label-input"
                data-bm-field="label"
                value="${escapeHtml(item.label)}"
                placeholder="사이트명 ${idx + 1} (선택)"
                aria-label="사이트명 ${idx + 1}"
              />
              <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0">
                <input
                  type="text"
                  class="text-input font-mono-tabular"
                  data-bm-field="url"
                  value="${escapeHtml(item.url)}"
                  placeholder="naver.com (https:// 자동 입력)"
                  aria-label="링크 주소 ${idx + 1}"
                  ${idx === 0 ? 'required' : ''}
                />
                ${
                  ed.links.length > 1
                    ? `<button type="button" class="icon-btn-plain" data-bm-remove="${escapeHtml(
                        item.id
                      )}" aria-label="링크 ${idx + 1} 삭제">${svgIcon('x')}</button>`
                    : ''
                }
              </div>
            </div>`
          )
          .join('');

        listContainer.querySelectorAll('.bookmark-row').forEach((row) => {
          const id = row.dataset.bmId;
          const labelInput = row.querySelector('[data-bm-field="label"]');
          const urlInput = row.querySelector('[data-bm-field="url"]');
          const removeBtn = row.querySelector('[data-bm-remove]');

          labelInput.oninput = (e) => {
            const target = ed.links.find((l) => l.id === id);
            if (target) target.label = e.target.value;
          };
          urlInput.oninput = (e) => {
            const cleaned = cleanTypedUrl(e.target.value);
            if (cleaned !== e.target.value) e.target.value = cleaned;
            const target = ed.links.find((l) => l.id === id);
            if (target) target.url = cleaned;
          };
          urlInput.onblur = (e) => {
            const finalized = finalizeUrlInput(e.target.value);
            e.target.value = finalized;
            const target = ed.links.find((l) => l.id === id);
            if (target) target.url = finalized;
          };
          if (removeBtn) {
            removeBtn.onclick = () => {
              if (ed.links.length > 1) {
                ed.links = ed.links.filter((l) => l.id !== id);
                renderBookmarkRows();
              }
            };
          }
        });
      }

      renderBookmarkRows();
      mainEl.querySelector('#bm-add-btn').onclick = () => {
        ed.links.push({ id: crypto.randomUUID(), label: '', url: 'https://' });
        renderBookmarkRows();
      };
    }

    // General file upload (1MB max per file)
    if (ed.boardType === 'general') {
      const dropzone = mainEl.querySelector('#file-dropzone');
      const fileInput = mainEl.querySelector('#file-input');
      const fileListEl = mainEl.querySelector('#ed-file-list');

      function getExistingAttachments() {
        const list = (ed.initialPost && ed.initialPost.attachments) || [];
        return list.filter((att) => !ed.removedFileIds.includes(att.id));
      }

      function renderFileList() {
        const existing = getExistingAttachments();
        if (existing.length === 0 && ed.newFiles.length === 0) {
          fileListEl.classList.add('hidden');
          fileListEl.innerHTML = '';
          return;
        }
        fileListEl.classList.remove('hidden');
        fileListEl.innerHTML = `
          ${existing
            .map(
              (att) => `
              <li style="background:#FFFFFF;padding:10px 14px">
                <div class="att-left">
                  ${svgIcon('fileText')}
                  <span class="att-name" style="font-size:12px">${escapeHtml(att.originalName)}</span>
                  <span class="font-mono-tabular" style="font-size:12px;color:#A3A3A3;flex-shrink:0">${formatBytes(
                    att.size
                  )}</span>
                </div>
                <button type="button" class="icon-btn-plain" data-rm-existing="${escapeHtml(
                  att.id
                )}" aria-label="${escapeHtml(att.originalName)} 제거">${svgIcon('x')}</button>
              </li>`
            )
            .join('')}
          ${ed.newFiles
            .map(
              (file, idx) => `
              <li style="background:rgba(239,246,255,0.35);padding:10px 14px">
                <div class="att-left">
                  ${svgIcon('fileText')}
                  <span class="att-name" style="font-size:12px">${escapeHtml(file.name)}</span>
                  <span class="font-mono-tabular" style="font-size:12px;color:#737373;flex-shrink:0">${formatBytes(
                    file.size
                  )}</span>
                  <span style="font-size:11px;color:#1D4ED8;flex-shrink:0">새 파일</span>
                </div>
                <button type="button" class="icon-btn-plain" data-rm-new="${idx}" aria-label="${escapeHtml(
                  file.name
                )} 취소">${svgIcon('x')}</button>
              </li>`
            )
            .join('')}
        `;

        fileListEl.querySelectorAll('[data-rm-existing]').forEach((btn) => {
          btn.onclick = () => {
            ed.removedFileIds.push(btn.dataset.rmExisting);
            renderFileList();
          };
        });
        fileListEl.querySelectorAll('[data-rm-new]').forEach((btn) => {
          btn.onclick = () => {
            const idx = Number(btn.dataset.rmNew);
            ed.newFiles = ed.newFiles.filter((_, i) => i !== idx);
            renderFileList();
          };
        });
      }

      function addFiles(fileList) {
        if (!fileList || fileList.length === 0) return;
        const incoming = Array.from(fileList);
        const oversized = incoming.filter((f) => f.size > MAX_FILE_SIZE);
        const validIncoming = incoming.filter((f) => f.size <= MAX_FILE_SIZE);

        const existingCount = getExistingAttachments().length;
        const remainingSlots = Math.max(0, MAX_FILES_PER_POST - existingCount - ed.newFiles.length);
        const accepted = validIncoming.slice(0, remainingSlots);
        const countOverflow = validIncoming.length > remainingSlots;

        if (accepted.length > 0) {
          ed.newFiles = [...ed.newFiles, ...accepted];
        }

        if (oversized.length > 0 && countOverflow) {
          setEdError(
            `파일당 최대 1MB까지만 첨부할 수 있으며, 게시글당 최대 ${MAX_FILES_PER_POST}개까지 등록됩니다.`
          );
        } else if (oversized.length > 0) {
          setEdError(
            `1MB를 초과한 파일은 제외되었습니다: ${oversized.map((f) => f.name).join(', ')}`
          );
        } else if (countOverflow) {
          setEdError(`첨부파일은 게시글당 최대 ${MAX_FILES_PER_POST}개까지 등록할 수 있습니다.`);
        } else {
          setEdError(null);
        }

        renderFileList();
      }

      dropzone.onclick = () => fileInput.click();
      dropzone.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          fileInput.click();
        }
      };
      dropzone.ondragover = (e) => {
        e.preventDefault();
        dropzone.classList.add('is-dragging');
      };
      dropzone.ondragleave = () => {
        dropzone.classList.remove('is-dragging');
      };
      dropzone.ondrop = (e) => {
        e.preventDefault();
        dropzone.classList.remove('is-dragging');
        addFiles(e.dataTransfer.files);
      };
      fileInput.onchange = (e) => {
        addFiles(e.target.files);
        e.target.value = '';
      };

      renderFileList();
    }

    // Docs WYSIWYG editor
    if (ed.boardType === 'docs') {
      const toolbarEl = mainEl.querySelector('#rich-toolbar');
      const canvasEl = mainEl.querySelector('#rich-canvas');
      const linkBarEl = mainEl.querySelector('#rich-link-bar');
      const linkInputEl = mainEl.querySelector('#rich-link-input');

      canvasEl.innerHTML = ensureDocHtml(ed.content);
      try {
        document.execCommand('defaultParagraphSeparator', false, 'p');
      } catch {
        // ignore
      }

      function syncDoc() {
        ed.content = sanitizeDocHtml(canvasEl.innerHTML);
      }

      function saveSelection() {
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return;
        if (canvasEl.contains(sel.anchorNode)) {
          ed.savedRange = sel.getRangeAt(0).cloneRange();
        }
      }

      function restoreSelection() {
        const sel = window.getSelection();
        if (!sel) return;
        canvasEl.focus();
        if (ed.savedRange) {
          sel.removeAllRanges();
          sel.addRange(ed.savedRange);
        }
      }

      function renderToolbar() {
        const pop = ed.openPopover;
        toolbarEl.innerHTML = `
          <div class="tb-pop-wrap">
            <button type="button" class="tb-btn ${pop === 'size' ? 'is-active' : ''}" data-pop="size" title="글씨 크기">
              ${svgIcon('type')}
              <span class="hide-xs">크기</span>
              ${svgIcon('chevronDown', 'icon-xs')}
            </button>
            ${
              pop === 'size'
                ? `<div class="tb-popover size-menu">
                    ${FONT_SIZES.map(
                      (s) =>
                        `<button type="button" class="size-menu-item" data-fontsize="${s.value}">${s.label}</button>`
                    ).join('')}
                  </div>`
                : ''
            }
          </div>

          <div class="tb-pop-wrap">
            <button type="button" class="tb-btn ${pop === 'color' ? 'is-active' : ''}" data-pop="color" title="글자색">
              <span style="display:inline-flex;flex-direction:column;align-items:center">
                ${svgIcon('baseline')}
                <span style="width:14px;height:2px;border-radius:999px;margin-top:-2px;background:${
                  ed.currentTextColor
                }"></span>
              </span>
              ${svgIcon('chevronDown', 'icon-xs')}
            </button>
            ${
              pop === 'color'
                ? `<div class="tb-popover swatch-row">
                    ${TEXT_COLORS.map(
                      (c) =>
                        `<button type="button" class="swatch-btn" data-textcolor="${c.value}" title="${c.label}" style="background:${c.value}"></button>`
                    ).join('')}
                  </div>`
                : ''
            }
          </div>

          <div class="tb-pop-wrap">
            <button type="button" class="tb-btn ${pop === 'bg' ? 'is-active' : ''}" data-pop="bg" title="글자 배경색">
              <span style="display:inline-flex;flex-direction:column;align-items:center">
                ${svgIcon('highlighter')}
                <span style="width:14px;height:2px;border-radius:999px;margin-top:-2px;border:1px solid #D4D4D4;background:${
                  ed.currentBgColor === 'transparent' ? '#FFFFFF' : ed.currentBgColor
                }"></span>
              </span>
              ${svgIcon('chevronDown', 'icon-xs')}
            </button>
            ${
              pop === 'bg'
                ? `<div class="tb-popover swatch-row">
                    ${BG_COLORS.map(
                      (c) =>
                        `<button type="button" class="swatch-btn" data-bgcolor="${c.value}" title="${c.label}" style="background:${
                          c.value === 'transparent' ? '#FFFFFF' : c.value
                        }">${c.value === 'transparent' ? '×' : ''}</button>`
                    ).join('')}
                  </div>`
                : ''
            }
          </div>

          <span class="tb-sep"></span>

          <button type="button" class="tb-btn" data-cmd="bold" title="굵게">${svgIcon('bold')}</button>
          <button type="button" class="tb-btn" data-cmd="italic" title="기울임">${svgIcon('italic')}</button>
          <button type="button" class="tb-btn" data-cmd="underline" title="밑줄">${svgIcon('underline')}</button>
          <button type="button" class="tb-btn" data-cmd="strikeThrough" title="취소선">${svgIcon('strikethrough')}</button>

          <span class="tb-sep"></span>

          <button type="button" class="tb-btn" data-cmd="insertUnorderedList" title="글머리 목록">${svgIcon('list')}</button>
          <button type="button" class="tb-btn" data-cmd="insertOrderedList" title="번호 목록">${svgIcon('listOrdered')}</button>
          <button type="button" class="tb-btn" id="tb-checklist-btn" title="체크리스트">${svgIcon('checkSquare')}</button>

          <span class="tb-sep"></span>

          <div class="tb-pop-wrap">
            <button type="button" class="tb-btn ${pop === 'symbol' ? 'is-active' : ''}" data-pop="symbol" title="특수문자">
              <span style="font-size:14px;font-weight:500;line-height:1;padding:0 2px">Ω</span>
              ${svgIcon('chevronDown', 'icon-xs')}
            </button>
            ${
              pop === 'symbol'
                ? `<div class="tb-popover symbol-grid">
                    ${SPECIAL_SYMBOLS.map(
                      (sym) => `<button type="button" class="symbol-btn" data-symbol="${escapeHtml(sym)}">${escapeHtml(sym)}</button>`
                    ).join('')}
                  </div>`
                : ''
            }
          </div>

          <button type="button" class="tb-btn ${pop === 'link' ? 'is-active' : ''}" id="tb-link-btn" title="링크 삽입">${svgIcon('link')}</button>
          <button type="button" class="tb-btn" data-cmd="insertHorizontalRule" title="구분선">${svgIcon('minus')}</button>
        `;

        if (pop === 'link') {
          linkBarEl.classList.remove('hidden');
        } else {
          linkBarEl.classList.add('hidden');
        }

        toolbarEl.querySelectorAll('[data-pop]').forEach((btn) => {
          btn.onmousedown = (e) => {
            e.preventDefault();
            saveSelection();
            const targetPop = btn.dataset.pop;
            ed.openPopover = ed.openPopover === targetPop ? null : targetPop;
            renderToolbar();
          };
        });

        toolbarEl.querySelectorAll('[data-cmd]').forEach((btn) => {
          btn.onmousedown = (e) => {
            e.preventDefault();
            restoreSelection();
            document.execCommand(btn.dataset.cmd, false);
            syncDoc();
            updateFormatHighlight();
          };
        });

        toolbarEl.querySelectorAll('[data-fontsize]').forEach((btn) => {
          btn.onmousedown = (e) => {
            e.preventDefault();
            const size = btn.dataset.fontsize;
            restoreSelection();
            const sel = window.getSelection();
            if (sel && sel.rangeCount > 0 && sel.getRangeAt(0).collapsed) {
              const span = document.createElement('span');
              span.style.fontSize = size;
              span.textContent = '\u200B';
              sel.getRangeAt(0).insertNode(span);
              const nextRange = document.createRange();
              nextRange.setStart(span.firstChild, 1);
              nextRange.collapse(true);
              sel.removeAllRanges();
              sel.addRange(nextRange);
            } else {
              document.execCommand('fontSize', false, '7');
              canvasEl.querySelectorAll('font[size="7"]').forEach((fontEl) => {
                const span = document.createElement('span');
                span.style.fontSize = size;
                while (fontEl.firstChild) span.appendChild(fontEl.firstChild);
                fontEl.replaceWith(span);
              });
            }
            ed.openPopover = null;
            syncDoc();
            saveSelection();
            renderToolbar();
          };
        });

        toolbarEl.querySelectorAll('[data-textcolor]').forEach((btn) => {
          btn.onmousedown = (e) => {
            e.preventDefault();
            ed.currentTextColor = btn.dataset.textcolor;
            ed.openPopover = null;
            restoreSelection();
            document.execCommand('foreColor', false, ed.currentTextColor);
            syncDoc();
            renderToolbar();
          };
        });

        toolbarEl.querySelectorAll('[data-bgcolor]').forEach((btn) => {
          btn.onmousedown = (e) => {
            e.preventDefault();
            ed.currentBgColor = btn.dataset.bgcolor;
            ed.openPopover = null;
            restoreSelection();
            const ok = document.execCommand('hiliteColor', false, ed.currentBgColor);
            if (!ok) document.execCommand('backColor', false, ed.currentBgColor);
            syncDoc();
            renderToolbar();
          };
        });

        toolbarEl.querySelectorAll('[data-symbol]').forEach((btn) => {
          btn.onmousedown = (e) => {
            e.preventDefault();
            const sym = btn.dataset.symbol;
            restoreSelection();
            const sel = window.getSelection();
            if (sel && sel.rangeCount > 0) {
              const range = sel.getRangeAt(0);
              range.deleteContents();
              const textNode = document.createTextNode(sym);
              range.insertNode(textNode);
              const nextRange = document.createRange();
              nextRange.setStartAfter(textNode);
              nextRange.collapse(true);
              sel.removeAllRanges();
              sel.addRange(nextRange);
            } else {
              document.execCommand('insertText', false, sym);
            }
            ed.openPopover = null;
            syncDoc();
            saveSelection();
            renderToolbar();
          };
        });

        toolbarEl.querySelector('#tb-checklist-btn').onmousedown = (e) => {
          e.preventDefault();
          restoreSelection();
          const sel = window.getSelection();
          if (!sel || sel.rangeCount === 0) return;
          const range = sel.getRangeAt(0);
          const anchorEl =
            range.startContainer.nodeType === Node.ELEMENT_NODE
              ? range.startContainer
              : range.startContainer.parentElement;
          const existingRow = anchorEl && anchorEl.closest('div[data-checklist="true"]');
          if (existingRow) {
            const p = document.createElement('p');
            const text = (existingRow.querySelector('span') && existingRow.querySelector('span').textContent) || '';
            p.textContent = text;
            if (!text) p.innerHTML = '<br>';
            existingRow.replaceWith(p);
            const r = document.createRange();
            r.selectNodeContents(p);
            r.collapse(false);
            sel.removeAllRanges();
            sel.addRange(r);
            syncDoc();
            return;
          }
          const block = anchorEl && anchorEl.closest('p, div, h1, h2, h3');
          const curText = block && canvasEl.contains(block) ? block.textContent || '' : '';
          const row = createChecklistRow(curText.trim() ? curText : '');
          if (block && block !== canvasEl && canvasEl.contains(block)) {
            block.replaceWith(row);
          } else {
            range.deleteContents();
            range.insertNode(row);
          }
          const span = row.querySelector('span');
          const r = document.createRange();
          r.selectNodeContents(span);
          r.collapse(false);
          sel.removeAllRanges();
          sel.addRange(r);
          syncDoc();
          saveSelection();
        };

        toolbarEl.querySelector('#tb-link-btn').onmousedown = (e) => {
          e.preventDefault();
          saveSelection();
          ed.openPopover = ed.openPopover === 'link' ? null : 'link';
          renderToolbar();
          if (ed.openPopover === 'link') {
            linkInputEl.value = 'https://';
            requestAnimationFrame(() => linkInputEl.focus());
          }
        };

        updateFormatHighlight();
      }

      function createChecklistRow(text = '') {
        const row = document.createElement('div');
        row.setAttribute('data-checklist', 'true');
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        const span = document.createElement('span');
        if (text) span.textContent = text;
        else span.innerHTML = '<br>';
        row.appendChild(cb);
        row.appendChild(span);
        return row;
      }

      function updateFormatHighlight() {
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0 || !canvasEl.contains(sel.anchorNode)) return;
        saveSelection();
        const cmds = ['bold', 'italic', 'underline', 'strikeThrough', 'insertUnorderedList', 'insertOrderedList'];
        for (const cmd of cmds) {
          const btn = toolbarEl.querySelector(`[data-cmd="${cmd}"]`);
          if (!btn) continue;
          try {
            btn.classList.toggle('is-active', document.queryCommandState(cmd));
          } catch {
            // ignore
          }
        }
      }

      function applyLink() {
        const raw = linkInputEl.value.trim();
        if (!raw) {
          ed.openPopover = null;
          renderToolbar();
          return;
        }
        const safeUrl = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
        restoreSelection();
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0 && sel.getRangeAt(0).collapsed) {
          const a = document.createElement('a');
          a.href = safeUrl;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.textContent = safeUrl;
          sel.getRangeAt(0).insertNode(a);
        } else {
          document.execCommand('createLink', false, safeUrl);
        }
        ed.openPopover = null;
        syncDoc();
        renderToolbar();
      }

      mainEl.querySelector('#rich-link-apply').onmousedown = (e) => {
        e.preventDefault();
        applyLink();
      };
      mainEl.querySelector('#rich-link-cancel').onmousedown = (e) => {
        e.preventDefault();
        ed.openPopover = null;
        renderToolbar();
      };
      linkInputEl.onkeydown = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          applyLink();
        } else if (e.key === 'Escape') {
          ed.openPopover = null;
          renderToolbar();
        }
      };

      canvasEl.oninput = syncDoc;
      canvasEl.onblur = syncDoc;
      canvasEl.onkeyup = updateFormatHighlight;
      canvasEl.onmouseup = updateFormatHighlight;
      canvasEl.onclick = (e) => {
        const t = e.target;
        if (t && t.tagName === 'INPUT' && t.type === 'checkbox') {
          if (t.checked) t.setAttribute('checked', '');
          else t.removeAttribute('checked');
          syncDoc();
        }
      };
      canvasEl.onkeydown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          const sel = window.getSelection();
          if (sel && sel.rangeCount > 0) {
            const node = sel.anchorNode;
            const element = node && node.nodeType === Node.ELEMENT_NODE ? node : node && node.parentElement;
            const row = element && element.closest('div[data-checklist="true"]');
            if (row) {
              e.preventDefault();
              const spanText = ((row.querySelector('span') && row.querySelector('span').textContent) || '').trim();
              if (!spanText) {
                const p = document.createElement('p');
                p.innerHTML = '<br>';
                row.replaceWith(p);
                const r = document.createRange();
                r.setStart(p, 0);
                r.collapse(true);
                sel.removeAllRanges();
                sel.addRange(r);
              } else {
                const nextRow = createChecklistRow();
                row.insertAdjacentElement('afterend', nextRow);
                const nextSpan = nextRow.querySelector('span');
                const r = document.createRange();
                r.setStart(nextSpan, 0);
                r.collapse(true);
                sel.removeAllRanges();
                sel.addRange(r);
              }
              syncDoc();
            }
          }
        }
      };
      canvasEl.onpaste = (e) => {
        const html = e.clipboardData && e.clipboardData.getData('text/html');
        if (html) {
          e.preventDefault();
          document.execCommand('insertHTML', false, sanitizeDocHtml(html));
          syncDoc();
        }
      };

      renderToolbar();
    }

    // Submit form
    mainEl.querySelector('#post-editor-form').onsubmit = async (e) => {
      e.preventDefault();
      if (!ed.title.trim()) {
        setEdError('제목을 입력해 주세요.');
        return;
      }

      if (ed.boardType === 'general') {
        const overFile = ed.newFiles.find((f) => f.size > MAX_FILE_SIZE);
        if (overFile) {
          setEdError(`"${overFile.name}" 파일이 1MB를 초과합니다. 1MB 이하 파일만 첨부해 주세요.`);
          return;
        }
      }

      const validLinks = ed.links
        .filter((l) => hasValidUrlContent(l.url))
        .map((l) => ({ ...l, url: finalizeUrlInput(l.url) }));

      if (ed.boardType === 'bookmarks' && validLinks.length === 0) {
        setEdError('최소 1개 이상의 링크 주소를 입력해 주세요.');
        return;
      }

      ed.submitting = true;
      setEdError(null);
      const submitBtn = mainEl.querySelector('#ed-submit-btn');
      const cancelBtn = mainEl.querySelector('#ed-cancel-btn');
      submitBtn.disabled = true;
      cancelBtn.disabled = true;
      submitBtn.textContent = '저장 중...';

      try {
        const fd = new FormData();
        fd.append('boardType', ed.boardType);
        fd.append('title', ed.title.trim());
        fd.append(
          'content',
          ed.boardType === 'docs' && isDocHtmlEmpty(ed.content) ? '' : ed.content
        );

        if (ed.boardType === 'bookmarks') {
          fd.append('links', JSON.stringify(validLinks));
        }

        if (ed.boardType === 'general') {
          if (ed.isEdit && ed.removedFileIds.length > 0) {
            fd.append('removeFileIds', JSON.stringify(ed.removedFileIds));
          }
          if (ed.newFiles.length > 0) {
            fd.append('fileNames', JSON.stringify(ed.newFiles.map((f) => f.name)));
            for (const f of ed.newFiles) {
              fd.append('files', f);
            }
          }
        }

        const url =
          ed.isEdit && ed.initialPost
            ? `/api/posts/${encodeURIComponent(ed.initialPost.id)}`
            : '/api/posts';
        const method = ed.isEdit ? 'PUT' : 'POST';

        const res = await fetch(url, { method, body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || '저장에 실패했습니다.');

        state.activeBoard = data.post.boardType;
        state.editor = null;
        await fetchPosts();
        openDetailView(data.post.id);
      } catch (err) {
        ed.submitting = false;
        submitBtn.disabled = false;
        cancelBtn.disabled = false;
        submitBtn.textContent = ed.isEdit ? '수정 완료' : '저장하기';
        setEdError(err instanceof Error ? err.message : '저장 중 오류가 발생했습니다.');
      }
    };
  }

  function renderMain() {
    let bodyHtml = '';
    if (state.view.type === 'list') {
      bodyHtml = renderBoardListHtml();
    } else if (state.view.type === 'detail') {
      const post = state.posts.find((p) => p.id === state.view.postId) || null;
      bodyHtml = renderDetailHtml(post);
    } else if (state.view.type === 'create' || state.view.type === 'edit') {
      bodyHtml = renderEditorHtml();
    }

    mainEl.innerHTML = `${renderNoticeHtml()}${bodyHtml}`;

    const noticeClose = mainEl.querySelector('#notice-close-btn');
    if (noticeClose) {
      noticeClose.onclick = () => {
        state.notice = null;
        renderMain();
      };
    }

    if (state.view.type === 'list') {
      bindBoardListEvents();
    } else if (state.view.type === 'detail') {
      const post = state.posts.find((p) => p.id === state.view.postId) || null;
      bindDetailEvents(post);
    } else if (state.view.type === 'create' || state.view.type === 'edit') {
      bindEditorEvents();
    }
  }

  function renderModal() {
    if (modalRootEl) modalRootEl.innerHTML = '';
  }

  function render() {
    renderHeader();
    renderMain();
    renderFooter();
    renderModal();
  }

  window.addEventListener('mousedown', (e) => {
    const ed = state.editor;
    if (!ed || !ed.openPopover) return;
    const tb = document.getElementById('rich-toolbar');
    const linkBar = document.getElementById('rich-link-bar');
    if (tb && !tb.contains(e.target) && (!linkBar || !linkBar.contains(e.target))) {
      ed.openPopover = null;
      const openPops = tb.querySelectorAll('.tb-popover');
      openPops.forEach((p) => p.remove());
      tb.querySelectorAll('[data-pop].is-active, #tb-link-btn.is-active').forEach((b) =>
        b.classList.remove('is-active')
      );
      if (linkBar) linkBar.classList.add('hidden');
    }
  });

  render();
  fetchPosts();
})();