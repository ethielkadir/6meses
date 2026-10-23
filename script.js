/* PROJECT: 06 — lógica de la aventura. Para personalizar textos y regalos, edita content.js. */

const STORAGE_KEY = "project06-completed-levels-v1";
const app = document.querySelector("#app");
const headerProgress = document.querySelector("#header-progress");
const modal = document.querySelector("#gift-modal");
const modalClose = document.querySelector("#modal-close");
const giftImage = document.querySelector("#gift-image");
const imageFallback = document.querySelector("#image-fallback");
const modalTitle = document.querySelector("#modal-title");
const modalCaption = document.querySelector("#modal-caption");
const toast = document.querySelector("#toast");
let completed = readProgress();
let toastTimeout;
let lastFocusedElement = null;

function readProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(saved)) return [];
    return [...new Set(saved.filter(n => Number.isInteger(n) && n >= 0 && n < CONFIG.levels.length))].sort((a, b) => a - b);
  } catch (_) {
    return [];
  }
}

function saveProgress() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(completed)); }
  catch (_) { /* La aventura también funciona si el navegador bloquea el almacenamiento. */ }
  updateHeaderProgress();
}

function updateHeaderProgress() {
  const percent = (completed.length / CONFIG.levels.length) * 100;
  headerProgress.style.width = `${percent}%`;
  headerProgress.parentElement.setAttribute("aria-label", `${completed.length} de ${CONFIG.levels.length} niveles completados`);
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[character]));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("is-visible"), 3300);
}

function isUnlocked(index) {
  return index === 0 || completed.includes(index - 1);
}

function renderLanding() {
  app.innerHTML = `
    <section class="view hero">
      <div class="hero-copy">
        <p class="eyebrow">✧ MI MUNDO DISEÑADO PARA TI ✧</p>
        <h1>${escapeHtml(CONFIG.title.split(":")[0])}<br><em>${escapeHtml(CONFIG.title.includes(":") ? CONFIG.title.split(":").slice(1).join(":").trim() : "SOLO NOSOTROS")}</em></h1>
        <p class="hero-subtitle">${escapeHtml(CONFIG.subtitle)}</p>
        <p class="hero-subtitle">${escapeHtml(CONFIG.intro)}</p>
        <div class="hero-bottom">
          <button class="primary-button" id="start-adventure" type="button">COMIENZA LA AVENTURA <span class="arrow">↗</span></button>
          <span class="hero-note">6 NIVELES · 6 LLAVES · SOLO TU Y YO</span>
        </div>
      </div>
      <div class="hero-art" aria-hidden="true">
        <div class="portal-halo"></div><div class="orbit"></div><div class="orbit orbit--two"></div>
        <div class="portal"><div class="portal-core"><span class="portal-heart">♡</span></div></div>
        <span class="orbit-star orbit-star--one">✦</span><span class="orbit-star orbit-star--two">✧</span><span class="orbit-star orbit-star--three">✦</span>
      </div>
    </section>
    <div class="glass-panel" style="max-width:620px;padding:15px 19px;margin:0 0 12px;display:flex;align-items:center;gap:13px">
      <span style="color:var(--gold);font-size:20px">✧</span><span style="color:#cfc4e8;font-size:11px;line-height:1.75">${escapeHtml(CONFIG.introNote)}</span>
    </div>`;
  document.querySelector("#start-adventure").addEventListener("click", renderMap);
}

