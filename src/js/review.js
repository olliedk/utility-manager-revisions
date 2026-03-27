/* ── Review Buildings row dropdown menus ────────── */
function toggleRowMenu(event, menuId) {
  event.stopPropagation();
  var menu = document.getElementById(menuId);
  var isOpen = menu.classList.contains('open');
  // Close all row menus
  document.querySelectorAll('.review-row-menu').forEach(function(m) { m.classList.remove('open'); });
  if (!isOpen) menu.classList.add('open');
}

document.addEventListener('click', function() {
  document.querySelectorAll('.review-row-menu').forEach(function(m) { m.classList.remove('open'); });
  closeFieldDropdown();
  document.querySelectorAll('.review-multiselect-dropdown.open').forEach(function(d) { d.classList.remove('open'); });
});

/* ── Map address modal ───────────────────────────── */
function openMapAddressModal() {
  document.querySelectorAll('.review-row-menu').forEach(function(m) { m.classList.remove('open'); });
  document.getElementById('mapAddressModalOverlay').classList.add('open');
}

function closeMapAddressModal() {
  document.getElementById('mapAddressModalOverlay').classList.remove('open');
}

/* ── Ignore address modal ────────────────────────── */
function openIgnoreAddressModal() {
  document.querySelectorAll('.review-row-menu').forEach(function(m) { m.classList.remove('open'); });
  document.getElementById('ignoreAddressModalOverlay').classList.add('open');
}

function closeIgnoreAddressModal() {
  document.getElementById('ignoreAddressModalOverlay').classList.remove('open');
}

function handleModalOverlayClick(event, overlayId) {
  if (event.target === document.getElementById(overlayId)) {
    document.getElementById(overlayId).classList.remove('open');
  }
}

/* ── Review Buildings slideouts ─────────────────── */
function openReviewSlideout(type) {
  document.getElementById('reviewSlideoutOverlay').classList.add('open');
  if (type === 'existing') {
    document.getElementById('reviewExistingSlideout').classList.add('open');
    // Show "Save & Next" only if row 2 is not yet reviewed
    var row2 = document.getElementById('buildingRow2Badge');
    var hasNext = row2 && !row2.classList.contains('review-badge--reviewed');
    document.getElementById('buildingExistingSaveNext').style.display = hasNext ? '' : 'none';
  } else {
    document.getElementById('reviewNewSlideout').classList.add('open');
    // Row 2 is always last — "Save & Next" stays hidden
  }
}

function closeReviewSlideout() {
  document.getElementById('reviewSlideoutOverlay').classList.remove('open');
  document.getElementById('reviewExistingSlideout').classList.remove('open');
  document.getElementById('reviewNewSlideout').classList.remove('open');
}

function saveBuildingReview(type) {
  var rowNum = type === 'existing' ? 1 : 2;
  var badge = document.getElementById('buildingRow' + rowNum + 'Badge');
  if (badge) {
    badge.className = 'review-badge review-badge--reviewed';
    badge.textContent = 'Reviewed';
  }
  closeReviewSlideout();
}

function saveAndNextBuilding() {
  saveBuildingReview('existing');
  openReviewSlideout('new');
}

/* ── Review Fields detail ─────────────────────────── */
function saveFieldsDetail() {
  var idx = parseInt(document.getElementById('screenReviewFieldsDetail').dataset.providerIndex || '0', 10);
  _markFieldsRowReviewed(idx);
  goBackToReviewFieldsSummary();
}

function _markFieldsRowReviewed(idx) {
  var badge = document.getElementById('fieldsRow' + (idx + 1) + 'Badge');
  if (badge) {
    badge.className = 'review-badge review-badge--reviewed';
    badge.textContent = 'Reviewed';
  }
}

/* ── Review Fields toggles ────────────────────────── */
function toggleFieldsSection(bodyId, caretId) {
  var body = document.getElementById(bodyId);
  var icon = document.getElementById(caretId).querySelector('i');
  if (body.style.display === 'none') {
    body.style.display = 'flex';
    body.style.flexDirection = 'column';
    body.style.gap = '12px';
    icon.className = 'fa-solid fa-caret-up';
  } else {
    body.style.display = 'none';
    icon.className = 'fa-solid fa-caret-down';
  }
}

