/* ── Screen navigation ───────────────────────────── */
function goToAddProvider() {
  document.querySelectorAll('.screen').forEach(function(s) { s.classList.remove('active'); });
  document.getElementById('screenAddProvider').classList.add('active');
}

function goToUtilitiesFromAddProvider() {
  document.getElementById('screenAddProvider').classList.remove('active');
  document.getElementById('screenUtilities').classList.add('active');
}

function goToBulkUploadFromAddProvider() {
  document.getElementById('screenAddProvider').classList.remove('active');
  document.getElementById('screenBulkUpload').classList.add('active');
  resetUploadState();
}

function goToBulkUpload() {
  document.getElementById('screenUtilities').classList.remove('active');
  document.getElementById('screenBulkUpload').classList.add('active');
  resetUploadState();
}

function goToUtilities() {
  document.getElementById('screenBulkUpload').classList.remove('active');
  document.getElementById('screenUtilities').classList.add('active');
}

/* ── Review Buildings screen ─────────────────────── */
function goToReviewBuildings() {
  document.getElementById('screenUtilities').classList.remove('active');
  document.getElementById('screenBulkUpload').classList.remove('active');
  document.getElementById('screenReviewBuildings').classList.add('active');
}

function exitReview() {
  document.getElementById('screenReviewBuildings').classList.remove('active');
  document.getElementById('screenReviewProviders').classList.remove('active');
  document.getElementById('screenReviewFields').classList.remove('active');
  document.getElementById('screenReviewFieldsDetail').classList.remove('active');
  document.getElementById('screenReviewAccounts').classList.remove('active');
  document.getElementById('screenReviewSubAccounts').classList.remove('active');
  document.getElementById('screenReviewComplete').classList.remove('active');
  document.getElementById('screenUtilities').classList.add('active');
  // Restore review-required banner
  var banner = document.getElementById('uploadAlert');
  banner.classList.add('visible', 'alert-banner--review');
  document.getElementById('uploadAlertIcon').className = 'fa-solid fa-clipboard-check alert-banner-icon';
  document.getElementById('uploadAlertTitle').textContent = 'Action required';
  document.getElementById('uploadAlertSub').textContent = '1 building, 2 providers, and 2 accounts require review before 24 new bills can be added.';
  document.getElementById('uploadAlertEnd').innerHTML = '<button class="alert-banner-review-btn" onclick="goToReviewBuildings()">Review</button>';
}

/* ── Review Providers screen ─────────────────────── */
function goToReviewProviders() {
  [1, 2].forEach(function(n) {
    var badge = document.getElementById('buildingRow' + n + 'Badge');
    if (badge) {
      badge.className = 'review-badge review-badge--reviewed';
      badge.textContent = 'Reviewed';
    }
  });
  document.getElementById('screenReviewBuildings').classList.remove('active');
  document.getElementById('screenReviewProviders').classList.add('active');
  renderReviewProvidersGrid();
}

function goBackToReviewBuildings() {
  document.getElementById('screenReviewProviders').classList.remove('active');
  document.getElementById('screenReviewBuildings').classList.add('active');
}

/* ── Review Fields screen ────────────────────────── */
function goToReviewFields() {
  document.getElementById('screenReviewProviders').classList.remove('active');
  document.getElementById('screenReviewFields').classList.add('active');
  renderReviewFieldsGrid();
}

function goBackToReviewProviders() {
  document.getElementById('screenReviewFields').classList.remove('active');
  document.getElementById('screenReviewProviders').classList.add('active');
}

/* ── Review Accounts screen ──────────────────────── */
function goToReviewAccounts() {
  document.getElementById('screenReviewFields').classList.remove('active');
  document.getElementById('screenReviewAccounts').classList.add('active');
  protoState.reviewAccountsPage = 1;
  renderReviewAccountsGrid();
}

function goBackToReviewFields() {
  document.getElementById('screenReviewAccounts').classList.remove('active');
  document.getElementById('screenReviewFields').classList.add('active');
}

/* ── Review Sub-accounts screen ─────────────────── */
function goToReviewSubAccounts(consolidatedIndex) {
  var ci = (typeof consolidatedIndex === 'number') ? consolidatedIndex : 0;
  protoState.activeConsolidatedAccount = ci;
  document.getElementById('screenReviewAccounts').classList.remove('active');
  document.getElementById('screenReviewSubAccounts').classList.add('active');
  renderReviewSubAccountsGrid(ci);
}

function goBackToReviewAccounts() {
  document.getElementById('screenReviewSubAccounts').classList.remove('active');
  document.getElementById('screenReviewAccounts').classList.add('active');
}

/* ── Review Complete screen ──────────────────────── */
function goToReviewComplete() {
  document.getElementById('screenReviewAccounts').classList.remove('active');
  document.getElementById('screenReviewComplete').classList.add('active');
}

function doneReviewComplete() {
  var scenarioCounts = {
    1: { providers: 4,  bills: 40 },
    2: { providers: 2,  bills: 20 },
    3: { providers: 4,  bills: 4  }
  };
  var counts = scenarioCounts[protoState.currentScenario] || scenarioCounts[1];
  protoState.providerCount = counts.providers;
  protoState.billCount     = counts.bills;
  protoState.providersPage = 1;
  protoState.billsPage     = 1;

  protoState.firstUploadDone = true;
  document.getElementById('screenReviewComplete').classList.remove('active');
  document.getElementById('screenUtilities').classList.add('active');
  document.getElementById('uploadAlert').classList.remove('visible', 'alert-banner--review');
  renderUtilities();
}

function goToBulkUploadFromComplete() {
  document.getElementById('screenReviewComplete').classList.remove('active');
  document.getElementById('screenBulkUpload').classList.add('active');
  resetUploadState();
}

/* ── Review Fields Detail screen ────────────────── */
var _reviewFieldsProviders = []; // populated by renderReviewFieldsGrid() via setReviewFieldsProviders()

function goToReviewFieldsDetail(providerIndex) {
  var panels = document.querySelectorAll('.review-fields-detail-provider');
  panels.forEach(function(el, i) {
    el.style.display = (i === providerIndex) ? 'flex' : 'none';
  });
  var name = _reviewFieldsProviders[providerIndex] || 'Provider';
  var title = name + ' data fields';
  document.getElementById('reviewFieldsDetailTitle').textContent = title;
  document.getElementById('reviewFieldsDetailBreadcrumb').textContent = title;
  document.getElementById('screenReviewFieldsDetail').dataset.providerIndex = providerIndex;
  var saveNext = document.getElementById('fieldsDetailSaveNext');
  if (saveNext) saveNext.style.display = (providerIndex + 1 < _reviewFieldsProviders.length) ? '' : 'none';
  document.getElementById('screenReviewFields').classList.remove('active');
  document.getElementById('screenReviewFieldsDetail').classList.add('active');
  var pageContent = document.getElementById('screenReviewFieldsDetail').querySelector('.page-content');
  if (pageContent) pageContent.scrollTop = 0;
}

function goBackToReviewFieldsSummary() {
  document.getElementById('screenReviewFieldsDetail').classList.remove('active');
  document.getElementById('screenReviewFields').classList.add('active');
}

function saveAndNextProviderFields() {
  var screen = document.getElementById('screenReviewFieldsDetail');
  var current = parseInt(screen.dataset.providerIndex || '0', 10);
  _markFieldsRowReviewed(current);
  if (current + 1 < _reviewFieldsProviders.length) {
    goToReviewFieldsDetail(current + 1);
  } else {
    goBackToReviewFieldsSummary();
  }
}
