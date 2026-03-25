/* ── Submit bills ────────────────────────────────── */
function submitBills() {
  goToUtilities();
  document.getElementById('uploadAlert').classList.add('visible');
}

function dismissAlert() {
  document.getElementById('uploadAlert').classList.remove('visible');
}

function completeProcessing() {
  var banner = document.getElementById('uploadAlert');
  var icon   = document.getElementById('uploadAlertIcon');
  var text   = document.getElementById('uploadAlertText');
  var btn    = document.getElementById('uploadAlertCompleteBtn');
  banner.classList.add('alert-banner--warning');
  icon.className = 'fa-solid fa-triangle-exclamation alert-banner-icon';
  text.innerHTML = '1 building, 2 providers, and 2 accounts require review before 24 new bills can be added. <a href="#" onclick="goToReviewBuildings(); return false;" style="color:var(--hyperlink);font-weight:600;">Start the review here.</a>';
  btn.style.display = 'none';
}

/* ── Upload simulation ───────────────────────────── */
var filesAdded = false;

function simulateUpload() {
  if (filesAdded) return;
  filesAdded = true;
  var zone = document.getElementById('uploadZone');
  zone.style.borderColor = 'var(--cta-primary-bg)';
  zone.style.background  = '#c5e6ef';
  setTimeout(function() {
    zone.style.borderColor = '';
    zone.style.background  = '';
    document.getElementById('fileList').style.display    = 'flex';
    document.getElementById('uploadActions').style.display = 'flex';
  }, 280);
}

function removeFile(num) {
  var row = document.getElementById('fileRow' + num);
  if (row) row.remove();
  if (!document.querySelectorAll('#fileList .file-row').length) {
    document.getElementById('fileList').style.display    = 'none';
    document.getElementById('uploadActions').style.display = 'none';
    filesAdded = false;
  }
}

function resetUploadState() {
  filesAdded = false;
  document.getElementById('fileList').innerHTML = `
    <div class="file-row" id="fileRow1">
      <div class="file-display">
        <div class="file-display-icon"><i class="fa-regular fa-file"></i></div>
        <span class="file-display-name">Maritime_Energy_Invoice_123456.csv</span>
      </div>
      <button class="file-remove" onclick="removeFile(1)" title="Remove file">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
    <div class="file-row" id="fileRow2">
      <div class="file-display">
        <div class="file-display-icon"><i class="fa-regular fa-file"></i></div>
        <span class="file-display-name">Maritime_Gas_Invoice_123456.csv</span>
      </div>
      <button class="file-remove" onclick="removeFile(2)" title="Remove file">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>`;
  document.getElementById('fileList').style.display    = 'none';
  document.getElementById('uploadActions').style.display = 'none';
}
