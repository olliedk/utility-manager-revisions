/* ═══════════════════════════════════════════════════
   REVIEW RENDER
   DOM-writing functions for the review flow grids.
   Called on every navigation to a review screen so
   the correct scenario data is always shown.
═══════════════════════════════════════════════════ */

/* ── Providers grid ──────────────────────────────── */
function renderReviewProvidersGrid() {
  var container = document.getElementById('reviewProvidersGridBody');
  if (!container) return;

  var scenarioNum = protoState.currentScenario || 1;
  var rows = getScenarioProviderRows(scenarioNum);
  var html = '';

  // Reset global row maps used by slideout interactions
  _providerRowTypes = {};
  _providerRowData  = {};

  rows.forEach(function(row, i) {
    var stripe = i % 2 === 0 ? 'review-grid-row--white' : 'review-grid-row--striped';
    var badgeClass = row.status === 'missing' ? 'review-badge--missing-data' : 'review-badge--pending';
    var badgeText  = row.status === 'missing' ? 'Missing data' : 'Pending review';
    _providerRowTypes[row.rowNum] = row.status;
    _providerRowData[row.rowNum]  = row;

    var utilityHtml = row.utilities.map(function(u) {
      return '<span class="review-utility-type-entry"><i class="' + u.icon + '"></i><span>' + u.type + '</span></span>';
    }).join('');

    var missingClass = row.status === 'missing' ? ' review-grid-row--missing' : '';
    html +=
      '<div class="review-grid-row ' + stripe + missingClass + '">' +
        '<div class="review-grid-accent"></div>' +
        '<div class="review-grid-cell review-grid-cell--provider">' +
          '<span class="review-grid-link" onclick="openProviderSlideout(\'' + row.status + '\',' + row.rowNum + ')">' + row.name + '</span>' +
          '<span class="review-badge review-badge--new" style="margin-left:4px;">New</span>' +
        '</div>' +
        '<div class="review-grid-cell review-grid-cell--utility" id="providerRow' + row.rowNum + 'UtilityCell">' +
          utilityHtml +
        '</div>' +
        '<div class="review-grid-cell review-grid-cell--status">' +
          '<span class="review-badge ' + badgeClass + '" id="providerRow' + row.rowNum + 'Badge">' + badgeText + '</span>' +
        '</div>' +
        '<div class="review-grid-cell review-grid-cell--actions">' +
          '<button class="review-icon-btn" onclick="openProviderSlideout(\'' + row.status + '\',' + row.rowNum + ')" title="Review">' +
            '<i class="fa-solid fa-clipboard-check"></i>' +
          '</button>' +
          '<button class="review-icon-btn" onclick="toggleProviderRowMenu(event,\'rowMenuP' + row.rowNum + '\')" title="More options">' +
            '<i class="fa-solid fa-ellipsis"></i>' +
          '</button>' +
          '<div class="review-row-menu" id="rowMenuP' + row.rowNum + '" style="width:252px;">' +
            '<button class="review-row-menu-item" onclick="openMapNameModal()">' +
              '<i class="fa-regular fa-building"></i> Map name to existing provider' +
            '</button>' +
            '<button class="review-row-menu-item" onclick="openIgnoreProviderModal()">' +
              '<i class="fa-solid fa-circle-xmark"></i> Ignore provider name' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  });

  container.innerHTML = html;

  // Update pagination count (all provider rows fit on one page — 2–4 rows)
  var countEl = document.getElementById('reviewProvidersPaginationCount');
  if (countEl) countEl.textContent = 'Showing 1\u2013' + rows.length + ' of ' + rows.length + ' records.';

  // Update inline alerts
  var totalCount   = rows.length;
  var missingCount = rows.filter(function(r) { return r.status === 'missing'; }).length;

  var infoTextEl = document.getElementById('providersInfoAlertText');
  if (infoTextEl) {
    infoTextEl.textContent = totalCount + ' new provider' + (totalCount !== 1 ? 's have' : ' has') + ' been suggested as providers from your uploaded files couldn\'t be linked to existing ones.';
  }

  var errorAlert  = document.getElementById('providersErrorAlert');
  var errorTextEl = document.getElementById('providersErrorAlertText');
  if (errorAlert && errorTextEl) {
    if (missingCount > 0) {
      errorTextEl.textContent = missingCount + ' provider' + (missingCount !== 1 ? 's are' : ' is') + ' missing required data that is needed to submit.';
      errorAlert.style.display = '';
    } else {
      errorAlert.style.display = 'none';
    }
  }

  // Enable Next button only if no missing-data rows exist
  var nextBtn = document.getElementById('reviewProvidersNextBtn');
  if (nextBtn) {
    var stillMissing = document.querySelectorAll('#screenReviewProviders .review-badge--missing-data').length;
    nextBtn.disabled = stillMissing > 0;
  }

  // Update _reviewFieldsProviders for use in nav.js / goToReviewFieldsDetail
  var fieldRows = getScenarioFieldRows(scenarioNum);
  setReviewFieldsProviders(fieldRows.map(function(r) { return r.label; }));
}

