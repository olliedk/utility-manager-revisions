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
  document.getElementById('screenUtilities').classList.add('active');
  // Ensure the warning banner is visible with the review link
  var banner = document.getElementById('uploadAlert');
  var icon   = document.getElementById('uploadAlertIcon');
  var text   = document.getElementById('uploadAlertText');
  var btn    = document.getElementById('uploadAlertCompleteBtn');
  banner.classList.add('visible', 'alert-banner--warning');
  icon.className = 'fa-solid fa-triangle-exclamation alert-banner-icon';
  text.innerHTML = '1 building, 2 providers, and 2 accounts require review before 24 new bills can be added. <a href="#" onclick="goToReviewBuildings(); return false;" style="color:var(--hyperlink);font-weight:600;">Start the review here.</a>';
  btn.style.display = 'none';
}

/* ── Review Providers screen ─────────────────────── */
function goToReviewProviders() {
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
  var total = document.querySelectorAll('.review-fields-detail-provider').length;
  if (current + 1 < total) {
    goToReviewFieldsDetail(current + 1);
  } else {
    goBackToReviewFieldsSummary();
  }
}
