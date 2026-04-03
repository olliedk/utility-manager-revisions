/* ── Mock data ────────────────────────────────────── */
var PROVIDER_POOL = [
  { name: 'Summit Ridge Energy',              type: 'Electric', icon: 'fa-bolt',              status: 'ok',      period: 'Monthly',   amount: '88.40'  },
  { name: 'Pacific Gas & Electric',           type: 'Gas',      icon: 'fa-fire-flame-simple', status: 'ok',      period: 'Monthly',   amount: '42.10'  },
  { name: 'SW Water Authority',               type: 'Water',    icon: 'fa-water',             status: 'ok',      period: 'Monthly',   amount: '74.96'  },
  { name: 'Clark Regional Wastewater Dist.',  type: 'Sewer',    icon: 'fa-faucet',            status: 'ok',      period: 'Monthly',   amount: '49.50'  },
  { name: 'Apex Waste Solutions',             type: 'Other',    icon: 'fa-plug',              status: 'ok',      period: 'Monthly',   amount: '60.88'  },
  { name: 'Metro Power Co.',                  type: 'Electric', icon: 'fa-bolt',              status: 'missing', period: 'Monthly',   amount: '95.20'  },
  { name: 'Clearwater Utilities',             type: 'Water',    icon: 'fa-water',             status: 'ok',      period: 'Monthly',   amount: '38.75'  },
  { name: 'Riverside Gas Co.',                type: 'Gas',      icon: 'fa-fire-flame-simple', status: 'ok',      period: 'Monthly',   amount: '56.30'  },
  { name: 'Northern Sewer District',          type: 'Sewer',    icon: 'fa-faucet',            status: 'missing', period: 'Quarterly', amount: '33.20'  },
  { name: 'Lakeview Electric',                type: 'Electric', icon: 'fa-bolt',              status: 'ok',      period: 'Monthly',   amount: '112.50' },
  { name: 'Central Valley Water',             type: 'Water',    icon: 'fa-water',             status: 'ok',      period: 'Monthly',   amount: '67.80'  },
  { name: 'Westside Gas & Fuel',              type: 'Gas',      icon: 'fa-fire-flame-simple', status: 'missing', period: 'Monthly',   amount: '44.15'  },
  { name: 'Tri-County Electric',              type: 'Electric', icon: 'fa-bolt',              status: 'ok',      period: 'Monthly',   amount: '78.90'  },
  { name: 'Eastside Sanitation',              type: 'Other',    icon: 'fa-plug',              status: 'ok',      period: 'Monthly',   amount: '29.60'  },
  { name: 'Blue Ridge Water Dist.',           type: 'Water',    icon: 'fa-water',             status: 'ok',      period: 'Monthly',   amount: '51.40'  },
  { name: 'Cascade Natural Gas',              type: 'Gas',      icon: 'fa-fire-flame-simple', status: 'ok',      period: 'Quarterly', amount: '61.70'  },
  { name: 'Valley Waste Management',          type: 'Other',    icon: 'fa-plug',              status: 'missing', period: 'Monthly',   amount: '35.20'  },
  { name: 'Harbor Lights Electric',           type: 'Electric', icon: 'fa-bolt',              status: 'ok',      period: 'Monthly',   amount: '103.30' },
  { name: 'Sunstone Sewer Services',          type: 'Sewer',    icon: 'fa-faucet',            status: 'ok',      period: 'Monthly',   amount: '42.85'  },
  { name: 'Desert Wind Energy',               type: 'Electric', icon: 'fa-bolt',              status: 'ok',      period: 'Monthly',   amount: '91.60'  }
];

