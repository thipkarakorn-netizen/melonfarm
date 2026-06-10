// ─── Clock ───
function updateClock() {
  const now = new Date();
  const d = now.toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: '2-digit' });
  const t = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const text = `${d} ${t}`;
  const el = document.getElementById('clock');
  if (el) el.textContent = text;
  document.querySelectorAll('.sb-clock').forEach(function(el) { el.textContent = text; });
}
setInterval(updateClock, 1000);
updateClock();

// ─── Navigation ───
const pages = {
  manual:   { title: 'สั่งการ',         sub: 'ระบบ IoT เพื่อควบคุมการใช้ปุ๋ยที่เหมาะสมต่อการเจริญเติบโต' },
  auto:     { title: 'ทำงานอัตโนมัติ',  sub: 'ระบบ IoT เพื่อควบคุมการใช้ปุ๋ยที่เหมาะสมต่อการเจริญเติบโต' },
  timezone: { title: 'เวลาทำงาน',       sub: 'ระบบ IoT เพื่อควบคุมการใช้ปุ๋ยที่เหมาะสมต่อการเจริญเติบโต' },
  calib:    { title: 'คาลิเบตค่า',      sub: 'ระบบ IoT เพื่อควบคุมการใช้ปุ๋ยที่เหมาะสมต่อการเจริญเติบโต' },
};

function navigate(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const target = document.getElementById('page-' + pageId);
  if (target) target.classList.add('active');

  const navItem = document.querySelector(`.nav-item[data-page="${pageId}"]`);
  if (navItem) navItem.classList.add('active');

  const info = pages[pageId];
  if (info) {
    document.getElementById('topbarTitle').textContent = info.title;
    document.getElementById('topbarSub').textContent = info.sub;
  }
}

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', e => {
    if (!item.dataset.page) return;
    e.preventDefault();
    navigate(item.dataset.page);
  });
});

// ─── Sidebar Toggle ───
function closeSidebar() {
  const sidebar  = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  if (sidebar) sidebar.classList.remove('open');
  if (backdrop) {
    backdrop.classList.remove('show');
    setTimeout(() => { backdrop.style.display = 'none'; }, 260);
  }
}

document.getElementById('menuToggle').addEventListener('click', () => {
  const sidebar  = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  const isMobile = window.innerWidth <= 640;

  if (isMobile) {
    const isOpen = sidebar.classList.contains('open');
    if (isOpen) {
      closeSidebar();
    } else {
      sidebar.classList.add('open');
      if (backdrop) {
        backdrop.style.display = 'block';
        requestAnimationFrame(() => backdrop.classList.add('show'));
      }
    }
  } else {
    sidebar.style.width = sidebar.offsetWidth > 60 ? '0px' : 'var(--sidebar-w)';
  }
});

// Close sidebar when a nav item is tapped on mobile
document.querySelectorAll('.nav-item[data-page]').forEach(item => {
  item.addEventListener('click', () => {
    if (window.innerWidth <= 640) closeSidebar();
  });
});

// ─── Spinners (integer) ───
function spinUp(id) {
  const el = document.getElementById(id);
  el.value = Number(el.value) + Number(el.step || 1);
}

function spinDown(id) {
  const el = document.getElementById(id);
  const next = Number(el.value) - Number(el.step || 1);
  if (next >= Number(el.min)) el.value = next;
}

// ─── Spinners (decimal) ───
function spinUpDec(id) {
  const el = document.getElementById(id);
  el.value = (parseFloat(el.value) + 0.1).toFixed(1);
}

function spinDownDec(id) {
  const el = document.getElementById(id);
  const next = parseFloat(el.value) - 0.1;
  if (next >= parseFloat(el.min)) el.value = next.toFixed(1);
}

// ─── Pump Toggle ───
function togglePump(btn) {
  const pumpId = btn.dataset.pump;
  const statusEl = document.querySelector(`.pump-status[data-pump="${pumpId}"]`);
  const isRunning = btn.classList.contains('running');

  if (isRunning) {
    btn.classList.remove('running');
    btn.textContent = '▶ เริ่มทำงาน';
    statusEl.textContent = 'หยุด';
    statusEl.classList.remove('running');
  } else {
    btn.classList.add('running');
    btn.textContent = '⏹ หยุดทำงาน';
    statusEl.textContent = 'กำลังทำงาน';
    statusEl.classList.add('running');
  }
}

