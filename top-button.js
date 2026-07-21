if (!customElements.get('top-button')) {
class TopButton extends HTMLElement {
  connectedCallback() {
    const sh = this.attachShadow({ mode: 'open' });
    sh.innerHTML = `<style>
      :host{position:fixed;right:18px;bottom:18px;z-index:50;display:block;}
      button{width:52px;height:52px;border-radius:50%;background:#ffffff;border:1px solid #ece9e0;box-shadow:0 10px 26px rgba(20,24,18,.18);display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0;opacity:0;transform:translateY(12px);pointer-events:none;transition:opacity .3s,transform .3s;}
      button.on{opacity:1;transform:none;pointer-events:auto;}
      button:active{transform:scale(.94);}
    </style>
    <button aria-label="ページの先頭へ"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1b8a5a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 14 L12 8 L18 14"></path></svg></button>`;
    const btn = sh.querySelector('button');
    this._scroller = null; // element that actually scrolls (null = window/document)
    const getTop = () => {
      if (this._scroller) return this._scroller.scrollTop;
      return window.scrollY || (document.scrollingElement ? document.scrollingElement.scrollTop : 0);
    };
    const onScroll = (e) => {
      if (e && e.target && e.target !== document && e.target !== window && e.target.scrollTop > 0) this._scroller = e.target;
      btn.classList.toggle('on', getTop() > 320);
    };
    // capture:true catches scroll events from inner scroll containers too
    window.addEventListener('scroll', onScroll, { passive: true, capture: true });
    onScroll();
    this._getTop = getTop;
    btn.addEventListener('click', () => this.smoothTop());
    this._cleanup = () => window.removeEventListener('scroll', onScroll, { capture: true });
  }
  disconnectedCallback() { if (this._cleanup) this._cleanup(); if (this._raf) cancelAnimationFrame(this._raf); }
  smoothTop() {
    if (this._raf) cancelAnimationFrame(this._raf);
    const start = this._getTop();
    if (start <= 0) return;
    const dur = Math.min(1400, Math.max(550, start * 0.35));
    const t0 = performance.now();
    const ease = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const setTop = (y) => {
      if (this._scroller) this._scroller.scrollTop = y;
      else window.scrollTo(0, y);
    };
    const step = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      setTop(Math.round(start * (1 - ease(p))));
      if (p < 1) this._raf = requestAnimationFrame(step);
    };
    this._raf = requestAnimationFrame(step);
  }
}
customElements.define('top-button', TopButton);
}
