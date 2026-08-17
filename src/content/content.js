/**
 * Kommen – Content Script
 *
 * Injects an embedded titlebar into Google Messages and applies theme / cozy
 * UI enhancements.  Reacts to settings changes relayed from the service worker.
 */

(function kommen() {
  "use strict";

  /* -------------------------------------------------------------------------
   * Constants
   * ---------------------------------------------------------------------- */

  const TITLEBAR_ID = "kommen-titlebar";
  const BODY_ATTR = "data-kommen";
  const STORAGE_KEYS = ["titlebarEnabled", "theme", "compactMode"];

  /* -------------------------------------------------------------------------
   * Helpers
   * ---------------------------------------------------------------------- */

  /** Read settings from sync storage (returns a Promise). */
  function loadSettings() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(STORAGE_KEYS, resolve);
    });
  }

  /* -------------------------------------------------------------------------
   * Titlebar
   * ---------------------------------------------------------------------- */

  function buildTitlebar() {
    const bar = document.createElement("div");
    bar.id = TITLEBAR_ID;
    bar.setAttribute("aria-label", "Kommen titlebar");

    // Drag region – lets the OS window be moved via this element in PWA mode
    const dragRegion = document.createElement("div");
    dragRegion.className = "kommen-drag-region";

    // App identity
    const identity = document.createElement("div");
    identity.className = "kommen-identity";

    const logo = document.createElement("span");
    logo.className = "kommen-logo";
    logo.textContent = "💬";
    logo.setAttribute("aria-hidden", "true");

    const title = document.createElement("span");
    title.className = "kommen-title";
    title.textContent = "Messages";

    identity.append(logo, title);

    // Window controls (visual only – real controls are rendered by the OS)
    const controls = document.createElement("div");
    controls.className = "kommen-window-controls";
    controls.setAttribute("aria-hidden", "true");

    for (const [cls, label] of [
      ["kommen-btn-minimize", "−"],
      ["kommen-btn-maximize", "□"],
      ["kommen-btn-close", "✕"],
    ]) {
      const btn = document.createElement("button");
      btn.className = `kommen-wc-btn ${cls}`;
      btn.textContent = label;
      btn.tabIndex = -1; // not keyboard-focusable – decorative in PWA context
      controls.appendChild(btn);
    }

    bar.append(dragRegion, identity, controls);
    return bar;
  }

  function injectTitlebar() {
    if (document.getElementById(TITLEBAR_ID)) return;
    const bar = buildTitlebar();
    document.body.insertAdjacentElement("afterbegin", bar);
  }

  function removeTitlebar() {
    document.getElementById(TITLEBAR_ID)?.remove();
  }

  /* -------------------------------------------------------------------------
   * Theme application
   * ---------------------------------------------------------------------- */

  function applyTheme(theme) {
    const root = document.documentElement;
    root.removeAttribute("data-kommen-theme");
    if (theme === "light" || theme === "dark") {
      root.setAttribute("data-kommen-theme", theme);
    }
    // "system" → no attribute; CSS media query handles it
  }

  /* -------------------------------------------------------------------------
   * Settings application
   * ---------------------------------------------------------------------- */

  function applySettings({ titlebarEnabled, theme, compactMode }) {
    document.documentElement.setAttribute(BODY_ATTR, "true");

    if (titlebarEnabled !== false) {
      injectTitlebar();
    } else {
      removeTitlebar();
    }

    applyTheme(theme ?? "system");

    document.documentElement.toggleAttribute(
      "data-kommen-compact",
      !!compactMode
    );
  }

  /* -------------------------------------------------------------------------
   * Boot
   * ---------------------------------------------------------------------- */

  async function init() {
    const settings = await loadSettings();
    applySettings(settings);
  }

  // Re-apply whenever settings change — only accept messages relayed from the
  // service worker (sender.tab is undefined for messages from a service worker)
  chrome.runtime.onMessage.addListener((message, sender) => {
    if (
      message.type === "SETTINGS_UPDATED" &&
      sender.tab === undefined
    ) {
      applySettings(message.settings);
    }
  });

  // Kick off
  init().catch(console.error);
})();