// ─── Auto Toggle ───
function onAutoToggle(checkbox) {
  const bar = document.getElementById('autoStatusBar');
  if (checkbox.checked) {
    bar.textContent = '▶ Auto Mode กำลังทำงาน — ระบบควบคุมอัตโนมัติเปิดใช้งานแล้ว';
    bar.classList.add('on');
  } else {
    bar.textContent = '⏸ Auto Mode ปิดอยู่ — เปิดสวิตช์ด้านบนเพื่อเริ่มใช้งาน';
    bar.classList.remove('on');
  }
}

// ─── Env Group Toggle (radio: hum / temp) ───
function toggleEnvGroup(selected) {
  ['hum', 'temp'].forEach(function(t) {
    const ctrl = document.getElementById(t + '-controls');
    if (!ctrl) return;
    const on = (t === selected);
    ctrl.style.opacity       = on ? '1'    : '0.4';
    ctrl.style.pointerEvents = on ? 'auto' : 'none';
  });
}

// ─── Plant Group Toggle (radio: plantday / prod) ───
function togglePlantGroup(selected) {
  const map = { plantday: 'plant-day-controls', prod: 'prod-controls' };
  Object.keys(map).forEach(function(k) {
    const ctrl = document.getElementById(map[k]);
    if (!ctrl) return;
    const on = (k === selected);
    ctrl.style.opacity       = on ? '1'    : '0.4';
    ctrl.style.pointerEvents = on ? 'auto' : 'none';
  });
}

// ─── Legacy alias (used by saved-state restore) ───
function toggleWeatherSection(type) { toggleEnvGroup(type); }
function togglePlantDaySection()    { togglePlantGroup('plantday'); }

// ─── Save Auto (PH/EC targets) ───
function saveAuto() {
  const data = {
    phMin: document.getElementById('ph-min')?.value,
    phMax: document.getElementById('ph-max')?.value,
    ecMin: document.getElementById('ec-min')?.value,
    ecMax: document.getElementById('ec-max')?.value,
  };
  localStorage.setItem('auto_targets', JSON.stringify(data));
  const btn = document.querySelector('#page-auto .btn-save');
  if (btn) {
    const orig = btn.textContent;
    btn.textContent = '✅ บันทึกแล้ว!';
    btn.style.background = '#58a6ff';
    setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 1800);
  }
}

// ─── Save Auto Extra (Weather / Plant / Flow) ───
// ─── คำนวณวันที่ผ่านไปตั้งแต่บันทึก ───
function calcCurrentDay(savedValue, savedDate, maxDays) {
  if (!savedDate || savedValue == null) return savedValue;
  const saved = new Date(savedDate); saved.setHours(0,0,0,0);
  const today = new Date();           today.setHours(0,0,0,0);
  const diff  = Math.floor((today - saved) / 86400000); // ms per day
  return Math.min(parseInt(savedValue) + diff, maxDays);
}

function saveAutoExtra() {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const data = {
    humSet    : document.getElementById('hum-set')?.value,
    humDiff   : document.getElementById('hum-diff')?.value,
    tempSet   : document.getElementById('temp-set')?.value,
    tempDiff  : document.getElementById('temp-diff')?.value,
    plantDay      : document.getElementById('plant-day')?.value,
    plantDayDate  : today,
    plantDayEnable: document.getElementById('plant-day-enable')?.checked,  // radio วันย้ายกล้า
    prodEnable    : document.getElementById('prod-enable')?.checked,        // radio ระยะผลิตเมล่อน
    prodDay       : document.getElementById('prod-day')?.value,
    prodDayDate   : today,
    ecTargetUs: document.getElementById('ec-target-us')?.value,
    waterPerTree: document.getElementById('water-per-tree')?.value,
    autoflowEnable: document.getElementById('autoflow-enable')?.checked,
    flowSet   : document.getElementById('flow-set')?.value,
    flowMax   : document.getElementById('flow-max')?.value,
    humEnable : document.getElementById('hum-enable')?.checked,             // radio ความชื้น
    tempEnable: document.getElementById('temp-enable')?.checked,            // radio อุณหภูมิ
  };
  localStorage.setItem('auto_extra', JSON.stringify(data));
  const btns = document.querySelectorAll('#page-auto .btn-save');
  const btn  = btns[btns.length - 1];
  if (btn) {
    const orig = btn.textContent;
    btn.textContent = '✅ บันทึกแล้ว!';
    btn.style.background = '#58a6ff';
    setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 1800);
  }
}

