//--------------------------------------- window.ready
jQuery(function() {
  checkObjectKeysFunc();
  window.chart_data["carbon_inequality"] = {
    percentiles: { start: 1, end: 100 },
  };

  importFilesAndShow_carbon_inequality();
});

//-------------------------------------- importFilesAndShow
function importFilesAndShow_carbon_inequality() {
  jQuery.get(
    `${window.charts_path}/${"carbon_inequality"}/${"carbon_inequality"}.csv`,
    function(gdp_nrt_sth) {
      window.chart_data["carbon_inequality"].data = fromCSV(gdp_nrt_sth, [
        "string",
        "number",
        "number",
      ]);

      // Render Chart Interface
      createChartInterface({
        chartID: "carbon_inequality",
        renderFunc: render_carbon_inequality,
      });
    }
  );
}

//--------------------------------------- showChart
function render_carbon_inequality(canvasID) {
  var chartID = "carbon_inequality";
  var options = {
    chart: {
      type: "bar",
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
      type: "numeric",
      tickAmount: 20,
      tickPlacement: "between",
      labels: {
        rotateAlways: true,
        formatter: (percentile) => formatPercentileLabel(percentile),
        maxHeight: 60,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      max: 110,
      tickAmount: 5,
      labels: {
        formatter: (val, index) =>
          formatYAxisLabel(val, index, 0, true) + " TpC",
      },
    },
    grid: {
      padding: {
        top: 0,
      },
    },
    tooltip: {
      y: {
        formatter: (val, index) => formatTooltipVal(val, index, 2) + " TpC",
        title: {
          formatter: (seriesName) => "",
        },
      },
      x: {
        formatter: (val) => "Percentile: " + val,
      },
    },
    legend: {
      show: false,
    },
  };

  let data = window.chart_data["carbon_inequality"].data;
  let data_hash = makeHash(data, "percentile");

  let percentiles = [];
  for (
    let percentile = window.chart_data["carbon_inequality"].percentiles.start,
      end = window.chart_data["carbon_inequality"].percentiles.end;
    percentile <= end;
    ++percentile
  )
    percentiles.push(percentile);

  let series = [{ name: "CO2 Emissions per capita (2019)", data: [] }];

  percentiles.forEach((percentile) => {
    let data_row = data_hash[percentile];
    if (data_row) series[0].data.push(data_row["co2_emissions"]);
    else series[0].data.push(null);
  });

  options["chart"].id = "CO2 Emissions per capita".replace(/ /g, "");
  options.series = series;

  return createApexChart(canvasID, options);
}
