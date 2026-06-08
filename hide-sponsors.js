(function () {
  const HIDDEN_ATTRIBUTE = "data-hide-sponsors-hidden";
  const ROOT_SELECTOR = "html, body, #search, #rso, [role='main']";
  const DIRECT_AD_SELECTOR = [
    "[data-text-ad]",
    "[data-pla]",
    ".pla-unit",
    ".cu-container",
    ".commercial-unit",
    ".commercial-unit-desktop-top",
    ".commercial-unit-mobile-top",
    ".uEierd",
    ".ads-ad"
  ].join(",");

  const LABEL_SELECTOR = [
    "[aria-label]",
    "[data-text-ad]",
    "[data-pla]",
    "span",
    "div"
  ].join(",");

  const SPONSORED_LABELS = new Set([
    "ad",
    "ads",
    "advertisement",
    "advertisements",
    "advertiser",
    "paid",
    "sponsored",
    "sponsored result",
    "sponsored results",
    "sponsored link",
    "sponsored links",
    "sponsored shopping",
    "advertentie",
    "anzeige",
    "anzeigen",
    "annonce",
    "annonces",
    "anuncio",
    "anuncios",
    "publicidad",
    "pubblicita",
    "annuncio",
    "annunci",
    "reklam",
    "reklama",
    "reklame",
    "sponsrad",
    "sponsrade",
    "sponsret",
    "sponsoreret",
    "sponsoroitu",
    "sponsorerte",
    "sponsorerad",
    "sponsrad",
    "gesponsord",
    "gesponsert",
    "sponsorizzato",
    "sponsorizzati",
    "patrocinado",
    "patrocinados",
    "patrocinada",
    "patrocinadas",
    "publicite",
    "reklama",
    "reklaam",
    "hirdetes",
    "hirdetesek",
    "oglas",
    "oglasi",
    "oglasavanje",
    "sponzorovano",
    "sponzorovane",
    "sponzorirano",
    "sponzorirani",
    "sponzorovane",
    "sponzorowane",
    "sponsorowane",
    "sponsorovano",
    "sponsorirano",
    "sponsorowany",
    "sponsorisano",
    "reklama",
    "anunt",
    "anunturi",
    "reclama",
    "reclame",
    "mainos",
    "mainokset",
    "ilan",
    "reklamlar",
    "annons",
    "annonser",
    "quang cao",
    "iklan",
    "iklan bersponsor",
    "sponsoid",
    "sponzorovane",
    "sponzorovany",
    "sponzorovana",
    "광고",
    "広告",
    "廣告",
    "广告",
    "贊助",
    "赞助",
    "赞助商",
    "赞助结果",
    "赞助商链接",
    "赞助链接",
    "معلن",
    "اعلان",
    "اعلانات",
    "إعلان",
    "إعلانات",
    "מודעה",
    "מודעות",
    "प्रायोजित",
    "विज्ञापन",
    "sponzorovano"
  ]);

  const CONTAINER_SELECTORS = [
    "[data-text-ad]",
    "[data-pla]",
    ".uEierd",
    ".pla-unit",
    ".cu-container",
    ".commercial-unit",
    ".commercial-unit-desktop-top",
    ".commercial-unit-mobile-top",
    ".ads-ad",
    "div[data-sokoban-container]",
    "div[jscontroller][data-hveid]",
    "div[jscontroller]",
    "[data-header-feature]",
    "[data-attrid]"
  ];

  let observer = null;
  let scanScheduled = false;
  let clickGuardInstalled = false;

  function normalizeLabel(text) {
    return (text || "")
      .replace(/[\u200B-\u200D\uFEFF]/g, "")
      .normalize("NFKC")
      .replace(/\p{Script=Latin}+/gu, (word) =>
        word.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      )
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  function hasSponsoredLabel(text) {
    const normalized = normalizeLabel(text);

    if (!normalized || normalized.length > 80) {
      return false;
    }

    if (SPONSORED_LABELS.has(normalized)) {
      return true;
    }

    return (
      normalized.includes("sponsored result") ||
      normalized.includes("sponsored link") ||
      normalized.includes("sponsored shopping") ||
      normalized.includes("赞助") ||
      normalized.includes("贊助") ||
      normalized.includes("广告") ||
      normalized.includes("廣告") ||
      normalized.includes("広告") ||
      normalized.includes("광고")
    );
  }

  function isRootContainer(element) {
    return element.matches(ROOT_SELECTOR);
  }

  function markHidden(element) {
    if (!element || isRootContainer(element) || element.hasAttribute(HIDDEN_ATTRIBUTE)) {
      return false;
    }

    element.setAttribute(HIDDEN_ATTRIBUTE, "true");
    element.style.setProperty("display", "none", "important");
    return true;
  }

  function closestAdContainer(element) {
    for (const selector of CONTAINER_SELECTORS) {
      const container = element.closest(selector);

      if (container && !isRootContainer(container)) {
        return container;
      }
    }

    return null;
  }

  function hideDirectAdContainers(root) {
    if (root.nodeType !== Node.ELEMENT_NODE) {
      return;
    }

    if (root.matches(DIRECT_AD_SELECTOR)) {
      markHidden(root);
    }

    root.querySelectorAll(DIRECT_AD_SELECTOR).forEach(markHidden);
  }

  function hideLabeledAds(root) {
    if (root.nodeType !== Node.ELEMENT_NODE) {
      return;
    }

    const candidates = root.matches(LABEL_SELECTOR)
      ? [root, ...root.querySelectorAll(LABEL_SELECTOR)]
      : [...root.querySelectorAll(LABEL_SELECTOR)];

    candidates.forEach((element) => {
      const label = element.getAttribute("aria-label") || element.textContent;

      if (!hasSponsoredLabel(label)) {
        return;
      }

      markHidden(closestAdContainer(element));
    });
  }

  function hideSponsored(root = document.body) {
    if (!root) {
      return;
    }

    hideDirectAdContainers(root);
    hideLabeledAds(root);
  }

  function isAdClickUrl(href) {
    if (!href) {
      return false;
    }

    try {
      const baseUrl =
        typeof location !== "undefined" ? location.href : "https://www.google.com/search?q=test";
      const url = new URL(href, baseUrl);
      const hostname = url.hostname.toLowerCase();
      const pathname = url.pathname.toLowerCase();

      return (
        pathname === "/aclk" ||
        pathname.startsWith("/pagead/") ||
        hostname.endsWith("googleadservices.com") ||
        hostname.endsWith("doubleclick.net")
      );
    } catch (error) {
      return false;
    }
  }

  function installClickGuard() {
    if (clickGuardInstalled || typeof document === "undefined") {
      return;
    }

    clickGuardInstalled = true;
    document.addEventListener(
      "click",
      (event) => {
        const link = event.target.closest && event.target.closest("a[href]");

        if (link && isAdClickUrl(link.href)) {
          event.preventDefault();
          event.stopPropagation();
          markHidden(closestAdContainer(link) || link);
        }
      },
      true
    );
  }

  function scheduleScan(root = document.body) {
    if (scanScheduled) {
      return;
    }

    scanScheduled = true;
    requestAnimationFrame(() => {
      scanScheduled = false;
      hideSponsored(root);
    });
  }

  function observeSearchResults() {
    if (!document.body || observer) {
      return;
    }

    hideSponsored(document.body);

    observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            scheduleScan(node);
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  if (typeof document !== "undefined") {
    installClickGuard();

    if (document.body) {
      observeSearchResults();
    } else {
      document.addEventListener("DOMContentLoaded", observeSearchResults, { once: true });
    }
  }

  if (typeof module === "object" && module.exports) {
    module.exports = {
      hasSponsoredLabel,
      hideSponsored,
      isAdClickUrl,
      normalizeLabel
    };
  }
})();
