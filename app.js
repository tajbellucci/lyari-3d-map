// ============================================
// Lyari 3D Crisis Map - App.js
// ============================================

const CENTER = [66.9960, 24.8720];

const CATEGORY = {
  infra:    { label: "Infrastructure", color: "#38bdf8" },
  social:   { label: "Social / Human", color: "#f472b6" },
  env:      { label: "Environment",    color: "#4ade80" },
  displace: { label: "Displacement",   color: "#facc15" },
};

const SEVERITY = {
  critical: { label: "Critical", color: "#ef4444" },
  severe:   { label: "Severe",   color: "#f97316" },
  high:     { label: "High",     color: "#eab308" },
};

const SEVERITY_UR = {
  critical: { label: "\u0627\u0646\u062a\u0647\u0627\u0626\u064a", color: "#ef4444" },
  severe:   { label: "\u0633\u0646\u06af\u064a\u0646", color: "#f97316" },
  high:     { label: "\u0632\u064a\u0627\u062f\u0647", color: "#eab308" },
};

const CATEGORY_UR = {
  infra:    { label: "\u0627\u0646\u0641\u0631\u0627\u0633\u0679\u0631\u06a9\u0681\u0631", color: "#38bdf8" },
  social:   { label: "\u0633\u0645\u0627\u0628\u06cc / \u0627\u0646\u0633\u0627\u0646\u06cc", color: "#f472b6" },
  env:      { label: "\u0645\u0627\u062d\u0648\u0644\u06cc\u0627\u062a\u06cc", color: "#4ade80" },
  displace: { label: "\u0646\u0648 \u0645\u06a9\u0627\u0646\u06cc", color: "#facc15" },
};

let currentLang = "en";

function toggleLang() {
  currentLang = currentLang === "en" ? "ur" : "en";
  const ur = currentLang === "ur";
  const btn = document.getElementById("lang-toggle");
  btn.textContent = ur ? "\u0627\u0631\u062f\u0648 / EN" : "EN / \u0627\u0631\u062f\u0648";
  const sidebar = document.getElementById("sidebar");
  const app = document.getElementById("app");
  const tbText = document.getElementById("titlebar-text");
  const tbSub = document.getElementById("titlebar-sub");

  // Swap every tagged static chrome string (title, subtitle, stats, filters, severity)
  document.querySelectorAll("#sidebar [data-ur]").forEach(el => {
    el.textContent = ur ? el.dataset.ur : el.dataset.en;
  });

  if (ur) {
    sidebar.dir = "rtl";
    sidebar.style.fontFamily = "'Noto Naskh Arabic', 'Segoe UI', Tahoma, Arial, sans-serif";
    app.classList.add("rtl-mode");
    if (tbText) tbText.textContent = "\u0644\u06cc\u0627\u0631\u06cc \u06a9\u0631\u0627\u0626\u0633\u0633 \u0645\u06cc\u067e";
    if (tbSub) tbSub.textContent = "\u06a9\u0633\u06cc \u0628\u06be\u06cc \u0645\u0627\u0631\u06a9\u0631 \u06cc\u0627 \u06a9\u0627\u0631\u0688 \u067e\u0631 \u06a9\u0644\u06a9 \u06a9\u0631\u06cc\u06ba";
    switchMapToUrdu();
    document.getElementById("intro-en").style.display = "none";
    document.getElementById("intro-ur").style.display = "block";
    document.getElementById("disclaimer").style.display = "none";
    document.getElementById("disclaimer-ur").style.display = "flex";
    document.getElementById("credit-en").style.display = "none";
    document.getElementById("credit-ur").style.display = "block";
  } else {
    sidebar.dir = "ltr";
    sidebar.style.fontFamily = "";
    app.classList.remove("rtl-mode");
    if (tbText) tbText.textContent = "Lyari Crisis Map";
    if (tbSub) tbSub.textContent = "Click any marker or card for details";
    switchMapToEnglish();
    document.getElementById("intro-en").style.display = "block";
    document.getElementById("intro-ur").style.display = "none";
    document.getElementById("disclaimer").style.display = "flex";
    document.getElementById("disclaimer-ur").style.display = "none";
    document.getElementById("credit-en").style.display = "block";
    document.getElementById("credit-ur").style.display = "none";
  }

  rebuildCards();
  document.querySelectorAll(".card").forEach(c => c.classList.remove("active"));
  setTimeout(updateMapControlPositions, 100);
}

function switchMapToUrdu() {
  if (!map || !map.getStyle) return;
  const style = map.getStyle();
  for (const layer of style.layers) {
    if (layer.type === "symbol" && layer.layout && layer.layout["text-field"]) {
      map.setLayoutProperty(layer.id, "text-field", [
        "coalesce", ["get", "name:ur"], ["get", "name:en"], ["get", "name:latin"], ["get", "name"]
      ]);
    }
  }
}

function switchMapToEnglish() {
  if (!map || !map.getStyle) return;
  const style = map.getStyle();
  for (const layer of style.layers) {
    if (layer.type === "symbol" && layer.layout && layer.layout["text-field"]) {
      map.setLayoutProperty(layer.id, "text-field", [
        "coalesce", ["get", "name:en"], ["get", "name:latin"], ["get", "name"]
      ]);
    }
  }
}


// ============================================
// ISSUES DATA - loaded from issues-data.js
// ============================================

