# Hide Sponsors

![Version](https://img.shields.io/badge/version-1.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Chrome](https://img.shields.io/badge/chrome-extension-yellow)

Hide Sponsors is a lightweight Chrome extension by bingo that keeps Google Search focused on organic results by hiding sponsored placements and blocking obvious ad redirect clicks.

## Project Description

Hide Sponsors is a local-only browser extension for people who want cleaner search pages and fewer accidental clicks on paid placements. It hides sponsored Google Search blocks, shopping ad units, and known ad redirect links before they can pull attention away from organic results.

Sponsored search results can be abused for scams, phishing, and malvertising, especially when paid links appear above organic results. Hide Sponsors reduces that risk without collecting user data or requiring extension permissions.

The extension:

- Hides sponsored links and shopping ad blocks on Google Search.
- Detects sponsored labels across common Google locales.
- Blocks obvious Google ad redirect clicks as a fallback.
- Runs locally in your browser.
- Does not collect, track, or send any user data.

This project is maintained by bingo.

## Installation

1. Download the latest release ZIP from the [Releases](https://github.com/bingofreedom/hide-sponsors/releases) page.
2. Extract the ZIP file.
3. Open Chrome and go to `chrome://extensions/`.
4. Enable **Developer mode** in the top-right corner.
5. Click **Load unpacked**.
6. Select the extracted extension folder.
7. Search on Google as usual.

## Usage

After installation, Hide Sponsors works automatically on supported Google Search domains. There are no settings to configure.

When you open a Google Search results page, Hide Sponsors scans the page for sponsored results, shopping ads, and known Google ad redirect links. Matching ad blocks are hidden from the page, and obvious ad redirect clicks are blocked as a fallback.

To update the extension manually:

1. Download the newest release ZIP.
2. Extract it.
3. Open `chrome://extensions/`.
4. Remove the old unpacked extension or click **Reload** after replacing the folder contents.

For local checks, run:

```sh
node --test test/hide-sponsors.test.js
```
