/**
 * Kommen – Background Service Worker
 *
 * Handles extension lifecycle events and message passing between the popup
 * and the content script.
 */

const DEFAULT_SETTINGS = {
  titlebarEnabled: true,
  theme: "system", // "system" | "light" | "dark"
  compactMode: false,
};

// Initialise default settings on first install
chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.storage.sync.set(DEFAULT_SETTINGS);
    console.log("[Kommen] Extension installed. Default settings applied.");
  }
});

// Relay messages from popup → content script
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "SETTINGS_UPDATED") {
    // Broadcast to all Google Messages tabs
    chrome.tabs.query({ url: "https://messages.google.com/*" }, (tabs) => {
      for (const tab of tabs) {
        chrome.tabs
          .sendMessage(tab.id, message)
          .catch(() => {
            // Tab may not have the content script yet; safe to ignore
          });
      }
      sendResponse({ ok: true });
    });
    // Return true to keep the message channel open for the async callback
    return true;
  }
  // Unknown message type — no async response needed
  return false;
});
