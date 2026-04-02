/* ── Overlay / close helpers ────────────────────── */
function showOverlay() {
  var overlayEl = document.getElementById('overlay');
  overlayEl.classList.add('active');
}

function hideOverlay() {
  var overlayEl = document.getElementById('overlay');
  overlayEl.classList.remove('active');
}

function closeAll() {
  closeDropdown();
  closeFilter();
  closeExport();
  closeCardMenus();
  closeDataPopover();
  closePageSizeMenu();
  closeAccountsPageSizeMenu();
}

/* ── Actions dropdown (header) ───────────────────── */
function toggleDropdown() {
  var menu   = document.getElementById('actionsDropdown');
  var isOpen = menu.classList.contains('open');
  closeAll();
  if (!isOpen) {
    menu.classList.add('open');
    showOverlay();
  }
}

function closeDropdown() {
  document.getElementById('actionsDropdown').classList.remove('open');
  document.getElementById('emptyStateActionsDropdown').classList.remove('open');
}

function toggleEmptyStateDropdown() {
  var menu   = document.getElementById('emptyStateActionsDropdown');
  var isOpen = menu.classList.contains('open');
  closeAll();
  if (!isOpen) {
    menu.classList.add('open');
    showOverlay();
  }
}

function handleDropdownItem(action) {
  closeAll();
  hideOverlay();
  if (action === 'bulk-upload') goToBulkUpload();
  if (action === 'add-provider') goToAddProvider();
}

/* ── Filter popover ──────────────────────────────── */
function toggleFilter(e) {
  e.stopPropagation();
  var pop    = document.getElementById('filterPopover');
  var isOpen = pop.classList.contains('open');
  closeAll();
  if (!isOpen) {
    pop.classList.add('open');
    showOverlay();
  }
}

function closeFilter() {
  document.getElementById('filterPopover').classList.remove('open');
  hideOverlay();
}

/* ── Export dropdown ─────────────────────────────── */
function toggleExport(e) {
  e.stopPropagation();
  var dd     = document.getElementById('exportDropdown');
  var isOpen = dd.classList.contains('open');
  closeAll();
  if (!isOpen) {
    dd.classList.add('open');
    showOverlay();
  }
}

function closeExport() {
  document.getElementById('exportDropdown').classList.remove('open');
  hideOverlay();
}

/* ── Provider card menus ─────────────────────────── */
function toggleCardMenu(menuId, e) {
  e.stopPropagation();
  var menu   = document.getElementById(menuId);
  var isOpen = menu.classList.contains('open');
  closeAll();
  if (!isOpen) {
    menu.classList.add('open');
    showOverlay();
  }
}

function closeCardMenus() {
  document.querySelectorAll('.pcard-menu').forEach(function(m) {
    m.classList.remove('open');
  });
  hideOverlay();
}

/* ── Slideout (Customize bill export) ────────────── */
function openSlideout() {
  closeExport();
  document.getElementById('slideoutOverlay').classList.add('open');
  document.getElementById('slideoutPanel').classList.add('open');
}

function closeSlideout() {
  document.getElementById('slideoutOverlay').classList.remove('open');
  document.getElementById('slideoutPanel').classList.remove('open');
}

/* ── Retire provider slideout ────────────────────── */
var _CONSUMPTION_META = {
  'Electric': { track: 'Yes', unit: 'kWh',   demand: 'Yes' },
  'Gas':      { track: 'Yes', unit: 'CCF',   demand: 'No'  },
  'Water':    { track: 'Yes', unit: 'Gal',   demand: 'No'  },
  'Sewer':    { track: 'No',  unit: '\u2014', demand: 'No'  },
  'Other':    { track: 'No',  unit: '\u2014', demand: 'No'  }
};

function openRetireSlideout(idx, event) {
  event.stopPropagation();
  closeCardMenus();
  var p    = _retireProviders[idx];
  var meta = _CONSUMPTION_META[p.type] || { track: 'No', unit: '\u2014', demand: 'No' };
  var fields = [
    { label: 'Name',                            value: p.name     },
    { label: 'Utility type',                    value: p.type     },
    { label: 'Billing frequency',               value: p.period   },
    { label: 'Track consumption',               value: meta.track },
    { label: 'Consumption unit',                value: meta.unit  },
    { label: 'Split consumption by meter',      value: 'No'       },
    { label: 'Track energy use intensity (EUI)', value: 'No'      },
    { label: 'Track demand',                    value: meta.demand}
  ];
  var html = '';
  fields.forEach(function(f) {
    html += '<div class="retire-detail-field">' +
      '<span class="retire-detail-label">' + f.label + '</span>' +
      '<span class="retire-detail-value">' + f.value + '</span>' +
    '</div>';
  });
  document.getElementById('retireProviderDetails').innerHTML = html;
  document.getElementById('retireSlideoutOverlay').classList.add('open');
  document.getElementById('retireSlideoutPanel').classList.add('open');
}