// Scenario-specific bills overrides (used instead of BILLS_DATA when set)
var SCENARIO_BILLS = {
  2: (function() {
    var bills = [];
    var accounts = [
      'Lincoln Elementary (#223-10010001)',
      'Washington Middle (#223-10010002)',
      'Jefferson High (#223-10010003)',
      'District Admin (#223-10010004)',
      'Facilities Depot (#223-10010005)',
      'Roosevelt Elementary (#223-10010006)',
      'Hoover Middle (#223-10010007)',
      'Kennedy High (#223-10010008)',
      'Franklin Elementary (#223-10010009)',
      'Adams Middle (#223-10010010)'
    ];
    var months = [
      { month: 'Feb 2026', start: 'Sun, Feb 1, 2026',  end: 'Sat, Feb 28, 2026' },
      { month: 'Jan 2026', start: 'Wed, Jan 1, 2026',  end: 'Fri, Jan 31, 2026' }
    ];
    var providers = [
      { name: 'Maritime Energy',         amounts: ['$2,140.50', '$1,980.30', '$2,310.75', '$1,755.20', '$1,630.90', '$2,045.60', '$1,890.40', '$2,200.10', '$1,720.85', '$1,965.30'] },
      { name: 'City Municipal Services', amounts: ['$987.60',  '$843.20',  '$1,102.45', '$765.80',  '$710.30',  '$920.15',  '$834.70',  '$1,055.90', '$798.40',  '$875.60']  }
    ];
    months.forEach(function(m) {
      providers.forEach(function(p, pi) {
        accounts.forEach(function(acct, ai) {
          bills.push({
            provider: p.name,
            account:  acct,
            month:    m.month,
            start:    m.start,
            end:      m.end,
            amount:   p.amounts[ai],
            status:   (pi === 0 && ai === 4 && m.month === 'Jan 2026') ? 'missing' : 'entered'
          });
        });
      });
    });
    return bills;
  })()
};

// Scenario-specific provider overrides (used instead of PROVIDER_POOL when set)
var SCENARIO_PROVIDERS = {
  2: [
    { name: 'Maritime Energy',        icons: ['fa-bolt', 'fa-fire-flame-simple'], type: 'Electric & Gas', status: 'ok', period: 'Monthly', amount: '74.96' },
    { name: 'City Municipal Services', icons: ['fa-water', 'fa-faucet'],           type: 'Water & Sewer',  status: 'ok', period: 'Monthly', amount: '74.96' }
  ]
};

