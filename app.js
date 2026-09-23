
(function () {
  const KEY = "cottonwood-quick-v1";
  const pages = {
    overview: "Operations Dashboard",
    packages: "Package versions",
    quick: "Quick update",
    stl: "STL shift",
    properties: "Properties",
    leasing: "Leasing",
    work: "Work orders",
    pandora: "Play Pandora",
  };
  const crumbs = {
    overview: "Overview",
    packages: "Package",
    quick: "Quick update",
    stl: "Staffing",
    properties: "Portfolio",
    leasing: "Leasing",
    work: "Operations",
    pandora: "Music",
  };

  const shifts = [
    { id: "d", crew: "D Shift", watch: "Days", name: "William McGallion", role: "STL", anchor: "sched-d" },
    { id: "b", crew: "B Shift", watch: "Nights", name: "John Pettier", role: "STL", anchor: "sched-b" },
  ];

  function tileHtml(s) {
    return (
      '<div class="tile" data-shift="' + s.id + '">' +
        '<div>' +
          '<div class="crew">' + s.crew + " · " + s.watch + "</div>" +
          '<div class="name">' + s.name + "</div>" +
          '<div class="role">' + s.role + "</div>" +
        "</div>" +
        '<div class="links">' +
          '<button type="button" data-go="stl" data-anchor="' + s.anchor + '">Shift schedule</button>' +
          '<button type="button" data-go="stl" data-anchor="sched-d">Roster</button>' +
        "</div>" +
      "</div>"
    );
  }

  const overviewTiles = document.getElementById("stlOverview");
  const pageTiles = document.getElementById("stlPage");
  overviewTiles.innerHTML = shifts.map(tileHtml).join("");
  pageTiles.innerHTML = shifts.map(tileHtml).join("");

  const nav = document.getElementById("nav");
  Object.keys(pages).forEach(function (id) {
    const b = document.createElement("button");
    b.type = "button";
    b.dataset.go = id;
    b.textContent = id === "overview" ? "Overview" : pages[id];
    if (id === "overview") b.className = "on";
    nav.appendChild(b);
  });

  function go(id, anchor) {
    if (!pages[id]) return;
    document.querySelectorAll(".page").forEach(function (p) {
      p.classList.toggle("on", p.id === "p-" + id);
    });
    document.querySelectorAll("nav button").forEach(function (b) {
      b.classList.toggle("on", b.dataset.go === id);
    });
    document.getElementById("title").textContent = pages[id];
    document.getElementById("crumb").textContent = crumbs[id] || "Cottonwood";
    document.getElementById("rail").classList.remove("open");
    document.getElementById("backdrop").classList.remove("on");
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (anchor) {
      requestAnimationFrame(function () {
        const el = document.getElementById(anchor);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }
  }

  document.body.addEventListener("click", function (e) {
    const t = e.target.closest("[data-go]");
    if (!t) return;
    go(t.dataset.go, t.dataset.anchor);
  });

  const menuBtn = document.getElementById("menuBtn");
  const rail = document.getElementById("rail");
  const backdrop = document.getElementById("backdrop");
  menuBtn.onclick = function () {
    const open = rail.classList.toggle("open");
    backdrop.classList.toggle("on", open);
  };
  backdrop.onclick = function () {
    rail.classList.remove("open");
    backdrop.classList.remove("on");
  };

  const note = document.getElementById("note");
  const tag = document.getElementById("tag");
  const status = document.getElementById("status");
  const log = document.getElementById("log");

  function load() {
    let rows = [];
    try {
      rows = JSON.parse(localStorage.getItem(KEY) || "[]");
      if (!Array.isArray(rows)) rows = [];
    } catch (_) {
      rows = [];
    }
    if (rows.length) {
      const last = rows[rows.length - 1];
      note.value = last.note || "";
      tag.value = last.tag || "";
    }
    log.textContent = rows.length ? rows.length + " saved" : "No saved tracking data yet.";
    return rows;
  }

  document.getElementById("saveBtn").onclick = function () {
    const rows = load();
    const entry = {
      note: note.value.trim(),
      tag: tag.value.trim(),
      at: new Date().toISOString(),
    };
    if (!entry.note) {
      status.textContent = "Enter a note first.";
      return;
    }
    rows.push(entry);
    localStorage.setItem(KEY, JSON.stringify(rows));
    status.textContent = "Saved. Still here after refresh.";
    load();
  };

  load();
})();