function closeRetireSlideout() {
  document.getElementById('retireSlideoutOverlay').classList.remove('open');
  document.getElementById('retireSlideoutPanel').classList.remove('open');
}

function setDateRange(period) {
  var inputs = document.querySelectorAll('.slideout-date-range input');
  var today  = new Date();
  var fmt    = function(d) { return (d.getMonth()+1) + '/' + d.getDate() + '/' + d.getFullYear(); };
  var start  = new Date(today);

  if (period === 'all')   { inputs[0].value = '1/1/2025'; inputs[1].value = fmt(today); return; }
  if (period === 'year')  { start.setFullYear(start.getFullYear()-1); }
  if (period === 'month') { start.setMonth(start.getMonth()-1); }
  if (period === 'week')  { start.setDate(start.getDate()-7); }
  if (period === 'today') { start = new Date(today); }

  inputs[0].value = fmt(start);
  inputs[1].value = fmt(today);
}

/* ── Utilities view toggle (Providers / Bills) ───── */
function switchView(view) {
  var providerGrid = document.getElementById('providerGridContainer');
  var billsWrap    = document.getElementById('billsTableWrap');
  var providersBtn = document.getElementById('viewProvidersBtn');
  var billsBtn     = document.getElementById('viewBillsBtn');

  if (view === 'providers') {
    providerGrid.style.display = '';
    billsWrap.style.display    = 'none';
    providersBtn.classList.add('toolbar-view-btn--active');
    billsBtn.classList.remove('toolbar-view-btn--active');
  } else {
    providerGrid.style.display = 'none';
    billsWrap.style.display    = '';
    providersBtn.classList.remove('toolbar-view-btn--active');
    billsBtn.classList.add('toolbar-view-btn--active');
  }
  updateRecordCount();
}

/* ── Pagination navigation ───────────────────────── */
function goToPage(n) {
  var isProvidersView = document.getElementById('viewProvidersBtn').classList.contains('toolbar-view-btn--active');
  var total   = isProvidersView ? protoState.providerCount : protoState.billCount;
  var pages   = total === 0 ? 1 : Math.ceil(total / protoState.pageSize);
  var pageKey = isProvidersView ? 'providersPage' : 'billsPage';
  if (isNaN(n) || n < 1 || n > pages) {
    document.getElementById('pageInput').value = protoState[pageKey];
    return;
  }
  protoState[pageKey] = n;
  renderUtilities();
}

function prevPage() {
  var isProvidersView = document.getElementById('viewProvidersBtn').classList.contains('toolbar-view-btn--active');
  var curPage = isProvidersView ? protoState.providersPage : protoState.billsPage;
  if (curPage > 1) goToPage(curPage - 1);
}

function nextPage() {
  var isProvidersView = document.getElementById('viewProvidersBtn').classList.contains('toolbar-view-btn--active');
  var total   = isProvidersView ? protoState.providerCount : protoState.billCount;
  var curPage = isProvidersView ? protoState.providersPage : protoState.billsPage;
  var pages   = total === 0 ? 1 : Math.ceil(total / protoState.pageSize);
  if (curPage < pages) goToPage(curPage + 1);
}

/* ── Records per page ────────────────────────────── */
function togglePageSizeMenu(e) {
  e.stopPropagation();
  var menu   = document.getElementById('pageSizeMenu');
  var isOpen = menu.classList.contains('open');
  closeAll();
  if (!isOpen) menu.classList.add('open');
}

function closePageSizeMenu() {
  var menu = document.getElementById('pageSizeMenu');
  if (menu) menu.classList.remove('open');
}

function setPageSize(n) {
  protoState.pageSize = n;
  document.getElementById('pageSizeLabel').textContent = n;
  var items = document.querySelectorAll('.page-size-item');
  items.forEach(function(item) {
    item.classList.toggle('selected', parseInt(item.textContent) === n);
  });
  closePageSizeMenu();
  protoState.providersPage = 1;
  protoState.billsPage = 1;
  renderUtilities();
}

/* ── Sidebar nav ─────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.nav-item').forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      if (this.id === 'navUtilities') goToUtilities();
    });
  });
});

/* ── ESC key: close open slideouts and modals ───── */
document.addEventListener('keydown', function(e) {
  if (e.key !== 'Escape') return;
  closeRetireSlideout();
  closeSlideout();
  closeReviewSlideout();
  closeProviderSlideout();
  closeFieldEditSlideout();
  closeAddCustomFieldSlideout();
  closeFieldDropdown();
  closeMapAddressModal();
  closeIgnoreAddressModal();
  closeMapNameModal();
  closeIgnoreProviderModal();
  document.querySelectorAll('.review-row-menu').forEach(function(m) { m.classList.remove('open'); });
});