// ============================================
// UC LABELS
// ============================================
const UC_LABELS = [
  { name: "UC-1 Agra Taj Colony", ur: "\u06cc\u0648 \u0633\u06cc -1 \u0627\u06af\u0631\u0627 \u062a\u0627\u062c \u06a9\u0627\u0644\u0648\u0646\u06cc", coords: [66.9826, 24.8714] },
  { name: "UC-2 Daryaabad", ur: "\u06cc\u0648 \u0633\u06cc -2 \u062f\u0631\u06cc\u0627\u0628\u0627\u062f", coords: [66.9850, 24.8730] },
  { name: "UC-3 Nawabad", ur: "\u06cc\u0648 \u0633\u06cc -3 \u0646\u0648\u0622\u0628\u0627\u062f", coords: [66.9870, 24.8740] },
  { name: "UC-4 Khada Memon Society", ur: "\u06cc\u0648 \u0633\u06cc -4 \u062e\u0627\u062f\u06c1 \u0645\u06cc\u0645\u0648\u0646 \u0633\u0648\u0633\u0627\u0626\u0679\u06cc", coords: [66.9890, 24.8750] },
  { name: "UC-5 Baghdadi", ur: "\u06cc\u0648 \u0633\u06cc -5 \u0628\u063a\u062f\u0627\u062f\u06cc", coords: [66.9980, 24.8700] },
  { name: "UC-6 Moosa Lane", ur: "\u06cc\u0648 \u0633\u06cc -6 \u0645\u0648\u0633\u0649 \u0644\u06cc\u0646", coords: [67.0010, 24.8660] },
  { name: "UC-7 Shah Baig Line", ur: "\u06cc\u0648 \u0633\u06cc -7 \u0634\u0627\u06c1 \u0628\u06cc\u06af \u0644\u0627\u0626\u0646", coords: [67.0030, 24.8650] },
  { name: "UC-8 Bihar Colony", ur: "\u06cc\u0648 \u0633\u06cc -8 \u0628\u06c1\u0627\u0631 \u06a9\u0627\u0644\u0648\u0646\u06cc", coords: [66.9880, 24.8680] },
  { name: "UC-9 Ragiwara", ur: "\u06cc\u0648 \u0633\u06cc -9 \u0631\u0627\u063a\u06cc\u0648\u0631\u06c1", coords: [66.9900, 24.8690] },
  { name: "UC-10 Singo Line", ur: "\u06cc\u0648 \u0633\u06cc -10 \u0633\u06cc\u0646\u06af\u0648 \u0644\u0627\u0626\u0646", coords: [66.9920, 24.8700] },
  { name: "UC-11 Chakiwara", ur: "\u06cc\u0648 \u0633\u06cc -11 \u0686\u0627\u06a9\u06cc\u0648\u0631\u06c1", coords: [66.9996, 24.8714] },
  { name: "UC-12 Allama Iqbal Colony", ur: "\u06cc\u0648 \u0633\u06cc -12 \u0639\u0644\u0627\u0645\u06c1 \u0627\u0642\u0628\u0627\u0644 \u06a9\u0627\u0644\u0648\u0646\u06cc", coords: [66.9950, 24.8720] },
  { name: "UC-13 Jinnahabad-Ghulam Shah Lane", ur: "\u06cc\u0648 \u0633\u06cc -13 \u062c\u0646\u0627\u06c1\u0627\u0628\u062f - \u063a\u0644\u0627\u0645 \u0634\u0627\u06c1 \u0644\u0627\u0626\u0646", coords: [66.9970, 24.8730] },
];

// ============================================
// MAP SETUP
// ============================================
const map = new maplibregl.Map({
  container: "map",
  style: "https://tiles.openfreemap.org/styles/liberty",
  center: CENTER,
  zoom: 14.2,
  pitch: 58,
  bearing: -18,
  antialias: true,
});
window.map = map;
map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right");
map.addControl(new maplibregl.ScaleControl({ unit: "metric" }), "bottom-right");

function updateMapControlPositions() {
  const navControl = document.querySelector(".maplibregl-ctrl-top-right, .maplibregl-ctrl-top-left");
  const scaleControl = document.querySelector(".maplibregl-ctrl-bottom-right, .maplibregl-ctrl-bottom-left");
  const ur = currentLang === "ur";
  if (navControl) {
    navControl.classList.remove("maplibregl-ctrl-top-right", "maplibregl-ctrl-top-left");
    navControl.classList.add(ur ? "maplibregl-ctrl-top-left" : "maplibregl-ctrl-top-right");
  }
  if (scaleControl) {
    scaleControl.classList.remove("maplibregl-ctrl-bottom-right", "maplibregl-ctrl-bottom-left");
    scaleControl.classList.add(ur ? "maplibregl-ctrl-bottom-left" : "maplibregl-ctrl-bottom-right");
  }
}

// ============================================
// MAP POPUP
// ============================================
function createPopup(issue, index) {
  const isUr = currentLang === "ur";
  const title = isUr ? (issue.titleUrdu || issue.title) : issue.title;
  const summary = isUr ? (issue.summaryUr || issue.summary) : (issue.summaryEn || issue.summary);
  const readBtn = isUr ? "\u0645\u06a9\u0645\u0644 \u0631\u06be\u0648\u0631\u0679 \u067e\u0631\u0648\u0628\u0647\u06cc\u06ba" : "Read Full Report";

  return `<div class="map-popup">
    <h4>${index + 1}. ${title}</h4>
    <p>${summary.substring(0, 150)}${summary.length > 150 ? '...' : ''}</p>
    <button class="popup-btn" onclick="flyAndOpen(${index})">${readBtn}</button>
  </div>`;
}

