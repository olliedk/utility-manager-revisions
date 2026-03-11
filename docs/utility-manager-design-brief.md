# Utility Manager GA Revisions — Design Brief
**Project:** Utility Manager GA Revisions
**Status:** Committed — 2026 Q2
**Team:** New Products
**Prepared for:** Claude Code Design Exploration

---

## 1. Product Context

FMX Utility Manager is a dedicated utility management solution launched at GA in early 2026. It allows organizations (primarily K-12 school districts, higher ed, and state/local government) to manage providers, accounts, and bills in one place — with automated bill entry via PDF/OCR and reporting dashboards.

**The core tension:** The product is currently perceived as "bill storage" rather than true "energy management." This perception, combined with several hard blockers around data ingestion and setup complexity, is causing lost deals and friction in early adoption. This initiative addresses the top remaining needs based on early GA reception.

---

## 2. User Personas

**Primary:** Facilities Manager / Energy Manager
- Responsible for cost control and utility reporting across multiple buildings/campuses
- Values speed, accuracy, and comparative analytics
- Often managing 50–200+ utility accounts across many providers

**Secondary:** AP Specialist / Administrator
- Responsible for inputting and uploading bill data
- Frustrated by manual entry at scale; needs bulk tools
- May not have deep utility knowledge

**Tertiary:** Building-Level Staff (decentralized model)
- Submits bills only for their specific building(s)
- Needs permission-scoped access, not full admin view

---

## 3. Core Pain Points (from Research)

From beta feedback, closed-lost analysis, and SE field notes (Q4 2025–Q1 2026):

1. **Setup is too slow and manual** — Large districts need to create dozens of providers, accounts, and meters. No bulk tools or guided setup. One user stopped using the product entirely due to data entry burden.
2. **Bill ingestion doesn't scale** — No CSV upload; PDF-only. Multi-hundred-page summary invoices break the current workflow. Multi-service bills (e.g., Gas + Electric on one page) can't be split.
3. **No way to retire accounts/providers** — Inactive accounts generate constant "Missing Bills" noise, eroding trust in the dashboard.
4. **Permissions are all-or-nothing** — Organizations with decentralized models (different staff per building) can't scope access appropriately.
5. **Intelligent Suggestions are limited** — 200-character instruction limit is too short. Single-line text field is hard to review. No instructions at provider or account level.
6. **Duplicate account numbers rejected** — Some providers issue the same account number to multiple buildings; FMX blocks this even when each bill has a unique invoice number.
7. **Bills list is limited** — Can't filter by date range, select subsets, or export easily.
8. **Reporting lacks depth** — Users can only view one provider/location at a time. No weather normalization, no YoY trends, no campus-level rollups.
9. **Some bill types have no consumption field** — System requires it; no way to make it optional per utility type.

---

## 4. Target Requirements (Ranked by Priority)

These are the committed, ranked requirements that design explorations **must** address.

---

### REQ-1: Guided Setup Wizard
**Goal:** Shorten the time to fully configure providers, accounts, custom fields, and meters.

**Requirements:**
- Automated wizard flow with user review/confirmation at each step
- Hierarchy: providers → custom fields → accounts → building associations
- Pre-fill provider fields from uploaded bill or CSV (utility type, units, meter numbers, EUI factors)
- Auto-detect non-standard columns → suggest new custom fields → user reviews
- Pre-fill account numbers, suggest nickname structures
- Support building association by address; allow inline building creation if one doesn't exist
- Architecture should be reusable for other FMX modules later

**Design Considerations:**
- Must feel fast — users have 50–200+ accounts to set up
- Wizard should allow bulk review, not just one-at-a-time
- Clear progress indicators; ability to pause and resume
- Error/warning states for missing data without blocking progress

---

### REQ-2: CSV Bill Upload
**Goal:** Allow users to upload a CSV of bill data instead of only PDFs.

**Requirements:**
- Single CSV upload (optimize for one file, not multi-CSV batch)
- Parse rows into structured bill records (one row = one bill, typically)
- Map CSV columns to FMX bill fields with a user-reviewable mapping step
- Extensible pattern for future modules