/* ── Fields grid ─────────────────────────────────── */
function renderReviewFieldsGrid() {
  var container = document.getElementById('reviewFieldsGridBody');
  if (!container) return;

  var scenarioNum = protoState.currentScenario || 1;
  var rows = getScenarioFieldRows(scenarioNum);
  var html = '';

  rows.forEach(function(row, i) {
    var stripe = i % 2 === 0 ? 'review-grid-row--white' : 'review-grid-row--striped';
    html +=
      '<div class="review-grid-row ' + stripe + '">' +
        '<div class="review-grid-accent"></div>' +
        '<div class="review-grid-cell review-grid-cell--provider">' +
          '<span class="review-grid-link" onclick="goToReviewFieldsDetail(' + row.providerIndex + ')">' + row.label + '</span>' +
          '<span class="review-badge review-badge--new" style="margin-left:4px;">New</span>' +
        '</div>' +
        '<div class="review-grid-cell review-grid-cell--fields">' + row.fieldCount + '</div>' +
        '<div class="review-grid-cell review-grid-cell--status">' +
          '<span class="review-badge review-badge--pending" id="fieldsRow' + row.rowNum + 'Badge">Pending review</span>' +
        '</div>' +
        '<div class="review-grid-cell review-grid-cell--actions">' +
          '<button class="review-icon-btn" onclick="goToReviewFieldsDetail(' + row.providerIndex + ')" title="Review">' +
            '<i class="fa-solid fa-clipboard-check"></i>' +
          '</button>' +
        '</div>' +
      '</div>';
  });

  container.innerHTML = html;

  var countEl = document.getElementById('reviewFieldsPaginationCount');
  if (countEl) countEl.textContent = 'Showing 1\u2013' + rows.length + ' of ' + rows.length + ' records.';

  // Keep _reviewFieldsProviders in sync so detail navigation uses the right count
  setReviewFieldsProviders(rows.map(function(r) { return r.label; }));

  // Update summary alert counts
  var totalFields = rows.reduce(function(sum, r) { return sum + r.fieldCount; }, 0);
  var def = SCENARIO_DEFINITIONS[scenarioNum];
  var unmatchedCount = def ? def.providers.reduce(function(sum, p) { return sum + (p.consolidated ? 2 : 1); }, 0) : 0;
  var totalEl = document.getElementById('fieldsAlertTotal');
  if (totalEl) totalEl.textContent = totalFields + ' new data field' + (totalFields !== 1 ? 's' : '') + ' have been identified from your uploaded files.';
  var unmatchedEl = document.getElementById('fieldsAlertUnmatched');
  if (unmatchedEl) unmatchedEl.textContent = unmatchedCount + ' new data field' + (unmatchedCount !== 1 ? 's' : '') + ' could not be matched to an FMX field.';

  // Build dynamic detail panels for the drill-down screen
  renderReviewFieldsDetailPanels();
}

