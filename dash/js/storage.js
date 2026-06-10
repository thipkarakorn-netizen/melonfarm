// ─── Storage Module ──────────────────────────────────────────────────────────
const Storage = {
  KEY: 'dash_lots_v2',

  _default() {
    return [{
      id:   'lot1',
      name: 'แปลง A',
      sensors: {
        temperature: 30.7,
        humidity:    68.0,
        waterLevel:  77.6,
        ph:          6.83,
        ec:          3.37,
        lastUpdated: new Date().toISOString()
      },
      thresholds: {
        temperature: { min: 20,  max: 38  },
        humidity:    { min: 50,  max: 90  },
        waterLevel:  { min: 15,  max: 100 },
        ph:          { min: 5.5, max: 7.5 },
        ec:          { min: 1.5, max: 3.5 }
      },
      dailyLogs: []
    }];
  },

  init() {
    if (!localStorage.getItem(this.KEY)) {
      localStorage.setItem(this.KEY, JSON.stringify(this._default()));
    }
  },

  getLots() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY)) || this._default();
    } catch(e) {
      return this._default();
    }
  },

  _save(lots) {
    localStorage.setItem(this.KEY, JSON.stringify(lots));
  },

  updateSensors(id, sensors) {
    const lots = this.getLots();
    const lot  = lots.find(l => l.id === id);
    if (lot) {
      lot.sensors = { ...lot.sensors, ...sensors };
      this._save(lots);
    }
  },

  addDailyLog(lotId, log) {
    const lots = this.getLots();
    const lot  = lots.find(l => l.id === lotId);
    if (lot) {
      if (!lot.dailyLogs) lot.dailyLogs = [];
      // deduplicate by date
      lot.dailyLogs = lot.dailyLogs.filter(l => l.date !== log.date);
      lot.dailyLogs.push(log);
      this._save(lots);
    }
  },

  deleteLog(lotId, date) {
    const lots = this.getLots();
    const lot  = lots.find(l => l.id === lotId);
    if (lot) {
      lot.dailyLogs = (lot.dailyLogs || []).filter(l => l.date !== date);
      this._save(lots);
    }
  }
};