function renderMap() {
  const total = CONFIG.levels.length;
  const allDone = completed.length === total;
  const cards = CONFIG.levels.map((level, index) => {
    const done = completed.includes(index);
    const unlocked = isUnlocked(index);
    const status = done ? "Completado" : unlocked ? "Disponible" : "Bloqueado";
    const symbol = done ? "✓" : unlocked ? "✧" : "⌑";
    return `<button class="level-card ${done ? "is-complete" : ""} ${unlocked && !done ? "is-next" : ""}" data-level="${index}" type="button" ${unlocked ? "" : "disabled"} aria-label="Nivel ${index + 1}: ${escapeHtml(level.title)}. ${status}">
      <div class="level-card-top"><span class="level-number">CAPÍTULO 0${index + 1} / 0${total}</span><span class="level-symbol">${symbol}</span></div>
      <h2>${escapeHtml(level.title)}</h2><p>${escapeHtml(level.short)}</p>
      <div class="level-status"><span class="status-icon">${done ? "✦" : unlocked ? "↗" : "✧"}</span>${status}</div>
    </button>`;
  }).join("");
  app.innerHTML = `
    <section class="view">
      <div class="page-heading"><div><p class="eyebrow">EL MAPA DE NUESTRA HISTORIA</p><h1>Seis capítulos,<br><em style="color:var(--pink)">un mismo destino.</em></h1><p>Abre las puertas en orden, descubre cada regalo y recolecta las llaves.</p></div><div class="chapters-meta">AVANCE<strong>${completed.length.toString().padStart(2, "0")} <span style="color:#9e91c5;font-size:15px">/ ${total.toString().padStart(2, "0")}</span></strong></div></div>
      <div class="level-grid">${cards}</div>
      <div class="map-bottom"><div class="key-meter"><span>LLAVES CONSEGUIDAS</span><span class="key-icons">${CONFIG.levels.map((_, i) => `<span class="key-icon ${completed.includes(i) ? "earned" : ""}" title="${completed.includes(i) ? "Llave conseguida" : "Llave pendiente"}">${completed.includes(i) ? "⚿" : "·"}</span>`).join("")}</span></div><div style="display:flex;gap:8px;align-items:center"><button class="text-button" id="home-button" type="button">← PORTADA</button><button class="text-button" id="reset-progress" type="button">REINICIAR AVENTURA ↻</button></div></div>
      ${allDone ? `<div style="margin-top:17px;text-align:center"><button class="primary-button" id="see-ending" type="button">DESCUBRIR EL FINAL ✦</button></div>` : ""}
    </section>`;
  document.querySelectorAll("[data-level]").forEach(button => button.addEventListener("click", () => renderLevel(Number(button.dataset.level))));
  document.querySelector("#home-button").addEventListener("click", renderLanding);
  document.querySelector("#reset-progress").addEventListener("click", () => {
    if (window.confirm("¿Quieres reiniciar la aventura? Una vez mas mi amor?.")) {
      completed = [];
      saveProgress();
      renderMap();
      showToast("Pues una vez mas será. ✧");
    }
  });
  document.querySelector("#see-ending")?.addEventListener("click", renderEnding);
}

function renderLevel(index) {
  const level = CONFIG.levels[index];
  if (!level) return renderMap();
  if (!isUnlocked(index)) {
    showToast("Primero debes conseguir la llave del capítulo anterior. ✧");
    return;
  }
  const done = completed.includes(index);
  const giftIcon = level.gift.type === "youtube" ? "♫" : "♡";
  const giftLabel = level.gift.type === "youtube" ? "ABRIR CANCIÓN EN YOUTUBE" : "ABRE TU REGALO";
  const progress = Math.round((completed.length / CONFIG.levels.length) * 100);
  app.innerHTML = `
    <section class="view">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:15px;margin-bottom:19px"><button id="back-to-map" class="text-button" type="button">← VOLVER AL MAPA</button><span class="eyebrow" style="margin:0">CAPÍTULO 0${index + 1} / 0${CONFIG.levels.length}</span></div>
      <div class="level-layout">
        <article class="glass-panel story-panel">
          <span class="chapter-kicker">${done ? "LLAVE CONSEGUIDA" : "NUEVO CAPÍTULO"}</span>
          <h1>${escapeHtml(level.title)}</h1>
          <div class="story-text">${escapeHtml(level.story)}</div>
          <div class="memory-note"><p class="eyebrow">${escapeHtml(level.memoryLabel)}</p><p>${escapeHtml(level.memory)}</p></div>
          <div class="level-actions"><button id="previous-chapter" class="secondary-button" type="button">← ${index === 0 ? "MAPA" : "CAPÍTULO ANTERIOR"}</button>${done ? `<span class="completed-message">✦ NIVEL COMPLETADO</span>` : `<button id="complete-chapter" class="primary-button complete-button" type="button">COMPLETAR NIVEL Y OBTENER LLAVE <span class="arrow">↗</span></button>`}</div>
        </article>
        <aside class="chapter-side">
          <div class="glass-panel gift-panel"><div class="gift-art" aria-hidden="true"><span class="gift-art-symbol">${giftIcon}</span></div><p class="eyebrow">UN REGALO TE ESPERA</p><h3>${escapeHtml(level.giftTitle)}</h3><p>${escapeHtml(level.giftDescription)}</p><button id="open-gift" class="primary-button" type="button">${giftLabel} <span class="arrow">↗</span></button><p class="gift-help">PREPARADO CON TODO MI AMOR ♡</p></div>
          <div class="glass-panel progress-panel"><div class="progress-row"><span>AVANCE DE LA AVENTURA</span><strong>${completed.length} / ${CONFIG.levels.length}</strong></div><div class="progress-track"><span style="width:${progress}%"></span></div><div class="progress-row" style="margin-top:12px"><span>LLAVES QUE TIENES</span><strong style="color:var(--gold)">${completed.length} ✧</strong></div></div>
        </aside>
      </div>
    </section>`;
  document.querySelector("#back-to-map").addEventListener("click", renderMap);
  document.querySelector("#previous-chapter").addEventListener("click", () => index === 0 ? renderMap() : renderLevel(index - 1));
  document.querySelector("#open-gift").addEventListener("click", () => openGift(index));
  document.querySelector("#complete-chapter")?.addEventListener("click", () => {
    if (!completed.includes(index)) completed.push(index);
    completed.sort((a, b) => a - b);
    saveProgress();
    if (index === CONFIG.levels.length - 1) renderEnding();
    else {
      renderLevel(index);
      showToast(`¡Conseguiste la llave ${index + 1}! El siguiente capítulo ya está disponible. ✧`);
    }
  });
}