/* ── Field select dropdown ────────────────────────── */
function openFieldSelect(event, btn, fieldName) {
  event.stopPropagation();
  var dropdown = document.getElementById('fieldSelectDropdown');
  // Toggle off if same trigger
  if (dropdown._trigger === btn && dropdown.classList.contains('open')) {
    closeFieldDropdown();
    return;
  }
  closeFieldDropdown();
  // Position below trigger
  var rect = btn.getBoundingClientRect();
  dropdown.style.top  = (rect.bottom + 4) + 'px';
  dropdown.style.left = rect.left + 'px';
  dropdown.classList.add('open');
  dropdown._trigger = btn;
  btn.classList.add('active');
  btn.querySelector('i').className = 'fa-solid fa-caret-up';
  // Update Add custom text
  var addBtn = document.getElementById('fieldDropdownAddCustomBtn');
  addBtn.dataset.fieldName = fieldName;
  document.getElementById('fieldDropdownAddCustomText').textContent = 'Add custom ' + fieldName + ' field';
}

function closeFieldDropdown() {
  var dropdown = document.getElementById('fieldSelectDropdown');
  if (dropdown._trigger) {
    dropdown._trigger.classList.remove('active');
    dropdown._trigger.querySelector('i').className = 'fa-solid fa-caret-down';
    dropdown._trigger = null;
  }
  dropdown.classList.remove('open');
}

/* ── Add custom field slideout ────────────────────── */
function openAddCustomFieldSlideout(fieldName) {
  closeFieldDropdown();
  document.getElementById('customFieldNameInput').value = fieldName;
  document.getElementById('customFieldSlideoutOverlay').classList.add('open');
  document.getElementById('addCustomFieldSlideout').classList.add('open');
}

function closeAddCustomFieldSlideout() {
  document.getElementById('customFieldSlideoutOverlay').classList.remove('open');
  document.getElementById('addCustomFieldSlideout').classList.remove('open');
}

/* ── Review Providers slideouts ──────────────────── */
var _currentProviderRow = 0;
var _providerRowTypes   = {}; // populated by renderReviewProvidersGrid()

function openProviderSlideout(type, rowNum) {
  _currentProviderRow = rowNum || 1;
  document.getElementById('providerSlideoutOverlay').classList.add('open');
  if (type === 'pending') {
    document.getElementById('providerPendingSlideout').classList.add('open');
    var c = document.getElementById('pendingTrackingSections');
    if (c && !c.children.length) initTrackingSections('pending');
    var nextRow = _nextUnreviewedProviderRow(_currentProviderRow);
    document.getElementById('providerPendingSaveNext').style.display = nextRow ? '' : 'none';
  } else {
    document.getElementById('providerMissingSlideout').classList.add('open');
    var c = document.getElementById('missingTrackingSections');
    if (c && !c.children.length) initTrackingSections('missing');
    var nextRow = _nextUnreviewedProviderRow(_currentProviderRow);
    document.getElementById('providerMissingSaveNext') &&
      (document.getElementById('providerMissingSaveNext').style.display = nextRow ? '' : 'none');
  }
}

function _nextUnreviewedProviderRow(afterRow) {
  var total = Object.keys(_providerRowTypes).length;
  for (var n = afterRow + 1; n <= total; n++) {
    var badge = document.getElementById('providerRow' + n + 'Badge');
    if (badge && !badge.classList.contains('review-badge--reviewed')) return n;
  }
  return null;
}

function closeProviderSlideout() {
  document.getElementById('providerSlideoutOverlay').classList.remove('open');
  document.getElementById('providerPendingSlideout').classList.remove('open');
  document.getElementById('providerMissingSlideout').classList.remove('open');
}

function saveProvider(type) {
  if (type === 'missing' && !_validateMissingProvider()) return;
  updateProviderRowUtilityTypes(_currentProviderRow);
  _markProviderReviewed(_currentProviderRow);
  closeProviderSlideout();
}

