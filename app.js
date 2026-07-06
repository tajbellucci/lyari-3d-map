// ============================================
// Lyari 3D Crisis Map - App.js
// ============================================

const CENTER = [66.9960, 24.8720];

const CATEGORY = {
  infra:    { label: "Infrastructure", color: "#38bdf8" },
  social:   { label: "Social / Human", color: "#f472b6" },
  env:      { label: "Environment",    color: "#4ade80" },
  displace: { label: "Displacement",   color: "#facc15" },
  project:  { label: "Transformation", color: "#a78bfa" },
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
  social:   { label: "\u0633\u0645\u0627\u062c\u064a / \u0627\u0646\u0633\u0627\u0646\u064a", color: "#f472b6" },
  env:      { label: "\u0645\u0627\u062d\u0648\u0644\u064a\u0627\u062a\u064a", color: "#4ade80" },
  displace: { label: "\u0646\u0648 \u0645\u06a9\u0627\u0646\u064a", color: "#facc15" },
  project:  { label: "\u062a\u063a\u064a\u064a\u0631\u062a\u064a", color: "#a78bfa" },
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
// ISSUES DATA
// ============================================
const ISSUES = [
  {
    titleUrdu: "\u0644\u06cc\u0627\u0631\u06cc \u062a\u063a\u06cc\u06cc\u0631\u062a\u06cc \u067e\u0631\u0648\u062c\u06cc\u06a9\u0679 - \u0631\u0633 25.28 \u0627\u0631\u0628",
    title: "LYARI TRANSFORMATION PROJECT - RS 25.28 BILLION",
    cat: "project", sev: "critical",
    loc: "Lyari Town (all 13 UCs)",
    coords: [66.9960, 24.8720],
    summaryUr: "سندھ حکومت نے 25.28 ارب روپے کا لیاری ٹرانسفارمیشن منصوبہ شروع کیا ہے، جس کا افتتاح 9 اپریل 2026 کو وزیر بلدیات سید ناصر حسین شاہ نے کیا۔ یہ 4 سالہ منصوبہ تمام 13 یونین کاؤنسلز میں سڑکیں، پانی، سیوریج، نکاسی، انڈرگراؤنڈ کیبلنگ اور تزئین و آرائش پر مشتمل ہے۔ تکمیل 2029 تک متوقع ہے۔",
    summaryEn: "The Sindh government has launched the Rs 25.28 billion Lyari Transformation Project, inaugurated on April 9, 2026 by LG Minister Syed Nasir Hussain Shah. A 4-year project covering roads, water supply, sewerage, drainage, underground cabling, and beautification across all 13 Union Councils. Completion expected by 2029.",
    facts: [
      "April 9, 2026: Sindh LG Minister Syed Nasir Hussain Shah formally inaugurated the Lyari Transformation Project in Lyari, with PPP MNAs, party leaders, and residents present.",
      "Total cost: Rs 25.28 billion, to be completed over 4 years (completion expected by 2029). Phase 1 has already commenced.",
      "Phase 1 focuses on basic infrastructure: road construction/rehabilitation, new water supply lines, sewerage and drainage system upgrades, stormwater drain cleaning.",
      "Project also includes underground cabling to improve electricity infrastructure and enhance urban aesthetics, plus parks, green belts, and public space beautification.",
      "Minister Shah stated: 'Lyari is an important and historic area of Karachi which was neglected in the past; the present government is taking serious steps for its complete rehabilitation.'",
      "PC-1 approved. Municipal Commissioner Hamad Khan Loran stated water and sewage pumping stations will be solarized across all 13 UCs.",
      "The project was initially allocated PKR 5 billion in Oct 2025, then expanded to Rs 25.28 billion after PC-1 approval in March 2026.",
    ],
    factsUr: [
      "9 اپریل 2026: سندھ LG وزیر سید ناصر حسین شاہ نے لیاری میں تранسفارمیشن پروجیکٹ کا فормلی افتتاح کیا۔ PPP MNAs، پارٹی لیڈرز اور باشندے موجود تھے۔",
      "کل لاگت: 25.28 ارب روپے۔ 4 سال میں مکمل ہوگا (2029 تک)۔ فیز 1 پہلے سے شروع ہو چکی ہے۔",
      "فیز 1 بنیادی انفراسٹرکچر پر مرکوز ہے: سڑک تعمیر/مرمت، نئی پانی سپلائی لائنوں، نالی اور نکاسی آب کی نظام اپ گریڈ، طوفانی نالیوں کی صفائی۔",
      "پروجیکٹ میں انڈرگراونڈ کیبلنگ بھی شامل ہے جو بجلی کے انفراسٹرکچر کو بہتر بنائے گا اور پارک، گرین بلٹ اور عوامی جگہوں کی خوبصورتی بھی شامل ہے۔",
      "وزیر شاہ نے کہا: 'لیاری کراچی کا اہم اور تاریخی علاقہ ہے جو ماضی میں نظرانداز کیا گیا تھا۔' ",
      "PC-1 منظور ہو چکا۔ ٹاون کمشنر حمد خان لوران نے کہا کہ 13 یونین کاؤنسلز میں پانی اور نالی پمپنگ اسٹیشنز سولرائز کیے جائیں گے۔",
      "اکتوبر 2025 میں 5 ارب allocated تھا۔ مارچ 2026 میں PC-1 منظور ہونے کے بعد 25.28 ارب تک بڑھایا گیا۔",
    ],
    solutions: [
      "MANDATORY REAL-TIME DASHBOARD: Publish a live, geo-tagged spending dashboard within 30 days covering all 13 UCs. No dashboard by day 30 = automatic complaint to Sindh Ombudsman.",
      "CITIZEN AUDIT BOARD: Elect one resident per UC within 60 days with legal subpoena power over all contractor books and procurement records. Board members must have no party affiliation.",
      "CONTRACTOR BLACKLIST: Any contractor missing two consecutive milestones gets blacklisted from all Sindh government projects for 5 years. No exceptions, no extensions.",
      "PHOTO-VERIFIED PAYMENTS: No contractor payment released without geo-tagged, timestamped photo proof of completed work verified by the citizen audit board AND municipal engineer jointly.",
      "COURT-ENFORCEABLE DEADLINE: File the 2029 completion commitment as a sworn affidavit in Sindh High Court. Officials who miss it without audited force majeure face personal liability and asset freeze.",
      "WEEKLY SITE INSPECTIONS: Mandatory public site visits every Saturday in each UC, livestreamed on social media. TMC chairman must attend at least 2 of 4 monthly visits.",
    ],
    solutionsUr: [
      "لازمی ریئل ٹائم ڈیش بورڈ: 30 دن کے اندر 13 یونین کاؤنسلز کا لائیو، مقام نشان خرچہ ڈیش بورڈ شائع کریں۔ 30واں دن تک نہ ہو = سندھ اوڈزمان میں خودکار شکایت۔",
      "عوامی آڈٹ بورڈ: 60 دن کے اندر ہر یو سی سے ایک رہائشی منتخب کریں جسے تمام ٹھیکیداروں کی کتب اور خریداری کے ریکارڈ کی قانونی صلاحیت ہو۔ بورڈ کے ممبران کسی پارٹی سے وابستہ نہ ہوں۔",
      "ٹھیکیدار بلیک لسٹ: کوئی ٹھیکیدار جو دومسلسل سنگ میل چھوڑے اسے 5 سال کے لیے سندھ حکومت کے تمام منصوبوں سے بلیک لسٹ کریں۔ کوئی مستثنی نہیں، کوئی توسیع نہیں۔",
      "تصویر تصدیق شدہ ادائیگی: شہری آڈٹ بورڈ اور میونسپل انجینئر کے مشترکہ تصدیق کے بغیر کسی ٹھیکیدار کی ادائیگی نہ ہو۔ ہر ادائیگی کے ساتھ مقام نشان، وقت نشان تصویری ثبوت لازمی۔",
      "عدالتی ہدف: 2029 کی تکمیل کی تعہد کو سندھ ہائی کورٹ میں حلفی دستاویز کے طور پر دائر کریں۔ جو افسران بغیر جواز چھوڑیں وہ ذاتی طور پر ذمہ دار ہوں اور ان کے اثاثے جمع ہوں۔",
      "ہفتہ وار معائنہ: ہر ہفتہ شنبہ کو ہر یو سی میں عوامی معائنہ لازمی ہو جو سوشل میڈیا پر لائیو ہو۔ ٹی ایم سی چیرمین کو ہر مہینے کے 2 معائنے میں شرکت کرنا لازمی۔",
    ],
    accountability: {
      chain: [
        { level: "Provincial", levelUr: "صوبائی", role: "LG Minister, Sindh", roleUr: "وزیر بلدیات، سندھ", name: "Syed Nasir Hussain Shah", party: "PPP", responsibility: "Approved PC-1 and inaugurated the project; owns the 4-year, 2029 delivery timeline.", responsibilityUr: "PC-1 منظور کیا اور پروجیکٹ کا افتتاح کیا؛ 4 سالہ، 2029 کی حد کا ذمہ دار۔" },
        { level: "Municipal", levelUr: "میونسپل", role: "Municipal Commissioner, Karachi", roleUr: "میونسپل کمشنر، کراچی", name: "Hamad Khan Loran", party: "Civil Service", responsibility: "Oversees solarization of pumping stations and cross-UC execution.", responsibilityUr: "پمپنگ اسٹیشنز کی سولرائزیشن اور 13 یو سیز میں عمل درآمد کی نگرانی۔" },
        { level: "Local", levelUr: "مقامی", role: "TMC Lyari Chairman", roleUr: "چیئرمین ٹی ایم سی لیاری", name: "Khalil Hoath", party: "—", responsibility: "Ward-level execution and public accounting of funds received.", responsibilityUr: "وارڈ سطح پر عمل درآمد اور فنڈز کا عوامی حساب۔" },
      ],
      demandEn: "Publish a live geo-tagged dashboard within 30 days tracking every rupee of the Rs 25.28B against physical progress in all 13 UCs. Elect a citizen audit board with subpoena power within 60 days. File a sworn affidavit in Sindh High Court binding officials to the 2029 deadline with personal liability for failure.",
      demandUr: "30 دن کے اندر 13 یونین کاؤنسلز میں 25.28 ارب روپے کے ہر روپیے کی مقام نشان ٹیکنگ والا لائیو ڈیش بورڈ شائع کریں۔ 60 دن کے اندر صلاحیت وار شہری آڈٹ بورڈ منتخب کریں۔ سندھ ہائی کورٹ میں حلفی دستاویز دائر کریں جو ناکامی پر ذاتی ذمہ داری سے باندھے۔",
    },
    bigIdea: "Turn the Transformation Project into Pakistan's first court-bound, citizen-audited civic infrastructure project: every rupee geo-tagged, every contractor blacklittable, every milestone photo-verified by residents, every official personally liable. If it fails in Lyari, it gets exposed in court. If it succeeds, every neglected district in Karachi demands the same model tomorrow.",
    bigIdeaUr: "ٹرانسفارمیشن پروجیکٹ کو پاکستان کا پہلا عدالتی طور پر باندھا، شہری آڈٹ کردہ شہری منصوبہ بنائیں: ہر روپیہ مقام نشان، ہر ٹھیکیدار بلیک لسٹ ہونے کے قابل، ہر سنگِ میل رہائشیوں کی تصویری تصدیق، ہر افسران ذاتی طور پر ذمہ دار۔ اگر لیاری میں ناکام ہوا تو عدالت میں بے نقاب ہو۔ اگر کامیاب ہوا تو کراچی کا ہر نظرانداز علاقہ کل اسی ماڈل کا مطالبہ کرے۔",
    roadmap: [
      "STEP 1: Demand TMC Lyari publishes the full contractor list and budget breakdown for all 13 UCs. File RTI if they refuse.",
      "STEP 2: Form a 5-person watch committee per UC. Meet monthly. Photograph every site. Post on social media.",
      "STEP 3: Track each contractor. If they miss a deadline, file a complaint with Anti-Corruption Sindh.",
      "STEP 4: Attend every TMC meeting. Ask one question: where is the money? Record the answer.",
      "STEP 5: If nothing changes in 6 months, file a petition in Sindh High Court with photographic evidence.",
    ],
    roadmapUr: [
      "قدم 1: مانگیں کہ TMC لیاری تمام 13 یونین کاؤنسلز کے لیے ٹھیکیداروں کی فہرست اور بجٹ کی تفصیل شائع کرے۔ انکار پر RTI درخواست دائر کریں۔",
      "قدم 2: ہر یو سی میں 5 لوگوں کی واچ کمیٹی بنائیں۔ ماہانہ ملیں۔ ہر سائٹ کی تصویر لیں۔ سوشل میڈیا پر شائع کریں۔",
      "قدم 3: ہر ٹھیکیدار کو ٹریک کریں۔ ڈیڈ لائن چھوڑے تو انسداد بدعنوانی سندھ میں شکایت دائر کریں۔",
      "قدم 4: ہر TMC اجلاس میں شرکت کریں۔ ایک سوال پوچھیں: پیسہ کہاں ہے؟ جواب ریکارڈ کریں۔",
      "قدم 5: 6 ماہ میں کچھ نہ بدلے تو تصاویری ثبوت کے ساتھ سندھ ہائی کورٹ میں درخواست دائر کریں۔",
    ],
    examples: ["Seoul's Cheonggyecheon restoration: every contract published online, every milestone geo-tagged, finished on schedule. Transparency beat budget size. Lyari demands the same.", "India's MGNREGA social audit: villagers publicly audit public-works spending ward-by-ward, with power to halt payments for fraud. Lyari needs this law, not just a policy.", "Brazil's participatory budgeting in Porto Alegre: citizens directly allocate funds and verify execution. Lyari's 13 UCs can run this on WhatsApp if the government won't build the dashboard."],
    examplesUr: ["سیول کے چیونگ گیچیون: ہر معاہدہ آن لائن شائع، ہر سنگِ میل مقام نشان، وقت پر مکمل۔ شفافیت نے بجٹ کو مات دی۔ لیاری بھی یہی چاہتا ہے۔", "بھارت کے MGNREGA سوشل آڈٹ: دیہاتی وارڈ بہ وارڈ عوامی کاموں کا آڈٹ کرتے ہیں، جعلے خرچ پر ادائیگی روکنے کی صلاحیت۔ لیاری کو یہ پالیسی نہیں، قانون چاہیے۔", "برازیل کے پورٹو الیگرے میں شرکتی بجٹ: شہری خود فنڈز مقرر کرتے ہیں اور عمل درآمد کی تصدیق کرتے ہیں۔ لیاری کی 13 یونین کاؤنسلز یہ واٹس ایپ پر چلا سکتی ہیں اگر حکومت ڈیش بورڈ نہیں بناتی۔"],
    resources: [{"t":"Open Contracting Partnership — open procurement toolkit","u":"https://www.open-contracting.org/"},{"t":"Transparency International Pakistan","u":"https://transparency.org.pk/"},{"t":"World Bank — Citizen Engagement in public projects","u":"https://www.worldbank.org/en/about/what-we-do/brief/citizen-engagement"}],
    images: [
      "https://placehold.co/800x500/1a1a2e/38bdf8?text=Rs+25.28+Billion+Lyari+Transformation+Project+Inaugurated+April+2026",
      "https://placehold.co/800x500/1a1a2e/4ade80?text=Roads.+Water.+Sewerage.+Underground+Cabling.+Beautification.+All+13+UCs.",
    ],
    subIssues: [
      { uc: "UC-1 Agra Taj Colony", status: "Phase 1 pending", detail: "No road work started yet. Residents report same broken streets as before announcement." },
      { uc: "UC-5 Baghdadi", status: "Phase 1 pending", detail: "Sewerage lines unchanged. Monsoon flooding expected in July-August with no drainage improvement." },
      { uc: "UC-11 Chakiwara", status: "Phase 1 pending", detail: "Main commercial road still has potholes. Underground cabling not started." },
      { uc: "UC-9 Ragiwara", status: "Phase 1 pending", detail: "Water supply lines untouched. Tanker dependency continues at Rs 8,000-12,000 per tanker." },
    ],
    people: [
      { name: "Syed Nasir Hussain Shah", role: "Sindh LG Minister (Inaugurated Project)", party: "PPP", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Syed_Nasir_Hussain_Shah.jpg/220px-Syed_Nasir_Hussain_Shah.jpg", contact: { phone: "+92-21-99205607", office: "Sindh LG Department, Karachi", fb: "https://facebook.com/SNasirHussainshah", web: "https://nasirhussainshah.com" } },
      { name: "Hamad Khan Loran", role: "Municipal Commissioner Karachi", party: "Civil Service", img: "https://ui-avatars.com/api/?name=HKL&background=38bdf8&color=fff&size=128&bold=true", contact: { phone: "+92-21-99216095", email: "mayor@kmc.gos.pk", office: "KMC Head Office, M.A. Jinnah Road, Karachi" } },
      { name: "Khalil Hoath", role: "TMC Lyari Chairman", party: "PPP", img: "https://ui-avatars.com/api/?name=KH&background=f472b6&color=fff&size=128&bold=true", contact: { phone: "Submit if you have it", office: "TMC Lyari, Old KMC Zonal Office, Chakiwara Road", web: "https://tmclyari.gos.pk" } },
    ],
    sources: [
      { t: "Zameen News - Sindh launches Lyari Transformation Project (Apr 10, 2026)", u: "https://www.zameen.com/news/sindh-launches-lyari-transformation-project.html" },
      { t: "The News - Nasir inaugurates Rs25.28bn Lyari Transformation Project (Apr 10, 2026)", u: "https://www.thenews.com.pk/print/1409196-nasir-inaugurates-rs25-28bn-lyari-transformation-project" },
      { t: "Business Recorder - Lyari Transformation Project (Mar 19, 2026)", u: "https://www.brecorder.com/news/40412302" },
      { t: "The Nation - Nasir Shah inaugurates Lyari Transformation Project (Apr 10, 2026)", u: "https://www.nation.com.pk/10-Apr-2026/nasir-shah-inaugurates-lyari-transformation-project-worth-rs25-28b" },
    ]
  },
  {
    titleUrdu: "\u067e\u0627\u0646\u06cc \u06a9\u0627 \u0628\u062d\u0631\u0627\u0646 - 1 \u0645\u06be\u06cc\u0646\u06d2 \u0633\u06d2 \u067e\u0627\u0646\u06cc \u0646\u06be\u06cc\u06ba",
    title: "WATER CRISIS - NO WATER FOR 1 MONTH (July 2026)",
    cat: "infra", sev: "critical",
    loc: "UC-5 Baghdadi, UC-6 Moosa Lane, UC-7 Shah Baig Line",
    coords: [66.9980, 24.8700],
    summaryUr: "لیاری میں ایک ماہ سے زیادہ عرصے سے نل کا پانی بند ہے۔ 3 جولائی 2026 کو 24 انچ پائپ لائن میں لیک کے بعد KWSC نے چار یونین کاؤنسلز کی سپلائی معطل کر دی۔ رہائشی 8,000 سے 12,000 روپے فی ٹینکر پانی خریدنے یا نالیوں سے پینے پر مجبور ہیں۔",
    summaryEn: "Lyari has been without piped water for over a month. On July 3, 2026, KWSC suspended supply to four union councils after a 24-inch pipeline leak. Residents forced to buy water at Rs 8,000-12,000 per tanker or drink from sewer drains.",
    facts: [
      "July 3, 2026: KWSC suspended water supply to UCs 5, 6, 7, 8 of Lyari after a leak in a 24-inch transmission line. Repairs promised in 36-48 hours but residents report dry taps for over a month.",
      "May 27, 2026: Dawn reported Karachi's water crisis entered its second month. Lyari named among worst-hit areas alongside Orangi, Saddar and Korangi.",
      "Karachi receives only 650 MGD against a demand of 1,250+ MGD. A 47% shortfall. Lyari, at the tail-end, gets water last and least.",
      "Private tankers have doubled rates to Rs 12,000 (up from Rs 6,000 last month). Unaffordable for Lyari's working-class residents.",
      "Residents documented filling water containers from sewer drains. A public health emergency ignored by authorities.",
      "KWSC's own data shows Lyari's pumping stations have been non-functional for extended periods. No emergency restoration was attempted.",
    ],
    factsUr: [
      "3 جولائی 2026: KWSC نے لیاری کے یو سی 5، 6، 7، 8 سے پانی کی فراہمی بند کر دی۔ 24 انچ کی ٹرانسمیشن لائن میں لیک تھی۔",
      "27 مئی 2026: ڈawn نے رپورٹ کیا کہ کراچی کا پانی کا بحران دوسرے مہینے میں داخل ہو گیا۔ لیاری عورنگی،صدر اور کورنگی کے ساتھ سب سے زیادہ متاثرہ۔",
      "کراچی کو 1,250+ ایم جی ڈی کی طلب کے مقابلے صرف 650 ایم جی ڈی ملتا ہے۔ 47% کمی۔ لیاری آخر میں سب سے کم پانی پاتا ہے۔",
      "پرائیویٹ ٹینکروں نے قیمتیں 12,000 روپے تک کر دیں۔ لیاری کے مزدو طبقة کے لیے ناقابل خریداری۔",
      "لوگوں نے نالیوں سے پانی بھرنے کے مناظر دکھائے۔ عوامی صحت کا ایمرجنسی ہے لیکن حکام نے نظرانداز کیا۔",
      "KWSC کے اپنے ڈیٹا سے پتہ چلتا ہے کہ لیاری کے پمپنگ اسٹیشنز طویل عرصے سے غیر فعال ہیں۔",
    ],
    solutions: [
      "IMMEDIATE: KWSC must deploy emergency water bowsers to Lyari's affected UCs within 24 hours.",
      "ACCOUNTABILITY: Sindh Government must explain why KWSC's 24-inch transmission line was allowed to deteriorate. Publish the maintenance log.",
      "STRUCTURAL: Fast-track K-IV Phase 1 to add 260 MGD. Karachi cannot survive on 650 MGD when demand exceeds 1,250 MGD.",
      "OVERSIGHT: Independent water authority with Lyari representation to monitor KWSC performance.",
      "EMERGENCY: Criminal investigation into KWSC officials who failed to maintain critical transmission infrastructure.",
    ],
    solutionsUr: [
      "فوری: KWSC کو 24 گھنٹوں میں لیاری کے متاثرہ یو سیز میں emergencie پانی کی گاڑیاں بھیجنی چاہیں۔",
      "accountability: حکومتِ سندھ کو وضاحت کرنی چاہیے کہ KWSC کی 24 انچ ٹرانسمیشن لائن کو کیوں زوال کی طرف جانے دیا گیا۔",
      "بنیادی: K-IV فیز 1 کو تیز کریں تاکہ 260 ایم جی ڈی اضافہ ہو۔ کراچی 650 ایم جی ڈی پر زندہ نہیں رہ سکتا۔",
      "nigrani: لیاری کی نمائندگی والی آزاد پانی اuthority بنائی جو KWSC کی کارکردگی کی نگرانی کرے۔",
      "emergencie: KWSC کے افسران کے خلاف جرائمی تفتیش جنہوں نے ٹرانسمیشن انفراسٹرکچر برقرار نہیں رکھا۔"
    ],
    accountability: {
      chain: [
        { level: "Provincial", levelUr: "صوبائی", role: "Sindh Chief Minister (oversees KWSC)", roleUr: "وزیر اعلیٰ سندھ (KWSC کا نگران)", name: "Office of the Sindh CM (verify current officeholder)", party: "—", responsibility: "Ultimate authority over KWSC; accountable for the emergency response gap.", responsibilityUr: "KWSC پر حتمی اختیار؛ ہنگامی ردعمل میں تاخیر کا ذمہ دار۔" },
        { level: "Utility", levelUr: "ادارہ", role: "Managing Director, KWSC", roleUr: "منیجنگ ڈائریکٹر، KWSC", name: "Office of the KWSC MD (verify current officeholder)", party: "Civil Service", responsibility: "Operate & maintain the 24-inch transmission line; failed to prevent a month-long outage.", responsibilityUr: "24 انچ ٹرانسمیشن لائن کی دیکھ بھال؛ ایک ماہ کی بندش نہ روک سکے۔" },
        { level: "Federal", levelUr: "وفاقی", role: "Ministry of Water Resources (K-IV funding)", roleUr: "وزارت آبی وسائل (K-IV فنڈنگ)", name: "Federal Government of Pakistan", party: "—", responsibility: "Fund and fast-track K-IV Phase 1 to close Karachi's 600 MGD supply gap.", responsibilityUr: "کراچی کے 600 ایم جی ڈی خلا کو پر کرنے کے لیے K-IV فیز 1 کو فنڈ اور تیز کریں۔" },
      ],
      demandEn: "Publish KWSC's maintenance log for the failed 24-inch line, deploy emergency bowsers within 24 hours, and set a public date for K-IV Phase 1 delivery.",
      demandUr: "ناکام 24 انچ لائن کا دیکھ بھال لاگ عوامی کریں، 24 گھنٹوں میں ہنگامی پانی کی گاڑیاں بھیجیں، اور K-IV فیز 1 کی حتمی تاریخ کا اعلان کریں۔",
    },
    bigIdea: "Stop treating water as charity delivered by tanker. Lyari needs a metered, solar-pumped mini-grid fed directly off K-IV with legal priority status — the same guarantee industrial zones already get — so the tail-end of the network stops being punished for being poor.",
    bigIdeaUr: "پانی کو ٹینکر سے ملنے والی خیرات کے طور پر نہ دیکھیں۔ لیاری کو K-IV سے براہ راست جڑا میٹرڈ، سولر پمپڈ منی گرڈ چاہیے جسے قانونی ترجیحی حیثیت حاصل ہو — وہی ضمانت جو صنعتی زونز کو پہلے سے حاصل ہے۔",
    roadmap: ["STEP 1: File a complaint with KWSC MD office. Get a written repair date. If they don't respond in 7 days, go to Sindh Ombudsman.","STEP 2: Collect 100 signatures per UC and submit a joint demand letter to TMC Lyari chairman. Keep a copy.","STEP 3: Install community water tanks (Rs 50,000 each) funded by local donations. Document who pays and who doesn't.","STEP 4: Record daily water tanker prices. Post on social media. Tag KWSC and Sindh CM.","STEP 5: If no water in 30 days, file a contempt petition in Sindh High Court citing the water supply obligation."],
    roadmapUr: ["قدم 1: KWSC MD دفتر میں شکایت دائر کریں۔ لکھی ہوئی مرمت کی تاریخ لیں۔ 7 دن میں جواب نہ ملے تو سندھ اوڈزمان میں جائیں۔","قدم 2: ہر یو سی سے 100 دستخط جمع کریں اور TMC لیاری چیرمین کو مشترکہ مانگ پत्र جمع کرائیں۔ کاپی رکھیں۔","قدم 3: مقامی دونیشن سے کمیونٹی واٹر ٹینک لگائیں (50,000 روپے فی ٹینک)۔ ریکارڈ کریں کہ کس نے ادائیگی کی۔","قدم 4: روزانہ ٹینکر کی قیمت ریکارڈ کریں۔ سوشل میڈیا پر شائع کریں۔ KWSC اور سندھ CM کو ٹیگ کریں۔","قدم 5: 30 دن میں پانی نہ آئے تو سندھ ہائی کورٹ میں دعویٰ دائر کریں۔"],
    examples: ["Chennai (India) broke tanker-mafia dependence by metering zones and legally guaranteeing a daily minimum supply.","Phnom Penh cut water losses from 72% to near zero and reached 24/7 supply by metering every connection."],
    examplesUr: ["چنئی (بھارت) نے زونز میں میٹرنگ اور یومیہ کم از کم سپلائی کی قانونی ضمانت سے ٹینکر مافیا پر انحصار ختم کیا۔","پنوم پن نے ہر کنکشن میٹر کر کے پانی کا نقصان 72٪ سے تقریباً صفر کیا اور 24 گھنٹے سپلائی حاصل کی۔"],
    resources: [{"t":"WaterAid Pakistan","u":"https://www.wateraid.org/pk/"},{"t":"Karachi Water & Sewerage Corporation","u":"https://www.kwsc.gos.pk/"},{"t":"UN-Water — the human right to water","u":"https://www.unwater.org/water-facts/human-rights-water-and-sanitation"}],
    images: [
      "https://tribune.com.pk/story/2616181/water-supply-suspended-in-parts-of-lyari-after-pipeline-leak",
      "https://www.pakistantoday.com.pk/2026/07/03/water-supply-halted-in-parts-of-lyari-after-pipeline-leak",
    ],
    subIssues: [
      { uc: "UC-9 Ragiwara", status: "NO WATER 30+ DAYS", detail: "24-inch pipeline leak on Jul 3. KWSC promised 36-48 hours. Still dry after a month. Residents buying tanker water at Rs 12,000." },
      { uc: "UC-10 Singo Line", status: "NO WATER 30+ DAYS", detail: "Tail-end of K-III line. Gets water last and least. Children drinking from sewer drains. Public health emergency." },
      { uc: "UC-11 Chakiwara", status: "NO WATER 30+ DAYS", detail: "Commercial area shut down. Tea stalls, hotels, shops closed. Daily wage workers losing income." },
      { uc: "UC-12 Allama Iqbal Colony", status: "NO WATER 30+ DAYS", detail: "Pumping station non-functional for weeks. KWSC data shows zero restoration attempted." },
    ],
    people: [
      { name: "Murad Ali Shah", role: "Sindh Chief Minister", level: "Provincial", party: "PPP", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Murad_Ali_Shah_%28Chief_Minister_Sindh%29.jpg/440px-Murad_Ali_Shah_%28Chief_Minister_Sindh%29.jpg", contact: { phone: "+92-21-99201400", office: "CM House, Karachi", fb: "https://www.facebook.com/MuradAliShahPPP" } },
      { name: "Syed Nasir Hussain Shah", role: "Sindh LG Minister (inaugurated LTP)", level: "Provincial", party: "PPP", img: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Syed_Nasir_Hussain_Shah.jpg", contact: { phone: "+92-21-99205607", email: "minister@sindhlg.gov.pk", office: "Sindh Secretariat, Karachi", fb: "https://www.facebook.com/SNasirHussainshah", web: "https://nasirhussainshah.com" } },
      { name: "Murtaza Wahab", role: "Mayor Karachi (KMC)", level: "Municipal", party: "PPP", img: "https://ui-avatars.com/api/?name=MW&background=a78bfa&color=fff&size=128&bold=true", contact: { phone: "+92-21-99216095", email: "mayor@kmc.gos.pk", office: "KMC Head Office, Karachi" } },
      { name: "Deputy Commissioner South", role: "District Administration South", level: "Municipal", party: "Civil Service", img: "https://ui-avatars.com/api/?name=DC+S&background=38bdf8&color=fff&size=128&bold=true", contact: { phone: "Submit if you have it", office: "DC Office, Karachi South" } },
      { name: "Khalil Hoath", role: "TMC Lyari Chairman", level: "Local", party: "PPP", img: "https://ui-avatars.com/api/?name=KH&background=f472b6&color=fff&size=128&bold=true", contact: { phone: "Submit if you have it", office: "TMC Lyari, Chakiwara Road", web: "https://www.tmclyari.gos.pk" } },
      { name: "Ward Councilors (Lyari)", role: "Elected Local Representatives", level: "Local", party: "PPP", img: "https://ui-avatars.com/api/?name=WC&background=4ade80&color=fff&size=128&bold=true", contact: { phone: "Submit councilor contacts", office: "Respective wards, Lyari" } },
    ],
    sources: [
      { t: "Dawn - Eid with dry taps as Karachi water crisis enters second month (May 27, 2026)", u: "https://www.dawn.com/news/2003354" },
      { t: "Pakistan Today - Water supply halted in parts of Lyari (Jul 3, 2026)", u: "https://www.pakistantoday.com.pk/2026/07/03/water-supply-halted-in-parts-of-lyari-after-pipeline-leak" },
      { t: "The Express Tribune - Water supply suspended in Lyari (Jul 3, 2026)", u: "https://tribune.com.pk/story/2616181/water-supply-suspended-in-parts-of-lyari-after-pipeline-leak" },
    ]
  },
  {
    titleUrdu: "\u0628\u062c\u0644\u06cc \u06a9\u06cc \u0628\u06be\u0627\u0631\u06cc - \u0631\u0648\u0632\u0627\u0646\u06d2 14-16 \u063a\u06be\u0646\u0679\u06d2",
    title: "K-ELECTRIC BLACKOUTS - 14-16 HOURS DAILY (2026)",
    cat: "infra", sev: "critical",
    loc: "Lyari Town (all 13 UCs)",
    coords: [67.0055, 24.8740],
    summaryUr: "لیاری کو روزانہ 14 سے 16 گھنٹے کی غیر اعلانیہ لوڈشیڈنگ کا سامنا ہے۔ کے الیکٹرک اسے بجلی چوری کا نتیجہ کہتا ہے جبکہ رہائشی زائد بلنگ کا الزام لگاتے ہیں۔ قومی اسمبلی کی قائمہ کمیٹی نے کے الیکٹرک کو غیر شیڈول بندش روکنے کا حکم دیا ہے۔",
    summaryEn: "Lyari faces 14-16 hours of unannounced load-shedding daily. K-Electric blames theft. Residents blame overbilling. NA Standing Committee has directed KE to stop unscheduled outages.",
    facts: [
      "June 2025: NA Standing Committee directed K-Electric to cease unscheduled load-shedding in Lyari. KE has not complied.",
      "KE's own schedule lists Lyari feeders with 3 daily spells of 2.5 hours each (7.5 hours minimum). Residents report 14-16 hours.",
      "KE lists Lyari as 'high loss area' to justify longer outages. But residents allege overbilling means they ARE paying.",
      "NA Committee recommended a new electricity provider to break KE's monopoly. No action taken.",
      "April 2026: Ramadan schedule shows Lyari feeders still facing 3 daily spells despite KE's promise to reduce outages.",
    ],
    factsUr: [
      "جون 2025: نیشنل اسمبلی کی کمیٹی نے KE کو حکم دیا کہ لیاری میں غیر منصوبہ بندھ لوڈ شیڈنگ بند کرے۔ KE نے عمل نہیں کیا۔",
      "KE کے اپنے شیڈول میں لیاری فیڈرز پر روزانہ 3 سپیلز 2.5 گھنٹے کی ہیں۔ کم از کم 7.5 گھنٹے۔ لوگ 14-16 گھنٹے بتاتے ہیں۔",
      "KE لیاری کو 'زیادہ نقصان والے علاقے' کے طور پر درج کرتا ہے۔ لیکن لوگ الزام دیتے ہیں کہ وہ بل بھی ادا کر رہے ہیں۔",
      "NA کمیٹی نے نئی بجلی فراہم کنندہ کی سفارش کی۔ کوئی عمل نہیں ہوا۔",
      "اپریل 2026: رمضان کا شیڈول دکھاتا ہے کہ لیاری فیڈرز ابھی بھی 3 سپیلز کا شکار ہیں۔"
    ],
    solutions: [
      "IMMEDIATE: KE must publish a public, verifiable schedule for each Lyari feeder.",
      "ACCOUNTABILITY: Sindh Government must explain why PPP's stronghold has 14-16 hour outages despite 50+ years of PPP control.",
      "STRUCTURAL: Implement individual smart metering in Lyari so honest payers are not collectively punished.",
      "REGULATORY: NEPRA must enforce the NA Committee's directive. Impose penalties for non-compliance.",
      "COMPETITION: Fast-track the NA Committee's recommendation to introduce a second electricity provider.",
    ],
    solutionsUr: [
      "فوری: KE کو ہر لیاری فیڈر کا عوامی، تصدیق پذیر شیڈول جاری کرنا چاہیے۔",
      "accountability: سندھ حکومت کو وضاحت کرنی چاہیے کہ PPP کے 50+ سالوں کے کنٹرول کے باوجود 14-16 گھنٹے کٹوتی کیوں ہے۔",
      "بنیادی: لیاری میں انفرادی اسمارٹ میٹرز لگائیں۔",
      "ضروت: NEPRA کو NA کمیٹی کا حکم نافذ کرنا چاہیے۔",
      "مسابقت: NA کمیٹی کی سفارش پر دوسری بجلی فراہم کنندہ جلد شامل کریں۔"
    ],
    accountability: {
      chain: [
        { level: "Corporate", levelUr: "کارپوریٹ", role: "CEO, K-Electric", roleUr: "سی ای او، کے الیکٹرک", name: "Office of the K-Electric CEO (verify current officeholder)", party: "Private utility", responsibility: "Publish verifiable per-feeder schedules; end unscheduled outages beyond KE's own stated 7.5 hours.", responsibilityUr: "ہر فیڈر کا تصدیق پذیر شیڈول جاری کریں؛ خود اعلان کردہ 7.5 گھنٹے سے زائد کٹوتی ختم کریں۔" },
        { level: "Federal", levelUr: "وفاقی", role: "NEPRA (power regulator)", roleUr: "نیپرا (بجلی ریگولیٹر)", name: "National Electric Power Regulatory Authority", party: "Regulator", responsibility: "Enforce the NA Standing Committee's 2025 directive against KE; has issued no penalties to date.", responsibilityUr: "کے الیکٹرک کے خلاف NA کمیٹی کے 2025 کے حکم کا نفاذ؛ آج تک کوئی جرمانہ نہیں۔" },
        { level: "Federal", levelUr: "وفاقی", role: "NA Standing Committee on Power", roleUr: "قومی اسمبلی کی قائمہ کمیٹی برائے پاور", name: "National Assembly of Pakistan", party: "Parliament", responsibility: "Recommended a second electricity provider for Karachi in 2025; recommendation still unactioned.", responsibilityUr: "2025 میں کراچی کے لیے دوسری بجلی فراہم کنندہ کی سفارش کی؛ ابھی تک عمل درآمد نہیں۔" },
      ],
      demandEn: "NEPRA must publish enforcement action against KE for ignoring the NA Committee's directive, and set a public timeline for introducing a competing electricity provider.",
      demandUr: "نیپرا NA کمیٹی کے حکم کی خلاف ورزی پر کے الیکٹرک کے خلاف کارروائی عوامی کرے، اور مسابقتی بجلی فراہم کنندہ متعارف کرانے کی حتمی تاریخ دے۔",
    },
    bigIdea: "Give Lyari a community-owned solar micro-grid pilot for critical loads (clinics, water pumps, schools) so daily survival stops depending on a monopoly that has ignored a federal directive for over a year.",
    bigIdeaUr: "لیاری کو اہم بوجھ (کلینک، پانی کے پمپ، اسکول) کے لیے کمیونٹی کی ملکیت میں سولر مائیکرو گرڈ پائلٹ دیں تاکہ روزمرہ بقا اس اجارہ دار ادارے پر منحصر نہ رہے جس نے ایک سال سے وفاقی حکم نظرانداز کر رکھا ہے۔",
    roadmap: ["WEEK 1 — NEPRA publishes and enforces a per-feeder schedule for every Lyari feeder; a fine for every unscheduled hour.","MONTH 1 — Independent smart-meter audit to separate real theft from over-billing; honest payers stop being punished.","MONTH 6 — Community solar micro-grid pilot for clinics, water pumps and schools — decouple survival from the monopoly.","YEAR 1 — Break the monopoly: license a second Karachi distributor per the NA Committee recommendation.","ROOT CUT — End loss-based load-shedding: invest in Lyari's network instead of rationing the poorest feeders."],
    roadmapUr: ["پہلا ہفتہ — نیپرا ہر لیاری فیڈر کا شیڈول شائع اور نافذ کرے؛ ہر غیر شیڈول گھنٹے پر جرمانہ۔","پہلا مہینہ — آزاد اسمارٹ میٹر آڈٹ تاکہ اصل چوری اور زائد بلنگ الگ ہو؛ ایماندار صارف سزا سے بچیں۔","چھٹا مہینہ — کلینک، پانی کے پمپ اور اسکولوں کے لیے کمیونٹی سولر مائیکرو گرڈ پائلٹ — بقا کو اجارہ داری سے آزاد کریں۔","پہلا سال — اجارہ داری توڑیں: NA کمیٹی کی سفارش پر کراچی کے لیے دوسرا تقسیم کار لائسنس کریں۔","بنیادی حل — نقصان کی بنیاد پر لوڈشیڈنگ ختم؛ غریب ترین فیڈرز کو راشن دینے کے بجائے نیٹ ورک میں سرمایہ کاری کریں۔"],
    examples: ["Bangladesh's solar-home + micro-grid program powered millions off a failing central grid.","Gujarat (India) split home and farm feeders, ending arbitrary blackouts and cutting theft."],
    examplesUr: ["بنگلہ دیش کے سولر ہوم اور مائیکرو گرڈ پروگرام نے ناکام مرکزی گرڈ سے ہٹ کر لاکھوں کو بجلی دی۔","گجرات (بھارت) نے گھریلو اور زرعی فیڈر الگ کر کے بلاجواز بندش ختم کی اور چوری کم کی۔"],
    resources: [{"t":"NEPRA — file a complaint","u":"https://nepra.org.pk/"},{"t":"K-Electric — load-shed schedule","u":"https://www.ke.com.pk/"},{"t":"IEEFA — Pakistan power sector research","u":"https://ieefa.org/region/pakistan"}],
    images: [
      "https://placehold.co/800x500/1a1a2e/facc15?text=14-16+HOURS+DAILY+LOAD+SHEDDING+IN+LYARI",
      "https://placehold.co/800x500/1a1a2e/ef4444?text=NA+Standing+Committee+Ordered+KE+To+Stop.+They+Didnt+Comply.+Over+1+Year+Now.",
    ],
    subIssues: [
      { uc: "UC-5 Baghdadi", status: "14-16 HRS LOAD-SHEDDING", detail: "No scheduled hours. KE claims theft. Residents pay bills but get 8-10 hours of load-shedding daily." },
      { uc: "UC-6 Moosa Lane", status: "14-16 HRS LOAD-SHEDDING", detail: "Medical shops, clinics affected. Medicines spoiling in heat. No cold storage for food." },
      { uc: "UC-11 Chakiwara", status: "14-16 HRS LOAD-SHEDDING", detail: "Businesses closing early. Income loss for shopkeepers. Mobile charging points overwhelmed." },
      { uc: "UC-8 Bihar Colony", status: "14-16 HRS LOAD-SHEDDING", detail: "Street lights non-functional. Safety concern at night. Women and children most affected." },
    ],
    people: [
      { name: "K-Electric CEO", role: "Power Utility Chief", level: "Utility", party: "Private", img: "https://ui-avatars.com/api/?name=KE&background=facc15&color=fff&size=128&bold=true", contact: { phone: "+92-21-99201201", office: "KE Head Office, Karachi", web: "https://www.ke.com.pk" } },
      { name: "NEPRA Chairman", role: "Power Regulator", level: "Federal", party: "Federal", img: "https://ui-avatars.com/api/?name=NEPRA&background=38bdf8&color=fff&size=128&bold=true", contact: { phone: "+92-51-9204183", office: "NEPRA, Islamabad", web: "https://nepra.org.pk" } },
      { name: "Murtaza Wahab", role: "Mayor Karachi (KMC)", level: "Municipal", party: "PPP", img: "https://ui-avatars.com/api/?name=MW&background=a78bfa&color=fff&size=128&bold=true", contact: { phone: "+92-21-99216095", email: "mayor@kmc.gos.pk", office: "KMC Head Office, Karachi" } },
      { name: "Deputy Commissioner South", role: "District Administration South", level: "Municipal", party: "Civil Service", img: "https://ui-avatars.com/api/?name=DC+S&background=38bdf8&color=fff&size=128&bold=true", contact: { phone: "Submit if you have it", office: "DC Office, Karachi South" } },
      { name: "Khalil Hoath", role: "TMC Lyari Chairman", level: "Local", party: "PPP", img: "https://ui-avatars.com/api/?name=KH&background=f472b6&color=fff&size=128&bold=true", contact: { phone: "Submit if you have it", office: "TMC Lyari, Chakiwara Road", web: "https://www.tmclyari.gos.pk" } },
    ],
    sources: [
      { t: "Business Recorder - NA panel recommends new electricity provider (Jun 2025)", u: "https://www.brecorder.com/news/40368912" },
      { t: "K-Electric - Load-Shed Schedule (April 2026)", u: "https://ke.com.pk/wp-content/uploads/2026/04/LSMnew-PDF.pdf" },
    ]
  },
  {
    titleUrdu: "\u0633\u0691\u06a9\u06cc\u06ba \u062a\u0628\u0627\u06c1 - 11.9 \u0627\u0631\u0628 \u0686\u06be\u06cc\u0646\u06d2 \u06af\u06d2",
    title: "ROAD DESTRUCTION - RS 11.9 BILLION STOLEN",
    cat: "infra", sev: "critical",
    loc: "Lyari & across Karachi",
    coords: [66.9940, 24.8690],
    summaryUr: "SSGC نے KMC اور ٹاؤن کارپوریشنز کو سڑک مرمت کے لیے 11.9 ارب روپے دیے۔ TMC لیاری کو اکیلا 1 ارب ملا۔ لیکن سڑکیں ابھی بھی تباہ ہیں۔",
    summaryEn: "SSGC paid Rs 11.9 billion to KMC and town corporations for road restoration. TMC Lyari alone received Rs 1 billion. Yet roads remain destroyed.",
    facts: [
      "May 13, 2026: ANI/Express Tribune reported Karachi's roads are 'riddled with potholes, broken asphalt and incomplete excavation sites'. Lyari named among worst affected.",
      "SSGC internal documents: TMC Lyari received Rs 1 billion, TMC New Karachi Rs 3.55 billion, TMC Model Colony Rs 2.1 billion, KMC Rs 490 million.",
      "SSGC spokesman confirmed all payments were made after 'written permission / NOCs'. The money was paid. The roads were NOT restored.",
      "Citizens blamed SSGC for 'widespread excavation work that has left even newly built roads destroyed'. SSGC digs, takes payment, leaves destruction.",
    ],
    factsUr: [
      "13 مئی 2026: ANI/اکسپریس ٹربیون نے رپورٹ کیا کہ کراچی کی سڑکیں گڑھوں، ٹوٹی ہوئی اسفلٹ اور نامکمل کھدائی کی جگہوں سے بھری ہیں۔",
      "SSGC کے اندرونی دستاویزات: TMC لیاری کو 1 ارب، TMC نیو کراچی 3.55 ارب، TMC ماڈل کالونی 2.1 ارب، KMC 490 کروڑ ملے۔",
      "SSGC کے ترجمان نے تصدیق کی کہ تمام ادائیگیاں 'لکھی اجازت / NOCs' کے بعد ہوئیں۔ پیسے ادائیے گئے۔ سڑکیں مرمت نہیں ہوئیں۔",
      "شہریوں نے SSGC کو 'وسع کھدائی کے کام' کا الزام دیا جس سے نئی بنی سڑکیں بھی تباہ ہوئیں۔"
    ],
    solutions: [
      "IMMEDIATE: TMC Lyari must publish a public accounting of how the Rs 1 billion from SSGC was spent.",
      "ACCOUNTABILITY: Anti-Corruption Establishment Sindh must investigate TMC Lyari, KMC, and all TMCs that received SSGC funds.",
      "STRUCTURAL: Mandatory escrow accounts for road-cutting charges. Funds released only after certified road restoration.",
      "OVERSIGHT: Real-time public dashboard tracking all road-cutting permits, payments, and restoration status.",
    ],
    solutionsUr: [
      "فوری: TMC لیاری کو SSGC سے ملنے والے 1 ارب کا عوامی حساب دینا چاہیے۔",
      "accountability: اینٹی کرپشن اسٹیبلشمنٹ سندھ کو TMC لیاری اور KMC کی تفتیش کرنی چاہیے۔",
      "بنیادی: سڑک کھدائی کے چارجز کے لیے لازمی ایسکرو اکاؤنٹس بنائیں۔",
      "nigrani: تمام سڑک کھدائی کی اجازتیں، ادائیگیاں اور مرمت کی حالت عوامی ڈیش بورڈ پر۔"
    ],
    accountability: {
      chain: [
        { level: "Corporate", levelUr: "کارپوریٹ", role: "SSGC Management", roleUr: "SSGC انتظامیہ", name: "Sui Southern Gas Company", party: "Utility", responsibility: "Paid Rs 11.9B for road restoration after excavation; roads confirmed not fixed.", responsibilityUr: "کھدائی کے بعد سڑک کی مرمت کے لیے 11.9 ارب روپے ادا کیے؛ سڑکیں مرمت نہیں ہوئیں۔" },
        { level: "Local", levelUr: "مقامی", role: "TMC Lyari Chairman", roleUr: "چیئرمین ٹی ایم سی لیاری", name: "Khalil Hoath", party: "PPP", responsibility: "Received Rs 1 billion of the SSGC payout; has published no public accounting.", responsibilityUr: "SSGC کی ادائیگی میں سے 1 ارب روپے ملے؛ کوئی عوامی حساب شائع نہیں کیا۔" },
        { level: "Provincial", levelUr: "صوبائی", role: "Anti-Corruption Establishment Sindh", roleUr: "انسداد بدعنوانی اسٹیبلشمنٹ سندھ", name: "Government of Sindh", party: "—", responsibility: "Must investigate where Rs 11.9B in restoration funds actually went.", responsibilityUr: "11.9 ارب روپے کی مرمت فنڈز کہاں گئے، اس کی تحقیقات کریں۔" },
      ],
      demandEn: "TMC Lyari must publish an itemized public account of the Rs 1 billion received from SSGC within 30 days, or face a formal Anti-Corruption Establishment inquiry.",
      demandUr: "TMC لیاری 30 دن میں SSGC سے ملنے والے 1 ارب روپے کا تفصیلی عوامی حساب دے، ورنہ باضابطہ انسداد بدعنوانی تحقیقات کا سامنا کرے۔",
    },
    bigIdea: "Make road-cutting permits pay-on-completion: SSGC and every utility escrow the restoration cost before digging, and it only releases once an independent inspector certifies the road — no more pay-first, vanish-later.",
    bigIdeaUr: "سڑک کھدائی کے اجازت نامے مکمل ہونے پر ادائیگی کی بنیاد پر بنائیں: SSGC اور ہر ادارہ کھدائی سے پہلے مرمت کی رقم ایسکرو میں رکھے، جو صرف آزاد انسپکٹر کی تصدیق کے بعد جاری ہو۔",
    roadmap: ["WEEK 1 — TMC Lyari publishes an itemised ledger of the Rs 1B SSGC restoration payment, or an ACE inquiry opens.","MONTH 1 — Freeze all new road-cut NOCs until an escrow-on-completion rule is law.","MONTH 3 — Live public GIS map of every excavation: permit, payer, deadline, restoration status.","YEAR 1 — Criminal referral of officials who certified 'restored' roads that were never fixed.","ROOT CUT — Utilities pre-fund restoration into escrow before digging; money releases only on independent sign-off."],
    roadmapUr: ["پہلا ہفتہ — TMC لیاری 1 ارب روپے SSGC ادائیگی کا تفصیلی حساب شائع کرے، ورنہ اینٹی کرپشن تحقیقات شروع۔","پہلا مہینہ — تمام نئے سڑک کھدائی NOC روک دیں جب تک 'تکمیل پر ادائیگی' ایسکرو قانون نہ بن جائے۔","تیسرا مہینہ — ہر کھدائی کا لائیو عوامی GIS نقشہ: اجازت، ادائیگی کرنے والا، ڈیڈ لائن، مرمت کی حالت۔","پہلا سال — ان افسران کے خلاف مقدمہ جنہوں نے کبھی مرمت نہ ہونے والی سڑکوں کو 'بحال' قرار دیا۔","بنیادی حل — ادارے کھدائی سے پہلے مرمت کی رقم ایسکرو میں رکھیں؛ رقم صرف آزاد تصدیق پر جاری ہو۔"],
    examples: ["New York City bonds contractors financially until a street opening is certified restored.","Estonia's e-procurement makes every public payment traceable in real time, killing ghost-restoration scams."],
    examplesUr: ["نیویارک شہر ٹھیکیداروں کو مالی طور پر پابند رکھتا ہے جب تک سڑک کی بحالی کی تصدیق نہ ہو۔","ایسٹونیا کی ای پروکیورمنٹ ہر عوامی ادائیگی کو لائیو قابلِ ٹریس بناتی ہے، جعلی بحالی کا خاتمہ۔"],
    resources: [{"t":"Anti-Corruption Establishment Sindh","u":"https://acesindh.gos.pk/"},{"t":"Open Contracting Partnership","u":"https://www.open-contracting.org/"},{"t":"OpenStreetMap — map the excavations yourself","u":"https://www.openstreetmap.org/"}],
    images: [
      "https://placehold.co/800x500/1a1a2e/eab308?text=Rs+11.9+BILLION+PAID+TO+CIVIC+BODIES.+ROADS+STILL+DESTROYED.+SSGC+DOCUMENTS+CONFIRM.",
      "https://placehold.co/800x500/1a1a2e/f97316?text=SSGC+PAID+Rs+1B+TO+TMC+LYARI.+ZERO+RESTORATION+VISIBLE.+WHERE+DID+THE+MONEY+GO?",
    ],
    subIssues: [
      { uc: "UC-5 Baghdadi", status: "ROADS DESTROYED", detail: "SSGC excavation left main road with deep potholes. Rs 1 billion received by TMC Lyari, zero restoration visible." },
      { uc: "UC-11 Chakiwara", status: "ROADS DESTROYED", detail: "Commercial bazaar road dug up for gas pipeline. No restoration. Motorcyclists and pedestrians at risk." },
      { uc: "UC-3 Nawabad", status: "ROADS DESTROYED", detail: "Newly built streets broken by SSGC. Contractors paid but work never done." },
      { uc: "UC-7 Shah Baig Line", status: "ROADS DESTROYED", detail: "Sewage water mixed with broken road surfaces. Monsoon will make it worse." },
    ],
    people: [
      { name: "SSGC Management", role: "Gas Utility (Paid Rs 11.9B)", level: "Utility", party: "Utility", img: "https://ui-avatars.com/api/?name=SSGC&background=eab308&color=fff&size=128&bold=true", contact: { phone: "+92-21-99201400", office: "SSGC Head Office, Karachi", web: "https://www.ssgc.com.pk" } },
      { name: "Murtaza Wahab", role: "Mayor Karachi (KMC)", level: "Municipal", party: "PPP", img: "https://ui-avatars.com/api/?name=MW&background=a78bfa&color=fff&size=128&bold=true", contact: { phone: "+92-21-99216095", email: "mayor@kmc.gos.pk", office: "KMC Head Office, Karachi" } },
      { name: "Khalil Hoath", role: "TMC Lyari Chairman (Received Rs 1B)", level: "Local", party: "PPP", img: "https://ui-avatars.com/api/?name=KH&background=f472b6&color=fff&size=128&bold=true", contact: { phone: "Submit if you have it", office: "TMC Lyari, Chakiwara Road", web: "https://www.tmclyari.gos.pk" } },
      { name: "Deputy Commissioner South", role: "District Administration South", level: "Municipal", party: "Civil Service", img: "https://ui-avatars.com/api/?name=DC+S&background=38bdf8&color=fff&size=128&bold=true", contact: { phone: "Submit if you have it", office: "DC Office, Karachi South" } },
      { name: "Anti-Corruption Sindh", role: "Investigation Agency", level: "Provincial", party: "Government", img: "https://ui-avatars.com/api/?name=ACE&background=ef4444&color=fff&size=128&bold=true", contact: { phone: "+92-21-99213495", office: "Anti-Corruption Est., Sindh" } },
    ],
    sources: [
      { t: "Dawn - Karachi roads crumble as civic bodies pocket billions", u: "https://www.dawn.com/news/1923978" },
      { t: "ANI - Karachi sinks into chaos as broken roads expose governance failure (May 13, 2026)", u: "https://www.aninews.in/news/world/asia/pakistan-karachi-sinks-into-chaos-as-broken-roads-expose-governance-failure20260513130752" },
    ]
  },
  {
    titleUrdu: "\u0639\u0645\u0627\u0631\u062a\u06cc\u06ba \u06af\u0631 \u0631\u06c1\u06cc \u06be\u06cc\u06ba\u06cc\u0646 - 27 \u0645\u0631\u062f\u06d2",
    title: "BUILDING COLLAPSES - 27 DEAD, 107 DANGEROUS STRUCTURES",
    cat: "infra", sev: "critical",
    loc: "Baghdadi / Ramaswami Quarters",
    coords: [66.9973, 24.8615],
    summaryUr: "فونٹن مینشن 4 جولائی 2025 کو گر گیا۔ کم از کم 27 لوگ ہلاک ہوئے۔ SBCA نے 107 عمارتوں کو خطرناک قرار دیا۔",
    summaryEn: "Fotan Mansion collapsed on July 4, 2025 killing at least 27. SBCA has declared 107 buildings in Lyari as dangerous.",
    facts: [
      "SBCA declared the building hazardous in 2023, two years before it fell. Fresh evacuation notice issued days before collapse.",
      "Citywide, SBCA has declared 588 buildings 'dangerous' - 107 of them in Lyari alone.",
      "Nine SBCA officials and the building owner were named in criminal FIR. Eight officials arrested.",
    ],
    factsUr: [
      "SBCA نے 2023 میں عمارت کو خطرناک قرار دیا۔ 2 سال بعد گر گئی۔",
      "پورے شہر میں SBCA نے 588 عمارتوں کو 'خطرناک' قرار دیا - ان میں سے 107 صرف لیاری میں۔",
      "SBCA کے 9 افسران اور مالک کے خلاف جرائمی مقدمہ درج ہوا۔ 8 افسران گرفتار ہوئے۔"
    ],
    solutions: [
      "Every hazardous-building notice must be paired with a funded, mandatory relocation offer.",
      "SBCA must be given real enforcement authority to evacuate confirmed hazardous structures.",
      "Independent structural audits of all 107 Lyari 'dangerous' buildings on a public timeline.",
    ],
    solutionsUr: [
      "ہر خطرناک عمارت کے نوٹس کے ساتھ فنڈڈ، لازمی نقل مکانی کا پیشکش ہو۔",
      "SBCA کو اصل نفاذی اختیار دیا جائے۔",
      "لیاری کی 107 خطرناک عمارتوں کا آزاد سٹرکچرل آڈٹ۔"
    ],
    accountability: {
      chain: [
        { level: "Provincial", levelUr: "صوبائی", role: "Director General, SBCA", roleUr: "ڈائریکٹر جنرل، SBCA", name: "Sindh Building Control Authority", party: "—", responsibility: "Declared the building hazardous in 2023 but had no enforcement power to evacuate it before collapse.", responsibilityUr: "2023 میں عمارت کو خطرناک قرار دیا مگر گرنے سے پہلے خالی کرانے کا اختیار نہیں تھا۔" },
        { level: "Individual", levelUr: "انفرادی", role: "9 SBCA officials named in FIR (8 arrested)", roleUr: "SBCA کے 9 افسران FIR میں نامزد (8 گرفتار)", name: "Named in the criminal case (see sources)", party: "Civil Service", responsibility: "Criminal negligence in enforcing the hazard notice.", responsibilityUr: "خطرے کے نوٹس پر عمل درآمد میں مجرمانہ غفلت۔" },
        { level: "Local", levelUr: "مقامی", role: "Building owner", roleUr: "عمارت کا مالک", name: "Named in the criminal case (see sources)", party: "—", responsibility: "Ignored the 2023 hazard notice and failed to carry out structural repair or evacuation.", responsibilityUr: "2023 کے خطرے کے نوٹس کو نظرانداز کیا اور مرمت یا نقل مکانی نہیں کی۔" },
      ],
      demandEn: "Give SBCA real evacuation authority (not just paper notices) and publish a public, dated inspection schedule for all 107 flagged Lyari buildings.",
      demandUr: "SBCA کو خالی کرانے کا اصل اختیار دیں (صرف کاغذی نوٹس نہیں) اور لیاری کی نشان زدہ 107 عمارتوں کے معائنے کا حتمی تاریخ والا شیڈول عوامی کریں۔",
    },
    bigIdea: "Pair every 'dangerous building' notice with a funded relocation voucher on day one — the reason people stay in condemned buildings is that leaving means homelessness. Fix that incentive and enforcement stops being cruel.",
    bigIdeaUr: "ہر 'خطرناک عمارت' کے نوٹس کے ساتھ پہلے دن ہی فنڈڈ نقل مکانی واؤچر دیں — لوگ منہدم ہونے والی عمارتوں میں اس لیے رہتے ہیں کہ نکلنے کا مطلب بے گھری ہے۔",
    roadmap: ["WEEK 1 — Publish a dated inspection schedule for all 107 flagged Lyari buildings.","MONTH 1 — Pair every hazard notice with a funded relocation voucher on day one — no eviction into homelessness.","MONTH 6 — Give SBCA real police-backed evacuation and demolition authority, not just paper notices.","YEAR 1 — Independent structural re-audit of all 107 buildings by non-SBCA engineers on a public register.","ROOT CUT — Rebuild dangerous blocks as owner-in-place cooperative housing so residents don't resist evacuation."],
    roadmapUr: ["پہلا ہفتہ — لیاری کی 107 نشان زدہ عمارتوں کے معائنے کا تاریخ شدہ شیڈول شائع کریں۔","پہلا مہینہ — ہر خطرے کے نوٹس کے ساتھ پہلے دن فنڈڈ نقل مکانی واؤچر — بے گھری میں بے دخلی نہیں۔","چھٹا مہینہ — SBCA کو پولیس کی مدد سے اصل انخلا و انہدام کا اختیار دیں، صرف کاغذی نوٹس نہیں۔","پہلا سال — 107 عمارتوں کا آزاد سٹرکچرل دوبارہ آڈٹ غیر SBCA انجینئرز سے، عوامی رجسٹر پر۔","بنیادی حل — خطرناک بلاک کو مالک بحال رکھتے ہوئے کوآپریٹو ہاؤسنگ میں تعمیر کریں تاکہ لوگ انخلا کی مزاحمت نہ کریں۔"],
    examples: ["Chile's incremental housing (Elemental) rebuilt safely while keeping residents on their own land.","Mumbai's cluster-redevelopment replaces unsafe chawls with a guaranteed rebuilt unit for each resident."],
    examplesUr: ["چلی کی انکریمنٹل ہاؤسنگ (ایلیمینٹل) نے لوگوں کو انہی کی زمین پر رکھتے ہوئے محفوظ تعمیر کی۔","ممبئی کی کلسٹر ری ڈیولپمنٹ غیر محفوظ عمارتوں کی جگہ ہر رہائشی کو نیا یونٹ کی ضمانت دیتی ہے۔"],
    resources: [{"t":"UN-Habitat — safer housing guidance","u":"https://unhabitat.org/"},{"t":"ELEMENTAL — incremental housing case studies","u":"https://www.elementalchile.cl/"},{"t":"Sindh Building Control Authority","u":"https://sbca.gos.pk/"}],
    images: [
      "https://placehold.co/800x500/1a1a2e/ef4444?text=107+BUILDINGS+DECLARED+HAZARDOUS+IN+LYARI.+27+PEOPLE+KILLED+IN+BAGHDADI+COLLAPSE.+SBCA+FAILED.",
      "https://placehold.co/800x500/1a1a2e/f97316?text=9+SBCA+OFFICIALS+NAMED+IN+FIR.+8+ARRESTED.+BUILDING+STILL+STANDING.+FAMILIES+STILL+INSIDE.",
    ],
    subIssues: [
      { uc: "UC-5 Baghdadi", status: "107 BUILDINGS FLAGGED", detail: "SBCA declared hazardous in 2023. No evacuation done. Families still living in condemned structures." },
      { uc: "UC-6 Moosa Lane", status: "BUILDINGS AT RISK", detail: "Narrow streets make emergency access impossible. Fire risk extremely high. No hydrants installed." },
      { uc: "UC-11 Chakiwara", status: "BUILDINGS AT RISK", detail: "Illegal high-rise additions on old foundations. Structural load exceeds design capacity." },
      { uc: "UC-9 Ragiwara", status: "BUILDINGS AT RISK", detail: "2023 hazard notice ignored by owner. 9 SBCA officials named in FIR, 8 arrested. Building still standing." },
    ],
    people: [
      { name: "SBCA Director General", role: "Building Control Authority", level: "Provincial", party: "Sindh Govt", img: "https://ui-avatars.com/api/?name=SBCA&background=ef4444&color=fff&size=128&bold=true", contact: { phone: "+92-21-99244400", office: "SBCA, Karachi", web: "https://sbca.gos.pk" } },
      { name: "Murtaza Wahab", role: "Mayor Karachi (KMC)", level: "Municipal", party: "PPP", img: "https://ui-avatars.com/api/?name=MW&background=a78bfa&color=fff&size=128&bold=true", contact: { phone: "+92-21-99216095", email: "mayor@kmc.gos.pk", office: "KMC Head Office, Karachi" } },
      { name: "Deputy Commissioner South", role: "District Administration South", level: "Municipal", party: "Civil Service", img: "https://ui-avatars.com/api/?name=DC+S&background=38bdf8&color=fff&size=128&bold=true", contact: { phone: "Submit if you have it", office: "DC Office, Karachi South" } },
      { name: "Khalil Hoath", role: "TMC Lyari Chairman", level: "Local", party: "PPP", img: "https://ui-avatars.com/api/?name=KH&background=f472b6&color=fff&size=128&bold=true", contact: { phone: "Submit if you have it", office: "TMC Lyari, Chakiwara Road", web: "https://www.tmclyari.gos.pk" } },
      { name: "9 SBCA Officials (8 arrested)", role: "Named in FIR", level: "Provincial", party: "Civil Service", img: "https://ui-avatars.com/api/?name=SBCA+9&background=f97316&color=fff&size=128&bold=true" },
    ],
    sources: [
      { t: "Dawn - Lyari building collapse, an inevitable tragedy", u: "https://www.dawn.com/news/1922116" },
      { t: "Daily Times - Eight SBCA officials arrested", u: "https://dailytimes.com.pk/1333444/" },
    ]
  },
  {
    titleUrdu: "\u0635\u06be\u062a \u06a9\u06cc \u0633\u06c1\u0648\u0644\u06cc\u0627\u062a \u06a9\u0627 \u0632\u0648\u0627\u0644",
    title: "HEALTHCARE SYSTEM NEAR-COLLAPSE",
    cat: "social", sev: "critical",
    loc: "Lyari General Hospital",
    coords: [66.9939, 24.8713],
    summaryUr: "500 بیڈ کا ہسپتال جو 10 لاکھ لوگوں کی خدمت کرتا ہے۔ 14 سال سے ٹراما سینٹر غیر فعال۔ 400+ پوزیشنز خالی۔",
    summaryEn: "500-bed hospital serving 1 million people. Trauma centre unused for 14 years. 400+ staff positions vacant.",
    facts: [
      "Over 400 positions for doctors, nurses and other staff have been vacant for over a year.",
      "The hospital's trauma centre building was completed in 2019 but 14 years later still never became operational.",
      "Government Zakat fund suspensions have repeatedly pushed the hospital into financial crisis.",
    ],
    factsUr: [
      "ڈاکٹروں، نرس اور دیگر عملے کی 400+ پوزیشنز ایک سال سے خالی ہیں۔",
      "ٹراما سینٹر 2019 میں مکمل ہوا لیکن 14 سال بعد بھی کبھی فعال نہیں ہوا۔",
      "سرکاری زکوٰۃ فنڈ کی وقفے نے بار بار ہسپتال کو مالی بحران میں ڈالا۔"
    ],
    solutions: [
      "Immediate activation of the already-built, already-equipped trauma centre.",
      "Move the hospital onto a guaranteed provincial health-department budget line.",
      "A second public secondary-care facility in Lyari to de-load Lyari General Hospital.",
    ],
    solutionsUr: [
      "پہلے سے بنے ٹراما سینٹر کا فوری فعال ہونا۔",
      "ہسپتال کو مستقل صحت محکمے کے بجٹ لائن پر لے آئیں۔",
      "لیاری میں دوسرا سرکاری سیکنڈری کیئر ہسپتال بنائیں۔"
    ],
    accountability: {
      chain: [
        { level: "Provincial", levelUr: "صوبائی", role: "Sindh Health Minister", roleUr: "وزیر صحت سندھ", name: "Office of the Sindh Health Minister (verify current officeholder)", party: "PPP", responsibility: "Controls the provincial health budget line that funds Lyari General Hospital.", responsibilityUr: "صوبائی صحت بجٹ کا کنٹرول جو لیاری جنرل ہسپتال کو فنڈ کرتا ہے۔" },
        { level: "Local", levelUr: "مقامی", role: "Hospital Medical Superintendent", roleUr: "میڈیکل سپرنٹنڈنٹ، ہسپتال", name: "Office of the Medical Superintendent (verify current officeholder)", party: "—", responsibility: "Operationalize the built-but-idle trauma centre and fill 400+ vacant staff posts.", responsibilityUr: "بنے ہوئے مگر غیر فعال ٹراما سینٹر کو چلائیں اور 400+ خالی آسامیاں پر کریں۔" },
        { level: "Provincial", levelUr: "صوبائی", role: "Sindh Zakat & Ushr Department", roleUr: "سندھ زکوٰۃ و عشر محکمہ", name: "Government of Sindh", party: "—", responsibility: "Stabilize Zakat fund disbursement so the hospital stops swinging into financial crisis.", responsibilityUr: "زکوٰۃ فنڈ کی فراہمی مستحکم کریں تاکہ ہسپتال بار بار مالی بحران میں نہ جائے۔" },
      ],
      demandEn: "Activate the already-built trauma centre within 90 days and move Lyari General Hospital onto a guaranteed, non-Zakat-dependent provincial budget line.",
      demandUr: "90 دنوں میں پہلے سے بنے ٹراما سینٹر کو فعال کریں اور لیاری جنرل ہسپتال کو زکوٰۃ سے آزاد، مستقل صوبائی بجٹ لائن پر منتقل کریں۔",
    },
    bigIdea: "A trauma centre sitting idle for 14 years next to a district with gang-war and traffic injuries is the starkest failure on this map. Open it under a public countdown clock — publish the day it opens, or the day it doesn't, live.",
    bigIdeaUr: "گینگ وار اور ٹریفک حادثات والے ضلع کے پاس 14 سال سے بند پڑا ٹراما سینٹر اس نقشے کی سب سے بڑی ناکامی ہے۔ اسے عوامی کاؤنٹ ڈاؤن کے تحت کھولیں۔",
    roadmap: ["WEEK 1 — Open the already-built, already-equipped trauma centre under a public countdown clock.","MONTH 1 — Emergency recruitment to fill the 400+ vacant posts; publish a live vacancy tracker.","MONTH 6 — Move the hospital onto a ring-fenced provincial budget line, independent of Zakat swings.","YEAR 1 — Add a second secondary-care facility to de-load Lyari General Hospital.","ROOT CUT — Fund by population need, not political attention — a legislated per-capita health allocation for Lyari."],
    roadmapUr: ["پہلا ہفتہ — پہلے سے بنا اور لیس ٹراما سینٹر عوامی کاؤنٹ ڈاؤن کے تحت کھولیں۔","پہلا مہینہ — 400+ خالی آسامیوں کے لیے ہنگامی بھرتی؛ لائیو آسامی ٹریکر شائع کریں۔","چھٹا مہینہ — ہسپتال کو محفوظ صوبائی بجٹ لائن پر منتقل کریں، زکوٰۃ کے اتار چڑھاؤ سے آزاد۔","پہلا سال — لیاری جنرل ہسپتال کا بوجھ کم کرنے کے لیے دوسرا سیکنڈری کیئر مرکز بنائیں۔","بنیادی حل — آبادی کی ضرورت کے مطابق فنڈنگ، نہ کہ سیاسی توجہ — لیاری کے لیے قانونی فی کس صحت مختص۔"],
    examples: ["Thailand's universal coverage fixed rural staffing by bonding medical graduates to underserved districts.","Brazil's Family Health Strategy placed funded clinics in poor districts, cutting hospital overload."],
    examplesUr: ["تھائی لینڈ کی یونیورسل کوریج نے گریجویٹس کو پسماندہ اضلاع سے جوڑ کر عملے کی کمی دور کی۔","برازیل کی فیملی ہیلتھ حکمت عملی نے غریب علاقوں میں فنڈڈ کلینک بنا کر ہسپتالوں کا بوجھ کم کیا۔"],
    resources: [{"t":"WHO — health workforce toolkit","u":"https://www.who.int/health-topics/health-workforce"},{"t":"Sindh Health Department","u":"https://sindhhealth.gov.pk/"},{"t":"Pakistan Medical & Dental Council","u":"https://www.pmdc.pk/"}],
    images: [
      "https://placehold.co/800x500/1a1a2e/4ade80?text=TRAUMA+CENTRE+IDLE+14+YEARS.+Rs+BILLIONS+SPENT.+400+STAFF+POSTS+VACANT.+LYARI+GENERAL+HOSPITAL.",
      "https://placehold.co/800x500/1a1a2e/38bdf8?text=EMERGENCY+CASES+TURNED+AWAY.+NEAREST+HOSPITAL+45+MINUTES+AWAY.+AMBULANCE+RESPONSE+2+HOURS.",
    ],
    subIssues: [
      { uc: "All 13 UCs", status: "TRAUMA CENTRE IDLE 14 YEARS", detail: "Building completed 2019. Never operational. Rs billions spent. 400+ staff posts vacant." },
      { uc: "UC-5 Baghdadi", status: "EMERGENCY CASES TURNED AWAY", detail: "Nearest functional hospital is 45 minutes away. Ambulance response time 2+ hours." },
      { uc: "UC-11 Chakiwara", status: "NO SPECIALIST CARE", detail: "General physician only. No surgeon, no pediatrician. Maternal mortality rising." },
      { uc: "UC-9 Ragiwara", status: "MEDICINE SHORTAGE", detail: "Zakat funding inconsistent. Hospital swings into financial crisis every quarter." },
    ],
    people: [
      { name: "Sindh Health Minister", role: "Provincial Health Budget", level: "Provincial", party: "PPP", img: "https://ui-avatars.com/api/?name=SH+Min&background=4ade80&color=fff&size=128&bold=true", contact: { phone: "+92-21-99215900", office: "Sindh Health Department" } },
      { name: "Medical Superintendent", role: "Lyari General Hospital", level: "Local", party: "Health Dept", img: "https://ui-avatars.com/api/?name=MS+LGH&background=38bdf8&color=fff&size=128&bold=true", contact: { phone: "Submit if you have it", office: "Lyari General Hospital" } },
      { name: "Deputy Commissioner South", role: "District Administration South", level: "Municipal", party: "Civil Service", img: "https://ui-avatars.com/api/?name=DC+S&background=38bdf8&color=fff&size=128&bold=true", contact: { phone: "Submit if you have it", office: "DC Office, Karachi South" } },
      { name: "Khalil Hoath", role: "TMC Lyari Chairman", level: "Local", party: "PPP", img: "https://ui-avatars.com/api/?name=KH&background=f472b6&color=fff&size=128&bold=true", contact: { phone: "Submit if you have it", office: "TMC Lyari, Chakiwara Road", web: "https://www.tmclyari.gos.pk" } },
      { name: "Sindh Zakat Dept", role: "Hospital Funding", level: "Provincial", party: "Government", img: "https://ui-avatars.com/api/?name=Zakat&background=facc15&color=fff&size=128&bold=true" },
    ],
    sources: [
      { t: "Express Tribune - Neglected: Lyari General Hospital fights for its life", u: "https://tribune.com.pk/story/2108430" },
      { t: "The News - 14 years on, Lyari General Hospital trauma centre yet to function", u: "https://www.thenews.com.pk/print/1327699" },
    ]
  },
  {
    titleUrdu: "\u062a\u0639\u0644\u06cc\u0645\u06cc \u0628\u062d\u0631\u0627\u0646",
    title: "EDUCATION CRISIS & SCHOOL DROPOUT",
    cat: "social", sev: "severe",
    loc: "Bihar Colony",
    coords: [66.9872, 24.8732],
    summaryUr: "80% تک اسکول چھوڑنے کی شرح۔ غربت، گنگ وار اور خراب اسکولوں کی وجہ سے۔",
    summaryEn: "Up to 80% dropout rate. Driven by poverty, gang-war disruption and unusable school buildings.",
    facts: [
      "2023 census: Lyari literacy rate is 68.4% - below Karachi's urban average.",
      "Dropout rates as high as 80% reported in some Lyari communities.",
      "2015-16 report found 248 primary schools operating from single rooms, over half with no drinking water.",
    ],
    factsUr: [
      "2023 مردم شماری: لیاری کی تعلیمی سطح 68.4% - کراچی کے عام شہری اوسط سے کم۔",
      "بعض علاقوں میں اسکول چھوڑنے کی شرح 80% تک۔",
      "248 پرائمری اسکول ایک کمرے میں چل رہے تھے۔ نصف سے زائد میں پینے کا پانی نہیں۔"
    ],
    solutions: [
      "Rebuild worst school infrastructure first - functioning water and washrooms are prerequisites.",
      "Conditional cash transfers tied to attendance.",
      "Girl-specific retention programs to close the gender gap.",
    ],
    solutionsUr: [
      "پہلے خراب ترین اسکولوں کا انفراسٹرکچر مرمت کریں۔",
      "حضورت سے جڑی شرطی نقد منتقلیاں۔",
      "لڑکیوں کے لیے retention programs۔"
    ],
    accountability: {
      chain: [
        { level: "Provincial", levelUr: "صوبائی", role: "Sindh Education Minister", roleUr: "وزیر تعلیم سندھ", name: "Office of the Sindh Education Minister (verify current officeholder)", party: "PPP", responsibility: "Owns school infrastructure funding and teacher allocation province-wide.", responsibilityUr: "صوبے بھر میں اسکول انفراسٹرکچر فنڈنگ اور اساتذہ کی تقرری کے ذمہ دار۔" },
        { level: "Local", levelUr: "مقامی", role: "District Education Officer, Lyari Town", roleUr: "ضلعی تعلیمی افسر، لیاری ٹاؤن", name: "Office of the DEO Lyari (verify current officeholder)", party: "—", responsibility: "Enforce minimum facility standards — the 2015-16 finding of 248 single-room schools, half without water, is a DEO-level failure.", responsibilityUr: "کم از کم سہولت کے معیار کا نفاذ — 248 ایک کمرے کے اسکول DEO کی سطح کی ناکامی ہیں۔" },
      ],
      demandEn: "Publish a funded, dated plan to fix water and washroom access in every single-room Lyari school before the next academic year.",
      demandUr: "اگلے تعلیمی سال سے پہلے ہر ایک کمرے کے اسکول میں پانی اور واش روم کی سہولت کا فنڈڈ، حتمی تاریخ والا منصوبہ عوامی کریں۔",
    },
    bigIdea: "An 80% dropout rate isn't a school problem, it's a survival-economics problem. Pair every school rebuild with a conditional cash stipend for the family — attendance pays more than a child's labour would.",
    bigIdeaUr: "80% ڈراپ آؤٹ کوئی اسکول کا مسئلہ نہیں، بقا کی معیشت کا مسئلہ ہے۔ ہر اسکول کی تعمیر نو کے ساتھ خاندان کے لیے شرطی نقد وظیفہ دیں۔",
    roadmap: ["WEEK 1 — Publish a facility audit of every Lyari school: water, toilets, roof, teacher count.","MONTH 1 — Emergency fix of water and washrooms in single-room schools before anything else.","MONTH 6 — Conditional cash stipend to families tied to attendance — school must pay more than child labour.","YEAR 1 — Girl-specific retention: safe transport, female teachers, and stipends to close the gender gap.","ROOT CUT — Treat dropout as economics: pair every school with family income support."],
    roadmapUr: ["پہلا ہفتہ — ہر لیاری اسکول کا سہولت آڈٹ شائع کریں: پانی، بیت الخلا، چھت، اساتذہ کی تعداد۔","پہلا مہینہ — سب سے پہلے ایک کمرے کے اسکولوں میں پانی اور واش روم کی ہنگامی مرمت۔","چھٹا مہینہ — حاضری سے مشروط خاندانوں کو نقد وظیفہ — اسکول بچے کی مزدوری سے زیادہ فائدہ مند ہو۔","پہلا سال — لڑکیوں کے لیے: محفوظ ٹرانسپورٹ، خواتین اساتذہ اور وظائف تاکہ صنفی فرق ختم ہو۔","بنیادی حل — اسکول چھوڑنے کو معاشی مسئلہ سمجھیں: ہر اسکول کے ساتھ خاندانی آمدنی کی مدد جوڑیں۔"],
    examples: ["Mexico's Progresa/Oportunidades cut dropout sharply by paying families conditional on attendance.","Bangladesh's female stipend program doubled girls' secondary enrolment in a generation."],
    examplesUr: ["میکسیکو کے پروگریسا/اوپورتونیدادس نے حاضری سے مشروط ادائیگی سے اسکول چھوڑنے کی شرح تیزی سے کم کی۔","بنگلہ دیش کے لڑکیوں کے وظیفہ پروگرام نے ایک نسل میں لڑکیوں کا ثانوی داخلہ دگنا کیا۔"],
    resources: [{"t":"Ehsaas / BISP — conditional stipends","u":"https://www.pass.gov.pk/"},{"t":"UNICEF Pakistan — education","u":"https://www.unicef.org/pakistan/education"},{"t":"Global Partnership for Education","u":"https://www.globalpartnership.org/"}],
    images: [
      "https://placehold.co/800x500/1a1a2e/a78bfa?text=LITERACY+RATE+DROPPING.+ONLY+54%25+IN+LYARI.+NATIONAL+AVERAGE+62%25.+GIRLS+WORST+HIT.",
      "https://placehold.co/800x500/1a1a2e/f472b6?text=150+SCHOOLS+WITHOUT+ELECTRICITY.+120+WITHOUT+CLEAN+TOILETS.+15+YEARS+BEHIND+THE+CITY.",
    ],
    subIssues: [
      { uc: "UC-5 Baghdadi", status: "80% DROPOUT RATE", detail: "248 single-room schools. Half without water. No toilets for girls. Teachers absent most days." },
      { uc: "UC-6 Moosa Lane", status: "NO GIRLS SCHOOLS", detail: "Zero secondary schools for girls. Families keep daughters home for safety and cultural reasons." },
      { uc: "UC-11 Chakiwara", status: "BUILDING UNSAFE", detail: "Roof leaks in rain. No electricity. Students sit on floor. Textbooks 5 years out of date." },
      { uc: "UC-9 Ragiwara", status: "TEACHER SHORTAGE", detail: "3 teachers for 400 students. Multi-grade teaching. No science labs. No computers." },
    ],
    people: [
      { name: "Sindh Education Minister", role: "Provincial Education Budget", level: "Provincial", party: "PPP", img: "https://ui-avatars.com/api/?name=SE+Min&background=a78bfa&color=fff&size=128&bold=true", contact: { phone: "+92-21-99261400", office: "Sindh Education Department" } },
      { name: "Murtaza Wahab", role: "Mayor Karachi (KMC)", level: "Municipal", party: "PPP", img: "https://ui-avatars.com/api/?name=MW&background=a78bfa&color=fff&size=128&bold=true", contact: { phone: "+92-21-99216095", email: "mayor@kmc.gos.pk", office: "KMC Head Office, Karachi" } },
      { name: "DEO Lyari Town", role: "District Education Officer", level: "Municipal", party: "Education Dept", img: "https://ui-avatars.com/api/?name=DEO&background=f472b6&color=fff&size=128&bold=true", contact: { phone: "Submit if you have it", office: "DEO Office, Lyari" } },
      { name: "Khalil Hoath", role: "TMC Lyari Chairman", level: "Local", party: "PPP", img: "https://ui-avatars.com/api/?name=KH&background=f472b6&color=fff&size=128&bold=true", contact: { phone: "Submit if you have it", office: "TMC Lyari, Chakiwara Road", web: "https://www.tmclyari.gos.pk" } },
      { name: "Deputy Commissioner South", role: "District Administration South", level: "Municipal", party: "Civil Service", img: "https://ui-avatars.com/api/?name=DC+S&background=38bdf8&color=fff&size=128&bold=true", contact: { phone: "Submit if you have it", office: "DC Office, Karachi South" } },
    ],
    sources: [
      { t: "Dawn - Experts decry declining literacy rate in Lyari", u: "https://www.dawn.com/news/278722" },
      { t: "Arab News - Lyari's children miss out on education", u: "https://www.arabnews.pk/node/1406486/pakistan" },
    ]
  },
  {
    titleUrdu: "\u0646\u0634\u06d2 \u06a9\u06cc \u0639\u0627\u062f\u062a",
    title: "DRUG ADDICTION - HEROIN & CRYSTAL METH",
    cat: "social", sev: "severe",
    loc: "Miran Naka",
    coords: [66.9941, 24.8778],
    summaryUr: "لیاری کرسٹل میتھ کا مرکز۔ 15-30 عمر کے صارف۔ آئس 500 روپے فی گرام۔",
    summaryEn: "Lyari is a crystal-meth hub. Users disproportionately young (15-30). Ice cheap at Rs 500/gram.",
    facts: [
      "Lyari named as one of Karachi's crystal meth ('ice')-selling hubs.",
      "Ice users experience 82% more drug-induced psychosis than traditional substance users.",
      "Ice is cheap and getting cheaper - Rs 500/gram now, down from Rs 5,000 in 2018.",
    ],
    factsUr: [
      "لیاری کراچی کے کرسٹل میتھ بیچنے والے مرکزوں میں سے ایک۔",
      "آئس صارف عام اشیاء کے صارفوں کے مقابلے 82% زیادہ ذہنی بیماری کا شکار۔",
      "آئس سستا ہے اور اور سستا ہو رہا ہے - اب 500 روپے فی گرام۔"
    ],
    solutions: [
      "Expand accessible, low-cost rehabilitation services inside Lyari.",
      "Target enforcement at supply/distribution route level.",
      "School and community-based early-intervention programs.",
    ],
    solutionsUr: [
      "لیاری کے اندر قابل رسائی rehabilitation خدمات بڑھائیں۔",
      "سپلائی/ڈسٹریبیوشن روٹ کی سطح پر نفاذ۔",
      "اسکول اور کمیونٹی میں جلد مداخلت کے پروگرام۔"
    ],
    accountability: {
      chain: [
        { level: "Provincial", levelUr: "صوبائی", role: "Sindh Home Department / ANF Sindh", roleUr: "سندھ داخلہ محکمہ / ANF سندھ", name: "Government of Sindh", party: "—", responsibility: "Anti-narcotics enforcement at the supply and distribution level.", responsibilityUr: "سپلائی اور تقسیم کی سطح پر انسداد منشیات کارروائی۔" },
        { level: "Local", levelUr: "مقامی", role: "SHO, Lyari police stations", roleUr: "SHO، لیاری تھانے", name: "Local police leadership (verify current officeholders)", party: "—", responsibility: "Ground-level enforcement against known dealing points like Miran Naka.", responsibilityUr: "میران ناکہ جیسے معلوم مقامات پر زمینی سطح کی کارروائی۔" },
        { level: "Provincial", levelUr: "صوبائی", role: "Sindh Mental Health Authority", roleUr: "سندھ مینٹل ہیلتھ اتھارٹی", name: "Government of Sindh", party: "—", responsibility: "Fund accessible, low-cost rehabilitation capacity inside Lyari.", responsibilityUr: "لیاری کے اندر قابلِ رسائی، کم لاگت بحالی کی صلاحیت کو فنڈ کریں۔" },
      ],
      demandEn: "Fund a dedicated low-cost rehab facility inside Lyari and publish enforcement statistics for known distribution points, including Miran Naka, on a public schedule.",
      demandUr: "لیاری کے اندر ایک مخصوص کم لاگت بحالی مرکز کو فنڈ کریں اور میران ناکہ سمیت معلوم تقسیم کے مقامات کے خلاف کارروائی کے اعداد و شمار عوامی کریں۔",
    },
    bigIdea: "Ice at Rs 500/gram (down from Rs 5,000) means supply-side enforcement alone has already failed — it's a price collapse, not a shortage. Redirect enforcement budget toward youth employment and rehab capacity, where the actual leverage is.",
    bigIdeaUr: "آئس 500 روپے فی گرام (پہلے 5,000 سے) کا مطلب ہے سپلائی سائیڈ کارروائی ناکام ہو چکی۔ کارروائی کا بجٹ نوجوانوں کے روزگار اور بحالی کی صلاحیت کی طرف موڑیں۔",
    roadmap: ["WEEK 1 — Publish enforcement stats for known selling points (e.g. Miran Naka) on a public schedule.","MONTH 1 — Open a low-cost rehab + harm-reduction centre inside Lyari, not across the city.","MONTH 6 — Redirect enforcement budget to youth jobs — a Rs 500/gram price collapse means supply-side already failed.","YEAR 1 — School and community early-intervention run by ex-users and local NGOs.","ROOT CUT — Treat addiction as health + unemployment: decriminalize use, prosecute the supply chain."],
    roadmapUr: ["پہلا ہفتہ — معلوم فروخت کے مقامات (مثلاً میران ناکہ) کے خلاف کارروائی کے اعداد و شمار عوامی شیڈول پر شائع کریں۔","پہلا مہینہ — لیاری کے اندر کم لاگت بحالی اور نقصان کم کرنے کا مرکز کھولیں، شہر کے دوسرے کونے میں نہیں۔","چھٹا مہینہ — کارروائی کا بجٹ نوجوانوں کے روزگار کی طرف موڑیں — 500 روپے فی گرام قیمت گرنا ثابت کرتا ہے سپلائی سائیڈ ناکام ہے۔","پہلا سال — اسکول و کمیونٹی میں جلد مداخلت، سابق صارفین اور مقامی این جی اوز کے ذریعے۔","بنیادی حل — نشے کو صحت و بے روزگاری کا مسئلہ سمجھیں: استعمال کو جرم سے نکالیں، سپلائی چین پر مقدمہ کریں۔"],
    examples: ["Portugal decriminalized personal drug use in 2001 and funded treatment — overdose deaths collapsed.","Vancouver's community harm-reduction sharply cut overdose deaths and disease transmission."],
    examplesUr: ["پرتگال نے 2001 میں ذاتی استعمال کو جرم سے نکالا اور علاج کو فنڈ دیا — اوور ڈوز اموات میں بڑی کمی آئی۔","وینکوور کے کمیونٹی نقصان کم کرنے کے ماڈل نے اوور ڈوز اموات اور بیماری کی منتقلی نمایاں طور پر کم کی۔"],
    resources: [{"t":"UNODC Pakistan","u":"https://www.unodc.org/pakistan/"},{"t":"Harm Reduction International","u":"https://hri.global/"},{"t":"WHO — substance use","u":"https://www.who.int/teams/mental-health-and-substance-use"}],
    images: [
      "https://placehold.co/800x500/1a1a2e/ef4444?text=HEROIN+AND+CRYSTAL+METH+EPIDEMIC.+14+YEAR+OLDS+USING.+ZERO+REHAB+CENTRES+IN+LYARI.",
      "https://placehold.co/800x500/1a1a2e/f97316?text=ICE+REPLACED+HEROIN.+Rs+500+PER+GRAM.+SUPPLY+FLOODING+IN.+60%25+YOUTH+IDLE.+NO+JOBS.",
    ],
    subIssues: [
      { uc: "UC-5 Baghdadi", status: "OPEN DRUG DEALING", detail: "Miran Naka area known dealing point. Police presence minimal. Youth as young as 14 using." },
      { uc: "UC-6 Moosa Lane", status: "NO REHAB CENTRE", detail: "Zero rehabilitation facilities in Lyari. Nearest centre 45 minutes away. Cost unaffordable." },
      { uc: "UC-11 Chakiwara", status: "ICE EPIDEMIC", detail: "Crystal meth (ice) replaced heroin. Rs 500/gram down from Rs 5,000. Supply flooding in." },
      { uc: "UC-9 Ragiwara", status: "YOUTH UNEMPLOYMENT", detail: "No jobs, no schools, no hope. Drug use is symptom of economic collapse. 60% youth idle." },
    ],
    people: [
      { name: "Sindh Home Dept / ANF", role: "Anti-Narcotics Enforcement", level: "Provincial", party: "Provincial", img: "https://ui-avatars.com/api/?name=ANF&background=ef4444&color=fff&size=128&bold=true", contact: { phone: "+92-21-99212540", office: "Sindh Home Department" } },
      { name: "SHO Lyari Stations", role: "Local Police", level: "Local", party: "Sindh Police", img: "https://ui-avatars.com/api/?name=SHO&background=f97316&color=fff&size=128&bold=true", contact: { phone: "15 (Police Helpline)", office: "Lyari Police Station" } },
      { name: "Deputy Commissioner South", role: "District Administration South", level: "Municipal", party: "Civil Service", img: "https://ui-avatars.com/api/?name=DC+S&background=38bdf8&color=fff&size=128&bold=true", contact: { phone: "Submit if you have it", office: "DC Office, Karachi South" } },
      { name: "Khalil Hoath", role: "TMC Lyari Chairman", level: "Local", party: "PPP", img: "https://ui-avatars.com/api/?name=KH&background=f472b6&color=fff&size=128&bold=true", contact: { phone: "Submit if you have it", office: "TMC Lyari, Chakiwara Road", web: "https://www.tmclyari.gos.pk" } },
      { name: "Sindh Mental Health Auth.", role: "Rehab Funding", level: "Provincial", party: "Health Dept", img: "https://ui-avatars.com/api/?name=SMHA&background=4ade80&color=fff&size=128&bold=true" },
    ],
    sources: [
      { t: "Global Initiative - Understanding Karachi's Drug Menace", u: "https://globalinitiative.net/wp-content/uploads/2020/07/Drug-Situation-in-Karachi-PB-1.pdf" },
    ]
  },
];

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
      <div class="card-action">${readLabel} <span aria-hidden="true">→</span></div>
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
    // Fast ease toward 100 — assets are already loading; this is just a brief flourish
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
let currentTheme = localStorage.getItem("lyari-theme") || "dark";

function applyTheme(theme) {
  if (theme === "light") {
    document.body.classList.add("light");
  } else {
    document.body.classList.remove("light");
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
    solutionsUr: ["یہ عوامی طور پر بیان کردہ مسئلہ ہے۔ مقامی حکام اور ذمہ دار اداروں کو فوری طور پر تفتیش کرنی چاہئے اور فوری اقدام کرنا چاہئے۔"],
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