var BILLS_DATA = [
  { provider: 'SW Water Authority',              account: 'Main Building (#123-44102934)',    month: 'Feb 2026', start: 'Sun, Feb 1, 2026',  end: 'Sat, Feb 28, 2026', amount: '$1,312.40', status: 'entered' },
  { provider: 'Clark Regional Wastewater Dist.', account: 'East Annex (#123-55872011)',       month: 'Feb 2026', start: 'Sun, Feb 1, 2026',  end: 'Sat, Feb 28, 2026', amount: '$743.20',   status: 'entered' },
  { provider: 'Apex Waste Solutions',            account: 'Main Building (#123-44102934)',    month: 'Feb 2026', start: 'Mon, Feb 3, 2026',  end: 'Mon, Mar 2, 2026',  amount: '$1,880.16', status: 'entered' },
  { provider: 'SW Water Authority',              account: 'Main Building (#123-44102934)',    month: 'Jan 2026', start: 'Wed, Jan 1, 2026',  end: 'Fri, Jan 31, 2026', amount: '$1,189.55', status: 'entered' },
  { provider: 'Clark Regional Wastewater Dist.', account: 'East Annex (#123-55872011)',       month: 'Jan 2026', start: 'Wed, Jan 1, 2026',  end: 'Fri, Jan 31, 2026', amount: '$698.80',   status: 'entered' },
  { provider: 'Apex Waste Solutions',            account: 'Main Building (#123-44102934)',    month: 'Jan 2026', start: 'Fri, Jan 3, 2026',  end: 'Mon, Feb 2, 2026',  amount: '$1,920.44', status: 'entered' },
  { provider: 'SW Water Authority',              account: 'Main Building (#123-44102934)',    month: 'Dec 2025', start: 'Mon, Dec 1, 2025',  end: 'Wed, Dec 31, 2025', amount: '$1,098.75', status: 'entered' },
  { provider: 'Clark Regional Wastewater Dist.', account: 'East Annex (#123-55872011)',       month: 'Dec 2025', start: 'Mon, Dec 1, 2025',  end: 'Wed, Dec 31, 2025', amount: '$724.30',   status: 'entered' },
  { provider: 'Apex Waste Solutions',            account: 'Main Building (#123-44102934)',    month: 'Dec 2025', start: 'Mon, Dec 1, 2025',  end: 'Wed, Dec 31, 2025', amount: '—',         status: 'missing' },
  { provider: 'SW Water Authority',              account: 'East Campus (#123-78900011)',       month: 'Feb 2026', start: 'Sun, Feb 1, 2026',  end: 'Sat, Feb 28, 2026', amount: '$987.60',   status: 'entered' },
  { provider: 'Summit Ridge Energy',             account: 'Main Building (#123-44102934)',    month: 'Feb 2026', start: 'Sun, Feb 1, 2026',  end: 'Sat, Feb 28, 2026', amount: '$2,340.00', status: 'entered' },
  { provider: 'Summit Ridge Energy',             account: 'Gymnasium (#123-77801155)',        month: 'Feb 2026', start: 'Sun, Feb 1, 2026',  end: 'Sat, Feb 28, 2026', amount: '$1,450.75', status: 'entered' },
  { provider: 'Pacific Gas & Electric',          account: 'Main Building (#123-44102934)',    month: 'Feb 2026', start: 'Sun, Feb 1, 2026',  end: 'Sat, Feb 28, 2026', amount: '$845.30',   status: 'entered' },
  { provider: 'Summit Ridge Energy',             account: 'Cafeteria (#123-88120046)',        month: 'Feb 2026', start: 'Sun, Feb 1, 2026',  end: 'Sat, Feb 28, 2026', amount: '$934.20',   status: 'entered' },
  { provider: 'Pacific Gas & Electric',          account: 'East Annex (#123-55872011)',       month: 'Feb 2026', start: 'Sun, Feb 1, 2026',  end: 'Sat, Feb 28, 2026', amount: '$567.00',   status: 'entered' },
  { provider: 'Summit Ridge Energy',             account: 'Main Building (#123-44102934)',    month: 'Jan 2026', start: 'Wed, Jan 1, 2026',  end: 'Fri, Jan 31, 2026', amount: '$2,100.50', status: 'entered' },
  { provider: 'Summit Ridge Energy',             account: 'Gymnasium (#123-77801155)',        month: 'Jan 2026', start: 'Wed, Jan 1, 2026',  end: 'Fri, Jan 31, 2026', amount: '$1,677.80', status: 'entered' },
  { provider: 'Pacific Gas & Electric',          account: 'Main Building (#123-44102934)',    month: 'Jan 2026', start: 'Wed, Jan 1, 2026',  end: 'Fri, Jan 31, 2026', amount: '$789.60',   status: 'entered' },
  { provider: 'Summit Ridge Energy',             account: 'Cafeteria (#123-88120046)',        month: 'Jan 2026', start: 'Wed, Jan 1, 2026',  end: 'Fri, Jan 31, 2026', amount: '$567.30',   status: 'missing' },
  { provider: 'SW Water Authority',              account: 'East Campus (#123-78900011)',       month: 'Jan 2026', start: 'Wed, Jan 1, 2026',  end: 'Fri, Jan 31, 2026', amount: '$903.40',   status: 'entered' },
  { provider: 'Clark Regional Wastewater Dist.', account: 'Main Building (#123-44102934)',    month: 'Feb 2026', start: 'Sun, Feb 1, 2026',  end: 'Sat, Feb 28, 2026', amount: '$512.90',   status: 'entered' },
  { provider: 'Apex Waste Solutions',            account: 'Admin Center (#123-66540021)',     month: 'Feb 2026', start: 'Mon, Feb 3, 2026',  end: 'Mon, Mar 2, 2026',  amount: '$1,123.45', status: 'entered' },
  { provider: 'SW Water Authority',              account: 'West Annex (#123-55010044)',        month: 'Feb 2026', start: 'Sun, Feb 1, 2026',  end: 'Sat, Feb 28, 2026', amount: '$456.90',   status: 'entered' },
  { provider: 'Pacific Gas & Electric',          account: 'Main Building (#123-44102934)',    month: 'Dec 2025', start: 'Mon, Dec 1, 2025',  end: 'Wed, Dec 31, 2025', amount: '$812.20',   status: 'entered' },
  { provider: 'Summit Ridge Energy',             account: 'Main Building (#123-44102934)',    month: 'Dec 2025', start: 'Mon, Dec 1, 2025',  end: 'Wed, Dec 31, 2025', amount: '$2,012.80', status: 'entered' },
  { provider: 'Summit Ridge Energy',             account: 'Gymnasium (#123-77801155)',        month: 'Dec 2025', start: 'Mon, Dec 1, 2025',  end: 'Wed, Dec 31, 2025', amount: '$1,567.30', status: 'entered' },
  { provider: 'Pacific Gas & Electric',          account: 'East Annex (#123-55872011)',       month: 'Dec 2025', start: 'Mon, Dec 1, 2025',  end: 'Wed, Dec 31, 2025', amount: '$601.40',   status: 'entered' },
  { provider: 'SW Water Authority',              account: 'Main Building (#123-44102934)',    month: 'Nov 2025', start: 'Sat, Nov 1, 2025',  end: 'Sun, Nov 30, 2025', amount: '$1,044.80', status: 'entered' },
  { provider: 'Clark Regional Wastewater Dist.', account: 'East Annex (#123-55872011)',       month: 'Nov 2025', start: 'Sat, Nov 1, 2025',  end: 'Sun, Nov 30, 2025', amount: '$681.55',   status: 'entered' },
  { provider: 'Summit Ridge Energy',             account: 'Main Building (#123-44102934)',    month: 'Nov 2025', start: 'Sat, Nov 1, 2025',  end: 'Sun, Nov 30, 2025', amount: '$1,890.60', status: 'entered' },
  { provider: 'Pacific Gas & Electric',          account: 'Main Building (#123-44102934)',    month: 'Nov 2025', start: 'Sat, Nov 1, 2025',  end: 'Sun, Nov 30, 2025', amount: '$778.90',   status: 'entered' },
  { provider: 'Apex Waste Solutions',            account: 'Main Building (#123-44102934)',    month: 'Nov 2025', start: 'Sat, Nov 1, 2025',  end: 'Sat, Nov 29, 2025', amount: '$1,755.20', status: 'entered' },
  { provider: 'SW Water Authority',              account: 'East Campus (#123-78900011)',       month: 'Nov 2025', start: 'Sat, Nov 1, 2025',  end: 'Sun, Nov 30, 2025', amount: '$945.30',   status: 'entered' },
  { provider: 'Summit Ridge Energy',             account: 'Cafeteria (#123-88120046)',        month: 'Nov 2025', start: 'Sat, Nov 1, 2025',  end: 'Sun, Nov 30, 2025', amount: '$498.70',   status: 'entered' },
  { provider: 'Clark Regional Wastewater Dist.', account: 'Main Building (#123-44102934)',    month: 'Nov 2025', start: 'Sat, Nov 1, 2025',  end: 'Sun, Nov 30, 2025', amount: '$499.10',   status: 'missing' },
  { provider: 'SW Water Authority',              account: 'West Annex (#123-55010044)',        month: 'Nov 2025', start: 'Sat, Nov 1, 2025',  end: 'Sun, Nov 30, 2025', amount: '$421.60',   status: 'entered' },
  { provider: 'Pacific Gas & Electric',          account: 'East Annex (#123-55872011)',       month: 'Nov 2025', start: 'Sat, Nov 1, 2025',  end: 'Sun, Nov 30, 2025', amount: '$534.80',   status: 'entered' },
  { provider: 'Apex Waste Solutions',            account: 'Admin Center (#123-66540021)',     month: 'Nov 2025', start: 'Sat, Nov 1, 2025',  end: 'Sat, Nov 29, 2025', amount: '$1,040.90', status: 'entered' },
  { provider: 'Summit Ridge Energy',             account: 'Gymnasium (#123-77801155)',        month: 'Nov 2025', start: 'Sat, Nov 1, 2025',  end: 'Sun, Nov 30, 2025', amount: '$1,388.40', status: 'entered' },
  { provider: 'SW Water Authority',              account: 'Main Building (#123-44102934)',    month: 'Oct 2025', start: 'Wed, Oct 1, 2025',  end: 'Fri, Oct 31, 2025', amount: '$1,067.30', status: 'entered' },
  { provider: 'Clark Regional Wastewater Dist.', account: 'East Annex (#123-55872011)',       month: 'Oct 2025', start: 'Wed, Oct 1, 2025',  end: 'Fri, Oct 31, 2025', amount: '$712.40',   status: 'entered' },
  { provider: 'Summit Ridge Energy',             account: 'Main Building (#123-44102934)',    month: 'Oct 2025', start: 'Wed, Oct 1, 2025',  end: 'Fri, Oct 31, 2025', amount: '$2,201.70', status: 'entered' },
  { provider: 'Pacific Gas & Electric',          account: 'Main Building (#123-44102934)',    month: 'Oct 2025', start: 'Wed, Oct 1, 2025',  end: 'Fri, Oct 31, 2025', amount: '$867.50',   status: 'entered' },
  { provider: 'Apex Waste Solutions',            account: 'Main Building (#123-44102934)',    month: 'Oct 2025', start: 'Wed, Oct 1, 2025',  end: 'Fri, Oct 31, 2025', amount: '$1,810.30', status: 'entered' },
  { provider: 'SW Water Authority',              account: 'East Campus (#123-78900011)',       month: 'Oct 2025', start: 'Wed, Oct 1, 2025',  end: 'Fri, Oct 31, 2025', amount: '$978.60',   status: 'entered' },
  { provider: 'Summit Ridge Energy',             account: 'Gymnasium (#123-77801155)',        month: 'Oct 2025', start: 'Wed, Oct 1, 2025',  end: 'Fri, Oct 31, 2025', amount: '$1,498.20', status: 'entered' },
  { provider: 'Pacific Gas & Electric',          account: 'East Annex (#123-55872011)',       month: 'Oct 2025', start: 'Wed, Oct 1, 2025',  end: 'Fri, Oct 31, 2025', amount: '$612.80',   status: 'entered' },
  { provider: 'Clark Regional Wastewater Dist.', account: 'Main Building (#123-44102934)',    month: 'Oct 2025', start: 'Wed, Oct 1, 2025',  end: 'Fri, Oct 31, 2025', amount: '$488.90',   status: 'entered' },
  { provider: 'Summit Ridge Energy',             account: 'Cafeteria (#123-88120046)',        month: 'Oct 2025', start: 'Wed, Oct 1, 2025',  end: 'Fri, Oct 31, 2025', amount: '$541.20',   status: 'missing' }
];

