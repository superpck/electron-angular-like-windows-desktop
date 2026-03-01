const { contextBridge, ipcRenderer } = require('electron');
const path = require('path');
const os = require('os');
const fs = require('fs');
const { execSync } = require('child_process');

// ── Step 1: expose IMMEDIATELY before anything else ──────────────────
// If this exists but electronAPI doesn't → preload loaded but crashed below
contextBridge.exposeInMainWorld('__preloadStep', { step: 'loaded' });

const LOG_PATH = path.join(os.tmpdir(), 'electron-preload-debug.log');

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  try { fs.appendFileSync(LOG_PATH, line); } catch (_) {}
  console.log('[preload]', msg);
}

log('preload start, LOG_PATH=' + LOG_PATH);

try {

let prevCpuSnapshot = null;

function takeCpuSnapshot() {
  const cpus = os.cpus();
  let totalIdle = 0;
  let totalTick = 0;
  for (const cpu of cpus) {
    for (const type of Object.keys(cpu.times)) {
      totalTick += cpu.times[type];
    }
    totalIdle += cpu.times.idle;
  }
  return { idle: totalIdle / cpus.length, total: totalTick / cpus.length };
}

function getCpuUsagePercent() {
  const current = takeCpuSnapshot();
  if (!prevCpuSnapshot) {
    prevCpuSnapshot = current;
    return 0;
  }
  const idleDiff = current.idle - prevCpuSnapshot.idle;
  const totalDiff = current.total - prevCpuSnapshot.total;
  prevCpuSnapshot = current;
  return totalDiff === 0 ? 0 : Math.max(0, Math.round((1 - idleDiff / totalDiff) * 100));
}

function getDiskVolumeName(device, mount) {
  // macOS: ask diskutil for the real volume name
  if (os.platform() === 'darwin') {
    try {
      const out = execSync(`diskutil info "${mount}" 2>/dev/null || diskutil info "${device}" 2>/dev/null`, { timeout: 3000 }).toString();
      const match = out.match(/Volume Name:\s*(.+)/);
      if (match) return match[1].trim();
    } catch (_) {}
  }
  // Linux / fallback: derive from mount path
  if (mount === '/') return 'Root';
  const parts = mount.split('/').filter(Boolean);
  return parts[parts.length - 1] || mount;
}

function getDiskInfo() {
  const disks = [];
  try {
    if (os.platform() === 'win32') {
      const out = execSync('wmic logicaldisk get caption,volumename,size,freespace /format:csv', { timeout: 3000 }).toString();
      for (const line of out.split('\n')) {
        const parts = line.trim().split(',');
        // caption, freespace, size, volumename (csv header order varies — use caption as name fallback)
        if (parts.length >= 4 && parts[1] && /^[A-Z]:$/.test(parts[1])) {
          const caption = parts[1];
          const free    = Number(parts[2]) || 0;
          const total   = Number(parts[3]) || 0;
          const volName = (parts[4] || '').trim();
          const name    = volName || `Drive (${caption})`;
          disks.push({ name, mount: caption, total, free });
        }
      }
    } else {
      // macOS / Linux
      const out = execSync("df -k | grep '^/dev'", { timeout: 3000 }).toString();
      for (const line of out.trim().split('\n')) {
        const cols = line.trim().split(/\s+/);
        if (cols.length >= 6) {
          const device = cols[0];
          const total  = Number(cols[1]) * 1024;
          const used   = Number(cols[2]) * 1024;
          const free   = Number(cols[3]) * 1024;
          const mount  = cols[5];
          const name   = getDiskVolumeName(device, mount);
          disks.push({ name, mount, total, free, used });
        }
      }
    }
  } catch (_) {}
  return disks;
}

contextBridge.exposeInMainWorld('electronAPI', {
  getSystemInfo: () => {
    const cpus = os.cpus();

    // Network interfaces — skip loopback
    const networkList = [];
    const nets = os.networkInterfaces();
    for (const [name, interfaces] of Object.entries(nets)) {
      for (const iface of interfaces) {
        if (!iface.internal) {
          networkList.push({
            name,
            address: iface.address,
            family: iface.family,
            mac: iface.mac,
          });
        }
      }
    }

    return {
      computer: {
        hostname: os.hostname(),
        os: `${os.type()} ${os.release()}`,
        platform: os.platform(),
        arch: os.arch(),
        uptime: os.uptime(), // seconds
      },
      cpu: {
        model: (cpus[0]?.model || 'Unknown').trim(),
        cores: cpus.length,
        speed: cpus[0]?.speed || 0, // MHz
        usage: getCpuUsagePercent(),
      },
      memory: {
        total: os.totalmem(),
        free: os.freemem(),
      },
      network: networkList,
      disks: getDiskInfo(),
      versions: {
        electron: process.versions.electron || '',
        node: process.versions.node || '',
        chrome: process.versions.chrome || '',
      },
    };
  },
  getPreloadDebug: () => ipcRenderer.invoke('get-preload-debug'),
});

log('electronAPI exposed OK');

} catch (err) {
  log('PRELOAD CRASH: ' + err.stack);
  // Still expose error info even if main API failed
  try {
    contextBridge.exposeInMainWorld('__preloadError', { message: String(err), stack: err.stack });
  } catch (_) {}
}