**Design Considerations:**
- Column mapping UI is critical — users won't know FMX's internal field names
- Validate and flag rows with errors before import; don't fail silently
- Show a preview of what will be imported
- Reference example formats: ATMOS collective invoice style, BP invoice style (multi-row per account)

---

### REQ-3: Account & Provider Retirement
**Goal:** Let admins deactivate accounts/providers without deleting history or generating "Missing Bills" noise.

**Requirements:**
- Retire action available on account and provider records
- Confirmation modal before retiring
- Retired items hidden from active views using existing filters (building, provider, account) — no new status field needed
- "Reinstate" option to undo
- Optional: retire buildings for consistency (cut if it risks scope)

**Engineering note:** Low lift, low complexity per initial ENG read.

**Design Considerations:**
- Retire vs. Delete must be visually distinct and clearly communicated
- Retired items should be easily discoverable (filterable, not permanently hidden)
- Consider a "Recently Retired" view or indicator

---

### REQ-4: Building/Account-Level Permissions
**Goal:** Allow admins to scope Utility Manager access so users only see and submit bills for their assigned buildings/accounts.

**Requirements:**
- Scoped to Utility Manager module (not reporting dashboards at this time)
- Admins can assign users to specific buildings or accounts
- Scoped users see only their assigned buildings/accounts in bills list, upload flows, etc.

**Design Considerations:**
- Permission assignment UI should live in admin/settings, not inline with utility data
- Users without full access should not see "locked" items — they simply don't appear
- Edge case: what happens when a user's building is retired?

---

### REQ-5: Expanded Intelligent Suggestions Instructions
**Goal:** Allow users to provide richer, more detailed instructions to guide the AI bill-parsing system.

**Requirements:**
- Add instruction support at provider and account level (not just bill entry)
- Remove/increase the 200-character limit significantly
- Replace single-line text field with a multi-line, reviewable textarea
- Instructions should guide automated setup (e.g., naming conventions, identifying provider/account from bill data)
- Support complex examples: "Consumption = Electric Charge + Distribution Charge + Surcharge"

**Design Considerations:**
- Instructions are written by admins, used by AI — UI should reflect this (write once, runs many times)
- Consider a "test" or preview mechanism so users can verify instructions work
- Inline examples or placeholder hints would reduce the learning curve

---

### REQ-6: Multi-Service Bill Splitting
**Goal:** Allow a single uploaded bill that contains charges for multiple utility types to be processed across two different providers (e.g., PSE&G combined Gas + Electric statement).

**Requirements:**
- Detect multi-service bills on upload
- Route charges to appropriate providers/accounts
- Handle shared charges (e.g., a single line item that appears once but applies to multiple services)
- Consider: rethink provider model to allow one provider → multiple utility types

**Design Considerations:**
- This is a structurally complex problem — UI must make the split/mapping legible
- User should be able to review and adjust the auto-split before confirming
- PSE&G NJ format is the primary reference case (Gas + Electric on one statement)

---

### REQ-7: Weather-Normalized EUI Reporting
**Goal:** Normalize utility usage using Heating/Cooling Degree Day (HDD/CDD) data so trends are comparable across seasons.

**Requirements:**
- Store degree days on each bill record
- Integration with a reliable weather data provider (ideally auto-populated by service address)
- New reporting widgets to show weather-normalized EUI alongside existing EUI widgets
- Support HDD/CDD in bulk import templates
- Resolve: where is the canonical service address? (bill vs. FMX building record — handle conflicts)

**Design Considerations:**
- Weather normalization is a mid-market/enterprise differentiator — present it prominently in reporting
- Users should understand what normalization means — tooltip/explainer likely needed
- Address conflict resolution should be surfaced on setup, not buried in a settings menu

---

### REQ-8: Filterable Bills List with Export
**Goal:** Provide a complete, filterable utility bills list with CSV/Excel export.

**Requirements:**
- Filter by: date range, provider, building, account, status
- Select subsets of bills (checkboxes) for targeted export
- Export to CSV and/or Excel
- Consistent with existing FMX table/list UI patterns

**Design Considerations:**
- This is a frequently-requested, high-usage feature — prioritize speed and clarity
- Date range filter is a must-have for the export workflow
- "Select all on page" vs. "select all matching filter" pattern matters at 87+ accounts

---

