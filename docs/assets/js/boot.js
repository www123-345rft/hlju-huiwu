(function () {
  var VER = "20260918d";
  try {
    var u = new URL(location.href);
    if (u.searchParams.get("v") !== VER) {
      u.searchParams.set("v", VER);
      location.replace(u.href);
    }
  } catch (e) {}
})();
