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
  } else {
    document.getElementById('reviewNewSlideout').classList.add('open');
  }
}

function closeReviewSlideout() {
  document.getElementById('reviewSlideoutOverlay').classList.remove('open');
  document.getElementById('reviewExistingSlideout').classList.remove('open');
  document.getElementById('reviewNewSlideout').classList.remove('open');
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
function openProviderSlideout(type) {
  document.getElementById('providerSlideoutOverlay').classList.add('open');
  if (type === 'pending') {
    document.getElementById('providerPendingSlideout').classList.add('open');
    var c = document.getElementById('pendingTrackingSections');
    if (c && !c.children.length) initTrackingSections('pending');
  } else {
    document.getElementById('providerMissingSlideout').classList.add('open');
    var c = document.getElementById('missingTrackingSections');
    if (c && !c.children.length) initTrackingSections('missing');
  }
}

function closeProviderSlideout() {
  document.getElementById('providerSlideoutOverlay').classList.remove('open');
  document.getElementById('providerPendingSlideout').classList.remove('open');
  document.getElementById('providerMissingSlideout').classList.remove('open');
}

function saveProvider(slideoutId) {
  updateProviderRowUtilityTypes(slideoutId);
  closeProviderSlideout();
}

function saveAndNextProvider() {
  var pendingOpen = document.getElementById('providerPendingSlideout').classList.contains('open');
  updateProviderRowUtilityTypes(pendingOpen ? 'pending' : 'missing');
  closeProviderSlideout();
  if (pendingOpen) {
    openProviderSlideout('missing');
  }
  // If on missing (last provider), just close — nothing left to review
}

function updateProviderRowUtilityTypes(slideoutId) {
  var cellId = slideoutId === 'pending' ? 'providerRow1UtilityCell' : 'providerRow2UtilityCell';
  var cell = document.getElementById(cellId);
  if (!cell) return;
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
  // Remove error state from select
  select.classList.remove('review-form-select--error');
  // Hide field error message
  document.getElementById('billingFreqError').style.display = 'none';
  // Hide error alert at top of slideout
  document.getElementById('providerErrorAlert').style.display = 'none';
  // Update table row badge to Reviewed
  var badge = document.getElementById('providerRow2Badge');
  badge.className = 'review-badge review-badge--reviewed';
  badge.textContent = 'Reviewed';
  // Enable Next button
  document.getElementById('reviewProvidersNextBtn').disabled = false;
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
