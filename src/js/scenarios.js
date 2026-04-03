/* ═══════════════════════════════════════════════════
   SCENARIO DEFINITIONS
   Shared data for all 3 testing scenarios.
   All functions are pure (no DOM access).
═══════════════════════════════════════════════════ */

var SCHOOLS = [
  { id: 'camden-elem',   name: 'Camden Elementary School'  },
  { id: 'camden-mid',    name: 'Camden Middle School'      },
  { id: 'rockport-high', name: 'Rockport High School'      },
  { id: 'admin',         name: 'District Admin Building'   },
  { id: 'gym',           name: 'Gymnasium'                 },
  { id: 'north-elem',    name: 'North Elementary School'   },
  { id: 'south-mid',     name: 'South Middle School'       },
  { id: 'library',       name: 'District Library'          },
  { id: 'westview-high', name: 'Westview High School'      },
  { id: 'arts-center',   name: 'Performing Arts Center'    }
];

/* Provider definition shape:
   {
     name:                  string,
     utilities:             [{ type, icon }],   // 1 = simple, 2 = multi-utility
     consolidated:          boolean,
     accountPrefix:         string,
     fieldCount:            number,
     consolidatedAccountNum: string | undefined,
     consolidatedNickname:  string | undefined
   }
*/
var SCENARIO_DEFINITIONS = {
  1: {
    label:       'Simple Bills',
    description: '4 providers, 1 utility each. 10 accounts per provider (1 per school).',
    stats:       ['4 providers', '40 accounts'],
    providers: [
      { name: 'Summit Ridge Energy', utilities: [{ type: 'Electric',    icon: 'fa-solid fa-bolt'              }], consolidated: false, accountPrefix: 'SRE', fieldCount: 12 },
      { name: 'BluePeak Gas',        utilities: [{ type: 'Natural Gas', icon: 'fa-solid fa-fire-flame-simple' }], consolidated: false, accountPrefix: 'BPG', fieldCount:  9 },
      { name: 'SW Water Authority',  utilities: [{ type: 'Water',       icon: 'fa-solid fa-water'             }], consolidated: false, accountPrefix: 'SWA', fieldCount:  7 },
      { name: 'Clark Wastewater',    utilities: [{ type: 'Sewer',       icon: 'fa-solid fa-faucet'            }], consolidated: false, accountPrefix: 'CRW', fieldCount:  6 }
    ]
  },
  2: {
    label:       'Multi-Utility Bills',
    description: '2 providers, 2 utilities each. 10 accounts per provider (1 per school).',
    stats:       ['2 providers', '20 accounts'],
    providers: [
      { name: 'Maritime Energy',         utilities: [{ type: 'Electric', icon: 'fa-solid fa-bolt' }, { type: 'Natural Gas', icon: 'fa-solid fa-fire-flame-simple' }], consolidated: false, accountPrefix: 'ME',  fieldCount: 21 },
      { name: 'City Municipal Services', utilities: [{ type: 'Water',    icon: 'fa-solid fa-water' }, { type: 'Sewer',      icon: 'fa-solid fa-faucet'            }], consolidated: false, accountPrefix: 'CMS', fieldCount: 13 }
    ]
  },
  3: {
    label:       'Consolidated Bills',
    description: '4 providers. Electric and Natural Gas use consolidated billing (1 account, 10 sub-accounts each). Water and Sewer are regular (10 accounts each).',
    stats:       ['4 providers', '22 accounts', '20 sub-accounts'],
    providers: [
      { name: 'Consolidated Edison', utilities: [{ type: 'Electric',    icon: 'fa-solid fa-bolt'              }], consolidated: true,  accountPrefix: 'CE',  subAcctBase: '000456', fieldCount: 12, consolidatedAccountNum: 'CE-000456-00', consolidatedNickname: 'School District Electric Consolidated' },
      { name: 'Metro Gas Co.',       utilities: [{ type: 'Natural Gas', icon: 'fa-solid fa-fire-flame-simple' }], consolidated: true,  accountPrefix: 'MG',  subAcctBase: '001122', fieldCount:  9, consolidatedAccountNum: 'MG-001122-00', consolidatedNickname: 'School District Gas Consolidated'     },
      { name: 'SW Water Authority',  utilities: [{ type: 'Water',       icon: 'fa-solid fa-water'             }], consolidated: false, accountPrefix: 'SWA', fieldCount:  7 },
      { name: 'Clark Wastewater',    utilities: [{ type: 'Sewer',       icon: 'fa-solid fa-faucet'            }], consolidated: false, accountPrefix: 'CRW', fieldCount:  6 }
    ]
  }
};

