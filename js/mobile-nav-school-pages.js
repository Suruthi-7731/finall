(function () {
  const header = document.querySelector('.mainHeader');
  if (!header) return;

  const nav = header.querySelector('.navItems');
  if (!nav) return;

  // Skip pages that already have a dedicated hamburger implementation.
  if (document.getElementById('hamburgerIcon')) return;

  const path = (window.location.pathname || '').toLowerCase();
  const schoolName = path.includes('/school1/')
    ? 'Bharathi Vidhya Kendhra'
    : path.includes('/school2/')
      ? 'Bharathi Kids Kshethralaya'
      : 'School Menu';

  const style = document.createElement('style');
  style.textContent = `
    .mainHeader .hamburgerIcon {
      display: none;
      border: 0;
      background: transparent;
      color: #fff;
      cursor: pointer;
      font-size: 2rem;
      line-height: 1;
      padding: 4px 8px;
    }

    .mainHeader .mobile-menu-header {
      display: none;
    }

    @media (max-width: 900px) {
      .mainHeader .hamburgerIcon {
        display: block !important;
      }

      .mainHeader .navItems {
        display: none !important;
        position: fixed;
        top: 78px;
        right: 0;
        width: 100%;
        max-height: calc(100vh - 78px);
        overflow-y: auto;
        flex-direction: column;
        align-items: stretch;
        padding: 0 0 12px;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        z-index: 1001;
      }

      .mainHeader .navItems.mobile-open {
        display: flex !important;
      }

      .mainHeader .mobile-menu-header {
        display: none !important;
      }

      .mainHeader .mobile-menu-header .school-name {
        color: #fff;
        font-size: 1rem;
        font-weight: 700;
      }

      .mainHeader .mobile-menu-header .close-btn {
        border: 0;
        background: transparent;
        color: #fff;
        font-size: 2rem;
        line-height: 1;
        cursor: pointer;
      }

      .mainHeader .navItems a {
        margin: 0 !important;
        padding: 12px 18px;
        display: block;
      }
    }
  `;
  document.head.appendChild(style);

  const mobileHeader = document.createElement('div');
  mobileHeader.className = 'mobile-menu-header';
  mobileHeader.innerHTML = `
    <span class="school-name">${schoolName}</span>
    <button type="button" class="close-btn" aria-label="Close menu">&times;</button>
  `;
  nav.insertBefore(mobileHeader, nav.firstChild);

  const hamburger = document.createElement('button');
  hamburger.type = 'button';
  hamburger.id = 'hamburgerIcon';
  hamburger.className = 'hamburgerIcon';
  hamburger.setAttribute('aria-label', 'Open menu');
  hamburger.innerHTML = '&#9776;';
  header.appendChild(hamburger);

  // Match mobile menu background to current header color for each page theme.
  const headerBg = window.getComputedStyle(header).backgroundColor;

  const syncNavBackground = () => {
    nav.style.backgroundColor = window.innerWidth <= 900 ? headerBg : 'transparent';
  };
  syncNavBackground();

  const setMenu = (open) => {
    nav.classList.toggle('mobile-open', open);
    hamburger.innerHTML = open ? '&times;' : '&#9776;';
    hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };

  hamburger.addEventListener('click', () => {
    setMenu(!nav.classList.contains('mobile-open'));
  });

  const closeBtn = mobileHeader.querySelector('.close-btn');
  closeBtn.addEventListener('click', () => setMenu(false));

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 900) setMenu(false);
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) setMenu(false);
    syncNavBackground();
  });
})();