// ============================================
// MAP LOAD
// ============================================
map.on("load", () => {
  window.__mapReady = true;
  const style = map.getStyle();

  for (const layer of style.layers) {
    if (layer.type === "symbol" && layer.layout && layer.layout["text-field"]) {
      map.setLayoutProperty(layer.id, "text-field", [
        "coalesce", ["get", "name:en"], ["get", "name:latin"], ["get", "name"]
      ]);
    }
  }

  const srcId = Object.keys(style.sources).find(id => style.sources[id].type === "vector");
  const firstSymbol = style.layers.find(l => l.type === "symbol")?.id;
  if (srcId) {
    map.addLayer({
      id: "3d-buildings",
      type: "fill-extrusion",
      source: srcId,
      "source-layer": "building",
      minzoom: 13,
      paint: {
        "fill-extrusion-color": [
          "interpolate", ["linear"],
          ["coalesce", ["get", "render_height"], 8],
          0, "#c9b8a3", 20, "#e0a878", 50, "#ff8a3d"
        ],
        "fill-extrusion-height": [
          "interpolate", ["linear"], ["zoom"],
          13, 0,
          14.5, ["coalesce", ["get", "render_height"], 8]
        ],
        "fill-extrusion-base": ["coalesce", ["get", "render_min_height"], 0],
        "fill-extrusion-opacity": 0.88,
        "fill-extrusion-vertical-gradient": true,
      },
    }, firstSymbol);
  }

  // District boundary
  map.addSource("lyari-boundary", { type: "geojson", data: BOUNDARY });
  map.addLayer({
    id: "lyari-fill", type: "fill", source: "lyari-boundary",
    paint: { "fill-color": "#ef4444", "fill-opacity": 0.06 },
  });
  map.addLayer({
    id: "lyari-line", type: "line", source: "lyari-boundary",
    paint: { "line-color": "#ef4444", "line-width": 2.5, "line-dasharray": [2, 1.5] },
  });

  // Slow cinematic intro rotation
  map.easeTo({ bearing: 12, duration: 12000, easing: t => t });

  // If the intro sequence already finished, reveal the markers now
  if (window.__appStarted) revealMarkers();
});

// ============================================
// BOUNDARY
// ============================================
const BOUNDARY = {
  type: "Feature",
  properties: {},
  geometry: {
    type: "Polygon",
    coordinates: [[
      [66.9760, 24.8770], [66.9800, 24.8860], [66.9900, 24.8930],
      [67.0000, 24.8950], [67.0090, 24.8900], [67.0130, 24.8790],
      [67.0140, 24.8680], [67.0070, 24.8570], [66.9950, 24.8520],
      [66.9840, 24.8560], [66.9770, 24.8650], [66.9760, 24.8770]
    ]]
  }
};