function saveAndNextProvider() {
  var type = _providerRowTypes[_currentProviderRow] || 'pending';
  if (type === 'missing' && !_validateMissingProvider()) return;
  updateProviderRowUtilityTypes(_currentProviderRow);
  _markProviderReviewed(_currentProviderRow);
  closeProviderSlideout();
  var nextRow = _nextUnreviewedProviderRow(_currentProviderRow);
  if (nextRow) openProviderSlideout(_providerRowTypes[nextRow] || 'pending', nextRow);
}

function _markProviderReviewed(rowNum) {
  var badge = document.getElementById('providerRow' + rowNum + 'Badge');
  if (badge) {
    badge.className = 'review-badge review-badge--reviewed';
    badge.textContent = 'Reviewed';
  }
  // Enable Next only once no Missing data badges remain
  var stillMissing = document.querySelectorAll('#screenReviewProviders .review-badge--missing-data').length;
  document.getElementById('reviewProvidersNextBtn').disabled = stillMissing > 0;
}

function _validateMissingProvider() {
  var select = document.getElementById('billingFreqSelect');
  if (!select.value) {
    select.classList.add('review-form-select--error');
    document.getElementById('billingFreqError').style.display = '';
    document.getElementById('providerErrorAlert').style.display = '';
    return false;
  }
  return true;
}

function updateProviderRowUtilityTypes(rowNum) {
  var cell = document.getElementById('providerRow' + rowNum + 'UtilityCell');
  if (!cell) return;
  var type = _providerRowTypes[rowNum] || 'pending';
  var slideoutId = type;
  var dropdown = document.getElementById(slideoutId + 'UtilitySelectDropdown');
  var selected = [];
  dropdown.querySelectorAll('input[type="checkbox"]:checked').forEach(function(cb) {
    selected.push(cb.value);
  });
  cell.innerHTML = selected.length
    ? selected.map(function(type) {
        return '<span class="review-utility-type-entry"><i class="' + getUtilityTypeIcon(type) + '"></i><span>' + type + '</span></span>';
      }).join('')
    : '<span class="review-utility-type-entry"><span>—</span></span>';
}

function getUtilityTypeIcon(type) {
  return {
    'Electric':    'fa-solid fa-bolt',
    'Natural Gas': 'fa-solid fa-fire-flame-simple',
    'Water':       'fa-solid fa-water',
    'Sewage':      'fa-solid fa-faucet',
    'Other':       'fa-solid fa-circle-dot'
  }[type] || 'fa-solid fa-circle-dot';
}

/* ── Utility type multi-select ───────────────────── */
function toggleMultiselect(event, id) {
  event.stopPropagation();
  var dropdown = document.getElementById(id + 'Dropdown');
  document.querySelectorAll('.review-multiselect-dropdown').forEach(function(d) {
    if (d !== dropdown) d.classList.remove('open');
  });
  dropdown.classList.toggle('open');
}

function removeMultiselectTag(event, id, value) {
  event.stopPropagation();
  var dropdown = document.getElementById(id + 'Dropdown');
  dropdown.querySelectorAll('input[type="checkbox"]').forEach(function(cb) {
    if (cb.value === value) cb.checked = false;
  });
  onMultiselectChange(id);
}

function onMultiselectChange(id) {
  var tagsContainer = document.getElementById(id + 'Tags');
  var dropdown = document.getElementById(id + 'Dropdown');
  tagsContainer.innerHTML = '';
  var selectedValues = [];
  dropdown.querySelectorAll('input[type="checkbox"]').forEach(function(cb) {
    if (cb.checked) {
      selectedValues.push(cb.value);
      var tag = document.createElement('span');
      tag.className = 'review-multiselect-tag';
      tag.innerHTML =
        '<span class="review-multiselect-tag-text">' + cb.value + '</span>' +
        '<button class="review-multiselect-tag-remove" onclick="removeMultiselectTag(event,\'' + id + '\',\'' + cb.value + '\')">' +
        '<i class="fa-solid fa-xmark"></i></button>';
      tagsContainer.appendChild(tag);
    }
  });
  // Sync tracking sections for this slideout
  var slideoutId = id.replace('UtilitySelect', '');
  var container = document.getElementById(slideoutId + 'TrackingSections');
  if (container) syncTrackingSections(container, slideoutId, selectedValues);
}

