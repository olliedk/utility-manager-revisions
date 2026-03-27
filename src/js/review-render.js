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

  // Reset global row types map used by slideout interactions
  _providerRowTypes = {};

  rows.forEach(function(row, i) {
    var stripe = i % 2 === 0 ? 'review-grid-row--white' : 'review-grid-row--striped';
    var badgeClass = 'review-badge--pending';
    var badgeText  = 'Pending review';
    _providerRowTypes[row.rowNum] = row.status;

    var utilityHtml = row.utilities.map(function(u) {
      return '<span class="review-utility-type-entry"><i class="' + u.icon + '"></i><span>' + u.type + '</span></span>';
    }).join('');

    html +=
      '<div class="review-grid-row ' + stripe + '">' +
        '<div class="review-grid-accent"></div>' +
        '<div class="review-grid-cell review-grid-cell--provider">' +
          '<span class="review-grid-link" onclick="openProviderSlideout(\'' + row.status + '\',' + row.rowNum + ')">' + row.name + '</span>' +
          '<span class="review-badge review-badge--new" style="margin-left:4px;">New</span>' +
          (row.consolidated ? '<span class="review-badge review-badge--pending" style="margin-left:4px;background:#f0f0f0;color:#555;">Consolidated</span>' : '') +
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

  // Update inline alert text
  var alertEl = document.querySelector('#screenReviewProviders .inline-alert .inline-alert-text ul');
  if (alertEl) {
    alertEl.innerHTML =
      '<li>' + rows.length + ' new provider' + (rows.length !== 1 ? 's have' : ' has') + ' been suggested based on bill data and are pending your review.</li>';
  }

  // Reset Next button to disabled
  var nextBtn = document.getElementById('reviewProvidersNextBtn');
  if (nextBtn) nextBtn.disabled = true;

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
}

/* ── Accounts grid ───────────────────────────────── */
var ACCOUNTS_PAGE_SIZE = 10;

function renderReviewAccountsGrid() {
  var container = document.getElementById('reviewAccountsGridBody');
  if (!container) return;

  var scenarioNum = protoState.currentScenario || 1;
  var allRows = getScenarioAccountRows(scenarioNum);
  var page = protoState.reviewAccountsPage || 1;
  var start = (page - 1) * ACCOUNTS_PAGE_SIZE;
  var pageRows = allRows.slice(start, start + ACCOUNTS_PAGE_SIZE);

  // Rebuild _accountRowTypes from full row list
  _accountRowTypes = {};
  allRows.forEach(function(r) { _accountRowTypes[r.rowNum] = r.type; });

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

    html +=
      '<div class="review-grid-row ' + stripe + '">' +
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

  // Pagination text
  var total = allRows.length;
  var rangeStart = start + 1;
  var rangeEnd   = Math.min(start + ACCOUNTS_PAGE_SIZE, total);
  var countEl = document.getElementById('reviewAccountsPaginationCount');
  if (countEl) countEl.textContent = 'Showing ' + rangeStart + '\u2013' + rangeEnd + ' of ' + total + ' records.';

  // Update alert text
  var alertEl = document.querySelector('#screenReviewAccounts .inline-alert .inline-alert-text ul');
  if (alertEl) {
    var missingCount = allRows.filter(function(r) { return r.type === 'missing'; }).length;
    var pendingCount = allRows.filter(function(r) { return r.type === 'pending' && !r.consolidated; }).length;
    alertEl.innerHTML =
      '<li>' + allRows.length + ' new accounts have been identified from your uploaded files and are pending review.</li>' +
      (missingCount > 0 ? '<li>' + missingCount + ' account' + (missingCount !== 1 ? 's are' : ' is') + ' missing required data before they can be saved.</li>' : '');
  }

  // Reset finish button
  var finishBtn = document.getElementById('reviewAccountsFinishBtn');
  if (finishBtn) finishBtn.disabled = true;
}

function setReviewAccountsPage(page) {
  var scenarioNum = protoState.currentScenario || 1;
  var total = getScenarioAccountRows(scenarioNum).length;
  var maxPage = Math.ceil(total / ACCOUNTS_PAGE_SIZE);
  protoState.reviewAccountsPage = Math.max(1, Math.min(page, maxPage));
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