// ============================================
// MODAL
// ============================================
const overlay = document.getElementById("overlay");
const modalTitle = document.getElementById("modal-title");
const modalBadges = document.getElementById("modal-badges");
const modalBody = document.getElementById("modal-body");
document.getElementById("modal-close").addEventListener("click", closeModal);
overlay.addEventListener("click", e => { if (e.target === overlay) closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

function closeModal() { overlay.classList.remove("open"); }

function openIssue(i) {
  const issue = ISSUES[i];
  const cat = CATEGORY[issue.cat] || { label: "Community", color: "var(--env)" };
  const catUr = CATEGORY_UR[issue.cat] || { label: "\u0639\u0648\u0627\u0645\u06cc", color: "var(--env)" };
  const sev = SEVERITY[issue.sev] || { label: "Reported", color: "var(--high)" };
  const sevUr = SEVERITY_UR[issue.sev] || { label: "\u0628\u06cc\u0627\u0646 \u0631\u067e\u0648\u0631\u0679", color: "var(--high)" };
  const isUr = currentLang === "ur";
  const title = isUr ? (issue.titleUrdu || issue.title) : issue.title;
  const summary = isUr ? (issue.summaryUr || issue.summary) : (issue.summaryEn || issue.summary);
  const facts = isUr ? (issue.factsUr || issue.facts) : issue.facts;
  const solutions = isUr ? (issue.solutionsUr || issue.solutions) : issue.solutions;
  const acc = issue.accountability;
  const isSubmitted = issue.isSubmitted;
  const communityLabel = isUr ? "\u0639\u0648\u0627\u0645\u06cc \u0631\u067e\u0648\u0631\u0679" : "Community Report";

  modalTitle.innerHTML = `<span style="font-size:16px;font-weight:700;letter-spacing:.3px">${title}</span>`;
  modalBadges.innerHTML = `
    ${isSubmitted ? `<span style="background:var(--env);color:var(--bg);font-size:11px">${communityLabel}</span>` : `<span style="background:${sev.color};color:#10141a;font-size:11px">${isUr ? sevUr.label : sev.label}</span>`}
    <span style="background:${cat.color};color:#10141a;font-size:11px">${isUr ? catUr.label : cat.label}</span>
    <span style="background:var(--panel-3);color:var(--text-secondary);font-size:11px">${issue.loc}</span>
    ${isSubmitted && issue.submittedBy ? `<span style="background:var(--panel-3);color:var(--text-secondary);font-size:11px">By: ${issue.submittedBy}</span>` : ""}
  `;

  const factsLabel = isUr ? "\u062d\u0642\u0627\u0626\u0642" : "FACTS";
  const solutionsLabel = isUr ? "\u0645\u0637\u0627\u0644\u0628\u0627\u062a / \u062d\u0644" : "DEMANDS / SOLUTIONS";
  const sourcesLabel = isUr ? "\u0630\u0631\u0627\u0626\u0639" : "SOURCES";
  const levelLabel = isUr ? "\u0633\u0637\u062d" : "Level";
  const whoLabel = isUr ? "\u06a9\u0648\u0646 \u0630\u0645\u06c1 \u062f\u0627\u0631" : "Who";
  const responsibilityLabel = isUr ? "\u0630\u0645\u06c1 \u062f\u0627\u0631\u06cc" : "Responsibility";
  const bigIdeaLabel = isUr ? "\u0628\u0691\u0627 \u062d\u0644 \u2014 \u0627\u0646\u0642\u0644\u0627\u0628\u06cc \u0642\u062f\u0645" : "THE BIG FIX";
  const roadmapLabel = isUr ? "\u0628\u0646\u06cc\u0627\u062f\u06cc \u0648\u062c\u06c1 \u06a9\u0627 \u0627\u0646\u0642\u0644\u0627\u0628\u06cc \u0631\u0648\u0688 \u0645\u06cc\u067e \u2014 \u0642\u062f\u0645 \u0628\u06c1 \u0642\u062f\u0645" : "ROOT-CAUSE REVOLUTION \u2014 STEP BY STEP";
  const examplesLabel = isUr ? "\u062f\u0646\u06cc\u0627 \u0645\u06cc\u06ba \u0622\u0632\u0645\u0648\u062f\u06c1 \u0645\u062b\u0627\u0644\u06cc\u06ba" : "PROVEN ELSEWHERE";
  const resourcesLabel = isUr ? "\u0622\u067e \u06a8\u06cc\u0627 \u06a9\u0631\u0646\u0627 \u06c7\u0633\u06cc" : "WHAT YOU CAN DO";

  const numEl = document.getElementById("modal-num");
  if (numEl) numEl.textContent = (i + 1).toString().padStart(2, "0");

  let accountabilityHtml = "";
  if (acc && acc.chain && acc.chain.length) {
    const levelColors = { "Local": "#4ade80", "Municipal": "#38bdf8", "Provincial": "#a78bfa", "Federal": "#f97316", "Utility": "#facc15" };
    accountabilityHtml = `
      <section class="accountability">
        <h3>${isUr ? (acc.titleUrdu || "\u0630\u0645\u06c1 \u062f\u0627\u0631 \u06a9\u0648\u0646\u061f") : "WHO IS RESPONSIBLE"}</h3>
        <div class="accountability-chain">
          ${acc.chain.map((c, idx) => {
            const col = levelColors[c.level] || "#8895a7";
            const isLast = idx === acc.chain.length - 1;
            let contactHtml = "";
            if (c.contact) {
              const ct = c.contact;
              contactHtml = `<div class="chain-contact">`;
              if (ct.phone) contactHtml += `<span>\u260e ${ct.phone}</span>`;
              if (ct.email) contactHtml += `<span>\u2709 ${ct.email}</span>`;
              if (ct.office) contactHtml += `<span>\u2302 ${ct.office}</span>`;
              if (ct.fb) contactHtml += `<a href="${ct.fb}" target="_blank" rel="noopener">FB</a>`;
              if (ct.web) contactHtml += `<a href="${ct.web}" target="_blank" rel="noopener">Web</a>`;
              contactHtml += `</div>`;
            }
            return `
              <div class="chain-node">
                <div class="chain-level" style="background:${col};color:#000">${isUr ? (c.levelUr || c.level) : c.level}</div>
                <div class="chain-card">
                  <div class="chain-name">${c.name}</div>
                  <div class="chain-role">${isUr ? (c.roleUr || c.role) : c.role}</div>
                  ${c.party ? `<div class="chain-party">${isUr ? (c.partyUr || c.party) : c.party}</div>` : ""}
                  <div class="chain-desc">${isUr ? (c.responsibilityUr || c.responsibility) : c.responsibility}</div>
                  ${contactHtml}
                </div>
                ${!isLast ? '<div class="chain-arrow">\u2193</div>' : ""}
              </div>`;
          }).join("")}
        </div>
        <div class="accountability-demand">
          <b>${isUr ? "\u0645\u0637\u0627\u0644\u0628\u06c1:" : "DEMAND:"}</b>
          ${isUr ? (acc.demandUr || acc.demandEn) : acc.demandEn}
        </div>
      </section>
    `;
  }

  let bigIdeaHtml = "";
  if (issue.bigIdea || issue.bigIdeaUr) {
    const txt = isUr ? (issue.bigIdeaUr || issue.bigIdea) : (issue.bigIdea || issue.bigIdeaUr);
    bigIdeaHtml = `
      <section class="big-idea">
        <h3>${bigIdeaLabel}</h3>
        <p>${txt}</p>
      </section>
    `;
  }

  const roadmap = isUr ? (issue.roadmapUr || issue.roadmap) : issue.roadmap;
  let roadmapHtml = "";
  if (roadmap && roadmap.length) {
    roadmapHtml = `
      <section class="roadmap">
        <h3>${roadmapLabel}</h3>
        <ol class="roadmap-steps">
          ${roadmap.map(step => `<li><span class="rm-dot"></span><span class="rm-text">${step}</span></li>`).join("")}
        </ol>
      </section>
    `;
  }

  const examples = isUr ? (issue.examplesUr || issue.examples) : issue.examples;
  let examplesHtml = "";
  if (examples && examples.length) {
    examplesHtml = `
      <section class="examples">
        <h3>${examplesLabel}</h3>
        <ul>${examples.map(e => `<li>${e}</li>`).join("")}</ul>
      </section>
    `;
  }

  let resourcesHtml = "";
  if (issue.resources && issue.resources.length) {
    resourcesHtml = `
      <section class="resources">
        <h3>${resourcesLabel}</h3>
        <ul class="sources">${issue.resources.map(s => `<li><a href="${s.u}" target="_blank" rel="noopener noreferrer">${s.t}</a></li>`).join("")}</ul>
      </section>
    `;
  }

  let imagesHtml = "";
  if (issue.images && issue.images.length) {
    imagesHtml = `
      <section class="issue-images-section">
        <h3 style="color:var(--muted);font-size:13px">${isUr ? "\u062a\u0635\u0627\u0648\u06cc\u0631" : "PHOTOS"}</h3>
        <div class="issue-images">${issue.images.map(img => `<img src="${img}" alt="Issue photo" loading="lazy" />`).join("")}</div>
      </section>
    `;
  }

  let peopleHtml = "";
  if (issue.people && issue.people.length) {
    const responsibleLabel = isUr ? "\u0630\u0645\u06c1 \u062f\u0627\u0631 \u0627\u0634\u062e\u0627\u0635" : "WHO IS RESPONSIBLE";
    peopleHtml = `
      <section class="people-section">
        <h3 style="color:var(--accent);font-size:13px">${responsibleLabel}</h3>
        <div class="people-grid">${issue.people.map(p => {
          let contactHtml = "";
          if (p.contact) {
            const c = p.contact;
            contactHtml = `<div class="person-contact">`;
            if (c.phone) contactHtml += `<span>\u260e ${c.phone}</span>`;
            if (c.email) contactHtml += `<span>\u2709 ${c.email}</span>`;
            if (c.office) contactHtml += `<span>\u2302 ${c.office}</span>`;
            if (c.fb) contactHtml += `<a href="${c.fb}" target="_blank" rel="noopener">Facebook</a>`;
            if (c.web) contactHtml += `<a href="${c.web}" target="_blank" rel="noopener">Website</a>`;
            contactHtml += `</div>`;
          } else {
            contactHtml = `<div class="person-contact no-contact">Contact info not found. <a href="#" onclick="openEditModal('person','${p.name.replace(/'/g,"\\'")}');return false;">Submit it</a></div>`;
          }
          return `
          <div class="person-card">
            <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=a78bfa&color=fff&size=128'" />
            <div class="person-name">${p.name}</div>
            <div class="person-role">${p.role}</div>
            <div class="person-party">${p.party}</div>
            ${contactHtml}
          </div>`;
        }).join("")}</div>
      </section>
    `;
  }

  modalBody.innerHTML = `
    ${imagesHtml}
    <section><p style="font-size:14px;color:var(--text-secondary);line-height:1.7">${summary}</p></section>
    ${peopleHtml}
    ${accountabilityHtml}
    <section class="facts">
      <h3 style="font-size:13px">${factsLabel}</h3>
      <ul>${facts.map(f => `<li 
style="font-size:13px;color:var(--text-secondary);line-height:1.6;margin-bottom:5px">${f}</li>`).join("")}</ul>
    </section>
    ${roadmapHtml}
    ${examplesHtml}
    ${bigIdeaHtml}
    <section class="sol">
      <h3 style="color:var(--env);font-size:13px">${solutionsLabel}</h3>
      <ul>${solutions.map(f => `<li 
style="font-size:13px;color:var(--text-secondary);line-height:1.6;margin-bottom:5px">${f}</li>`).join("")}</ul>
    </section>
    ${resourcesHtml}
    <section>
      <h3 style="color:var(--muted);font-size:13px">${sourcesLabel}</h3>
      <ul class="sources">${issue.sources.map(s => `<li><a href="${s.u}" target="_blank" rel="noopener noreferrer">${s.t}</a></li>`).join("")}</ul>
    </section>
  `;

  // The modal lives outside #app, so drive its RTL/font directly.
  const modalEl = document.getElementById("modal");
  modalEl.dir = isUr ? "rtl" : "ltr";
  modalEl.classList.toggle("rtl", isUr);
  modalEl.style.fontFamily = isUr ? "'Noto Naskh Arabic', 'Segoe UI', Tahoma, Arial, sans-serif" : "";

  overlay.classList.add("open");
  modalEl.scrollTop = 0;

  const sections = overlay.querySelectorAll("#modal-body section");
  if (typeof gsap !== "undefined") {
    gsap.fromTo(sections,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.45, stagger: 0.07, ease: "power3.out", delay: 0.15,
        onComplete: () => sections.forEach(s => s.classList.add("revealed")) });
  } else {
    sections.forEach((s, k) => setTimeout(() => s.classList.add("revealed"), 120 + k * 70));
  }
}

// ============================================
// MARKERS + CARDS
// ============================================
const cardsEl = document.getElementById("cards");
const markers = [];

ISSUES.forEach((issue, i) => {
  const cat = CATEGORY[issue.cat];
  const sev = SEVERITY[issue.sev];

  const el = document.createElement("div");
  el.className = "marker" + (issue.sev === "critical" ? " sev-critical" : "");
  el.style.background = cat.color;
  el.style.borderColor = sev.color;
  el.textContent = i + 1;
  el.style.animationDelay = `${i * 0.08}s`;
  el.addEventListener("click", () => flyAndOpen(i));

  // Add popup on hover
  const popup = new maplibregl.Popup({ offset: 15, closeButton: false, className: "map-popup-container" })
    .setHTML(createPopup(issue, i));

  el.addEventListener("mouseenter", () => {
    popup.setLngLat(issue.coords).addTo(map);
  });
  el.addEventListener("mouseleave", () => {
    popup.remove();
  });

  const marker = new maplibregl.Marker({ element: el })
    .setLngLat(issue.coords)
    .addTo(map);
  markers.push(marker);
});

function rebuildCards() {
  cardsEl.innerHTML = "";
  const isUr = currentLang === "ur";
  ISSUES.forEach((issue, i) => {
    const cat = CATEGORY[issue.cat] || { label: "Community", color: "var(--env)" };
    const sev = SEVERITY[issue.sev] || { label: "Reported", color: "var(--high)" };
    const title = isUr ? (issue.titleUrdu || issue.title) : issue.title;
    const readLabel = isUr ? "\u0645\u06a9\u0645\u0644 \u0631\u06be\u0648\u0631\u0679 \u0622\u0628 \u0643\u0631\u06cc\u06ba" : "Read full report";
    const urduNums = ["\u0660","\u0661","\u0662","\u0663","\u0664","\u0665","\u0666","\u0667","\u0668","\u0669"];
    const num = isUr ? urduNums[i + 1] || (i + 1).toString() : (i + 1).toString();
    const isSubmitted = issue.isSubmitted;
    const communityLabel = isUr ? "\u0639\u0648\u0627\u0645\u06cc" : "Community";

    const card = document.createElement("div");
    card.className = "card" + (isSubmitted ? " submitted-card" : "");
    card.style.borderLeftColor = isSubmitted ? "var(--env)" : cat.color;
    card.innerHTML = `
      <div class="card-header">
        <span class="card-num" style="color:${isSubmitted ? "var(--env)" : cat.color};border-color:${isSubmitted ? "var(--env)" : cat.color}44;background:${isSubmitted ? "var(--env)" : cat.color}18">${isSubmitted ? "C" : num}</span>
        <span class="card-title">${title}</span>
      </div>
      <div class="card-meta">
        ${isSubmitted ? `<span class="card-sev community-badge">${communityLabel}</span>` : `<span class="card-sev" style="background:${sev.color}">${isUr ? SEVERITY_UR[issue.sev].label : sev.label}</span>`}
        <span class="card-loc">${issue.loc}</span>
      </div>
      <div class="card-action">${readLabel} <span aria-hidden="true">â†’</span></div>
    `;
    card.addEventListener("click", () => {
      document.querySelectorAll(".card").forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      flyAndOpen(i);
    });
    // If the app is already visible (e.g. language toggle), reveal instantly with a light stagger
    if (window.__appStarted) {
      setTimeout(() => card.classList.add("revealed"), i * 45);
    }
    cardsEl.appendChild(card);
  });

  // Update markers with Urdu numerals
  markers.forEach((marker, i) => {
    const el = marker.getElement();
    const urduNums = ["\u0660","\u0661","\u0662","\u0663","\u0664","\u0665","\u0666","\u0667","\u0668","\u0669"];
    const issue = ISSUES[i];
    if (issue && issue.isSubmitted) {
      el.textContent = "C";
    } else {
      el.textContent = isUr ? (urduNums[i + 1] || (i + 1).toString()) : (i + 1).toString();
    }
  });
}

rebuildCards();

function flyAndOpen(i) {
  const issue = ISSUES[i];
  map.flyTo({ center: issue.coords, zoom: 15.8, pitch: 60, bearing: -10, duration: 1600 });
  map.once("moveend", () => openIssue(i));
}

// ============================================
// INTRO ORCHESTRATION  (preloader -> welcome -> app)
// ============================================
const G = typeof gsap !== "undefined" ? gsap : null;

function revealMarkers() {
  markers.forEach((m, i) => {
    const el = m.getElement();
    setTimeout(() => el.classList.add("revealed"), 120 + i * 90);
  });
}

// Reveal the app UI. Runs its heavy orchestration only once.
function startApp() {
  const app = document.getElementById("app");
  const sidebar = document.getElementById("sidebar");
  app.classList.add("loaded");
  sidebar.classList.add("loaded");

  if (window.__appStarted) return;
  window.__appStarted = true;

  // Titlebar rises after the sidebar settles
  setTimeout(() => document.getElementById("titlebar").classList.add("revealed"), 650);

  // Staggered card reveal
  const cards = [...cardsEl.children];
  cards.forEach((c, i) => setTimeout(() => c.classList.add("revealed"), 400 + i * 70));

  // Markers pop in once the map is painted
  if (window.__mapReady) revealMarkers();
}

// ---- Welcome (About / How-to) modal ----
const welcomeOverlay = document.getElementById("welcome-overlay");

function openWelcome() {
  welcomeOverlay.classList.add("active");
  const lines = welcomeOverlay.querySelectorAll(".welcome-title-line");
  const body = welcomeOverlay.querySelectorAll(".welcome-badge, .welcome-divider, .welcome-info, .welcome-stats, .welcome-cta");
  const archArt = welcomeOverlay.querySelector(".arch-art");
  if (G) {
    G.set(lines, { yPercent: 110, opacity: 0 });
    G.set(body, { y: 20, opacity: 0 });
    G.to(lines, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: "power4.out", delay: 0.15 });
    G.to(body, { y: 0, opacity: 1, duration: 0.7, stagger: 0.09, ease: "power3.out", delay: 0.4 });
    if (archArt) {
      G.fromTo(archArt, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 1.1, ease: "power2.out", delay: 0.1, transformOrigin: "50% 20%" });
    }
  } else {
    [...lines, ...body].forEach(el => { el.style.opacity = 1; el.style.transform = "none"; });
  }
}

function closeWelcome() {
  if (welcomeOverlay.dataset.closing) return;
  welcomeOverlay.dataset.closing = "1";
  const done = () => {
    welcomeOverlay.classList.remove("active");
    if (G) G.set(".welcome-modal", { clearProps: "all" });
    delete welcomeOverlay.dataset.closing;
  };
  if (G) {
    G.to(".welcome-modal", { scale: 0.94, y: 24, opacity: 0, duration: 0.45, ease: "power3.in", onComplete: done });
  } else {
    done();
  }
  startApp();
}

document.getElementById("welcome-close").addEventListener("click", closeWelcome);
document.getElementById("welcome-cta").addEventListener("click", closeWelcome);
document.getElementById("info-btn").addEventListener("click", openWelcome);
welcomeOverlay.addEventListener("click", e => { if (e.target === welcomeOverlay) closeWelcome(); });

// ---- Preloader ----
(function runPreloader() {
  const pre = document.getElementById("preloader");
  const bar = document.getElementById("preloader-bar");
  const pct = document.getElementById("preloader-percent");
  if (!pre) { openWelcome(); return; }

  let progress = 0;
  const tick = setInterval(() => {
    // Fast ease toward 100 â€” assets are already loading; this is just a brief flourish
    progress += Math.max(3, (100 - progress) * 0.30);
    if (progress >= 100) { progress = 100; clearInterval(tick); finish(); }
    if (bar) bar.style.width = progress + "%";
    if (pct) pct.textContent = Math.round(progress) + "%";
  }, 40);

  function finish() {
    setTimeout(() => {
      if (G) {
        G.to(pre, { opacity: 0, duration: 0.45, ease: "power2.inOut",
          onComplete: () => { pre.style.display = "none"; openWelcome(); } });
      } else {
        pre.style.display = "none";
        openWelcome();
      }
    }, 120);
  }
})();

// ---- Custom cursor (lightweight: no rAF loop, CSS eases the follower) ----
(function customCursor() {
  if (window.matchMedia("(max-width: 768px)").matches || !window.matchMedia("(pointer: fine)").matches) return;
  const dot = document.getElementById("cursor");
  const ring = document.getElementById("cursor-follower");
  if (!dot || !ring) return;

  window.addEventListener("mousemove", e => {
    const x = e.clientX + "px", y = e.clientY + "px";
    dot.style.left = x; dot.style.top = y;
    ring.style.left = x; ring.style.top = y;
  }, { passive: true });

  const hoverSel = "a, button, .card, .marker, .filter-chip, .info-btn, .lang-btn, .theme-btn, .stat-card, .popup-btn, .welcome-close";
  document.addEventListener("mouseover", e => {
    if (e.target.closest(hoverSel)) ring.classList.add("hover");
  });
  document.addEventListener("mouseout", e => {
    if (e.target.closest(hoverSel)) ring.classList.remove("hover");
  });
})();

// ---- Filter chips ----
(function filters() {
  const chips = document.querySelectorAll(".filter-chip");
  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      chips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      const f = chip.dataset.filter;
      ISSUES.forEach((issue, i) => {
        const catGroup = (issue.cat === "displace") ? "social" : issue.cat;
        const show = f === "all" || catGroup === f || issue.cat === f;
        const card = cardsEl.children[i];
        if (card) card.style.display = show ? "" : "none";
        const mEl = markers[i] && markers[i].getElement();
        if (mEl) mEl.style.display = show ? "" : "none";
      });
    });
  });
})();

// ============================================
// THEME TOGGLE (Light/Dark Mode)
// ============================================
let currentTheme = localStorage.getItem("lyari-theme") || "light";

function applyTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
  localStorage.setItem("lyari-theme", theme);
  currentTheme = theme;
}

function toggleTheme() {
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(newTheme);
}

// Apply saved theme on load
applyTheme(currentTheme);

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
document.addEventListener("keydown", e => {
  // Ctrl+L = toggle language
  if (e.ctrlKey && e.key === "l") {
    e.preventDefault();
    toggleLang();
  }
  // Ctrl+D = toggle dark/light mode
  if (e.ctrlKey && e.key === "d") {
    e.preventDefault();
    toggleTheme();
  }
});

// ============================================
// COMMUNITY EDIT / APPROVAL SYSTEM
// ============================================
const EDITS_KEY = "lyari-community-edits";

function getEdits() {
  try { return JSON.parse(localStorage.getItem(EDITS_KEY)) || []; } catch { return []; }
}

function saveEdit(edit) {
  const edits = getEdits();
  edits.push({ ...edit, status: "pending", submittedAt: new Date().toISOString() });
  localStorage.setItem(EDITS_KEY, JSON.stringify(edits));
}

function openEditModal(type, target) {
  document.getElementById("edit-type").value = type;
  document.getElementById("edit-target").value = target;
  document.getElementById("edit-form").style.display = "block";
  document.getElementById("edit-success").style.display = "none";
  document.getElementById("edit-form").reset();
  document.getElementById("edit-overlay").classList.add("open");
}

function closeEditModal() {
  document.getElementById("edit-overlay").classList.remove("open");
}

document.getElementById("edit-close").addEventListener("click", closeEditModal);
document.getElementById("edit-overlay").addEventListener("click", e => {
  if (e.target.id === "edit-overlay") closeEditModal();
});

function handleEditSubmission(e) {
  e.preventDefault();
  const type = document.getElementById("edit-type").value;
  const target = document.getElementById("edit-target").value;
  const details = document.getElementById("edit-details").value.trim();
  const name = document.getElementById("edit-name").value.trim() || "Anonymous";
  
  saveEdit({ type, target, details, submittedBy: name });
  
  document.getElementById("edit-form").style.display = "none";
  document.getElementById("edit-success").style.display = "block";
}

// ============================================
// SUBMIT ISSUE FEATURE
// ============================================
const SUBMITTED_KEY = "lyari-submitted-issues";

function getSubmittedIssues() {
  // Try IndexedDB first, fallback to localStorage
  if (typeof LyariDB !== "undefined") {
    return LyariDB.getSubmittedIssues().catch(() => {
      try { return JSON.parse(localStorage.getItem(SUBMITTED_KEY)) || []; }
      catch { return []; }
    });
  }
  try { return JSON.parse(localStorage.getItem(SUBMITTED_KEY)) || []; }
  catch { return []; }
}

function getApprovedItems() {
  const APPROVED_KEY = "lyari-approved";
  if (typeof LyariDB !== "undefined") {
    return LyariDB.getApproved().catch(() => {
      try { return JSON.parse(localStorage.getItem(APPROVED_KEY)) || []; }
      catch { return []; }
    });
  }
  try { return JSON.parse(localStorage.getItem(APPROVED_KEY)) || []; }
  catch { return []; }
}

function saveSubmittedIssue(issue) {
  // Save to both IndexedDB and localStorage for compatibility
  if (typeof LyariDB !== "undefined") {
    LyariDB.addSubmittedIssue(issue).catch(() => {});
  }
  // Always save to localStorage as fallback
  const issues = JSON.parse(localStorage.getItem(SUBMITTED_KEY) || "[]");
  issues.push(issue);
  localStorage.setItem(SUBMITTED_KEY, JSON.stringify(issues));
}

function openSubmitForm() {
  const overlay = document.getElementById("submit-overlay");
  overlay.classList.add("open");
  document.getElementById("submit-form").style.display = "block";
  document.getElementById("submit-success").style.display = "none";
  document.getElementById("submit-form").reset();
  document.getElementById("photo-preview").innerHTML = "";
}

function closeSubmitForm() {
  document.getElementById("submit-overlay").classList.remove("open");
}

// Photo preview
document.getElementById("form-photos").addEventListener("change", function() {
  const preview = document.getElementById("photo-preview");
  preview.innerHTML = "";
  const files = Array.from(this.files).slice(0, 3);
  files.forEach((file, i) => {
    const reader = new FileReader();
    reader.onload = e => {
      const div = document.createElement("div");
      div.className = "remove-photo";
      div.innerHTML = `<img src="${e.target.result}" alt="Photo ${i + 1}">`;
      div.addEventListener("click", () => {
        div.remove();
      });
      preview.appendChild(div);
    };
    reader.readAsDataURL(file);
  });
});

document.getElementById("submit-close").addEventListener("click", closeSubmitForm);
document.getElementById("submit-overlay").addEventListener("click", e => {
  if (e.target.id === "submit-overlay") closeSubmitForm();
});

function handleSubmission(e) {
  e.preventDefault();
  
  const title = document.getElementById("form-title").value.trim();
  const category = document.getElementById("form-category").value;
  const severity = document.getElementById("form-severity").value;
  const location = document.getElementById("form-location").value.trim();
  const uc = document.getElementById("form-uc").value;
  const description = document.getElementById("form-description").value.trim();
  const factsText = document.getElementById("form-facts").value.trim();
  const submitter = document.getElementById("form-name").value.trim() || "Anonymous";
  
  // Collect photos from preview
  const photos = [];
  document.querySelectorAll("#photo-preview img").forEach(img => {
    photos.push(img.src);
  });
  
  const facts = factsText ? factsText.split("\n").filter(f => f.trim()) : [];
  
  // Random coords within Lyari bounds
  const lat = 24.865 + Math.random() * 0.015;
  const lng = 66.988 + Math.random() * 0.016;
  
  const newIssue = {
    id: "submitted-" + Date.now(),
    title: title.toUpperCase(),
    titleUrdu: title,
    cat: category,
    sev: severity,
    loc: location + " (" + uc + ")",
    coords: [lng, lat],
    summaryEn: description,
    summaryUr: description,
    facts: facts.length ? facts : [description],
    factsUr: facts.length ? facts : [description],
    solutions: ["This is a community-reported issue. Local authorities and responsible agencies must investigate and take immediate action."],
    solutionsUr: ["ÛŒÛ Ø¹ÙˆØ§Ù…ÛŒ Ø·ÙˆØ± Ù¾Ø± Ø¨ÛŒØ§Ù† Ú©Ø±Ø¯Û Ù…Ø³Ø¦Ù„Û ÛÛ’Û” Ù…Ù‚Ø§Ù…ÛŒ Ø­Ú©Ø§Ù… Ø§ÙˆØ± Ø°Ù…Û Ø¯Ø§Ø± Ø§Ø¯Ø§Ø±ÙˆÚº Ú©Ùˆ ÙÙˆØ±ÛŒ Ø·ÙˆØ± Ù¾Ø± ØªÙØªÛŒØ´ Ú©Ø±Ù†ÛŒ Ú†Ø§ÛØ¦Û’ Ø§ÙˆØ± ÙÙˆØ±ÛŒ Ø§Ù‚Ø¯Ø§Ù… Ú©Ø±Ù†Ø§ Ú†Ø§ÛØ¦Û’Û”"],
    resources: [
      { t: "File RTI request to Sindh Information Commission", u: "https://sinfoc.gov.pk/" },
      { t: "Report to Anti-Corruption Sindh", u: "https://acesindh.gos.pk/" },
      { t: "Contact Lyari TMC Chairman - Khalil Hoath (PPP)", u: "#" },
    ],
    sources: [{ t: "Community Report by " + submitter, u: "#" }],
    images: photos,
    people: [
      { name: "Khalil Hoath", role: "TMC Lyari Chairman", party: "PPP", img: "https://ui-avatars.com/api/?name=KH&background=f472b6&color=fff&size=128&bold=true" },
    ],
    isSubmitted: true,
    submittedBy: submitter,
    submittedAt: new Date().toISOString(),
  };
  
  saveSubmittedIssue(newIssue);
  
  // Show success
  document.getElementById("submit-form").style.display = "none";
  document.getElementById("submit-success").style.display = "block";
  
  // Reload cards and add marker
  rebuildCards();
  addSubmittedMarker(newIssue, ISSUES.length - 1);
}

function addSubmittedMarker(issue, index) {
  const isApproved = issue.type === "issue";
  const label = isApproved ? "A" : "C";
  const color = isApproved ? "#38bdf8" : "var(--env)";
  const prefix = isApproved ? "Approved" : "Community";

  const el = document.createElement("div");
  el.className = "marker community-marker";
  el.style.background = color;
  el.style.borderColor = "#fff";
  el.textContent = label;
  el.title = issue.title;
  el.addEventListener("click", () => flyAndOpen(index));
  
  const popup = new maplibregl.Popup({ offset: 15, closeButton: false })
    .setHTML(`<div class="map-popup">
      <h4 style="color:${color}">${prefix}: ${issue.title}</h4>
      <p>${(issue.summaryEn || "").substring(0, 120)}...</p>
      <button class="popup-btn" onclick="flyAndOpen(${index})">Read Report</button>
    </div>`);
  
  el.addEventListener("mouseenter", () => popup.setLngLat(issue.coords).addTo(map));
  el.addEventListener("mouseleave", () => popup.remove());
  
  const marker = new maplibregl.Marker({ element: el })
    .setLngLat(issue.coords)
    .addTo(map);
  markers.push(marker);
}

// Initialize DB and load submitted + approved issues on startup
(async function initAndLoad() {
  // Init IndexedDB
  if (typeof LyariDB !== "undefined") {
    await LyariDB.init().catch(e => console.warn("DB init failed:", e));
  }
  // Load submitted issues
  const submitted = await getSubmittedIssues();
  const baseCount = ISSUES.length;
  submitted.forEach((issue) => {
    ISSUES.push(issue);
  });
  // Load approved community issues from admin panel
  const approved = await getApprovedItems();
  approved.forEach((item) => {
    if (item.type === "issue") {
      // Skip duplicates by title
      if (!ISSUES.some(e => e.title === item.title)) {
        ISSUES.push(item);
      }
    }
  });
  // Rebuild cards to include new issues
  if (typeof rebuildCards === "function") rebuildCards();
  // Add markers only for the newly loaded issues (after the initial 8)
  for (let i = baseCount; i < ISSUES.length; i++) {
    addSubmittedMarker(ISSUES[i], i);
  }
})();