/* ── Tracking sections (dynamic per utility type) ── */
function initTrackingSections(slideoutId) {
  var dropdown = document.getElementById(slideoutId + 'UtilitySelectDropdown');
  var container = document.getElementById(slideoutId + 'TrackingSections');
  var selectedTypes = [];
  dropdown.querySelectorAll('input[type="checkbox"]:checked').forEach(function(cb) {
    selectedTypes.push(cb.value);
  });
  syncTrackingSections(container, slideoutId, selectedTypes);
}

function syncTrackingSections(container, slideoutId, selectedTypes) {
  // Remove sections for deselected types
  Array.prototype.slice.call(container.querySelectorAll('.review-tracking-section')).forEach(function(section) {
    if (selectedTypes.indexOf(section.dataset.type) === -1) section.remove();
  });
  // Add sections for newly selected types, in selection order
  selectedTypes.forEach(function(type) {
    if (!container.querySelector('.review-tracking-section[data-type="' + type + '"]')) {
      var section = document.createElement('div');
      section.className = 'review-tracking-section';
      section.dataset.type = type;
      section.innerHTML = buildTrackingSectionHTML(slideoutId, type);
      container.appendChild(section);
    }
  });
}

function buildTrackingSectionHTML(slideoutId, type) {
  var slug = type.toLowerCase().replace(/\s+/g, '-');
  var p = slideoutId + '-' + slug; // prefix for IDs
  var cu = getDefaultConsumptionUnit(type);
  var du = getDefaultDemandUnit(type);

  return '' +
    '<div class="review-form-divider"></div>' +
    '<h2 class="review-track-heading">' + type + ' data tracking</h2>' +

    // Track consumption
    '<div class="review-toggle-item">' +
      '<label class="review-toggle">' +
        '<input type="checkbox" checked onchange="onTrackToggle(this, \'' + p + '-consumption-sub\')">' +
        '<span class="review-toggle-slider"></span>' +
      '</label>' +
      '<span class="review-toggle-item-label">Track consumption</span>' +
    '</div>' +
    '<div id="' + p + '-consumption-sub" class="review-tracking-sub-group">' +
      '<div class="review-form-field">' +
        '<div class="review-form-label">Consumption unit</div>' +
        '<input class="review-form-input" type="text" value="' + cu + '">' +
      '</div>' +
      '<div class="review-checkbox-row" style="padding-left:0">' +
        '<input type="checkbox" id="' + p + '-split-meter">' +
        '<label for="' + p + '-split-meter">Split consumption by meter</label>' +
      '</div>' +
    '</div>' +

    // Track EUI
    '<div class="review-toggle-item">' +
      '<label class="review-toggle">' +
        '<input type="checkbox" checked onchange="onTrackToggle(this, \'' + p + '-eui-sub\')">' +
        '<span class="review-toggle-slider"></span>' +
      '</label>' +
      '<span class="review-toggle-item-label">Track energy use intensity (EUI)</span>' +
    '</div>' +
    '<div id="' + p + '-eui-sub" class="review-tracking-sub-group">' +
      '<div class="review-form-field">' +
        '<div class="review-form-label">kBTU conversion factor</div>' +
        '<input class="review-form-input" type="text" value="3412.12">' +
      '</div>' +
    '</div>' +

    // Track demand
    '<div class="review-toggle-item">' +
      '<label class="review-toggle">' +
        '<input type="checkbox" checked onchange="onTrackToggle(this, \'' + p + '-demand-sub\')">' +
        '<span class="review-toggle-slider"></span>' +
      '</label>' +
      '<span class="review-toggle-item-label">Track demand</span>' +
    '</div>' +
    '<div id="' + p + '-demand-sub" class="review-tracking-sub-group">' +
      '<div class="review-form-field">' +
        '<div class="review-form-label">Demand unit</div>' +
        '<input class="review-form-input" type="text" value="' + du + '">' +
      '</div>' +
      '<div class="review-checkbox-row" style="padding-left:0">' +
        '<input type="checkbox" id="' + p + '-split-demand">' +
        '<label for="' + p + '-split-demand">Split demand by meter</label>' +
      '</div>' +
    '</div>';
}

