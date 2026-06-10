// ─── Chart Manager ───────────────────────────────────────────────────────────
const ChartManager = {
  _charts: {},

  destroyAll() {
    Object.values(this._charts).forEach(c => { try { c.destroy(); } catch(e) {} });
    this._charts = {};
  },

  // อัปเดตจุดขวาสุด (ปัจจุบัน) ของกราฟโดยไม่สร้างใหม่ → ไม่กระพริบ
  updateLastPoint(canvasId, sensorKey, newValue) {
    const chart = this._charts[canvasId];
    if (!chart) return;
    const keys = ['temperature','humidity','waterLevel','ph','ec'];
    chart.data.datasets.forEach((ds, i) => {
      const k = sensorKey === 'all' ? keys[i] : sensorKey;
      if (k === sensorKey || sensorKey !== 'all') {
        const data = ds.data;
        if (data && data.length > 0) {
          data[data.length - 1] = parseFloat(newValue.toFixed(2));
        }
      }
    });
    chart.update('none'); // 'none' = ไม่มี animation → เส้นนิ่งสนิท
  },

  renderDetailChart(lot, sensor, range, canvasId) {
    // Generate time labels
    const n    = range === '24H' ? 24 : range === '7D' ? 7 : 30;
    const unit = range === '24H' ? 'h' : 'd';
    const now  = new Date();
    const labels = [];
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(now);
      if (unit === 'h') {
        d.setHours(d.getHours() - i);
        labels.push(String(d.getHours()).padStart(2,'0') + ':00');
      } else {
        d.setDate(d.getDate() - i);
        labels.push(`${d.getDate()}/${d.getMonth()+1}`);
      }
    }

    // Sensor config
    const allKeys = ['temperature','humidity','waterLevel','ph','ec'];
    const keys    = sensor === 'all' ? allKeys : [sensor];
    const colors  = {
      temperature: '#f0883e',
      humidity:    '#58a6ff',
      waterLevel:  '#3fb950',
      ph:          '#bc8cff',
      ec:          '#ffd700'
    };
    const names = {
      temperature: 'อุณหภูมิ (°C)',
      humidity:    'ความชื้น (%)',
      waterLevel:  'ระดับน้ำ (%)',
      ph:          'PH',
      ec:          'EC (mS/cm)'
    };

    // Build datasets — walk BACKWARD from current sensor value
    // so the last (rightmost) point always matches the card display
    const datasets = keys.map(k => {
      const currentVal = parseFloat((lot.sensors[k] || 0).toFixed(2));
      const spread = { temperature:2, humidity:4, waterLevel:3, ph:0.4, ec:0.3 }[k] || 1;
      const data = new Array(n);
      data[n - 1] = currentVal; // rightmost point = exact card value
      for (let i = n - 2; i >= 0; i--) {
        data[i] = parseFloat(clampValue(
          data[i + 1] + (Math.random() - 0.5) * spread * 0.6, k
        ).toFixed(2));
      }
      return {
        label: names[k],
        data,
        borderColor:     colors[k],
        backgroundColor: colors[k] + '22',
        pointRadius: n > 14 ? 0 : 2,
        tension: 0.38,
        fill: false,
        borderWidth: 1.8,
      };
    });

    function clampValue(v, k) {
      const ranges = { temperature:[10,50], humidity:[20,100], waterLevel:[0,100], ph:[3,10], ec:[0,7] };
      const [lo,hi] = ranges[k] || [0, 100];
      return Math.max(lo, Math.min(hi, v));
    }

    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    // Destroy previous chart on this canvas
    if (this._charts[canvasId]) {
      try { this._charts[canvasId].destroy(); } catch(e) {}
    }

    // ── Scrollable canvas width ──
    // 24H: each hour = 70px → 24×70 = 1680px
    // 7D:  each day  = 120px → 7×120 = 840px
    // 30D: each day  = 60px  → 30×60 = 1800px
    const pxPerPoint = range === '24H' ? 70 : range === '7D' ? 120 : 60;
    const canvasW    = Math.max(n * pxPerPoint, 600);
    const canvasH    = 250;

    canvas.style.width  = canvasW + 'px';
    canvas.style.height = canvasH + 'px';
    canvas.width  = canvasW;
    canvas.height = canvasH;

    // Scroll to rightmost (latest) on render
    const wrapper = canvas.parentElement;
    if (wrapper) {
      wrapper.style.overflowX = 'auto';
      setTimeout(() => { wrapper.scrollLeft = wrapper.scrollWidth; }, 80);
    }

    // Mouse drag-to-scroll
    if (wrapper && !wrapper._dragBound) {
      wrapper._dragBound = true;
      let isDown = false, startX = 0, scrollLeft = 0;
      wrapper.addEventListener('mousedown',  e => { isDown = true; startX = e.pageX - wrapper.offsetLeft; scrollLeft = wrapper.scrollLeft; });
      wrapper.addEventListener('mouseleave', () => { isDown = false; });
      wrapper.addEventListener('mouseup',    () => { isDown = false; });
      wrapper.addEventListener('mousemove',  e => { if (!isDown) return; e.preventDefault(); const x = e.pageX - wrapper.offsetLeft; wrapper.scrollLeft = scrollLeft - (x - startX); });
    }

    this._charts[canvasId] = new Chart(canvas, {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            labels: { color: '#94a3b8', font: { size: 11 }, boxWidth: 12, padding: 12 }
          },
          tooltip: {
            backgroundColor: '#132030',
            borderColor: 'rgba(255,255,255,.12)',
            borderWidth: 1,
            titleColor: '#f0f6fc',
            bodyColor: '#94a3b8',
            padding: 10,
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,.05)' },
            ticks: { color: '#64748b', font: { size: 10 } }
          },
          y: {
            grid: { color: 'rgba(255,255,255,.05)' },
            ticks: { color: '#64748b', font: { size: 10 } }
          }
        }
      }
    });
  }
};
