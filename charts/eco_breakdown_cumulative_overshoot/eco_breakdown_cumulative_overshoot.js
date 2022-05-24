//--------------------------------------- window.ready
jQuery(function() {
  checkObjectKeysFunc();
  window.chart_data["eco_breakdown_cumulative_overshoot"] = {
    regions: {
      CHN: "China",
      EUK: "Europe and United Kingdom",
      HIC: "Rest of Europe and High Income Countries",
      SOU: "Rest of Global South",
      USA: "United States of America",
    },
    years: { start: 1970, end: 2017 },
  };

  importFilesAndShow_eco_breakdown_cumulative_overshoot();
});

//-------------------------------------- importFilesAndShow
function importFilesAndShow_eco_breakdown_cumulative_overshoot() {
  jQuery.get(
    `${
      window.charts_path
    }/${"eco_breakdown_cumulative_overshoot"}/${"eco_breakdown_cumulative_overshoot"}.csv`,
    function(eco_breakdown_cumulative_overshoot) {
      {
        window.chart_data["eco_breakdown_cumulative_overshoot"].data = fromCSV(
            eco_breakdown_cumulative_overshoot,
          ["string", "string", "number", "number"],
          false,
          ",",
          true
        );
        // Render Chart Interface
        var chart = createChartInterface({
          chartID: "eco_breakdown_cumulative_overshoot",
          renderFunc: render_eco_breakdown_cumulative_overshoot,
        });
      }
    }
  );
}
//--------------------------------------- showChart
function render_eco_breakdown_cumulative_overshoot(canvasID) {
  var chartID = "eco_breakdown_cumulative_overshoot";
  var options = {
    chart: {
      type: "area",
      stacked: true,
      height: "100%",
      fontFamily: "Open Sans",
      toolbar: {
        show: false,
        tools: { zoom: false },
      },
      selection: { enable: false },
    },
    theme: {
      palette: "palette1",
    },
    fill: { type: "solid", opacity: 0.7 },
    responsive: [
      {
        breakpoint: 960,
        options: {
          xaxis: { tickAmount: 10 },
        },
      },
      {
        breakpoint: 401,
        options: {
          //chart: {height: 300},
        },
      },
    ],
    dataLabels: {
      enabled: false,
    },
    yaxis: {
      min: 0,
      max: 1,
      tickAmount: 4,
      forceNiceScale: true,
      labels: {
        formatter: (val, index) => Math.round(val * 100) / 1 + ' %'
        ,
      },
    },
    tooltip: {
      y: {
        formatter: (val, index) => Math.round(val * 10000) / 100 + ' %',
      },
      followCursor: true,
      shared: false,
    },
    legend: {
      show: true,
    },
  };

  let data = window.chart_data["eco_breakdown_cumulative_overshoot"].data;
  console.log(data)

  let years = [];
  for (
    let year = window.chart_data[chartID].years.start,
      end = window.chart_data[chartID].years.end;
    year <= end;
    ++year
  )
    years.push(year);

  let series = [];

  Object.keys(window.chart_data[chartID].regions).forEach((region, i) => {
    series[i] = { name: window.chart_data[chartID].regions[region], data: [] };

    years.forEach((year) => {
        let data_cell = data[i][year];
        console.log(data_cell)
        if (isNaN(data_cell)==false) {
            series[i].data.push(data_cell)
        } else {
            series[i].data.push(null);
        }
    })
  });

//     years.forEach((year) => {
//       let data_row = data_hash["7_5"][year + "_" + region];
//       if (data_row) series[i].data.push(data_row["poor_pop"] * 1e6);
//       else series[i].data.push(null);
//     });
//   });

  options["chart"].id = "Share of responsibility for excess resource use by region".replace(/ /g, "");
  options["xaxis"] = {
    categories: years,
    tickAmount: 30,
    tooltip: { enabled: false },
  };
  options.series = series;
  return createApexChart(canvasID, options);
}