function getDefaultConsumptionUnit(type) {
  return { 'Electric': 'kWh', 'Natural Gas': 'CCF', 'Water': 'Gallons', 'Sewage': 'Gallons', 'Other': '' }[type] || '';
}

function getDefaultDemandUnit(type) {
  return { 'Electric': 'kW', 'Natural Gas': '', 'Water': '', 'Sewage': '', 'Other': '' }[type] || '';
}

function onTrackToggle(checkbox, subId) {
  var sub = document.getElementById(subId);
  if (sub) sub.style.display = checkbox.checked ? 'flex' : 'none';
}

/* ── Billing frequency change (missing data slideout) */
function onBillingFreqChange(select) {
  if (!select.value) return;
  select.classList.remove('review-form-select--error');
  document.getElementById('billingFreqError').style.display = 'none';
  document.getElementById('providerErrorAlert').style.display = 'none';
}

/* ── Review Providers row dropdown menus ─────────── */
function toggleProviderRowMenu(event, menuId) {
  event.stopPropagation();
  var menu = document.getElementById(menuId);
  var isOpen = menu.classList.contains('open');
  document.querySelectorAll('.review-row-menu').forEach(function(m) { m.classList.remove('open'); });
  if (!isOpen) menu.classList.add('open');
}

/* ── Map name modal ───────────────────────────────── */
function openMapNameModal() {
  document.querySelectorAll('.review-row-menu').forEach(function(m) { m.classList.remove('open'); });
  document.getElementById('mapNameModalOverlay').classList.add('open');
}

function closeMapNameModal() {
  document.getElementById('mapNameModalOverlay').classList.remove('open');
}

/* ── Ignore provider modal ────────────────────────── */
function openIgnoreProviderModal() {
  document.querySelectorAll('.review-row-menu').forEach(function(m) { m.classList.remove('open'); });
  document.getElementById('ignoreProviderModalOverlay').classList.add('open');
}

function closeIgnoreProviderModal() {
  document.getElementById('ignoreProviderModalOverlay').classList.remove('open');
}

/* ── Review Accounts slideouts ──────────────────── */
var _currentAccountRow = 0;
var _accountRowTypes = {}; // populated by renderReviewAccountsGrid()

function openAccountSlideout(type, rowNum) {
  _currentAccountRow = rowNum;
  document.getElementById('accountSlideoutOverlay').classList.add('open');
  var saveNextId = type === 'pending' ? 'accountPendingSaveNext' : 'accountMissingSaveNext';
  if (type === 'pending') {
    document.getElementById('accountPendingSlideout').classList.add('open');
  } else {
    document.getElementById('accountMissingSlideout').classList.add('open');
  }
  var nextRow = _nextUnreviewedAccountRow(rowNum);
  document.getElementById(saveNextId).style.display = nextRow ? '' : 'none';
}

function _nextUnreviewedAccountRow(afterRow) {
  var total = Object.keys(_accountRowTypes).length;
  for (var n = afterRow + 1; n <= total; n++) {
    var badge = document.getElementById('accountRow' + n + 'Badge');
    if (badge && !badge.classList.contains('review-badge--reviewed')) return n;
  }
  return null;
}

function closeAccountSlideout() {
  document.getElementById('accountSlideoutOverlay').classList.remove('open');
  document.getElementById('accountPendingSlideout').classList.remove('open');
  document.getElementById('accountMissingSlideout').classList.remove('open');
}

function _markAccountRowReviewed(rowNum) {
  var badge = document.getElementById('accountRow' + rowNum + 'Badge');
  if (badge) {
    badge.className = 'review-badge review-badge--reviewed';
    badge.textContent = 'Reviewed';
  }
  var stillMissing = document.querySelectorAll('#screenReviewAccounts .review-badge--missing-data').length;
  var finishBtn = document.getElementById('reviewAccountsFinishBtn');
  if (finishBtn) finishBtn.disabled = stillMissing > 0;
}