// ─── Load Auto Settings ───
(function loadAutoSettings() {
  document.addEventListener('DOMContentLoaded', function() {
    // load targets
    try {
      const t = JSON.parse(localStorage.getItem('auto_targets') || 'null');
      if (t) {
        if (t.phMin !== undefined && document.getElementById('ph-min')) document.getElementById('ph-min').value = t.phMin;
        if (t.phMax !== undefined && document.getElementById('ph-max')) document.getElementById('ph-max').value = t.phMax;
        if (t.ecMin !== undefined && document.getElementById('ec-min')) document.getElementById('ec-min').value = t.ecMin;
        if (t.ecMax !== undefined && document.getElementById('ec-max')) document.getElementById('ec-max').value = t.ecMax;
      }
    } catch(e) {}
    // load extra
    try {
      const e = JSON.parse(localStorage.getItem('auto_extra') || 'null');
      if (e) {
        const set = (id, val) => { const el = document.getElementById(id); if (el && val !== undefined) el.value = val; };
        const chk = (id, val) => { const el = document.getElementById(id); if (el && val !== undefined) el.checked = !!val; };
        set('hum-set',   e.humSet);
        set('hum-diff',  e.humDiff);
        set('temp-set',  e.tempSet);
        set('temp-diff', e.tempDiff);

        // ─── กู้ radio กลุ่ม env (เลือกได้ช่องเดียว) ───
        if (e.humEnable) {
          chk('hum-enable', true);
          toggleEnvGroup('hum');
        } else if (e.tempEnable) {
          chk('temp-enable', true);
          toggleEnvGroup('temp');
        }

        // ─── นับวันอัตโนมัติ: วันย้ายกล้า (max 20) และระยะผลิตเมล่อน (max 45) ───
        set('plant-day', calcCurrentDay(e.plantDay, e.plantDayDate, 20));
        set('prod-day',  calcCurrentDay(e.prodDay,  e.prodDayDate,  45));

        // ─── กู้ radio กลุ่ม plant (เลือกได้ช่องเดียว) ───
        if (e.plantDayEnable) {
          chk('plant-day-enable', true);
          togglePlantGroup('plantday');
        } else if (e.prodEnable) {
          chk('prod-enable', true);
          togglePlantGroup('prod');
        }

        set('ec-target-us',    e.ecTargetUs);
        set('water-per-tree',  e.waterPerTree);
        chk('autoflow-enable', e.autoflowEnable);
        set('flow-set',        e.flowSet);
        set('flow-max',        e.flowMax);
      }
    } catch(e) {}

    // ─── คืนค่า AMOUNT OF WATER จาก env_adjust (ต้องทำหลังสุดเพื่อไม่ให้ถูกทับ) ───
    try {
      const adj = JSON.parse(localStorage.getItem('env_adjust') || '{}');
      if (adj.baseWater != null && (adj.humSelected || adj.tempSelected)) {
        var adjusted = adj.baseWater;
        if (adj.humSelected)  adjusted = Math.max(0, adj.baseWater - (adj.humReduceMl || 0));
        if (adj.tempSelected) adjusted = adj.baseWater + (adj.tempAddMl || 0);
        const tzEl = document.getElementById('tz-water-amount');
        if (tzEl) {
          tzEl.value = adjusted;
          if (typeof updateZoneStats === 'function') updateZoneStats();
        }
      }
    } catch(e) {}

    // ─── อัปเดต EC & Water ตามตารางแผนการปลูก ───
    autoEcWater();
  });
})();

