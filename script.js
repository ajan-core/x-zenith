const uploadPortal = document.getElementById('uploadPortal');
const hiddenUpload = document.getElementById('hiddenUpload');
const progressWrap = document.getElementById('progressWrap');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const directDownload = document.getElementById('directDownload');
const viewportVideo = document.getElementById('viewportVideo');
const videoMeta = document.getElementById('videoMeta');
const terminal = document.getElementById('terminal');
const hexGrid = document.getElementById('hexGrid');

const SAMPLE_VIDEO = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
let activeVideoUrl = SAMPLE_VIDEO;

for (let i = 0; i < 35; i += 1) {
  const tile = document.createElement('button');
  tile.className = 'hex-tile';
  tile.type = 'button';
  tile.setAttribute('aria-label', `Play fragment ${i + 1}`);
  tile.addEventListener('click', () => activateTile(tile, i + 1));
  hexGrid.appendChild(tile);
}

function appendLog(message) {
  const line = document.createElement('div');
  line.textContent = `› ${message}`;
  terminal.appendChild(line);
}

function activateTile(tile, index) {
  document.querySelectorAll('.hex-tile.active').forEach((node) => node.classList.remove('active'));
  tile.classList.add('active');

  viewportVideo.src = SAMPLE_VIDEO;
  activeVideoUrl = SAMPLE_VIDEO;
  viewportVideo.play().catch(() => {});

  videoMeta.textContent = `[FRAGMENT_${String(index).padStart(2, '0')}]: LINKED | USER: CORE_USER`;
  appendLog(`[ADMIN_01] Fragment ${index} routed to viewport and playback started.`);
}

uploadPortal.addEventListener('click', () => hiddenUpload.click());

hiddenUpload.addEventListener('change', () => {
  const [file] = hiddenUpload.files;
  if (!file) return;

  progressWrap.classList.remove('hidden');
  let progress = 0;
  progressFill.style.width = '0%';
  progressText.textContent = '0%';
  appendLog(`Upload accepted from CORE_USER: ${file.name}`);

  const timer = setInterval(() => {
    progress = Math.min(progress + 8, 100);
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `${progress}%`;

    if (progress >= 100) {
      clearInterval(timer);
      const localUrl = URL.createObjectURL(file);
      viewportVideo.src = localUrl;
      activeVideoUrl = localUrl;
      videoMeta.textContent = `[FRAGMENT_UPLINK]: ${file.name} | AUTH: ADMIN_01`;
      appendLog('[ADMIN_01] Upload stream complete. Viewport source updated.');
    }
  }, 120);
});

directDownload.addEventListener('click', () => {
  if (!activeVideoUrl) {
    appendLog('[ADMIN_01] No active video available for download.');
    return;
  }

  const a = document.createElement('a');
  a.href = activeVideoUrl;
  a.download = `nexus-fragment-${Date.now()}.mp4`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  appendLog('[CORE_USER] Direct download trigger engaged. Save-As dispatched.');
});

viewportVideo.src = SAMPLE_VIDEO;
videoMeta.textContent = '[FRAGMENT_00]: SAMPLE FEED READY';