// Extend BILLS_DATA to 200 by cycling through existing entries with offset months
(function() {
  var base = BILLS_DATA.length;
  var months = ['Sep 2025','Aug 2025','Jul 2025','Jun 2025','May 2025','Apr 2025','Mar 2025'];
  var startDates = {
    'Sep 2025': 'Mon, Sep 1, 2025', 'Aug 2025': 'Fri, Aug 1, 2025',
    'Jul 2025': 'Tue, Jul 1, 2025', 'Jun 2025': 'Sun, Jun 1, 2025',
    'May 2025': 'Thu, May 1, 2025', 'Apr 2025': 'Tue, Apr 1, 2025',
    'Mar 2025': 'Sat, Mar 1, 2025'
  };
  var endDates = {
    'Sep 2025': 'Tue, Sep 30, 2025', 'Aug 2025': 'Sun, Aug 31, 2025',
    'Jul 2025': 'Thu, Jul 31, 2025', 'Jun 2025': 'Mon, Jun 30, 2025',
    'May 2025': 'Sat, May 31, 2025', 'Apr 2025': 'Wed, Apr 30, 2025',
    'Mar 2025': 'Mon, Mar 31, 2025'
  };
  var idx = 0;
  while (BILLS_DATA.length < 200) {
    var src = BILLS_DATA[idx % base];
    var m   = months[Math.floor(idx / base) % months.length];
    BILLS_DATA.push({
      provider: src.provider, account: src.account, month: m,
      start: startDates[m], end: endDates[m],
      amount: src.status === 'missing' ? '—' : src.amount,
      status: src.status
    });
    idx++;
  }
})();