/* ── Fields detail panels ────────────────────────── */
var _UTILITY_SECTION_DATA = {
  'Electric':    { key: 'Elec',  title: 'Electric info',     rows: [
    { fmx: 'Meter consumption', location: 'mapped', billLoc: 'Electricity Usage', example: '4,210 kWh' },
    { fmx: 'Meter demand',      location: 'mapped', billLoc: 'Peak Demand',       example: '48.5 kW'   }
  ]},
  'Natural Gas': { key: 'Gas',   title: 'Natural Gas info',  rows: [
    { fmx: 'Meter consumption', location: 'mapped', billLoc: 'Gas Usage',         example: '284 CCF'   }
  ]},
  'Water':       { key: 'Water', title: 'Water info',        rows: [
    { fmx: 'Meter consumption', location: 'mapped', billLoc: 'Water Usage',       example: '14,820 Gal'}
  ]},
  'Sewer':       { key: 'Sewer', title: 'Sewer info',        rows: [
    { fmx: 'Meter consumption', location: 'mapped', billLoc: 'Sewer Volume',      example: '14,820 Gal'}
  ]}
};

var _PROVIDER_EXAMPLE_DATA = {
  'SRE': { acct: 'SRE-001001', amt: '$8,432.15',    tax: '$12.40' },
  'BPG': { acct: 'BPG-020234', amt: '$2,145.80',    tax: '$18.20' },
  'SWA': { acct: 'SWA-050001', amt: '$1,230.40',    tax: '$9.80'  },
  'CRW': { acct: 'CRW-080010', amt: '$890.15',      tax: '$7.50'  },
  'ME':  { acct: 'ME-847291',  amt: '$8,432.15',    tax: '$12.40' },
  'CMS': { acct: 'CMS-10042',  amt: '$1,230.40',    tax: '$9.80'  },
  'CE':  { acct: 'CE-000456-00', amt: '$103,730.53', tax: '$12.40' },
  'MG':  { acct: 'MG-001122-00', amt: '$45,221.10',  tax: '$18.20' }
};