### REQ-9: Duplicate Account Numbers (Same Provider, Different Buildings)
**Goal:** Allow a single account code/number to be reused when each bill has its own unique invoice/reference number.

**Requirements:**
- Remove the current uniqueness constraint on account number per provider
- Use invoice/reference number as the unique identifier per bill
- Reference: oil delivery scenarios where multiple buildings share one account number

**Design Considerations:**
- Downstream impact: search, deduplication logic, and account display need to handle non-unique numbers gracefully
- Consider adding a "building label" or nickname to disambiguate accounts with the same number

---

### REQ-10: Configurable Required Fields
**Goal:** Allow organizations to mark fields like "consumption" as optional rather than required.

**Requirements:**
- Per-utility-type field configuration (e.g., consumption is not applicable for some bill types)
- Admin-controlled — not end-user configurable
- Reference case: bills with no consumption charges (e.g., demand-only bills)

**Design Considerations:**
- Field config UI should live near provider/account settings, not in a global settings page
- Validation error messages should reflect the configured requirement state

---

## 5. Stretch Goal

**Accounting Integration:** Add utility bills to Accounting, with automatic assignment to the correct accounts and budgets. Not in scope for this sprint but should inform data model decisions.

---

## 6. Design Principles for This Project

Based on the research, all design explorations should adhere to these principles:

1. **Scale-first thinking** — Designs must work for 87 accounts, not just 5. Tables, filters, and bulk actions are more important than individual record polish.
2. **Reduce time-to-value** — Every setup step that can be automated or pre-filled should be. The wizard concept is central to this.
3. **Trust through transparency** — AI/automated actions (ingestion, suggestions, splitting) must always show users what happened and allow review before committing.
4. **Don't punish edge cases** — Duplicate account numbers, missing consumption fields, and multi-service bills are real scenarios, not exceptions. The system should handle them gracefully.
5. **Progressive disclosure** — Advanced features (weather normalization, multi-service splitting) should be accessible but not overwhelming to smaller customers.

---

## 7. Design Scope for This Exploration

For the Claude Code exploration, focus on these three areas as they are highest-priority, most visually interesting, and most interconnected:

### Area A — Guided Setup Wizard (REQ-1)
Explore 2–3 different flows/patterns for how a user would set up a new provider and its accounts via a guided, wizard-style experience. Consider:
- Step-by-step linear wizard
- Hub-and-spoke review model (upload → AI pre-fills → user reviews all at once)
- Inline data table editing (import CSV → editable grid → confirm)

### Area B — CSV Upload + Column Mapping (REQ-2)
Explore the upload and column-mapping UI. Consider:
- Auto-match columns with manual override
- Visual diff between what was detected vs. what will be imported
- Error/warning row highlighting before commit

### Area C — Bills List + Export (REQ-8)
Explore the filterable bills list. Consider:
- Filter panel (sidebar vs. inline chips)
- Date range picker UX
- Bulk selection and export confirmation flow

---

## 8. Key Reference Data

**Quantitative signals:**
- ~$100k+ in immediate ARR impact tied to the identified gaps
- Users managing 87+ accounts on a single utility provider
- Multi-hundred-page PDFs from large districts (Arlington ISD)
- 200-character instruction limit identified as too short

**Competitor context:**
- EnergyCap and Atrius are the primary incumbents in K-12
- Missing Energy Star integration is a table-stakes gap vs. competitors
- FMX currently perceived as "bill storage" vs. "energy management" — this initiative begins the shift

**Customer quotes (for UX inspiration):**
- "I did not like inputting all the data. I got annoyed doing that so I stopped using it." — Doug Depinet, Mohawk Local
- "Ability to display more than 12 records at once. One of our utilities has 87 accounts." — James Scanlin, Kent School
- "When exporting, would be good to be able to select a date range… filter out accounts for specific buildings." — Sydney Lindeman, Park Hill SD
- "Will there be a way to retire utility provider accounts… as a way to not see the Missing Bills status." — Hillarie Kin

---

*Brief prepared from: Utility Manager GA Revisions Notion page, Closed-Lost Analysis (Q4 2025–Q1 2026), Mid-Market Feedback Analysis, Closed Beta Feedback, and SE field research.*
