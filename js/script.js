// --- Переключение языка ---
const DEFAULT_LANG = "ru";

function applyLang(lang){
  const dict = translations[lang];
  if(!dict) return;

  document.documentElement.lang = (lang === "kg") ? "ky" : "ru";
  if(dict.page_title) document.title = dict.page_title;

  document.querySelectorAll("[data-i18n]").forEach(function(el){
    const key = el.getAttribute("data-i18n");
    if(dict[key] !== undefined){
      el.innerHTML = dict[key];
    }
  });

  document.querySelectorAll("[data-i18n-alt]").forEach(function(el){
    const key = el.getAttribute("data-i18n-alt");
    if(dict[key] !== undefined){
      el.setAttribute("alt", dict[key]);
    }
  });

  document.querySelectorAll(".lang-btn").forEach(function(btn){
    btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
  });

  localStorageSafeSet("medvetcity_lang", lang);
}

// localStorage может быть недоступен в некоторых средах предпросмотра —
// оборачиваем в try/catch, чтобы переключение языка работало в любом случае.
function localStorageSafeSet(key, value){
  try { window.localStorage.setItem(key, value); } catch(e) { /* игнорируем */ }
}
function localStorageSafeGet(key){
  try { return window.localStorage.getItem(key); } catch(e) { return null; }
}

function initLangSwitch(){
  document.querySelectorAll(".lang-btn").forEach(function(btn){
    btn.addEventListener("click", function(){
      applyLang(btn.getAttribute("data-lang"));
    });
  });
  const saved = localStorageSafeGet("medvetcity_lang");
  applyLang(saved === "kg" ? "kg" : DEFAULT_LANG);
}

// --- Аккордеон (используется и для «Направлений», и для FAQ — независимо друг от друга) ---
function initAccordionGroup(itemSelector, headSelector){
  document.querySelectorAll(headSelector).forEach(function(btn){
    btn.addEventListener("click", function(){
      const item = btn.closest(itemSelector);
      const isOpen = item.classList.contains("open");
      const container = item.parentElement;
      container.querySelectorAll(itemSelector + ".open").forEach(function(o){
        o.classList.remove("open");
        o.querySelector(headSelector).setAttribute("aria-expanded", "false");
      });
      if(!isOpen){
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });
}

function initAccordion(){
  initAccordionGroup(".pillar", ".pillar-head");
  initAccordionGroup(".faq-item", ".faq-head");
}

// --- Появление блоков при скролле ---
function initScrollReveal(){
  const io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".reveal-io").forEach(function(el, i){
    el.style.transitionDelay = (Math.min(i % 6, 6) * 70) + "ms";
    io.observe(el);
  });
}

// --- Лайтбокс для галереи стройки ---
function initLightbox(){
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  if(!lightbox || !lightboxImg) return;

  document.querySelectorAll(".gal-item").forEach(function(item){
    item.addEventListener("click", function(){
      const full = item.querySelector("img").getAttribute("src");
      lightboxImg.src = full;
      lightbox.classList.add("open");
    });
  });
  lightbox.addEventListener("click", function(){
    lightbox.classList.remove("open");
    lightboxImg.src = "";
  });
}

document.addEventListener("DOMContentLoaded", function(){
  initLangSwitch();
  initAccordion();
  initScrollReveal();
  initLightbox();
});
