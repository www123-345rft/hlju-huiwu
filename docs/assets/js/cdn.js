var ASSET_VER = "20260918e";
var CDN_REPO = "www123-345rft/hlju-huiwu";
window.ASSET_VER = ASSET_VER;
window.CDN_BASES = [
  "https://cdn.jsdmirror.com/gh/" + CDN_REPO + "@main/docs/",
  "https://testingcf.jsdelivr.net/gh/" + CDN_REPO + "@main/docs/",
  "https://gcore.jsdelivr.net/gh/" + CDN_REPO + "@main/docs/",
  "https://fastly.jsdelivr.net/gh/" + CDN_REPO + "@main/docs/",
];
window.pickedCdn = window.STATIC_BASE || "";

window.assetFallback = function (rel) {
  return rel + (rel.indexOf("?") >= 0 ? "&" : "?") + "v=" + ASSET_VER;
};

window.assetUrl = function (rel) {
  var host = location.hostname;
  if (host === "127.0.0.1" || host === "localhost" || location.protocol === "file:") {
    return window.assetFallback(rel);
  }
  var base = window.pickedCdn || window.STATIC_BASE || window.CDN_BASES[0];
  return base + rel + "?v=" + ASSET_VER;
};

window.chooseCdn = function (probeRel) {
  return new Promise(function (resolve) {
    var host = location.hostname;
    if (host === "127.0.0.1" || host === "localhost" || location.protocol === "file:") {
      window.pickedCdn = "";
      resolve("");
      return;
    }
    if (window.STATIC_BASE) {
      window.pickedCdn = window.STATIC_BASE;
      resolve(window.STATIC_BASE);
      return;
    }
    var settled = false;
    var left = window.CDN_BASES.length;
    function finish(base) {
      if (settled) return;
      settled = true;
      window.pickedCdn = base;
      resolve(base);
    }
    window.CDN_BASES.forEach(function (base) {
      var img = new Image();
      var timer = setTimeout(function () {
        img.onload = img.onerror = null;
        left -= 1;
        if (!settled && left <= 0) finish(window.CDN_BASES[0]);
      }, 2500);
      img.onload = function () {
        clearTimeout(timer);
        finish(base);
      };
      img.onerror = function () {
        clearTimeout(timer);
        left -= 1;
        if (!settled && left <= 0) finish(window.CDN_BASES[0]);
      };
      img.src = base + probeRel + "?v=" + ASSET_VER + "&r=" + Date.now();
    });
  });
};
