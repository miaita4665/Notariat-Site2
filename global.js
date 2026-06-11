/* ── global.js ── */
async function loadComponent(url, placeholderId) {
  try {
    const res  = await fetch(url);
    const html = await res.text();
    const placeholder = document.getElementById(placeholderId);
    if (placeholder) placeholder.outerHTML = html;
  } catch (e) {
    console.warn("Nu s-a putut încărca componenta:", url);
  }
}

Promise.all([
  loadComponent("navbar.html", "navbar-placeholder"),
  loadComponent("footer.html",  "footer-placeholder"),
]).then(() => {
  initNav();
  initLang();
  initCookies();
});

function initNav() {
  window.toggleMenu = () => document.getElementById("mobileMenu")?.classList.toggle("hidden");
  window.closeMenu  = () => document.getElementById("mobileMenu")?.classList.add("hidden");
}

function initCookies() {
  if (!localStorage.getItem("cookiesAccepted")) {
    document.getElementById("cookie-banner")?.classList.remove("hidden");
  }
  window.acceptCookies = () => {
    localStorage.setItem("cookiesAccepted", "true");
    document.getElementById("cookie-banner")?.classList.add("hidden");
  };
}

/* ── TRADUCERI GLOBALE (Navbar, Footer, Cookies) ── */
/* ── TRADUCERI GLOBALE (Navbar, Footer, Cookies) ── */
const globalTranslations = {
  ro: {
    "cookie-text": "Acest site folosește cookie-uri pentru a vă oferi o experiență de navigare mai bună. Prin continuarea navigării sunteți de acord cu utilizarea acestora.",
    "cookie-link": "Află mai multe",
    "cookie-btn": "Am înțeles",
    "top-address": "Str. Soldat Ghiță Șerban nr. 94, et. 1, Sector 3, București",
    "nav-1": "ACASĂ", "nav-2": "DESPRE NOI", "nav-3": "SERVICII", "nav-4": "CONTACT",
    "nav-ghiduri": "GHIDURI UTILE",
    "nav-dd-1": "Acte Necesare Dosare", "nav-dd-2": "Tarife & Onorarii", "nav-dd-3": "Ghidul Tipuri de Acte", "nav-dd-4": "Traduceri & Apostile",
    "mob-nav-1": "ACASĂ", "mob-nav-2": "DESPRE NOI", "mob-nav-3": "SERVICII", "mob-nav-4": "CONTACT",
    "mob-dd-1": "─ Acte Necesare", "mob-dd-2": "─ Tarife & Onorarii", "mob-dd-3": "─ Ghid Tipuri Acte", "mob-dd-4": "─ Traduceri & Apostile",
    "footer-menu-title": "Meniu", "footer-info-title": "Informații Utile",
    "footer-nav-1": "Acasă", "footer-nav-2": "Despre Noi", "footer-nav-3": "Servicii", "footer-nav-4": "Contact",
    "footer-info-1": "Acte Necesare Dosare", "footer-info-2": "Tarife & Onorarii", "footer-info-3": "Ghidul Tipuri de Acte", "footer-info-4": "Traduceri & Apostile",
    "footer-terms": "Termeni & Condiții", "footer-cookies": "Politica Cookies", "footer-privacy": "Politica de Confidențialitate",
    "footer-copy": "© 2026 Popovici & Agachi Societate Profesională Notarială — Toate drepturile rezervate"
  },
  en: {
    "cookie-text": "This site uses cookies to offer you a better browsing experience. By continuing to browse, you agree to their use.",
    "cookie-link": "Learn more",
    "cookie-btn": "I understand",
    "top-address": "94 Soldat Ghita Serban St, 1st Floor, District 3, Bucharest",
    "nav-1": "HOME", "nav-2": "ABOUT US", "nav-3": "SERVICES", "nav-4": "CONTACT",
    "nav-ghiduri": "USEFUL GUIDES",
    "nav-dd-1": "Required Documents", "nav-dd-2": "Fees & Honorariums", "nav-dd-3": "Types of Deeds Guide", "nav-dd-4": "Translations & Apostilles",
    "mob-nav-1": "HOME", "mob-nav-2": "ABOUT US", "mob-nav-3": "SERVICES", "mob-nav-4": "CONTACT",
    "mob-dd-1": "─ Required Docs", "mob-dd-2": "─ Fees & Honorariums", "mob-dd-3": "─ Types of Deeds", "mob-dd-4": "─ Translations",
    "footer-menu-title": "Menu", "footer-info-title": "Useful Information",
    "footer-nav-1": "Home", "footer-nav-2": "About Us", "footer-nav-3": "Services", "footer-nav-4": "Contact",
    "footer-info-1": "Required Documents", "footer-info-2": "Fees & Honorariums", "footer-info-3": "Types of Deeds Guide", "footer-info-4": "Translations & Apostilles",
    "footer-terms": "Terms & Conditions", "footer-cookies": "Cookie Policy", "footer-privacy": "Privacy Policy",
    "footer-copy": "© 2026 Popovici & Agachi — All rights reserved"
  }
};

let lang = localStorage.getItem("lang") || "ro";

function initLang() {
  applyGlobalLang(); 
  window.toggleLang = () => {
    lang = lang === "ro" ? "en" : "ro";
    localStorage.setItem("lang", lang);
    applyGlobalLang(); 
  };
}

function applyGlobalLang() {
  // 1. Schimbă textul butoanelor din Navbar (RO/EN)
  const labels = { ro: "EN", en: "RO" };
  ["langBtn", "mobLangBtn"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = labels[lang];
  });
  document.documentElement.lang = lang;

  // 2. Aplică traducerile globale pentru Meniu, Subsol și Cookie-uri
  const gDict = globalTranslations[lang];
  Object.keys(gDict).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = gDict[id];
  });

  // 3. Cheamă traducerile specifice paginii (dacă există funcția în pagină)
  if (typeof window.applyLocalTranslations === "function") {
    window.applyLocalTranslations(lang);
  }
}