// ─── Auto EC & Water per plan table ───
function autoEcWater() {
  var plantSel = document.getElementById('plant-day-enable')?.checked;
  var prodSel  = document.getElementById('prod-enable')?.checked;
  var ec = null, water = null;

  if (plantSel) {
    var d = parseInt(document.getElementById('plant-day')?.value) || 1;
    // ตารางวันย้ายกล้า (1-20 วัน)
    if      (d <= 2)  { ec = 600;  water = 600;  }
    else if (d <= 8)  { ec = 800;  water = 800;  }
    else if (d <= 12) { ec = 1000; water = 800;  }
    else if (d <= 14) { ec = 1000; water = 1200; }
    else if (d <= 16) { ec = 1200; water = 1400; }
    else              { ec = 1400; water = 1600; } // 17-20
  } else if (prodSel) {
    var d = parseInt(document.getElementById('prod-day')?.value) || 1;
    // ตารางระยะผลิตเมล่อน (1-45 วัน)
    if      (d <= 20) { ec = 1600; water = 2000; }
    else if (d <= 30) { ec = 1400; water = 1800; }
    else if (d <= 35) { ec = 1200; water = 1600; }
    else if (d <= 40) { ec = 1000; water = 1400; }
    else              { ec = 1000; water = 1200; } // 41-45
  }

  if (ec !== null) {
    const ecEl = document.getElementById('ec-target-us');
    const wEl  = document.getElementById('water-per-tree');
    if (ecEl) ecEl.value = ec;
    if (wEl)  wEl.value  = water;
  }
}

// ─── Calibration: wide field spinners ───
function fieldSpinUp(id) {
  const el   = document.getElementById(id);
  const step = parseFloat(el.step) || 1;
  const val  = parseFloat(el.value) || 0;
  el.value   = (val + step).toFixed(step < 1 ? 2 : 0);
  el.dispatchEvent(new Event('input'));
}

function fieldSpinDown(id) {
  const el   = document.getElementById(id);
  const step = parseFloat(el.step) || 1;
  const val  = parseFloat(el.value) || 0;
  el.value   = (val - step).toFixed(step < 1 ? 2 : 0);
  el.dispatchEvent(new Event('input'));
}

// ─── Calibration: update "หลัง calibrate" preview ───
function updateCalibAfter(rawVal, offsetStr, targetId, unit) {
  const offset    = parseFloat(offsetStr) || 0;
  const calibrated = (rawVal + offset).toFixed(2);
  const el        = document.getElementById(targetId);
  if (el) el.textContent = calibrated + unit;
}

// ─── Calibration: per-section save/load ─────────────────────────────────────

function _calibFeedback(btn) {
  var orig = btn.textContent;
  btn.textContent      = '✅ บันทึกแล้ว!';
  btn.style.background = '#58a6ff';
  setTimeout(function () { btn.textContent = orig; btn.style.background = ''; }, 1800);
}

// PH ─────────────────────────────────────────────────────────────────────────
function savePHCalib(btn) {
  var refEl = document.getElementById('ph-ref');
  var offEl = document.getElementById('ph-offset');
  localStorage.setItem('iot_ph_calib', JSON.stringify({
    ref: refEl ? refEl.value : '',
    off: offEl ? offEl.value : '0'
  }));
  _calibFeedback(btn);
}

// EC ─────────────────────────────────────────────────────────────────────────
function saveECCalib(btn) {
  var refEl = document.getElementById('ec-ref');
  var offEl = document.getElementById('ec-offset');
  localStorage.setItem('iot_ec_calib', JSON.stringify({
    ref: refEl ? refEl.value : '',
    off: offEl ? offEl.value : '0'
  }));
  _calibFeedback(btn);
}

// Temperature ─────────────────────────────────────────────────────────────────
function saveTempCalib(btn) {
  var refEl = document.getElementById('temp-ref');
  var offEl = document.getElementById('temp-offset');
  localStorage.setItem('iot_temp_calib', JSON.stringify({
    ref: refEl ? refEl.value : '',
    off: offEl ? offEl.value : '0'
  }));
  _calibFeedback(btn);
}

// Load all saved calibration values on page start ────────────────────────────
function loadAllCalib() {
  // PH
  var ph = JSON.parse(localStorage.getItem('iot_ph_calib') || '{}');
  if (ph.ref !== undefined) { var e = document.getElementById('ph-ref');    if (e) e.value = ph.ref; }
  if (ph.off !== undefined) { var e = document.getElementById('ph-offset'); if (e) { e.value = ph.off; updateCalibAfter(6.83, ph.off, 'ph-after-val', ''); } }

  // EC
  var ec = JSON.parse(localStorage.getItem('iot_ec_calib') || '{}');
  if (ec.ref !== undefined) { var e = document.getElementById('ec-ref');    if (e) e.value = ec.ref; }
  if (ec.off !== undefined) { var e = document.getElementById('ec-offset'); if (e) { e.value = ec.off; updateCalibAfter(3.37, ec.off, 'ec-after-val', ' mS/cm'); } }

  // Temp
  var tmp = JSON.parse(localStorage.getItem('iot_temp_calib') || '{}');
  if (tmp.ref !== undefined) { var e = document.getElementById('temp-ref');    if (e) e.value = tmp.ref; }
  if (tmp.off !== undefined) { var e = document.getElementById('temp-offset'); if (e) { e.value = tmp.off; updateCalibAfter(30.7, tmp.off, 'temp-after-val', ' °C'); } }
}

