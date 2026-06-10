// ─── Mock Sensor Simulation ──────────────────────────────────────────────────
function simulateSensorStep(sensors) {
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function walk(v, step, lo, hi) {
    return parseFloat(clamp(v + (Math.random() - 0.5) * step, lo, hi).toFixed(2));
  }
  return {
    ...sensors,
    temperature: walk(sensors.temperature, 0.4,  18, 44),
    humidity:    walk(sensors.humidity,    1.2,  35, 95),
    waterLevel:  walk(sensors.waterLevel,  0.6,   5, 100),
    ph:          walk(sensors.ph,          0.06,  4,   9),
    ec:          walk(sensors.ec,          0.06, 0.3,  6),
    lastUpdated: new Date().toISOString(),
  };
}
