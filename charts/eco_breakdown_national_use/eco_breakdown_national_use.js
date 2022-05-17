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
            labels: {
              formatter: (val, index) => formatYAxisLabel(val, index, 0, true),
            },
          },
        },
      },
    ],
    stroke: {
      curve: "straight",
      width: 2.5,
    },
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
          text: "Fair Share",
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
          text: "Resources",
          style: {
            color: "#247BA0",
          },
        },
      },
    ],
    colors: ["#775DD0", "#FF4560", "#FEB019", "#00E396", "#008FFB", "#A5978B"],
    grid: {
      padding: {
        top: 0,
      },
    },
    legend: {
      fontSize: "12px",
      markers: { width: 10, height: 10, radius: 10, offsetY: "-2px" },
    },
    tooltip: {
      y: { formatter: (val, index) => formatTooltipVal(val, index, 0) },
    },
  };

  let years = [];
  for (
    let year = window.chart_data["eco_breakdown_national_use"].years.start,
      end = window.chart_data["eco_breakdown_national_use"].years.end;
    year <= end;
    ++year
  )
    years.push(year);

  let series = [
    { name: "Fair Share", data: [] },
    { name: "Resources", data: [] },
  ];

  let data = window.chart_data["eco_breakdown_national_use"].data;

  for (let i = 0; i < data.length; i++) {
    series[0]["data"].push(formatYAxisLabel(data[i]["fairShare"], 0, 0));
    series[1]["data"].push(formatYAxisLabel(data[i]["value"], 0, 0));
  }

  options["xaxis"] = {
    categories: years,
    tickAmount: 15,
    tooltip: { enabled: false },
  };
  options.series = series;

  return [
    createApexChart(canvasID, options),
    createApexChart(canvasID + "-2", options),
  ];
}

jQuery('#languageSelect').multiselect({
  columns: 1,
  placeholder: 'Select Languages',
  search: true,
  onOptionClick: function(r, element){
    const values = jQuery('#languageSelect').val();
    let innerHtml = ""
    values.forEach(val=>{
        innerHtml += "<span class='sel'>"+val+"</span>"
    })
    console.log(innerHtml)
    jQuery("#selected").html(innerHtml);

  }
});