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
  var scenarioMessages = {
    1: '4 files successfully processed: 2 buildings, 4 providers, and 40 accounts are awaiting review before 40 new bills can be added.',
    2: '2 files successfully processed: 2 buildings, 2 providers, and 20 accounts are awaiting review before 20 new bills can be added.',
    3: '4 files successfully processed: 2 buildings, 4 providers, and 4 accounts are awaiting review before 4 new bills can be added.'
  };
  var scenario = protoState.currentScenario || 1;
  document.getElementById('uploadAlert').classList.add('alert-banner--review');
  document.getElementById('uploadAlertIcon').className = 'fa-solid fa-clipboard-check alert-banner-icon';
  document.getElementById('uploadAlertTitle').textContent = 'Action required';
  document.getElementById('uploadAlertSub').textContent = scenarioMessages[scenario];
  document.getElementById('uploadAlertEnd').innerHTML = '<button class="alert-banner-review-btn" onclick="goToReviewBuildings()">Review</button>';
}

/* ── Scenario dropdown ───────────────────────────── */
var filesAdded = false;

function toggleScenarioDropdown(event) {
  if (event) event.stopPropagation();
  if (filesAdded) return;
  var dropdown = document.getElementById('scenarioDropdown');
  if (dropdown) dropdown.classList.toggle('open');
}

function _closeScenarioDropdown() {
  var dropdown = document.getElementById('scenarioDropdown');
  if (dropdown) dropdown.classList.remove('open');
}

document.addEventListener('click', _closeScenarioDropdown);

/* ── Scenario file lists ─────────────────────────── */
var SCENARIO_FILES = {
  1: [
    'Summit_Ridge_Energy_2025_Invoice.csv',
    'BluePeak_Gas_2025_Invoice.csv',
    'SW_Water_Authority_2025_Invoice.csv',
    'Clark_Wastewater_2025_Invoice.csv'
  ],
  2: [
    'Maritime_Energy_2025_Invoice_Electric_Gas.csv',
    'City_Municipal_Services_2025_Invoice_Water_Sewer.csv'
  ],
  3: [
    'Consolidated_Edison_2025_Invoice.csv',
    'Metro_Gas_Co_2025_Invoice.csv',
    'SW_Water_Authority_2025_Invoice.csv',
    'Clark_Wastewater_2025_Invoice.csv'
  ]
};

function pickScenario(n) {
  protoState.currentScenario = n;
  _closeScenarioDropdown();
  if (filesAdded) return;
  filesAdded = true;

  var zone = document.getElementById('uploadZone');
  zone.style.borderColor = 'var(--cta-primary-bg)';
  zone.style.background  = '#c5e6ef';

  setTimeout(function() {
    zone.style.borderColor = '';
    zone.style.background  = '';

    var files = SCENARIO_FILES[n] || SCENARIO_FILES[1];
    document.getElementById('fileList').innerHTML = files.map(function(name, i) {
      return '<div class="file-row" id="fileRow' + (i + 1) + '">' +
        '<div class="file-display">' +
          '<div class="file-display-icon"><i class="fa-regular fa-file"></i></div>' +
          '<span class="file-display-name">' + name + '</span>' +
        '</div>' +
        '<button class="file-remove" onclick="removeFile(' + (i + 1) + ')" title="Remove file">' +
          '<i class="fa-solid fa-xmark"></i>' +
        '</button>' +
      '</div>';
    }).join('');

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
  filesAdded = false;
  document.getElementById('fileList').innerHTML = '';
  document.getElementById('fileList').style.display      = 'none';
  document.getElementById('uploadActions').style.display = 'none';
  document.getElementById('uploadSteps').style.display   = 'flex';
  _closeScenarioDropdown();
}
