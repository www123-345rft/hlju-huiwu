/* 纯静态姓名查座：仅查询公开的 assets/seating-data.json，不接收或上传姓名。 */
(function () {
  "use strict";
  const form = document.getElementById("seatSearchForm");
  const input = document.getElementById("seatName");
  const button = document.getElementById("seatSearchButton");
  const status = document.getElementById("seatSearchStatus");
  const results = document.getElementById("seatSearchResults");
  if (!form || !input || !button || !status || !results) return;

  let people = [];
  let loaded = false;
  const dataUrl = (window.STATIC_BASE || "") + "assets/seating-data.json?v=20260920c";

  function cleanName(value) {
    return String(value == null ? "" : value)
      .normalize("NFKC")
      .replace(/\s+/g, "")
      .trim();
  }

  function setStatus(message) {
    status.textContent = message;
  }

  function textNode(tag, text, className) {
    const el = document.createElement(tag);
    el.textContent = text;
    if (className) el.className = className;
    return el;
  }

  function showMatch(person) {
    const card = document.createElement("article");
    card.className = "seat-search-result";
    const area = String(person.area || "").trim();
    card.appendChild(textNode("strong", String(person.name)));
    card.appendChild(textNode(
      "p",
      (area ? area + " · " : "") + "第 " + person.row + " 排 · " + person.seat + " 号座"
    ));
    if (person.unit) {
      card.appendChild(textNode("small", "单位：" + person.unit));
    }
    results.appendChild(card);
  }

  function search(event) {
    event.preventDefault();
    results.replaceChildren();
    if (!loaded) {
      setStatus("座位名单尚未加载完成，请稍后重试。");
      return;
    }
    if (!people.length) {
      setStatus("尚未导入正式座位名单，请联系会务组。");
      return;
    }
    const query = cleanName(input.value);
    if (query.length < 2) {
      setStatus("请输入至少两个字的完整姓名。");
      return;
    }
    const matches = people.filter(person => cleanName(person.name) === query);
    if (!matches.length) {
      setStatus("未找到对应座位，请检查姓名或联系会务组。");
      return;
    }
    setStatus(matches.length === 1
      ? "查询成功，请核对姓名和座位信息。"
      : "查到 " + matches.length + " 条同名记录，请结合单位向会务组确认。");
    matches.forEach(showMatch);
  }

  form.addEventListener("submit", search);
  fetch(dataUrl, { cache: "no-store" })
    .then(response => {
      if (!response.ok) throw new Error("HTTP " + response.status);
      return response.json();
    })
    .then(data => {
      if (!data || !Array.isArray(data.seats)) {
        throw new Error("座位数据格式不正确");
      }
      people = data.seats.filter(person =>
        person && cleanName(person.name) &&
        String(person.row == null ? "" : person.row).trim() &&
        String(person.seat == null ? "" : person.seat).trim()
      );
      loaded = true;
      button.disabled = people.length === 0;
      setStatus(people.length
        ? "座位名单已加载，请输入完整姓名查询。"
        : "尚未导入正式座位名单，请联系会务组。");
    })
    .catch(() => {
      loaded = false;
      button.disabled = true;
      setStatus("座位名单加载失败，请刷新页面或联系会务组。");
    });
})();
