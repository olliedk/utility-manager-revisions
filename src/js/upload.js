/* ── Submit bills ────────────────────────────────── */
function submitBills() {
  if (!protoState.currentScenario) protoState.currentScenario = 1;
  goToUtilities();
  document.getElementById('uploadAlert').classList.add('visible');
}

function dismissAlert() {
  document.getElementById('uploadAlert').classList.remove('visible');
}

function completeProcessing() {
  document.getElementById('uploadAlert').classList.add('alert-banner--review');
  document.getElementById('uploadAlertTitle').textContent = 'Action required';
  document.getElementById('uploadAlertSub').textContent = '2 files successfully processed: 2 buildings, 2 providers, and 2 accounts are awaiting review before 24 new bills can be added.';
  document.getElementById('uploadAlertEnd').innerHTML = '<button class="alert-banner-review-btn" onclick="goToReviewBuildings()">Review</button>';
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
    document.getElementById('uploadSteps').style.display   = 'none';
    document.getElementById('fileList').style.display      = 'flex';
    document.getElementById('uploadActions').style.display = 'flex';
  }, 280);
}

function removeFile(num) {
  var row = document.getElementById('fileRow' + num);
  if (row) row.remove();
  if (!document.querySelectorAll('#fileList .file-row').length) {
    document.getElementById('fileList').style.display      = 'none';
    document.getElementById('uploadActions').style.display = 'none';
    document.getElementById('uploadSteps').style.display   = 'flex';
    filesAdded = false;
  }
}

function resetUploadState() {
  protoState.currentScenario = null;
  renderScenarioSelector();
  filesAdded = false;
  document.getElementById('fileList').innerHTML = `
    <div class="file-row" id="fileRow1">
      <div class="file-display">
        <div class="file-display-icon"><i class="fa-regular fa-file"></i></div>
        <span class="file-display-name">Maritime_Energy_2025_Invoice_Energy.csv</span>
      </div>
      <button class="file-remove" onclick="removeFile(1)" title="Remove file">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
    <div class="file-row" id="fileRow2">
      <div class="file-display">
        <div class="file-display-icon"><i class="fa-regular fa-file"></i></div>
        <span class="file-display-name">Maritime_Energy_2025_Invoice_Gas.csv</span>
      </div>
      <button class="file-remove" onclick="removeFile(2)" title="Remove file">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>`;
  document.getElementById('fileList').style.display      = 'none';
  document.getElementById('uploadActions').style.display = 'none';
  document.getElementById('uploadSteps').style.display   = 'flex';
}
