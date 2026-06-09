/* ── Submit bills ────────────────────────────────── */
var SCENARIO_STATS = {
  1: { providers: 4, accounts: 40, bills: 40 },
  2: { providers: 2, accounts: 20, bills: 20 },
  3: { providers: 4, accounts: 22, bills: 4  }
};

function submitBills() {
  if (!protoState.currentScenario) protoState.currentScenario = 1;
  var scenario = protoState.currentScenario;
  var fileCount = protoState.firstUploadDone
    ? (SCENARIO_FILES_ROUND2[scenario] || SCENARIO_FILES_ROUND2[1]).length
    : (SCENARIO_FILES[scenario] || SCENARIO_FILES[1]).length;
  var banner = document.getElementById('uploadAlert');
  banner.classList.add('alert-banner--review');
  document.getElementById('uploadAlertIcon').className = 'fa-solid fa-circle-info alert-banner-icon';
  document.getElementById('uploadAlertTitle').textContent = '';
  document.getElementById('uploadAlertSub').textContent =
    fileCount + ' bill' + (fileCount !== 1 ? 's are' : ' is') +
    ' being processed. This can take several minutes. You’ll receive an email when processing is complete.';
  document.getElementById('uploadAlertEnd').innerHTML =
    '<button class="alert-banner-action" onclick="completeProcessing()" title="Simulate processing complete">Complete processing</button>' +
    '<button class="alert-banner-dismiss" onclick="dismissAlert()" title="Dismiss"><i class="fa-solid fa-xmark"></i></button>';
  goToUtilities();
  banner.classList.add('visible');
}

function dismissAlert() {
  document.getElementById('uploadAlert').classList.remove('visible', 'alert-banner--review');
}

function completeProcessing() {
  var scenario = protoState.currentScenario || 1;

  if (protoState.firstUploadDone) {
    // Second upload: no review required — show "X new bills added" banner
    var newBillCounts = { 1: 10, 2: 10, 3: 1 };
    var newCount = newBillCounts[scenario] || 10;
    protoState.billCount += newCount;
    protoState.billsPage = 1;
    renderUtilities();
    document.getElementById('uploadAlert').classList.add('alert-banner--review');
    document.getElementById('uploadAlertIcon').className = 'fa-solid fa-clipboard-check alert-banner-icon';
    document.getElementById('uploadAlertTitle').textContent = newCount + ' new bill' + (newCount !== 1 ? 's' : '') + ' added';
    document.getElementById('uploadAlertSub').textContent = 'These bills are ready for review and reporting.';
    document.getElementById('uploadAlertEnd').innerHTML =
      '<button class="alert-banner-action" onclick="switchView(\'bills\'); dismissAlert()">Review bills</button>' +
      '<button class="alert-banner-dismiss" onclick="dismissAlert()" title="Dismiss"><i class="fa-solid fa-xmark"></i></button>';
  } else {
    // First upload: providers/accounts/bills added immediately; review is optional.
    var fileCount = (SCENARIO_FILES[scenario] || SCENARIO_FILES[1]).length;
    var stats    = SCENARIO_STATS[scenario] || SCENARIO_STATS[1];
    protoState.providerCount = stats.providers;
    protoState.billCount     = stats.bills;
    protoState.providersPage = 1;
    protoState.billsPage     = 1;
    protoState.firstUploadDone = true;
    protoState.pendingReviewProviders = [];
    for (var pi = 0; pi < stats.providers; pi++) protoState.pendingReviewProviders.push(pi);
    renderUtilities();
    document.getElementById('uploadAlert').classList.add('alert-banner--review');
    document.getElementById('uploadAlertIcon').className = 'fa-solid fa-circle-info alert-banner-icon';
    document.getElementById('uploadAlertTitle').textContent =
      fileCount + ' bill' + (fileCount !== 1 ? 's' : '') + ' successfully processed';
    document.getElementById('uploadAlertSub').textContent =
      stats.providers + ' provider' + (stats.providers !== 1 ? 's' : '') + ', ' +
      stats.accounts  + ' account'  + (stats.accounts  !== 1 ? 's' : '') + ', and ' +
      stats.bills     + ' bill'     + (stats.bills     !== 1 ? 's were' : ' was') +
      ' added. They are ready for review and reporting.';
    document.getElementById('uploadAlertEnd').innerHTML =
      '<button class="alert-banner-action" onclick="goToReviewBuildings()">Start review</button>';
  }
}

