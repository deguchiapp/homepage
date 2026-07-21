(function () {
  var ITEMS = [
    ['faq.html', 'FAQ'],
    ['contact.html', 'お問い合わせ'],
    ['privacy.html', 'プライバシーポリシー'],
    ['release-notes.html', 'リリースノート']
  ];

  var OPEN = [];
  function closeAll(except) {
    OPEN.forEach(function (el) { if (el !== except) el.removeAttribute('open'); });
    OPEN = except ? [except] : [];
  }
  document.addEventListener('click', function () { closeAll(null); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(null); });

  var STYLE = "\
:host{position:relative;display:inline-block;font-family:'Zen Kaku Gothic New',sans-serif}\
.sm-trigger{display:inline-flex;align-items:center;gap:5px;background:none;border:none;padding:0;margin:0;cursor:pointer;font:500 13px 'Zen Kaku Gothic New',sans-serif;color:#6B7065;line-height:1}\
.sm-trigger:hover{color:#1b8a5a}\
:host(.sm-active) .sm-trigger{color:#1b8a5a;font-weight:700}\
.sm-caret{font-size:15px;transition:transform .18s ease;transform:translateY(1px)}\
:host([open]) .sm-caret{transform:translateY(1px) rotate(180deg)}\
.sm-menu{position:absolute;top:calc(100% + 12px);right:0;min-width:196px;background:#ffffff;border:1px solid #ece9e0;border-radius:14px;box-shadow:0 14px 34px rgba(20,24,18,.14);padding:8px;display:none;flex-direction:column;gap:2px;z-index:30}\
:host([open]) .sm-menu{display:flex}\
.sm-item{display:block;padding:10px 14px;border-radius:9px;color:#6B7065;font:500 13px 'Zen Kaku Gothic New',sans-serif;text-decoration:none;white-space:nowrap}\
.sm-item:hover{background:#f4f2ec;color:#1b8a5a}\
.sm-item.sm-current{color:#1b8a5a;font-weight:700}\
@media (max-width:720px){.sm-menu{right:0}}\
";

  class SupportMenu extends HTMLElement {
    connectedCallback() {
      if (this._built) return;
      this._built = true;
      var cur = (location.pathname.split('/').pop() || '').toLowerCase();
      var isActive = ITEMS.some(function (it) { return it[0] === cur; });
      if (isActive) this.classList.add('sm-active');

      var links = ITEMS.map(function (it) {
        var c = it[0] === cur ? ' sm-current' : '';
        return '<a class="sm-item' + c + '" href="' + it[0] + '">' + it[1] + '</a>';
      }).join('');

      var root = this.attachShadow({ mode: 'open' });
      root.innerHTML =
        '<style>' + STYLE + '</style>' +
        '<button type="button" class="sm-trigger" aria-haspopup="true" aria-expanded="false">' +
        'サポート<span class="sm-caret">\u25BE</span></button>' +
        '<div class="sm-menu" role="menu">' + links + '</div>';

      var self = this;
      var btn = root.querySelector('.sm-trigger');
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var willOpen = !self.hasAttribute('open');
        closeAll(willOpen ? self : null);
        if (willOpen) { self.setAttribute('open', ''); OPEN = [self]; }
        else { self.removeAttribute('open'); }
        btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      });
      root.querySelector('.sm-menu').addEventListener('click', function (e) { e.stopPropagation(); });
    }
  }
  if (!customElements.get('support-menu')) customElements.define('support-menu', SupportMenu);
})();