function _validateMissingAccount() {
  var input = document.getElementById('missingBillTrackingInput');
  if (!input || !input.value.trim()) {
    input.closest('.review-form-input-wrap').classList.add('review-form-input-wrap--error');
    document.getElementById('missingBillTrackingError').style.display = 'flex';
    document.getElementById('accountMissingErrorAlert').style.display = 'flex';
    return false;
  }
  return true;
}

function saveAccount(type) {
  if (type === 'missing' && !_validateMissingAccount()) return;
  _markAccountRowReviewed(_currentAccountRow);
  closeAccountSlideout();
}

function saveAndNextAccount() {
  var type = _accountRowTypes[_currentAccountRow] || 'pending';
  if (type === 'missing' && !_validateMissingAccount()) return;
  _markAccountRowReviewed(_currentAccountRow);
  closeAccountSlideout();
  var nextRow = _nextUnreviewedAccountRow(_currentAccountRow);
  if (nextRow) openAccountSlideout(_accountRowTypes[nextRow], nextRow);
}

/* ── Review Sub-accounts ─────────────────────────── */
var _currentSubAccountRow = 0;
var _subAccountData = {}; // populated by renderReviewSubAccountsGrid()

function _nextUnreviewedSubAccountRow(afterRow) {
  var total = Object.keys(_subAccountData).length;
  for (var n = afterRow + 1; n <= total; n++) {
    var badge = document.getElementById('subAccountRow' + n + 'Badge');
    if (badge && !badge.classList.contains('review-badge--reviewed')) return n;
  }
  return null;
}

function openSubAccountSlideout(rowNum) {
  _currentSubAccountRow = rowNum;
  var data = _subAccountData[rowNum] || {};
  var numInput = document.getElementById('subAccountNumberInput');
  var buildingSelect = document.getElementById('subAccountBuildingSelect');
  if (numInput && data.num) numInput.value = data.num;
  if (buildingSelect && data.building) buildingSelect.value = data.building;
  document.getElementById('subAccountSlideoutTitle').textContent = 'Review sub-account';
  var nextRow = _nextUnreviewedSubAccountRow(rowNum);
  document.getElementById('subAccountSaveNext').style.display = nextRow ? '' : 'none';
  document.getElementById('subAccountSlideoutOverlay').classList.add('open');
  document.getElementById('subAccountSlideout').classList.add('open');
}

function closeSubAccountSlideout() {
  document.getElementById('subAccountSlideoutOverlay').classList.remove('open');
  document.getElementById('subAccountSlideout').classList.remove('open');
}

function saveSubAccount() {
  var badge = document.getElementById('subAccountRow' + _currentSubAccountRow + 'Badge');
  if (badge) {
    badge.className = 'review-badge review-badge--reviewed';
    badge.textContent = 'Reviewed';
  }
  closeSubAccountSlideout();
}

function saveAndNextSubAccount() {
  var badge = document.getElementById('subAccountRow' + _currentSubAccountRow + 'Badge');
  if (badge) {
    badge.className = 'review-badge review-badge--reviewed';
    badge.textContent = 'Reviewed';
  }
  closeSubAccountSlideout();
  var nextRow = _nextUnreviewedSubAccountRow(_currentSubAccountRow);
  if (nextRow) openSubAccountSlideout(nextRow);
}

function saveReviewSubAccounts() {
  // Find the row number of the active consolidated account
  var scenarioNum = protoState.currentScenario || 1;
  var ci = protoState.activeConsolidatedAccount || 0;
  var allRows = getScenarioAccountRows(scenarioNum);
  var rowNum = null;
  for (var i = 0; i < allRows.length; i++) {
    if (allRows[i].consolidated && allRows[i].consolidatedIndex === ci) {
      rowNum = allRows[i].rowNum;
      break;
    }
  }
  if (rowNum) {
    var badge = document.getElementById('accountRow' + rowNum + 'Badge');
    if (badge) {
      badge.className = 'review-badge review-badge--reviewed';
      badge.textContent = 'Reviewed';
    }
  }
  goBackToReviewAccounts();
}

