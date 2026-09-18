(function () {
  var VER = "20260918e";
  var ENTRY = "https://cdn.jsdmirror.com/gh/www123-345rft/hlju-huiwu@v20260918e/docs/";
  try {
    var host = location.hostname;
    if (host.indexOf("github.io") !== -1) {
      var parts = location.pathname.split("/").filter(Boolean);
      var file = parts[parts.length - 1] || "index.html";
      if (!/\.html$/i.test(file)) file = "index.html";
      location.replace(ENTRY + file + location.search);
      return;
    }
    var u = new URL(location.href);
    if (u.searchParams.get("v") !== VER) {
      u.searchParams.set("v", VER);
      location.replace(u.href);
    }
  } catch (e) {}
})();
