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

  loadJson(`${window.charts_path}/${chartID}/data.json`, function(err,
    eco_breakdown_national_use
  ) {
    window.chart_data[chartID].data = eco_breakdown_national_use;

    // Render Chart Interface
    createChartInterface({
      chartID: "eco_breakdown_national_use",
      renderFunc: render_eco_breakdown_national_use,
    });
  });
}

//--------------------------------------- showChart
function render_eco_breakdown_national_use(canvasID, selected = false) {
  let options, options2;
  options = options2 = {
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
            tickAmount: 15,
          },
        },
      },
    ],
    stroke: {
      curve: "straight",
      width: 2.5,
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
  let series, series2;

  series = series2 = [
    { name: "Ratio", data: [] },
  ];

  let data = window.chart_data["eco_breakdown_national_use"].data;

  for (let i = 0; i < 48; i++) {
    series[0]["data"].push(data[0]["biophysical"]["ratio"]["MF"][i]);
    series2[0]["data"].push(data[0]["biophysical"]["ratio"]["MF"][i]);
  }
  console.log(series)
  console.log(series2)


  options["xaxis"] = {
    categories: years,
    tooltip: { enabled: false },
  };
  options.series = series;
  options2.series = series;

  let chart = createApexChart(canvasID, options);
  let chart2 = createApexChart(canvasID + "-2", options2);

  createDropdown(chart, chart2, canvasID, canvasID+'-2', data, series, options)

  return [chart, chart2];
}

function createDropdown(chart, chart2, canvasID, canvasID2, data, series, options){
  let dropdown = `
<div class="wrapper">
  <select name="countrySelect[]" id="countrySelect">
     `;
  data.forEach(element => {
    let opt = document.createElement('option');
    opt.value = element['country'];
    opt.innerHTML = element['country'];
    dropdown += opt.outerHTML;
    })
  dropdown += `
  </select>
</div>
`;
  //Append dropdown menu
  jQuery(canvasID).append(dropdown);
  jQuery(canvasID2).append(dropdown);

  jQuery("#countrySelect").on("change", function(e) {
    let country = e.target.value
    let country_data = data.find(element=>element.country == country)
    series[0]["data"] = []
    for (let i = 0; i < 48; i++) {
      series[0]["data"].push(country_data["biophysical"]["ratio"]["MF"][i]);
    }
    options.series = series;
    console.log(chart)
    let canvas = document.getElementById("chart-canvas-eco_breakdown_national_use");
    console.log(canvas)
    let childNode = canvas.removeChild(canvas.lastChild)
    //var divtest = document.createElement("div");
    //divtest.innerHTML = createApexChart(canvasID, options)
    canvas.appendChild(createApexChart(canvasID, options));

    //jQuery(canvasID).remove();
    //createDropdown(chart, chart2, canvasID, canvasID2, data, series, options)
    // chart2.updateSeries (
    //   series
    // )
    //chart2.updateSeries = createApexChart(canvasID + "-2", options);


    return true;
  });
}
