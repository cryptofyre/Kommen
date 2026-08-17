/**
 * Kommen – Popup Script
 *
 * Loads settings from sync storage, renders them in the UI, and saves updates
 * back while notifying any open Google Messages tabs.
 */

(function () {
  "use strict";

  const ids = {
    titlebarEnabled: document.getElementById("titlebarEnabled"),
    compactMode: document.getElementById("compactMode"),
    theme: document.getElementById("theme"),
    saveBtn: document.getElementById("save-btn"),
    saveStatus: document.getElementById("save-status"),
  };

  const STORAGE_KEYS = ["titlebarEnabled", "theme", "compactMode"];

  /* ── Load ─────────────────────────────────────────────── */

  chrome.storage.sync.get(STORAGE_KEYS, (data) => {
    ids.titlebarEnabled.checked = data.titlebarEnabled !== false;
    ids.compactMode.checked = !!data.compactMode;
    ids.theme.value = data.theme ?? "system";
  });

  /* ── Save ─────────────────────────────────────────────── */

  ids.saveBtn.addEventListener("click", () => {
    const settings = {
      titlebarEnabled: ids.titlebarEnabled.checked,
      compactMode: ids.compactMode.checked,
      theme: ids.theme.value,
    };

    chrome.storage.sync.set(settings, () => {
      // Notify content scripts
      chrome.runtime.sendMessage(
        { type: "SETTINGS_UPDATED", settings },
        () => {
          // Ignore errors (no tab open is fine)
          void chrome.runtime.lastError;
        }
      );

      // Briefly show confirmation
      ids.saveStatus.textContent = "Saved ✓";
      setTimeout(() => {
        ids.saveStatus.textContent = "";
      }, 1800);
    });
  });
})();