// ─── TimeZone: toggle zone use ───
function toggleZoneUse(btn, cardId) {
  const card = document.getElementById(cardId);
  const isActive = btn.classList.contains('active');
  if (isActive) {
    btn.classList.remove('active');
    card.classList.remove('active');
  } else {
    btn.classList.add('active');
    card.classList.add('active');
  }
  updateZoneStats();
}

// ─── TimeZone: recalculate stats ───
function updateZoneStats() {
  const allCards   = document.querySelectorAll('#page-timezone .zone-card');
  const activeBtns = document.querySelectorAll('#page-timezone .zone-use-btn.active');
  const total      = allCards.length;
  const active     = activeBtns.length;

  const waterAmount = parseInt(document.getElementById('tz-water-amount')?.value || 800);
  const perZone     = active > 0 ? Math.round(waterAmount / active) : 0;

  const flowRate   = parseInt(document.getElementById('tz-flow-rate')?.value || 62);
  // flowRate หน่วย ml/m → เวลารอ = perZone ÷ flowRate (นาที)
  const waitTotalMin = flowRate > 0 ? perZone / flowRate : 0;
  const waitMin      = Math.floor(waitTotalMin);
  const waitSec      = Math.round((waitTotalMin - waitMin) * 60);

  const zonesEl = document.getElementById('tz-zones-open');
  const mlEl    = document.getElementById('tz-total-ml');
  const waitEl  = document.getElementById('tz-wait-time');

  if (zonesEl) zonesEl.textContent = `${active}/${total}`;
  if (mlEl)    mlEl.textContent    = `${perZone} ml`;
  if (waitEl) {
    if (waitMin > 0 && waitSec > 0)  waitEl.textContent = `${waitMin}น ${waitSec}วิ`;
    else if (waitMin > 0)            waitEl.textContent = `${waitMin}น`;
    else                             waitEl.textContent = `${waitSec}วิ`;
  }

  // อัปเดตค่า ml ในแต่ละ zone card ให้ตรงกับ เฉลี่ย/ต่อรอบ
  document.querySelectorAll('#page-timezone .zone-card').forEach(card => {
    const inp = card.querySelector('.zone-ml-input');
    if (!inp) return;
    const isActive = card.classList.contains('active');
    inp.value = isActive ? perZone : 0;
  });
}

// ─── TimeZone: click-to-edit time display ───
function editTime(span) {
  const current = span.textContent.trim();        // e.g. "08:00"
  const inp = document.createElement('input');
  inp.type  = 'time';
  inp.value = current;
  inp.className = 'zone-time-input';

  span.replaceWith(inp);
  inp.focus();

  function commit() {
    const newVal = inp.value || current;
    const [hh, mm] = newVal.split(':');
    const display = document.createElement('div');
    display.className  = 'zone-time';
    display.textContent = `${hh.padStart(2,'0')}:${mm.padStart(2,'0')}`;
    display.onclick    = function() { editTime(this); };
    inp.replaceWith(display);
  }

  inp.addEventListener('blur',   commit);
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') { inp.blur(); } });
}

