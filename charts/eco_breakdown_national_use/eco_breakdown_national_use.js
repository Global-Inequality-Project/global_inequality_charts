//--------------------------------------- window.ready
jQuery(function () {
  checkObjectKeysFunc();
  window.chart_data["eco_breakdown_national_use"] = {
    years: { start: 1970, end: 2017 },
  };

  importFilesAndShow_eco_breakdown_national_use();
});

//-------------------------------------- importFilesAndShow
function importFilesAndShow_eco_breakdown_national_use() {
  var chartID = "eco_breakdown_national_use";

  loadJson(`${window.charts_path}/${chartID}/data.json`, function (
    err,
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
  let years = [];
  for (
    let year = window.chart_data["eco_breakdown_national_use"].years.start,
    end = window.chart_data["eco_breakdown_national_use"].years.end;
    year <= end;
    ++year
  )
    years.push(year);

  let series = [{ name: "Ratio", data: [] }];

  let data = window.chart_data["eco_breakdown_national_use"].data;

  for (let i = 0; i < 48; i++) {
    series[0]["data"].push(data[0]["biophysical"]["ratio"]["MF"][i]);
  }

  let options = {
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
          // decrease font size at responsive view
          annotations: {
            yaxis: [
              {
                y: 1,
                borderColor: "#9A0000",
                borderWidth: 5,
                strokeDashArray: 5,
                offsetY: 2.5,
                label: {
                  text: "Fair Share",
                  position: "left",
                  textAnchor: "start",
                  borderColor: "#9A0000",
                  offsetY: 1,
                  offsetX: 5,
                  style: {
                    color: "#fff",
                    fontSize: "8px",
                    background: "#9A0000",
                  },
                },
              },
            ],
          },
          xaxis: { tickAmount: 10 },
        },
      },
      {
        breakpoint: 401,
        options: {
          yaxis: {
            tickAmount: 5,
            min: 0,
            max:
              Math.max.apply(Math, series[0]["data"]) > 1
                ? Math.max.apply(Math, series[0]["data"])
                : 1,
            forceNiceScale: true,
          },
        },
      },
    ],
    yaxis: {
      min: 0,
      max:
        Math.max.apply(Math, series[0]["data"]) > 1
          ? Math.max.apply(Math, series[0]["data"])
          : 1,
      forceNiceScale: true,
    },
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
    annotations: {
      yaxis: [
        {
          y: 1,
          borderColor: "#9A0000",
          borderWidth: 5,
          strokeDashArray: 5,
          offsetY: 2.5,
          label: {
            text: "Fair Share",
            position: "left",
            textAnchor: "start",
            borderColor: "#9A0000",
            offsetY: 1,
            offsetX: 5,
            style: {
              color: "#fff",
              fontSize: "12px",
              background: "#9A0000",
            },
          },
        },
      ],
    },
  };

  options["xaxis"] = {
    categories: years,
    tooltip: { enabled: false },
    tickAmount: 20,
  };
  options.series = series;

  const canvasID2 = canvasID + "-2";


  function createDropdownForChart(id) {
    let dropdown = `
    <div class="wrapper">
      <select name="countrySelect[]" id="countrySelect">
         `;
    data.forEach((element) => {
      let opt = document.createElement("option");
      opt.value = element["country"];
      opt.innerHTML = element["country"];
      dropdown += opt.outerHTML;
    });
    dropdown += `
      </select>
    </div>
    <div id="${id.replace("#", "")}-chart"></div>
    `;
    jQuery(id).append(dropdown);
  }
  function createSelectedChart(
    series,
    country_data,
    options,
    chart
  ) {
    series[0]["data"] = [];
    for (let i = 0; i < 48; i++) {
      series[0]["data"].push(country_data["biophysical"]["ratio"]["MF"][i]);
    }
    options.series = series;
    options.yaxis = {
      min: 0,
      max:
        Math.max.apply(Math, series[0]["data"]) > 1
          ? Math.max.apply(Math, series[0]["data"])
          : 1,
      forceNiceScale: true,
    };
    chart.updateOptions(options)
  }
  
  createDropdownForChart(canvasID)
  createDropdownForChart(canvasID2)
  let chart = createApexChart(canvasID + "-chart", options);
  let chart2 = createApexChart(canvasID2 + "-chart", options);

  //Append dropdown menu

  jQuery(".wrapper:first-child").on("change", function (e) {
    let country = e.target.value;
    let country_data = data.find((element) => element.country == country);

    parentid = e.target.parentNode.parentNode.getAttributeNode("id").value;
    if (parentid == "chart-canvas-eco_breakdown_national_use") {
      createSelectedChart(series, country_data, options, chart);
    } else if (parentid == "chart-canvas-eco_breakdown_national_use-2") {
      createSelectedChart(series, country_data, options, chart2);
    } else {
      throw new Error("Wrong identifier");
    }
  });

  return [chart, chart2];
}
