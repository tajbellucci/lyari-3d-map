// ============================================
// LIGHTWEIGHT IndexedDB DATABASE
// ============================================
const DB_NAME = "LyariCrisisMap";
const DB_VERSION = 1;

const STORES = {
  ISSUES: "submitted_issues",
  EDITS: "community_edits",
  APPROVED: "approved_items",
  ISSUES_DB: "main_issues",
};

let db = null;

function openDB() {
  return new Promise((resolve, reject) => {
    if (db) { resolve(db); return; }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = e => {
      const d = e.target.result;
      if (!d.objectStoreNames.contains(STORES.ISSUES)) {
        d.createObjectStore(STORES.ISSUES, { keyPath: "id" });
      }
      if (!d.objectStoreNames.contains(STORES.EDITS)) {
        d.createObjectStore(STORES.EDITS, { keyPath: "id", autoIncrement: true });
      }
      if (!d.objectStoreNames.contains(STORES.APPROVED)) {
        d.createObjectStore(STORES.APPROVED, { keyPath: "id" });
      }
      if (!d.objectStoreNames.contains(STORES.ISSUES_DB)) {
        d.createObjectStore(STORES.ISSUES_DB, { keyPath: "title" });
      }
    };
    req.onsuccess = e => { db = e.target.result; resolve(db); };
    req.onerror = e => reject(e.target.error);
  });
}

function dbGetAll(storeName) {
  return openDB().then(d => new Promise((resolve, reject) => {
    const tx = d.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  }));
}

function dbGet(storeName, key) {
  return openDB().then(d => new Promise((resolve, reject) => {
    const tx = d.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const req = store.get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  }));
}

function dbPut(storeName, data) {
  return openDB().then(d => new Promise((resolve, reject) => {
    const tx = d.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    const req = store.put(data);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  }));
}

function dbDelete(storeName, key) {
  return openDB().then(d => new Promise((resolve, reject) => {
    const tx = d.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    const req = store.delete(key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  }));
}

function dbClear(storeName) {
  return openDB().then(d => new Promise((resolve, reject) => {
    const tx = d.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    const req = store.clear();
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  }));
}

function dbCount(storeName) {
  return openDB().then(d => new Promise((resolve, reject) => {
    const tx = d.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const req = store.count();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  }));
}

// ============================================
// MIGRATION: localStorage -> IndexedDB
// ============================================
function migrateLocalStorageToDB() {
  const LS_ISSUES = "lyari-submitted-issues";
  const LS_EDITS = "lyari-community-edits";
  const LS_APPROVED = "lyari-approved";

  try {
    const oldIssues = JSON.parse(localStorage.getItem(LS_ISSUES)) || [];
    if (oldIssues.length > 0) {
      oldIssues.forEach(issue => dbPut(STORES.ISSUES, issue));
      console.log(`Migrated ${oldIssues.length} issues from localStorage to IndexedDB`);
    }
  } catch(e) { console.warn("Issue migration error:", e); }

  try {
    const oldEdits = JSON.parse(localStorage.getItem(LS_EDITS)) || [];
    if (oldEdits.length > 0) {
      oldEdits.forEach(edit => dbPut(STORES.EDITS, edit));
      console.log(`Migrated ${oldEdits.length} edits from localStorage to IndexedDB`);
    }
  } catch(e) { console.warn("Edit migration error:", e); }

  try {
    const oldApproved = JSON.parse(localStorage.getItem(LS_APPROVED)) || [];
    if (oldApproved.length > 0) {
      oldApproved.forEach(item => dbPut(STORES.APPROVED, item));
      console.log(`Migrated ${oldApproved.length} approved items from localStorage to IndexedDB`);
    }
  } catch(e) { console.warn("Approved migration error:", e); }
}

// ============================================
// HIGH-LEVEL API
// ============================================
const LyariDB = {
  // Submitted Issues
  async getSubmittedIssues() { return dbGetAll(STORES.ISSUES); },
  async addSubmittedIssue(issue) {
    if (!issue.id) issue.id = "submitted-" + Date.now();
    if (!issue.submittedAt) issue.submittedAt = new Date().toISOString();
    await dbPut(STORES.ISSUES, issue);
    return issue;
  },
  async deleteSubmittedIssue(id) { await dbDelete(STORES.ISSUES, id); },

  // Community Edits
  async getEdits() { return dbGetAll(STORES.EDITS); },
  async addEdit(edit) {
    if (!edit.submittedAt) edit.submittedAt = new Date().toISOString();
    edit.status = "pending";
    await dbPut(STORES.EDITS, edit);
    return edit;
  },
  async deleteEdit(id) { await dbDelete(STORES.EDITS, id); },

  // Approved Items
  async getApproved() { return dbGetAll(STORES.APPROVED); },
  async approveItem(item) {
    item.approvedAt = new Date().toISOString();
    item.status = "approved";
    await dbPut(STORES.APPROVED, item);
    return item;
  },
  async removeApproved(id) { await dbDelete(STORES.APPROVED, id); },

  // Main Issues (for syncing approved back to map)
  async saveMainIssues(issues) {
    for (const issue of issues) {
      await dbPut(STORES.ISSUES_DB, issue);
    }
  },
  async getMainIssues() { return dbGetAll(STORES.ISSUES_DB); },

  // Stats
  async getStats() {
    const issues = await this.getSubmittedIssues();
    const edits = await this.getEdits();
    const approved = await this.getApproved();
    return {
      pendingIssues: issues.filter(i => i.status !== "approved").length,
      pendingEdits: edits.filter(e => e.status === "pending").length,
      approved: approved.length,
      total: issues.length + edits.length,
    };
  },

  // Initialize
  async init() {
    await openDB();
    migrateLocalStorageToDB();
    console.log("LyariDB initialized");
  }
};