// ─── TimeZone: save all ───
function saveAllZones() {
  // เก็บข้อมูลทุก zone
  const zones = [];
  document.querySelectorAll('#page-timezone .zone-card').forEach(function(card) {
    const useBtn  = card.querySelector('.zone-use-btn');
    const timeEl  = card.querySelector('.zone-time');
    const mlInp   = card.querySelector('.zone-ml-input');
    const plantEl = card.querySelector('.zone-plant');
    const ghEl    = card.querySelector('.zone-gh');
    zones.push({
      active : useBtn  ? useBtn.classList.contains('active') : false,
      time   : timeEl  ? timeEl.textContent.trim()          : '08:00',
      ml     : mlInp   ? mlInp.value                        : '100',
      plant  : plantEl ? plantEl.textContent.trim()         : '',
      gh     : ghEl    ? ghEl.textContent.trim()            : ''
    });
  });

  const waterEl = document.getElementById('tz-water-amount');
  const flowEl  = document.getElementById('tz-flow-rate');

  localStorage.setItem('tz_all_zones', JSON.stringify({
    zones      : zones,
    waterAmount: waterEl ? waterEl.value : '800',
    flowRate   : flowEl  ? flowEl.value  : '62'
  }));

  // visual feedback
  const btn  = document.querySelector('.btn-save-all');
  const orig = btn.textContent;
  btn.textContent      = '✅ บันทึกแล้ว!';
  btn.style.background = '#58a6ff';
  setTimeout(() => {
    btn.textContent      = orig;
    btn.style.background = '';
  }, 1800);
}

// ─── Water Level Calibration ───
function updateWaterStatus() {
  const cur  = 77.6; // mock current value (replace with real sensor later)
  const max  = parseFloat(document.getElementById('water-max')?.value) || 100;
  const min  = parseFloat(document.getElementById('water-min')?.value) || 15;
  const bar  = document.getElementById('water-preview-bar');
  const lbl  = document.getElementById('water-status-label');
  const minL = document.getElementById('water-min-label');
  const maxL = document.getElementById('water-max-label');

  if (bar) { bar.style.width = cur + '%'; }
  if (minL) minL.textContent = `⚠️ ต่ำสุด: ${min}%`;
  if (maxL) maxL.textContent = `✅ สูงสุด: ${max}%`;

  // Update status label
  if (lbl) {
    if (cur >= max) {
      lbl.textContent = 'น้ำเต็ม / ล้น';
      lbl.style.color = '#58a6ff';
      if (bar) bar.style.background = '#58a6ff';
    } else if (cur <= min) {
      lbl.textContent = 'น้ำน้อยวิกฤต!';
      lbl.style.color = '#f0883e';
      if (bar) bar.style.background = '#f0883e';
    } else {
      lbl.textContent = 'ปกติ';
      lbl.style.color = '#3fb950';
      if (bar) bar.style.background = '#3fb950';
    }
  }

  // Save to localStorage so alarm page can read
  const saved = JSON.parse(localStorage.getItem('water_calib') || '{}');
  localStorage.setItem('water_calib', JSON.stringify({ ...saved, max, min }));
}

function saveWaterCalib(btn) {
  try {
    // บันทึกค่าน้ำโดยตรงไม่ขึ้นกับฟังก์ชันอื่น
    var maxEl = document.getElementById('water-max');
    var minEl = document.getElementById('water-min');
    var maxVal = maxEl ? maxEl.value : '100';
    var minVal = minEl ? minEl.value : '15';

    localStorage.setItem('water_level_max', maxVal);
    localStorage.setItem('water_level_min', minVal);

    // อัปเดต status label
    var lbl = document.getElementById('water-status-label');
    if (lbl) {
      var cur = 77.6;
      var maxN = parseFloat(maxVal) || 100;
      var minN = parseFloat(minVal) || 15;
      if (cur >= maxN)      { lbl.textContent = 'น้ำเต็ม / ล้น';   lbl.style.color = '#58a6ff'; }
      else if (cur <= minN) { lbl.textContent = 'น้ำน้อยวิกฤต!';  lbl.style.color = '#f0883e'; }
      else                  { lbl.textContent = 'ปกติ';             lbl.style.color = '#3fb950'; }
    }

    // visual feedback
    var orig = btn.textContent;
    btn.textContent      = '✅ บันทึกแล้ว!';
    btn.style.background = '#58a6ff';
    setTimeout(function() {
      btn.textContent      = orig;
      btn.style.background = '';
    }, 1800);

  } catch(e) {
    alert('เกิดข้อผิดพลาด: ' + e.message);
  }
}

// ─── Init: navigate to hash or default ───
const initHash = location.hash.replace('#', '');
const initPage = (initHash && pages[initHash]) ? initHash : 'manual';
navigate(initPage);

// Load all saved calibration values on startup
loadAllCalib();
updateWaterStatus();
