# Kommen 💬

A Manifest V3 browser extension that transforms [Google Messages](https://messages.google.com) into a cozier, more habitable PWA — complete with an embedded titlebar, warm theming, and polished UI tweaks.

> Designed for Windows and macOS · Linux contributions welcome

---

## Features

| Feature | Description |
|---|---|
| **Embedded Titlebar** | A native-feeling drag-region titlebar is injected at the top of the page, so the app feels like a real desktop client when installed as a PWA |
| **Cozy Warm Theme** | Soft warm tones replace the default Google palette — matches system light/dark preference automatically |
| **Explicit Themes** | Force Light or Dark mode from the popup, regardless of OS setting |
| **Compact Mode** | A slimmer titlebar variant for smaller screens or personal preference |
| **Persistent Settings** | All options are stored via `chrome.storage.sync` and sync across your devices |

---

## Project Structure

```
Kommen/
├── manifest.json              # MV3 extension manifest
├── package.json               # Dev tooling (web-ext)
├── src/
│   ├── background/
│   │   └── service_worker.js  # Background service worker
│   ├── content/
│   │   └── content.js         # Injected into messages.google.com
│   ├── popup/
│   │   ├── popup.html         # Extension popup UI
│   │   ├── popup.css
│   │   └── popup.js
│   ├── styles/
│   │   └── kommen.css         # Titlebar + cozy UI overrides
│   └── assets/
│       └── icons/             # Extension icons (16/32/48/128 px)
```

---

## Development

### Prerequisites

- Node.js ≥ 18
- Chrome / Chromium (or any Chromium-based browser)

### Install dev dependencies

```bash
npm install
```

### Load unpacked in Chrome

1. Navigate to `chrome://extensions`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked** and select the root `Kommen/` folder

### Lint

```bash
npm run lint
```

### Build (zip for distribution)

```bash
npm run build
# → dist/kommen-0.1.0.zip
```

### Live-reload during development (Chromium)

```bash
npm run dev
```

---

## Settings

Open the extension popup (click the Kommen icon in your toolbar) to:

- Enable / disable the embedded titlebar
- Toggle compact titlebar mode
- Choose between **System**, **Light**, or **Dark** theme

Changes are applied immediately to any open Google Messages tab.

---

## Contributing

Issues and PRs are welcome! Please open an issue first for significant changes.

---

## License

[MIT](LICENSE)
