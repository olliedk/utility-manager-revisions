/* ── Prototype data state ────────────────────────── */
var protoState = {
  providerCount: 5, billCount: 10, pageSize: 20, providersPage: 1, billsPage: 1,
  currentScenario:          null, // 1 | 2 | 3
  activeConsolidatedAccount: 0,   // index into scenario's consolidated providers
  reviewAccountsPage:        1,   // current page for the review-accounts grid
  reviewAccountsPageSize:    20   // rows per page for the review-accounts grid
};

var _retireProviders = [];
