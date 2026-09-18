(function () {
  const host = location.hostname;
  const local = host === "127.0.0.1" || host === "localhost" || location.protocol === "file:";
  window.assetUrl = function (rel) {
    if (local) return rel;
    return "https://cdn.jsdelivr.net/gh/www123-345rft/hlju-huiwu@main/docs/" + rel + "?v=hd2";
  };
})();