function renderReviewFieldsDetailPanels() {
  var container = document.getElementById('reviewFieldsDetailPanels');
  if (!container) return;

  var scenarioNum = protoState.currentScenario || 1;
  var def = SCENARIO_DEFINITIONS[scenarioNum];
  if (!def) return;

  var html = '';
  def.providers.forEach(function(p, pi) {
    var ex = _PROVIDER_EXAMPLE_DATA[p.accountPrefix] || { acct: p.accountPrefix + '-000001', amt: '$1,000.00', tax: '$10.00' };
    var unmatched = p.utilities.some(function(u) { return u.type === 'Electric' || u.type === 'Natural Gas'; });

    // Panel wrapper
    html += '<div class="review-fields-detail-provider" id="detailProvider' + pi + '">';

    // Inline alert
    html +=
      '<div class="inline-alert">' +
        '<div class="inline-alert-tag inline-alert-tag--info">' +
          '<i class="fa-solid fa-circle-info"></i>' +
        '</div>' +
        '<div class="inline-alert-body inline-alert-body--info">' +
          '<div class="inline-alert-text">' +
            '<ul style="padding-left:18px;margin:0;line-height:20px;">' +
              '<li>' + p.fieldCount + ' new data fields have been identified from your uploaded files.</li>' +
              (unmatched ? '<li>1 new data field could not be matched to an FMX field.</li>' : '') +
            '</ul>' +
          '</div>' +
          '<button class="inline-alert-dismiss" onclick="this.closest(\'.inline-alert\').style.display=\'none\'"><i class="fa-solid fa-xmark"></i></button>' +
        '</div>' +
      '</div>';

    // Toolbar
    html +=
      '<div class="review-toolbar">' +
        '<div class="review-toolbar-left">' +
          '<div class="review-toolbar-search">' +
            '<input type="text" placeholder="">' +
            '<div class="review-toolbar-search-addon"><i class="fa-solid fa-magnifying-glass"></i></div>' +
          '</div>' +
          '<button class="review-toolbar-icon-btn"><i class="fa-solid fa-filter"></i><span>Filter</span></button>' +
          '<div class="review-toolbar-div"></div>' +
        '</div>' +
        '<div class="review-toolbar-right">' +
          '<button class="review-toolbar-icon-btn review-toolbar-icon-btn--inline" onclick="openAddCustomFieldSlideout(\'field\')">' +
            '<i class="fa-solid fa-plus"></i><span>Custom field</span>' +
          '</button>' +
          '<div class="review-toolbar-div"></div>' +
          '<button class="review-toolbar-icon-btn">' +
            '<span style="display:flex;gap:3px;align-items:center;line-height:16px;">' +
              '<i class="fa-solid fa-sort"></i>' +
              '<i class="fa-solid fa-caret-down" style="font-size:11px;"></i>' +
            '</span>' +
            '<span>Sort</span>' +
          '</button>' +
        '</div>' +
      '</div>';

    // General bill info section
    html += _buildFieldsSection(pi, 'Gen', 'General bill info', [
      { fmx: 'Account #',                location: 'mapped',    billLoc: 'Account ID',      example: ex.acct    },
      { fmx: 'Bill cycle',               location: 'mapped',    billLoc: 'Billing Period',   example: 'Feb 2026' },
      { fmx: 'Bill start date',          location: 'mapped',    billLoc: 'Bill Start',       example: '02/01/2026' },
      { fmx: 'Bill end date',            location: 'mapped',    billLoc: 'Bill End',         example: '02/28/2026' },
      { fmx: 'Total bill amount',        location: 'mapped',    billLoc: 'Total Amount Due', example: ex.amt     },
      { fmx: 'Total consumption charge', location: 'calc',      billLoc: '',                 example: '\u2014'   },
      { fmx: 'Late fee charge',          location: 'mapped',    billLoc: 'Late Fee',         example: '$0.00'    },
      { fmx: 'Tax charge',               location: 'ignoring',  billLoc: 'Tax',              example: ex.tax     },
      { fmx: 'Other charge',             location: 'unmatched', billLoc: '',                 example: '\u2014'   }
    ]);

    // One utility section per utility type
    p.utilities.forEach(function(u, ui) {
      var ud = _UTILITY_SECTION_DATA[u.type];
      if (!ud) return;
      html += _buildFieldsSection(pi, ud.key, ud.title, ud.rows);
    });

    // Sub-account info section (consolidated providers only)
    if (p.consolidated) {
      var subAcctNum = p.accountPrefix + '-' + (p.subAcctBase ? p.subAcctBase : '000001') + '-01';
      html += _buildFieldsSection(pi, 'SubAcct', 'Sub-account info', [
        { fmx: 'Account #',                location: 'mapped',    billLoc: 'Account ID',      example: subAcctNum },
        { fmx: 'Bill cycle',               location: 'mapped',    billLoc: 'Billing Period',   example: 'Dec 2024' },
        { fmx: 'Bill start date',          location: 'mapped',    billLoc: 'Bill Start',       example: '12/01/2024' },
        { fmx: 'Bill end date',            location: 'mapped',    billLoc: 'Bill End',         example: '12/31/2024' },
        { fmx: 'Total bill amount',        location: 'mapped',    billLoc: 'Total Amount Due', example: ex.amt     },
        { fmx: 'Total consumption charge', location: 'calc',      billLoc: '',                 example: '\u2014'   },
        { fmx: 'Late fee charge',          location: 'mapped',    billLoc: 'Late Fee',         example: '$0.00'    },
        { fmx: 'Tax charge',               location: 'ignoring',  billLoc: 'Tax',              example: ex.tax     },
        { fmx: 'Other charge',             location: 'unmatched', billLoc: '',                 example: '\u2014'   }
      ]);
    }

    html += '</div>';
  });

  container.innerHTML = html;
}

