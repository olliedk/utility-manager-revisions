/* ── Prototype data state ────────────────────────── */
var protoState = {
  providerCount: 0, billCount: 0, pageSize: 20, providersPage: 1, billsPage: 1,
  currentScenario:          null,  // 1 | 2 | 3
  firstUploadDone:          false, // true after doneReviewComplete() — enables second-upload mode
  activeConsolidatedAccount: 0,    // index into scenario's consolidated providers
  reviewAccountsPage:        1,    // current page for the review-accounts grid
  reviewAccountsPageSize:    20    // rows per page for the review-accounts grid
};

var _retireProviders = [];
