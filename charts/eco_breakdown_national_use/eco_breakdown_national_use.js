//--------------------------------------- window.ready
jQuery(function() {
  checkObjectKeysFunc();
  window.chart_data["eco_breakdown_national_use"] = {
    years: { start: 1970, end: 2017 },
  };

  importFilesAndShow_eco_breakdown_national_use();
});

//-------------------------------------- importFilesAndShow
function importFilesAndShow_eco_breakdown_national_use() {
  var chartID = "eco_breakdown_national_use";

  jQuery.get(`${window.charts_path}/${chartID}/single_country.csv`, function(
    eco_breakdown_national_use
  ) {
    window.chart_data[chartID].data = fromCSV(eco_breakdown_national_use, [
      "string",
      "string",
      "number",
      "number",
      "number",
      "string",
    ]);

    // Render Chart Interface
    createChartInterface({
      chartID: "eco_breakdown_national_use",
      renderFunc: render_eco_breakdown_national_use,
    });
  });
}

//--------------------------------------- showChart
function render_eco_breakdown_national_use(canvasID) {
  let data = window.chart_data["eco_breakdown_national_use"].data;

  var options = {
    chart: {
      type: "line",
      height: "100%",
      fontFamily: "Open Sans",
      toolbar: {
        show: false,
        tools: { zoom: false },
      },
    },
    theme: {
      palette: "palette7",
    },
    responsive: [
      {
        breakpoint: 961,
        options: {
          xaxis: { tickAmount: 10 },
        },
      },
      {
        breakpoint: 401,
        options: {
          yaxis: {
            tickAmount: 5,
          },
        },
      },
    ],
    stroke: {
      curve: "straight",
      width: 2.5,
    },
    series: [
      {
        name: "Series A",
        data: [1.4, 2, 2.5, 1.5, 2.5, 2.8, 3.8, 4.6],
      },
      {
        name: "Series B",
        data: [20, 29, 37, 36, 44, 45, 50, 58],
      },
    ],
    yaxis: [
      {
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: "#FF1654",
        },
        labels: {
          style: {
            colors: "#FF1654",
          },
        },
        title: {
          text: "Series A",
          style: {
            color: "#FF1654",
          },
        },
      },
      {
        opposite: true,
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: "#247BA0",
        },
        labels: {
          style: {
            colors: "#247BA0",
          },
        },
        title: {
          text: "Series B",
          style: {
            color: "#247BA0",
          },
        },
      },
    ],
    xaxis: {
      categories: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016]
    },
    colors: ["#775DD0", "#FF4560", "#FEB019", "#00E396", "#008FFB", "#A5978B"],
    grid: {
      padding: {
        top: 0,
      },
    },
    legend: {
      fontSize: "12px",
      markers: { width: 10, height: 10, radius: 10, offsetY: "-2px" },
      horizontalAlign: "left",
      offsetX: 40,
    },
    tooltip: {
      shared: false,
      intersect: true,
      x: {
        show: false,
      },
    },
    legend: {
      horizontalAlign: "left",
      offsetX: 40,
    },
  };

  options["chart"].id = "GDP per capita Global North vs Global South".replace(
    / /g,
    ""
  );

  return [
    createApexChart(canvasID, options),
    createApexChart(canvasID + "-2", options),
  ];
}