function _buildFieldsSection(pi, sectionKey, title, rows) {
  var bodyId  = 'p' + pi + sectionKey + 'Body';
  var caretId = 'p' + pi + sectionKey + 'Caret';

  var html =
    '<div class="review-fields-section">' +
      '<div class="review-fields-section-header" onclick="toggleFieldsSection(\'' + bodyId + '\',\'' + caretId + '\')">' +
        '<span class="review-fields-section-title">' + title + '</span>' +
        '<button class="review-fields-collapse-btn" id="' + caretId + '" onclick="event.stopPropagation();toggleFieldsSection(\'' + bodyId + '\',\'' + caretId + '\')">' +
          '<i class="fa-solid fa-caret-up"></i>' +
        '</button>' +
      '</div>' +
      '<div class="review-fields-section-body" id="' + bodyId + '">' +
        '<div class="review-fields-grid">' +
          '<div class="review-fields-header-row">' +
            '<div class="review-fields-header-cell review-fields-col--fmx">FMX data field <i class="fa-solid fa-sort"></i></div>' +
            '<div class="review-fields-header-cell review-fields-col--bill-location">Bill data location <i class="fa-solid fa-sort"></i></div>' +
            '<div class="review-fields-header-cell review-fields-col--example">Example data <i class="fa-solid fa-sort"></i></div>' +
            '<div class="review-fields-header-cell review-fields-col--row-actions"></div>' +
          '</div>';

  rows.forEach(function(row, i) {
    var stripe = i % 2 === 0 ? 'review-fields-row--white' : 'review-fields-row--striped';
    var extraClass = row.location === 'ignoring' ? ' review-fields-row--ignored' : '';
    var accentHtml = row.location === 'unmatched' ? '<div class="review-grid-accent"></div>' : '';

    var locationHtml;
    if (row.location === 'mapped') {
      locationHtml = '<span class="review-fields-location-mapped">' + row.billLoc + '</span>';
    } else if (row.location === 'calc') {
      locationHtml = '<span class="review-fields-location-tag review-fields-location-tag--calc"><i class="fa-solid fa-calculator"></i><span>Calculation</span></span>';
    } else if (row.location === 'ignoring') {
      locationHtml = '<span class="review-fields-location-tag review-fields-location-tag--ignoring"><i class="fa-solid fa-eye-slash"></i><span>Ignoring</span></span>';
    } else { // unmatched
      locationHtml = '<span class="review-fields-location-tag review-fields-location-tag--unmatched"><i class="fa-solid fa-circle-exclamation"></i><span>Couldn\'t identify</span></span>';
    }

    var actionsHtml;
    if (row.location === 'calc') {
      actionsHtml = '<div class="review-fields-cell review-fields-col--row-actions"></div>';
    } else if (row.location === 'ignoring') {
      actionsHtml = '<div class="review-fields-cell review-fields-col--row-actions" style="display:flex;gap:4px;"><button class="review-fields-row-action-btn" title="Include" onclick="toggleFieldRowIgnore(this)"><i class="fa-solid fa-circle-check"></i></button></div>';
    } else {
      var fmxEsc  = (row.fmx    || '').replace(/'/g, "\\'");
      var locEsc  = (row.billLoc || '').replace(/'/g, "\\'");
      actionsHtml = '<div class="review-fields-cell review-fields-col--row-actions" style="display:flex;gap:4px;"><button class="review-fields-row-action-btn" title="Edit" onclick="openFieldEditSlideout(\'' + fmxEsc + '\',\'' + locEsc + '\')"><i class="fa-regular fa-pen-to-square"></i></button><button class="review-fields-row-action-btn" title="Ignore" onclick="toggleFieldRowIgnore(this)"><i class="fa-solid fa-circle-xmark"></i></button></div>';
    }

    var ignoredAttr = row.location === 'ignoring' ? ' data-saved-location=\'<span class="review-fields-location-mapped">' + row.billLoc + '</span>\'' : '';

    html +=
      '<div class="review-fields-row ' + stripe + extraClass + '"' + ignoredAttr + '>' +
        accentHtml +
        '<div class="review-fields-cell review-fields-col--fmx">' + row.fmx + '</div>' +
        '<div class="review-fields-cell review-fields-col--bill-location">' + locationHtml + '</div>' +
        '<div class="review-fields-cell review-fields-col--example">' + row.example + '</div>' +
        actionsHtml +
      '</div>';
  });

  html += '</div></div></div>';
  return html;
}

/* ── Accounts grid ───────────────────────────────── */
function renderReviewAccountsGrid() {
  var container = document.getElementById('reviewAccountsGridBody');
  if (!container) return;

  var scenarioNum = protoState.currentScenario || 1;
  var allRows = getScenarioAccountRows(scenarioNum);
  var pageSize = protoState.reviewAccountsPageSize || 20;
  var page = protoState.reviewAccountsPage || 1;
  var start = (page - 1) * pageSize;
  var pageRows = allRows.slice(start, start + pageSize);

  // Rebuild row maps from full row list
  _accountRowTypes = {};
  _accountRowData  = {};
  allRows.forEach(function(r) {
    _accountRowTypes[r.rowNum] = r.type;
    _accountRowData[r.rowNum]  = r;
  });

  var html = '';
  pageRows.forEach(function(row, i) {
    var stripe = i % 2 === 0 ? 'review-grid-row--white' : 'review-grid-row--striped';
    var badgeClass = row.type === 'missing' ? 'review-badge--missing-data' : 'review-badge--pending';
    var badgeText  = row.type === 'missing' ? 'Missing data' : 'Pending review';

    var acctAction, reviewAction;
    if (row.consolidated) {
      acctAction  = 'onclick="goToReviewSubAccounts(' + row.consolidatedIndex + ')"';
      reviewAction = 'onclick="goToReviewSubAccounts(' + row.consolidatedIndex + ')"';
    } else {
      acctAction  = 'onclick="openAccountSlideout(\'' + row.type + '\',' + row.rowNum + ')"';
      reviewAction = 'onclick="openAccountSlideout(\'' + row.type + '\',' + row.rowNum + ')"';
    }

    var acctMissingClass = row.type === 'missing' ? ' review-grid-row--missing' : '';
    html +=
      '<div class="review-grid-row ' + stripe + acctMissingClass + '">' +
        '<div class="review-grid-accent"></div>' +
        '<div class="review-grid-cell review-grid-cell--checkbox">' +
          '<input type="checkbox" style="width:15px;height:15px;accent-color:var(--cta-primary-bg);cursor:pointer;">' +
        '</div>' +
        '<div class="review-grid-cell review-grid-cell--acct-num">' +
          '<span class="review-grid-link" ' + acctAction + '>' + row.accountNum + '</span>' +
          '<span class="review-badge review-badge--new">New</span>' +
        '</div>' +
        '<div class="review-grid-cell review-grid-cell--nickname"><span class="review-grid-text">' + row.nickname + '</span></div>' +
        '<div class="review-grid-cell review-grid-cell--provider">' +
          '<span class="review-utility-type-entry"><i class="' + row.icon + '"></i><span>' + row.providerName + '</span></span>' +
        '</div>' +
        '<div class="review-grid-cell review-grid-cell--status">' +
          '<span class="review-badge ' + badgeClass + '" id="accountRow' + row.rowNum + 'Badge">' + badgeText + '</span>' +
        '</div>' +
        '<div class="review-grid-cell review-grid-cell--actions">' +
          '<button class="review-icon-btn" title="Review" ' + reviewAction + '><i class="fa-solid fa-clipboard-check"></i></button>' +
        '</div>' +
      '</div>';
  });

  container.innerHTML = html;

  // Pagination UI
  var total = allRows.length;
  var pageSize2 = protoState.reviewAccountsPageSize || 20;
  var pages = total === 0 ? 1 : Math.ceil(total / pageSize2);
  var rangeStart = start + 1;
  var rangeEnd   = Math.min(start + pageSize2, total);
  var countEl = document.getElementById('reviewAccountsPaginationCount');
  if (countEl) countEl.textContent = 'Showing ' + rangeStart + '\u2013' + rangeEnd + ' of ' + total + ' records.';
  var prevBtn   = document.getElementById('acctPrevBtn');
  var nextBtn   = document.getElementById('acctNextBtn');
  var pageInput = document.getElementById('acctPageInput');
  var pageTotal = document.getElementById('acctPageTotal');
  if (prevBtn)   prevBtn.disabled   = page === 1;
  if (nextBtn)   nextBtn.disabled   = page === pages;
  if (pageInput) { pageInput.value = page; pageInput.disabled = pages === 1; }
  if (pageTotal) pageTotal.textContent = 'of ' + pages;
  var rpp = document.getElementById('acctRecordsPerPage');
  if (rpp) { if (total > 20) rpp.classList.add('visible'); else rpp.classList.remove('visible'); }

  // Update alert text
  var alertEl = document.querySelector('#screenReviewAccounts .inline-alert .inline-alert-text ul');
  if (alertEl) {
    var missingCount = allRows.filter(function(r) { return r.type === 'missing'; }).length;
    var pendingCount = allRows.filter(function(r) { return r.type === 'pending' && !r.consolidated; }).length;
    alertEl.innerHTML =
      '<li>' + allRows.length + ' new accounts have been identified from your uploaded files and are pending review.</li>' +
      (missingCount > 0 ? '<li>' + missingCount + ' account' + (missingCount !== 1 ? 's are' : ' is') + ' missing required data before they can be saved.</li>' : '');
  }

  // Disable finish button only if there are rows with missing data
  var finishBtn = document.getElementById('reviewAccountsFinishBtn');
  if (finishBtn) {
    var stillMissing = document.querySelectorAll('#screenReviewAccounts .review-badge--missing-data').length;
    finishBtn.disabled = stillMissing > 0;
  }
}

function goToAccountsPage(n) {
  var scenarioNum = protoState.currentScenario || 1;
  var total   = getScenarioAccountRows(scenarioNum).length;
  var pageSize = protoState.reviewAccountsPageSize || 20;
  var pages   = total === 0 ? 1 : Math.ceil(total / pageSize);
  if (isNaN(n) || n < 1 || n > pages) {
    var inp = document.getElementById('acctPageInput');
    if (inp) inp.value = protoState.reviewAccountsPage;
    return;
  }
  protoState.reviewAccountsPage = n;
  renderReviewAccountsGrid();
}

function prevAccountsPage() {
  if ((protoState.reviewAccountsPage || 1) > 1) goToAccountsPage(protoState.reviewAccountsPage - 1);
}

function nextAccountsPage() {
  var scenarioNum = protoState.currentScenario || 1;
  var total   = getScenarioAccountRows(scenarioNum).length;
  var pageSize = protoState.reviewAccountsPageSize || 20;
  var pages   = total === 0 ? 1 : Math.ceil(total / pageSize);
  if ((protoState.reviewAccountsPage || 1) < pages) goToAccountsPage(protoState.reviewAccountsPage + 1);
}

function toggleAccountsPageSizeMenu(e) {
  e.stopPropagation();
  var menu   = document.getElementById('acctPageSizeMenu');
  var isOpen = menu.classList.contains('open');
  closeAccountsPageSizeMenu();
  if (!isOpen) menu.classList.add('open');
}

function closeAccountsPageSizeMenu() {
  var menu = document.getElementById('acctPageSizeMenu');
  if (menu) menu.classList.remove('open');
}

function setAccountsPageSize(n) {
  protoState.reviewAccountsPageSize = n;
  var label = document.getElementById('acctPageSizeLabel');
  if (label) label.textContent = n;
  document.querySelectorAll('#acctPageSizeMenu .page-size-item').forEach(function(item) {
    item.classList.toggle('selected', parseInt(item.textContent) === n);
  });
  closeAccountsPageSizeMenu();
  protoState.reviewAccountsPage = 1;
  renderReviewAccountsGrid();
}

/* ── Sub-accounts grid ───────────────────────────── */
function renderReviewSubAccountsGrid(consolidatedIndex) {
  var scenarioNum = protoState.currentScenario || 1;
  var rows = getScenarioSubAccountRows(scenarioNum, consolidatedIndex);

  // Rebuild _subAccountData
  _subAccountData = {};
  rows.forEach(function(r) {
    _subAccountData[r.rowNum] = { num: r.num, building: r.building };
  });

  // Update header text
  var def = SCENARIO_DEFINITIONS[scenarioNum];
  var consProviders = def ? def.providers.filter(function(p) { return p.consolidated; }) : [];
  var p = consProviders[consolidatedIndex];
  var acctNum  = p ? p.consolidatedAccountNum : '';
  var nickname = p ? p.consolidatedNickname   : '';

  var titleEl    = document.getElementById('subAccountsPageTitle');
  var bcEl       = document.getElementById('subAccountsBreadcrumb');
  var numInput   = document.getElementById('subAccountsParentNum');
  var nameInput  = document.getElementById('subAccountsParentNickname');
  var countEl    = document.getElementById('subAccountsCount');

  if (titleEl)    titleEl.textContent = 'Account #' + acctNum;
  if (bcEl)       bcEl.textContent    = 'Account #' + acctNum;
  if (numInput)   numInput.value      = acctNum;
  if (nameInput)  nameInput.value     = nickname;
  if (countEl)    countEl.textContent = '(' + rows.length + ')';

  // Render grid rows
  var container = document.getElementById('subAccountsGridBody');
  if (!container) return;

  var html = '';
  rows.forEach(function(row, i) {
    var stripe = i % 2 === 0 ? 'review-grid-row--white' : 'review-grid-row--striped';
    html +=
      '<div class="review-grid-row ' + stripe + '">' +
        '<div class="review-grid-accent"></div>' +
        '<div class="review-grid-cell" style="width:180px;flex-shrink:0;">' +
          '<span class="review-grid-link" onclick="openSubAccountSlideout(' + row.rowNum + ')">' + row.num + '</span>' +
        '</div>' +
        '<div class="review-grid-cell" style="flex:1;"><span class="review-grid-text">' + row.name + '</span></div>' +
        '<div class="review-grid-cell" style="width:80px;flex-shrink:0;"><span class="review-grid-text">1</span></div>' +
        '<div class="review-grid-cell review-grid-cell--status">' +
          '<span class="review-badge review-badge--pending" id="subAccountRow' + row.rowNum + 'Badge">Pending review</span>' +
        '</div>' +
        '<div class="review-grid-cell review-grid-cell--actions">' +
          '<button class="review-icon-btn" title="Review" onclick="openSubAccountSlideout(' + row.rowNum + ')"><i class="fa-solid fa-clipboard-check"></i></button>' +
        '</div>' +
      '</div>';
  });

  container.innerHTML = html;
}

/* ── Bridge to nav.js ────────────────────────────── */
function setReviewFieldsProviders(arr) {
  _reviewFieldsProviders = arr;
}
