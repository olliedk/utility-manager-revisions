/* ── Screen navigation ───────────────────────────── */
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
  document.getElementById('screenReviewComplete').classList.remove('active');
  document.getElementById('screenUtilities').classList.add('active');
  // Restore review-required banner
  var banner = document.getElementById('uploadAlert');
  banner.classList.add('visible', 'alert-banner--review');
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
}

function goBackToReviewBuildings() {
  document.getElementById('screenReviewProviders').classList.remove('active');
  document.getElementById('screenReviewBuildings').classList.add('active');
}

/* ── Review Fields screen ────────────────────────── */
function goToReviewFields() {
  document.getElementById('screenReviewProviders').classList.remove('active');
  document.getElementById('screenReviewFields').classList.add('active');
}

function goBackToReviewProviders() {
  document.getElementById('screenReviewFields').classList.remove('active');
  document.getElementById('screenReviewProviders').classList.add('active');
}

/* ── Review Accounts screen ──────────────────────── */
function goToReviewAccounts() {
  document.getElementById('screenReviewFields').classList.remove('active');
  document.getElementById('screenReviewAccounts').classList.add('active');
}

function goBackToReviewFields() {
  document.getElementById('screenReviewAccounts').classList.remove('active');
  document.getElementById('screenReviewFields').classList.add('active');
}

/* ── Review Complete screen ──────────────────────── */
function goToReviewComplete() {
  document.getElementById('screenReviewAccounts').classList.remove('active');
  document.getElementById('screenReviewComplete').classList.add('active');
}

function doneReviewComplete() {
  document.getElementById('screenReviewComplete').classList.remove('active');
  document.getElementById('screenUtilities').classList.add('active');
}

function goToBulkUploadFromComplete() {
  document.getElementById('screenReviewComplete').classList.remove('active');
  document.getElementById('screenBulkUpload').classList.add('active');
  resetUploadState();
}

/* ── Review Fields Detail screen ────────────────── */
var _reviewFieldsProviders = [
  'Maritime Energy (Electric)',
  'Maritime Energy (Natural Gas)'
];

function goToReviewFieldsDetail(providerIndex) {
  document.querySelectorAll('.review-fields-detail-provider').forEach(function(el, i) {
    el.style.display = (i === providerIndex) ? 'flex' : 'none';
  });
  var name = _reviewFieldsProviders[providerIndex] || 'Provider';
  var title = name + ' data fields';
  document.getElementById('reviewFieldsDetailTitle').textContent = title;
  document.getElementById('reviewFieldsDetailBreadcrumb').textContent = title;
  document.getElementById('screenReviewFieldsDetail').dataset.providerIndex = providerIndex;
  var total = document.querySelectorAll('.review-fields-detail-provider').length;
  var saveNext = document.getElementById('fieldsDetailSaveNext');
  if (saveNext) saveNext.style.display = (providerIndex + 1 < total) ? '' : 'none';
  document.getElementById('screenReviewFields').classList.remove('active');
  document.getElementById('screenReviewFieldsDetail').classList.add('active');
}

function goBackToReviewFieldsSummary() {
  document.getElementById('screenReviewFieldsDetail').classList.remove('active');
  document.getElementById('screenReviewFields').classList.add('active');
}

function saveAndNextProviderFields() {
  var screen = document.getElementById('screenReviewFieldsDetail');
  var current = parseInt(screen.dataset.providerIndex || '0', 10);
  _markFieldsRowReviewed(current);
  var total = document.querySelectorAll('.review-fields-detail-provider').length;
  if (current + 1 < total) {
    goToReviewFieldsDetail(current + 1);
  } else {
    goBackToReviewFieldsSummary();
  }
}