/* ── Scenario selector UI ────────────────────────── */
function renderScenarioSelector() {
  var container = document.getElementById('scenarioCardRow');
  if (!container) return;
  var html = '';
  [1, 2, 3].forEach(function(n) {
    var def = SCENARIO_DEFINITIONS[n];
    var isSelected = protoState.currentScenario === n;
    html +=
      '<div class="scenario-card' + (isSelected ? ' scenario-card--selected' : '') + '" onclick="selectScenario(' + n + ')">' +
        '<div class="scenario-card-check"><i class="fa-solid fa-circle-check"></i></div>' +
        '<div class="scenario-card-number">Scenario ' + n + '</div>' +
        '<div class="scenario-card-title">' + def.label + '</div>' +
        '<div class="scenario-card-desc">' + def.description + '</div>' +
        '<ul class="scenario-card-stats">' +
          def.stats.map(function(s) { return '<li>' + s + '</li>'; }).join('') +
        '</ul>' +
      '</div>';
  });
  container.innerHTML = html;
}

function selectScenario(n) {
  protoState.currentScenario = n;
  var cards = document.querySelectorAll('.scenario-card');
  cards.forEach(function(card, i) {
    if (i + 1 === n) {
      card.classList.add('scenario-card--selected');
    } else {
      card.classList.remove('scenario-card--selected');
    }
  });
}

/* ── Provider row data ───────────────────────────── */
/* Returns array of objects for rendering the providers grid.
   Each provider generates one row.
   Shape: { rowNum, name, utilities, status, providerIndex }
*/
function getScenarioProviderRows(scenarioNum) {
  var def = SCENARIO_DEFINITIONS[scenarioNum];
  if (!def) return [];
  return def.providers.map(function(p, i) {
    return {
      rowNum:        i + 1,
      name:          p.name,
      utilities:     p.utilities,
      consolidated:  p.consolidated,
      status:        i === def.providers.length - 1 ? 'missing' : 'pending',
      providerIndex: i
    };
  });
}

/* ── Field row data ──────────────────────────────── */
/* Returns one row per utility type per provider.
   For multi-utility providers (scenario 2) each utility type is its own row.
   Shape: { rowNum, label, fieldCount, status, providerIndex }
   providerIndex is the index into _reviewFieldsProviders in nav.js.
*/
function getScenarioFieldRows(scenarioNum) {
  var def = SCENARIO_DEFINITIONS[scenarioNum];
  if (!def) return [];
  return def.providers.map(function(p, pi) {
    var totalFields = p.utilities.reduce(function(sum, u, ui) {
      return sum + (ui === 0 ? p.fieldCount : Math.floor(p.fieldCount * 0.6));
    }, 0);
    return {
      rowNum:        pi + 1,
      label:         p.name,
      utilities:     p.utilities,
      fieldCount:    totalFields,
      status:        'pending',
      providerIndex: pi
    };
  });
}

/* ── Account row data ────────────────────────────── */
/* Returns flat array of all account rows for the scenario.
   Consolidated accounts come first in scenario 3.
   Shape: { rowNum, accountNum, nickname, providerName, icon, type, consolidated, consolidatedIndex }
*/
function getScenarioAccountRows(scenarioNum) {
  var def = SCENARIO_DEFINITIONS[scenarioNum];
  if (!def) return [];
  var rows = [];

  // In scenario 3: consolidated rows first
  def.providers.forEach(function(p, pi) {
    if (!p.consolidated) return;
    var ci = rows.filter(function(r) { return r.consolidated; }).length;
    rows.push({
      accountNum:        p.consolidatedAccountNum,
      nickname:          p.consolidatedNickname,
      providerName:      p.name,
      icon:              p.utilities[0].icon,
      icons:             p.utilities.map(function(u) { return u.icon; }),
      type:              'pending',
      consolidated:      true,
      consolidatedIndex: ci
    });
  });

  // Then regular accounts (10 per provider for non-consolidated)
  def.providers.forEach(function(p, pi) {
    if (p.consolidated) return;
    SCHOOLS.forEach(function(school, si) {
      var padPi  = String(pi + 1).padStart(3, '0');
      var padSi  = String(si + 1).padStart(2, '0');
      var acctNum = p.accountPrefix + '-' + padPi + '-' + padSi;
      // School 8 (District Library) is missing data in Scenario 3
      var isMissing = (scenarioNum === 3 && si === 7);
      rows.push({
        accountNum:        acctNum,
        nickname:          school.name,
        providerName:      p.name,
        icon:              p.utilities[0].icon,
        icons:             p.utilities.map(function(u) { return u.icon; }),
        type:              isMissing ? 'missing' : 'pending',
        consolidated:      false,
        consolidatedIndex: null
      });
    });
  });

  // Assign rowNum after ordering
  rows.forEach(function(r, i) { r.rowNum = i + 1; });
  return rows;
}

/* ── Sub-account row data ────────────────────────── */
/* Returns 10 sub-account rows for the given consolidated provider index.
   Shape: { rowNum, num, building }
*/
function getScenarioSubAccountRows(scenarioNum, consolidatedIndex) {
  var def = SCENARIO_DEFINITIONS[scenarioNum];
  if (!def) return [];
  var consProviders = def.providers.filter(function(p) { return p.consolidated; });
  var p = consProviders[consolidatedIndex];
  if (!p) return [];
  return SCHOOLS.map(function(school, i) {
    return {
      rowNum:   i + 1,
      num:      p.accountPrefix + '-' + p.subAcctBase + '-' + String(i + 1).padStart(2, '0'),
      building: school.id,
      name:     school.name
    };
  });
}
