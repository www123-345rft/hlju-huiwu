var ASSET_VER = "20260918d";
window.assetFallback = function (rel) {
  return rel + (rel.indexOf("?") >= 0 ? "&" : "?") + "v=" + ASSET_VER;
};
window.assetUrl = function (rel) {
  var local = window.assetFallback(rel);
  var host = location.hostname;
  if (host === "127.0.0.1" || host === "localhost" || location.protocol === "file:") return local;
  return "https://fastly.jsdelivr.net/gh/www123-345rft/hlju-huiwu@main/docs/" + rel + "?v=" + ASSET_VER;
};
