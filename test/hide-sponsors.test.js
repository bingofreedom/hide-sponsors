const assert = require("node:assert");
const test = require("node:test");

const { hasSponsoredLabel, isAdClickUrl, normalizeLabel } = require("../hide-sponsors");

test("normalizes sponsored labels consistently", () => {
  assert.equal(normalizeLabel(" Sponsored results "), "sponsored results");
  assert.equal(normalizeLabel("Publicité"), "publicite");
});

test("detects sponsored labels across common Google locales", () => {
  [
    "Sponsored",
    "Sponsored results",
    "Advertisement",
    "Anzeige",
    "Anuncio",
    "Patrocinado",
    "Publicité",
    "广告",
    "贊助",
    "広告",
    "광고"
  ].forEach((label) => {
    assert.equal(hasSponsoredLabel(label), true, label);
  });
});

test("ignores long snippets that merely mention ads", () => {
  assert.equal(
    hasSponsoredLabel("This article explains how sponsored search results work and why scams happen."),
    false
  );
});

test("detects obvious Google ad click redirect URLs", () => {
  assert.equal(isAdClickUrl("https://www.google.com/aclk?sa=l&adurl=https%3A%2F%2Fexample.com"), true);
  assert.equal(isAdClickUrl("https://www.googleadservices.com/pagead/aclk?adurl=https://example.com"), true);
  assert.equal(isAdClickUrl("https://www.google.com/url?q=https%3A%2F%2Fexample.com"), false);
});