function onBillTrackingStartChange(input) {
  if (!input.value.trim()) return;
  input.closest('.review-form-input-wrap').classList.remove('review-form-input-wrap--error');
  var addon = input.closest('.review-form-input-wrap').querySelector('.review-form-input-addon');
  if (addon) addon.classList.remove('review-form-input-addon--error');
  document.getElementById('missingBillTrackingError').style.display = 'none';
  document.getElementById('accountMissingErrorAlert').style.display = 'none';
  var label = document.getElementById('missingBillTrackingField').querySelector('.review-form-label');
  if (label) label.classList.remove('review-form-label--error');
}

function removeMeterEntry(btn) {
  var entry = btn.closest('.review-meter-entry');
  if (entry) entry.remove();
}

function addMeterEntry(containerId) {
  var container = document.getElementById(containerId);
  var entry = document.createElement('div');
  entry.className = 'review-meter-entry';
  entry.innerHTML =
    '<div class="review-form-row">' +
      '<div class="review-form-field">' +
        '<div class="review-form-label">Meter # <span class="review-form-label-required">*</span></div>' +
        '<input class="review-form-input" type="text" value="">' +
      '</div>' +
      '<button class="review-form-icon-btn" title="Remove meter" onclick="removeMeterEntry(this)"><i class="fa-solid fa-xmark"></i></button>' +
    '</div>' +
    '<div class="review-form-field">' +
      '<div class="review-form-label">Meter name</div>' +
      '<input class="review-form-input" type="text" value="">' +
    '</div>' +
    '<div class="review-form-row">' +
      '<div class="review-form-field">' +
        '<div class="review-form-label">Building <span class="review-form-label-required">*</span></div>' +
        '<select class="review-form-select">' +
          '<option value="">Select building</option>' +
          '<option value="main">Main building</option>' +
          '<option value="east">East Annex</option>' +
          '<option value="west">West Annex</option>' +
        '</select>' +
      '</div>' +
      '<div class="review-form-field">' +
        '<div class="review-form-label">Location</div>' +
        '<select class="review-form-select">' +
          '<option value=""></option>' +
          '<option value="first">First floor</option>' +
          '<option value="second">Second floor</option>' +
        '</select>' +
      '</div>' +
      '<button class="review-form-icon-btn" title="Add location"><i class="fa-solid fa-plus"></i></button>' +
    '</div>';
  container.appendChild(entry);
}

/* ── Review Fields Detail — ignore/include row toggle ── */
function toggleFieldRowIgnore(btn) {
  var row = btn.closest('.review-fields-row');
  var locationCell = row.querySelector('.review-fields-col--bill-location');
  var actionsCell = row.querySelector('.review-fields-col--row-actions');
  var isIgnored = row.classList.contains('review-fields-row--ignored');

  if (!isIgnored) {
    // Save current location HTML then switch to ignored state
    row.dataset.savedLocation = locationCell.innerHTML;
    locationCell.innerHTML =
      '<span class="review-fields-location-tag review-fields-location-tag--ignoring">' +
      '<i class="fa-solid fa-eye-slash"></i><span>Ignoring</span></span>';
    row.classList.add('review-fields-row--ignored');
    actionsCell.innerHTML =
      '<button class="review-fields-row-action-btn" title="Include" onclick="toggleFieldRowIgnore(this)">' +
      '<i class="fa-solid fa-circle-check"></i></button>';
  } else {
    // Restore saved location and switch back to included state
    locationCell.innerHTML = row.dataset.savedLocation;
    row.classList.remove('review-fields-row--ignored');
    actionsCell.innerHTML =
      '<button class="review-fields-row-action-btn" title="Edit"><i class="fa-regular fa-pen-to-square"></i></button>' +
      '<button class="review-fields-row-action-btn" title="Ignore" onclick="toggleFieldRowIgnore(this)">' +
      '<i class="fa-solid fa-circle-xmark"></i></button>';
  }
}
