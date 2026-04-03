/* ── Render functions ────────────────────────────── */
function renderProviders(count) {
  var container = document.getElementById('providerGridContainer');
  if (count === 0) { container.innerHTML = ''; return; }
  var pool      = (SCENARIO_PROVIDERS[protoState.currentScenario]) || PROVIDER_POOL;
  var start     = (protoState.providersPage - 1) * protoState.pageSize;
  var providers = pool.slice(start, start + protoState.pageSize).slice(0, count - start);
  _retireProviders = providers;
  var html = '';
  providers.forEach(function(p, i) {
    var menuId      = 'dyn-menu-' + i;
    var statusClass = p.status === 'ok' ? 'status-ok' : 'status-missing';
    var statusLabel = p.status === 'ok' ? 'Up-to-date' : 'Missing bills';
    var typeIcons   = p.icons
      ? p.icons.map(function(ic) { return '<i class="fa-solid ' + ic + '"></i>'; }).join(' ')
      : '<i class="fa-solid ' + p.icon + '"></i>';
    html += '<div class="provider-card">' +
      '<div class="pcard-top">' +
        '<div class="pcard-type">' + typeIcons + ' ' + p.type + '</div>' +
        '<div class="pcard-actions">' +
          '<span class="status-badge ' + statusClass + '">' + statusLabel + '</span>' +
          '<button class="kebab-btn" onclick="toggleCardMenu(\'' + menuId + '\', event)" title="More options"><i class="fa-solid fa-ellipsis"></i></button>' +
          '<div class="pcard-menu" id="' + menuId + '">' +
            '<div class="pcard-menu-item" onclick="closeCardMenus()"><i class="fa-solid fa-circle-info"></i> View</div>' +
            '<div class="pcard-menu-item" onclick="closeCardMenus()"><i class="fa-regular fa-pen-to-square"></i> Edit</div>' +
            '<div class="pcard-menu-item" onclick="closeCardMenus()"><i class="fa-solid fa-list-ol"></i> Edit custom fields</div>' +
            '<div class="pcard-menu-item" onclick="openRetireSlideout(' + i + ', event)"><i class="fa-regular fa-hand"></i> Retire</div>' +
            '<div class="pcard-menu-item destructive" onclick="closeCardMenus()"><i class="fa-solid fa-trash"></i> Delete</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="pcard-name">' + p.name + '</div>' +
      '<div class="pcard-footer">' +
        '<span class="period-tag">' + p.period + '</span>' +
        '<div class="pcard-amount">' +
          '<div class="pcard-amount-value">' + p.amount + '</div>' +
          '<div class="pcard-amount-label">Avg Daily Cost</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  });
  container.innerHTML = html;
}

function renderBillsTable(count) {
  var tbody = document.getElementById('billsTbody');
  if (count === 0) { tbody.innerHTML = ''; return; }
  var pool  = (SCENARIO_BILLS[protoState.currentScenario]) || BILLS_DATA;
  var start = (protoState.billsPage - 1) * protoState.pageSize;
  var bills = pool.slice(start, start + protoState.pageSize).slice(0, count - start);
  var rows = '';
  bills.forEach(function(b) {
    var statusClass = b.status === 'entered' ? 'bill-status-entered' : 'bill-status-missing';
    var statusLabel = b.status === 'entered' ? 'Entered' : 'Missing';
    rows +=
      '<tr>' +
        '<td><span class="bill-link">' + b.month + '</span></td>' +
        '<td><span class="bill-status-badge ' + statusClass + '">' + statusLabel + '</span></td>' +
        '<td><span class="bill-link">' + b.provider + '</span></td>' +
        '<td><span class="bill-link">' + b.account + '</span></td>' +
        '<td>' + b.start + '</td>' +
        '<td>' + b.end + '</td>' +
        '<td>' + b.amount + '</td>' +
        '<td class="bills-actions-col"><div class="bills-row-actions">' +
          '<button class="bills-row-btn" title="Review"><i class="fa-regular fa-pen-to-square"></i></button>' +
          '<button class="bills-row-btn" title="More options"><i class="fa-solid fa-ellipsis"></i></button>' +
        '</div></td>' +
      '</tr>';
  });
  tbody.innerHTML = rows;
}

function updateRecordCount() {
  var isProvidersView = document.getElementById('viewProvidersBtn').classList.contains('toolbar-view-btn--active');
  var total   = isProvidersView ? protoState.providerCount : protoState.billCount;
  var curPage = isProvidersView ? protoState.providersPage : protoState.billsPage;
  var pages   = total === 0 ? 1 : Math.ceil(total / protoState.pageSize);
  var start   = (curPage - 1) * protoState.pageSize + 1;
  var end     = Math.min(curPage * protoState.pageSize, total);
  var label   = total === 0 ? 'No records.' : 'Showing ' + start + '\u2013' + end + ' of ' + total + ' records.';
  document.getElementById('utilsRecordCount').textContent = label;

  var prevBtn    = document.getElementById('pagePrevBtn');
  var nextBtn    = document.getElementById('pageNextBtn');
  var pageInput  = document.getElementById('pageInput');
  var totalSpan  = document.getElementById('pageTotalSpan');
  totalSpan.textContent = 'of ' + pages;
  pageInput.value       = curPage;
  pageInput.disabled    = pages === 1;
  prevBtn.disabled      = curPage === 1;
  nextBtn.disabled      = curPage === pages;

  var rpp = document.getElementById('recordsPerPage');
  if (total > 20) {
    rpp.classList.add('visible');
  } else {
    rpp.classList.remove('visible');
    closePageSizeMenu();
  }
}

function renderUtilities() {
  var isEmpty      = protoState.providerCount === 0 && protoState.billCount === 0;
  var toolbar      = document.querySelector('#screenUtilities .toolbar');
  var emptyState   = document.getElementById('emptyState');
  var providerGrid = document.getElementById('providerGridContainer');
  var billsWrap    = document.getElementById('billsTableWrap');
  var pagination   = document.getElementById('paginationRow');
  var isProviders  = document.getElementById('viewProvidersBtn').classList.contains('toolbar-view-btn--active');

  renderProviders(protoState.providerCount);
  renderBillsTable(protoState.billCount);

  if (isEmpty) {
    toolbar.style.display    = 'none';
    emptyState.classList.add('visible');
    providerGrid.style.display = 'none';
    billsWrap.style.display    = 'none';
    pagination.style.display   = 'none';
    return;
  }

  toolbar.style.display = '';
  emptyState.classList.remove('visible');
  pagination.style.display = '';

  if (isProviders) {
    providerGrid.style.display = '';
    billsWrap.style.display    = 'none';
  } else {
    providerGrid.style.display = 'none';
    billsWrap.style.display    = '';
  }
  updateRecordCount();
}

function setDataCount(type, count) {
  protoState[type === 'providers' ? 'providerCount' : 'billCount'] = count;
  protoState[type === 'providers' ? 'providersPage' : 'billsPage'] = 1;
  renderUtilities();
}
