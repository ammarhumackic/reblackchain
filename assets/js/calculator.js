Number.prototype.formatMoney = function(c, d, t){
  var n = this,
  c = isNaN(c = Math.abs(c)) ? 2 : c,
  d = d == undefined ? "." : d,
  t = t == undefined ? "," : t,
  s = n < 0 ? "-" : "",
  i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
  j = (j = i.length) > 3 ? j % 3 : 0;
  return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

var $infra = {
  hardware: document.getElementById('infra-hardware'),
  installation: document.getElementById('infra-installation'),
  taxes: document.getElementById('infra-taxes'),
  total: document.getElementById('infra-total')
}

var $revenue = {
  mined: document.getElementById('revenue-mined'),
  maintenance: document.getElementById('revenue-maintenance'),
  electricity: document.getElementById('revenue-electricity'),
  total: document.getElementById('revenue-total')
}

var $profits = {
  year_0: document.getElementById('profits-year-0'),
  year_2: document.getElementById('profits-year-2'),
  year_3: document.getElementById('profits-year-3')
}

var eth = 730 // ETH in EUR
var rate = 0.45 // ETH per month per miner

document.getElementById('eth-rate').innerHTML = 'EUR ' + eth

function calculate (numberOfMiners) {
  // Infra
  var hardware = 2900 * numberOfMiners
  var installation = 290 * numberOfMiners
  var taxes = 145 * numberOfMiners
  var cost_total = hardware + installation + taxes

  $infra.hardware.innerHTML = formatNumber(hardware)
  $infra.installation.innerHTML = formatNumber(installation)
  $infra.taxes.innerHTML = formatNumber(taxes)
  $infra.total.innerHTML = formatNumber(cost_total)

  // Revenue
  var mined = eth * rate * numberOfMiners
  var maintenance = mined * -0.2
  var electricity = -21.34 * numberOfMiners
  var revenue_total = mined + maintenance + electricity

  $revenue.mined.innerHTML = formatNumber(mined)
  $revenue.maintenance.innerHTML = formatNumber(maintenance)
  $revenue.electricity.innerHTML = formatNumber(electricity)
  $revenue.total.innerHTML = formatNumber(revenue_total)

  // Profits
  var total = cost_total * -1
  const profits = []
  for (var i = 0; i < 3; i++) {
    total += revenue_total * 12
    profits.push(Math.round(total))
  }


  var chartColors = {
    red: '#FA6C6C',
    green: '#27D694'
  }

  var color = Chart.helpers.color;
  var barChartData = {
    labels: ['One year', 'Two years', 'Three years'],
    datasets: [{
      label: 'Yearly Profit',
      backgroundColor: profits.map(function (profit) { return profit >= 0 ? chartColors.green : chartColors.red }),
      borderWidth: 1,
      data: profits
    }]
  };

  var ctx = document.getElementById('chart').getContext('2d');
  window.myBar = new Chart(ctx, {
    type: 'bar',
    data: barChartData,
    options: {
      responsive: true,
      legend: {
        display: false
      },
      scales: {
        yAxes: [{
          display: true,
          gridLines: { color: "rgba(0, 0, 0, 0)" },
          ticks: {
              max: profits[profits.length-1],
              callback: formatNumber
            },
        }]
      }
    }
  });
}

window.onload = function() {
  calculate(100)
}

function formatNumber (number) {
  minus = false ? '- ' : ''
  return minus + '€ ' + number.formatMoney(2, '.', ',')
}

document.getElementById('miners').addEventListener('keydown', function (e) {
  if (this.value > 9999999 && [8].indexOf(e.keyCode) < 0) {
    e.preventDefault()
  }
})

document.getElementById('miners').addEventListener('keyup', function (e) {
  calculate(this.value)
})