function openGift(index) {
  const level = CONFIG.levels[index];
  const gift = level.gift;
  if (gift.type === "youtube") {
    const url = String(gift.value || "").trim();
    if (!url || url.includes("https://youtu.be/9fCiUt9Z60Q") || !/^https?:\/\//i.test(url)) {
      showToast("Este regalo aún necesita su enlace de YouTube. Pégalo en script.js, dentro del nivel " + (index + 1) + ".");
      return;
    }
    let parsed;
    try { parsed = new URL(url); } catch (_) { showToast("Revisa el enlace de YouTube en script.js."); return; }
    if (!/(^|\.)youtube\.com$|(^|\.)youtu\.be$/.test(parsed.hostname)) {
      showToast("Pega un enlace válido de YouTube en script.js.");
      return;
    }
    window.open(parsed.href, "_blank", "noopener,noreferrer");
    return;
  }
  if (gift.type === "image") {
    lastFocusedElement = document.activeElement;
    modalTitle.textContent = level.giftTitle;
    modalCaption.textContent = level.giftCaption || "";
    imageFallback.hidden = true;
    giftImage.hidden = false;
    giftImage.alt = level.giftTitle;
    giftImage.onerror = () => { giftImage.hidden = true; imageFallback.hidden = false; };
    giftImage.onload = () => { giftImage.hidden = false; imageFallback.hidden = true; };
    giftImage.src = gift.value;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    modalClose.focus();
  }
}

function closeGiftModal() {
  modal.hidden = true;
  document.body.style.overflow = "";
  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") lastFocusedElement.focus();
}

function renderEnding() {
  if (completed.length !== CONFIG.levels.length) {
    showToast("Todavía te quedan capítulos por completar. Ya casi llegas mi amor✧");
    return renderMap();
  }
  app.innerHTML = `
    <section class="view ending-view"><div class="glass-panel ending-card">
      <div class="ending-symbol">♡</div><p class="eyebrow">MISIÓN COMPLETADA · SEIS LLAVES REUNIDAS</p>
      <h1 class="ending-title">${escapeHtml(CONFIG.endingTitle).replace(/\n/g, "<br>").replace(/&lt;em&gt;/g, "<em>").replace(/&lt;\/em&gt;/g, "</em>")}</h1>
      <div class="earned-keys">${CONFIG.levels.map(() => "<span>⚿</span>").join("")}</div>
      <p class="ending-copy">${escapeHtml(CONFIG.endingMessage)}</p>
      <div style="display:flex;justify-content:center;flex-wrap:wrap;gap:10px;margin-top:30px"><button id="ending-map" class="secondary-button" type="button">← VOLVER A LOS RECUERDOS</button><button id="replay-adventure" class="primary-button" type="button">VOLVER A VIVIRLO ↻</button></div>
    </div></section>`;
  document.querySelector("#ending-map").addEventListener("click", renderMap);
  document.querySelector("#replay-adventure").addEventListener("click", () => renderLevel(0));
}

modalClose.addEventListener("click", closeGiftModal);
modal.addEventListener("click", event => { if (event.target === modal) closeGiftModal(); });
document.addEventListener("keydown", event => { if (event.key === "Escape" && !modal.hidden) closeGiftModal(); });
document.querySelector("#brand-home").addEventListener("click", renderLanding);
updateHeaderProgress();
renderLanding();
