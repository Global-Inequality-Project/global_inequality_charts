//--------------------------------------- window.ready
jQuery(function() {
  checkObjectKeysFunc();
  window.chart_data["inequality_gini_coefficient"] = {
    years: { start: 1960, end: 2020 },
  };

  importFilesAndShow_inequality_gini_coefficient();
});

//-------------------------------------- importFilesAndShow
function importFilesAndShow_inequality_gini_coefficient() {
  jQuery.get(
    `${
      window.charts_path
    }/${"inequality_gini_coefficient"}/${"inequality_gini_coefficient"}.csv`,
    function(inequality_gini_coefficient) {
      window.chart_data[
        "inequality_gini_coefficient"
      ].data = fromCSV(inequality_gini_coefficient, [
        "string",
        "number",
        "number",
      ]);

      // Render Chart Interface
      createChartInterface({
        chartID: "inequality_gini_coefficient",
        renderFunc: render_inequality_gini_coefficient,
      });
    }
  );
}

//--------------------------------------- showChart
function render_inequality_gini_coefficient(canvasID) {
  var options = {
    chart: {
      type: "line",
      height: "100%",
      fontFamily: "Open Sans",
      toolbar: {
        show: false,
        tools: { zoom: false },
      },
      selection: { enable: false },
    },
    theme: {
      palette: "palette6",
    },
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
    xaxis: {
      tickAmount: 20,
      tickPlacement: "between",
      labels: {
        rotateAlways: true,
        formatter: (val, index) => formatYAxisLabel(val, index, 0, true),
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      tickAmount: 5,
      forceNiceScale: true,
      labels: {
        formatter: (val, index) => formatYAxisLabel(val, index, 2),
      },
    },
    grid: {
      padding: {
        top: 0,
      },
    },
    tooltip: {
      y: {
        formatter: (val, index) => formatYAxisLabel(val, index, 2),
        title: {
          formatter: (seriesName) => "",
        },
      },
      x: {
        formatter: (val, index) => "Year: " + val,
      },
      followCursor: true,
      shared: false,
    },
    legend: {
      show: false,
    },
  };

  let data = window.chart_data["inequality_gini_coefficient"].data;
  let data_hash = makeHash(data, "year");

  let years = [];
  for (
    let year = window.chart_data["inequality_gini_coefficient"].years.start,
      end = window.chart_data["inequality_gini_coefficient"].years.end;
    year <= end;
    ++year
  )
    years.push(year);

  let series = [
    { name: "Absolute gini", data: [] },
    { name: "Relative gini", data: [] },
  ];

  years.forEach((year) => {
    let data_row = data_hash[year];
    if (data_row) {
      series[0].data.push(data_row["all_countries"]);
      series[1].data.push(data_row["all_countries_w/o_china"]);
    } else {
      series[0].data.push(null);
      series[1].data.push(null);
    }
  });
  console.log(series)
  options.series = series;
  options["xaxis"] = {
    categories: years,
    tickAmount: 30,
    tooltip: { enabled: false },
  };

  return createApexChart(canvasID, options);
}