/* ── Scenario dropdown ───────────────────────────── */
var filesAdded = false;

function toggleScenarioDropdown(event) {
  if (event) event.stopPropagation();
  if (filesAdded) return;
  if (protoState.firstUploadDone) {
    _pickSecondUpload();
    return;
  }
  var dropdown = document.getElementById('scenarioDropdown');
  if (dropdown) dropdown.classList.toggle('open');
}

function _closeScenarioDropdown() {
  var dropdown = document.getElementById('scenarioDropdown');
  if (dropdown) dropdown.classList.remove('open');
}

document.addEventListener('click', _closeScenarioDropdown);

function _pickSecondUpload() {
  var n = protoState.currentScenario || 1;
  var zone = document.getElementById('uploadZone');
  zone.style.borderColor = 'var(--cta-primary-bg)';
  zone.style.background  = '#c5e6ef';
  filesAdded = true;

  setTimeout(function() {
    zone.style.borderColor = '';
    zone.style.background  = '';

    var files = SCENARIO_FILES_ROUND2[n] || SCENARIO_FILES_ROUND2[1];
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

/* ── Scenario file lists ─────────────────────────── */
// Round 2: latest monthly bills — no new providers/accounts to review
var SCENARIO_FILES_ROUND2 = {
  1: [
    'Summit_Ridge_Lincoln_Elementary_Mar2026.csv',
    'Summit_Ridge_Washington_Middle_Mar2026.csv',
    'Summit_Ridge_Jefferson_High_Mar2026.csv',
    'Summit_Ridge_District_Admin_Mar2026.csv',
    'Summit_Ridge_Facilities_Depot_Mar2026.csv',
    'Summit_Ridge_Roosevelt_Elementary_Mar2026.csv',
    'Summit_Ridge_Hoover_Middle_Mar2026.csv',
    'Summit_Ridge_Kennedy_High_Mar2026.csv',
    'Summit_Ridge_Franklin_Elementary_Mar2026.csv',
    'Summit_Ridge_Adams_Middle_Mar2026.csv'
  ],
  2: [
    'Maritime_Energy_Lincoln_Elementary_Electric_Mar2026.csv',
    'Maritime_Energy_Washington_Middle_Electric_Mar2026.csv',
    'Maritime_Energy_Jefferson_High_Electric_Mar2026.csv',
    'Maritime_Energy_District_Admin_Electric_Mar2026.csv',
    'Maritime_Energy_Facilities_Depot_Electric_Mar2026.csv',
    'City_Municipal_Roosevelt_Elementary_Gas_Mar2026.csv',
    'City_Municipal_Hoover_Middle_Gas_Mar2026.csv',
    'City_Municipal_Kennedy_High_Gas_Mar2026.csv',
    'City_Municipal_Franklin_Elementary_Gas_Mar2026.csv',
    'City_Municipal_Adams_Middle_Gas_Mar2026.csv'
  ],
  3: [
    'Consolidated_Edison_All_Sites_Mar2026.csv'
  ]
};

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
  // Note: currentScenario and firstUploadDone are intentionally preserved
  filesAdded = false;
  document.getElementById('fileList').innerHTML = '';
  document.getElementById('fileList').style.display      = 'none';
  document.getElementById('uploadActions').style.display = 'none';
  document.getElementById('uploadSteps').style.display   = 'flex';
  _closeScenarioDropdown();
}
