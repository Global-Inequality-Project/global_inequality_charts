//--------------------------------------- window.ready
jQuery(function() {
  checkObjectKeysFunc();
  window.chart_data["inequality_gini_coefficient"] = {
    years: { start: 1960, end: 2020 },
    data: { absolute: null, relative: null },
    customChoice: 0,
  };

  importFilesAndShow_inequality_gini_coefficient();
});

//-------------------------------------- importFilesAndShow
function importFilesAndShow_inequality_gini_coefficient() {
  const baseUrl = `${
    window.charts_path
  }/${"inequality_gini_coefficient"}/${"inequality_gini_coefficient"}`;

  jQuery.get(baseUrl + "_absolute.csv", function(
    inequality_gini_coefficient_absolute
  ) {
    window.chart_data["inequality_gini_coefficient"].data[
      "absolute"
    ] = fromCSV(inequality_gini_coefficient_absolute, [
      "string",
      "number",
      "number",
    ]);
    jQuery.get(baseUrl + "_relative.csv", function(
      inequality_gini_coefficient_relative
    ) {
      window.chart_data["inequality_gini_coefficient"].data[
        "relative"
      ] = fromCSV(inequality_gini_coefficient_relative, [
        "string",
        "number",
        "number",
      ]);

      // Create custom tools for the sidebar (optional)
      let customTools = `
         <button onclick="toggleChartArea(this, 'choice', 'inequality_gini_coefficient')" value="OFF" class="chart-btn">
           <i class="fa-solid fa-sliders"></i>Scale to
         </button>

         <div class="chart-btn-area" id="chart-inequality_gini_coefficient-choice-btns">

           <button class="chart-btn" id="inequality_gini_coefficient-choice-1" onclick="setChoice_inequality_gini_coefficient(0)">
             <i class="fa-solid fa-square-check"></i>Absolute gini coefficient
           </button>

           <button class="chart-btn" id="inequality_gini_coefficient-choice-2" onclick="setChoice_inequality_gini_coefficient(1)">
             <i class="fa-solid fa-square"></i></i>Relative gini coefficient
           </button>

         </div>
         `;

      // Render Chart Interface
      createChartInterface({
        chartID: "inequality_gini_coefficient",
        renderFunc: render_inequality_gini_coefficient,
        customTools: customTools,
      });
    });
  });
}

//--------------------------------------- showChart
function render_inequality_gini_coefficient(canvasID) {
  let chartID = "inequality_gini_coefficient";

  let options = {};
  let customChoice = window.chart_data[chartID].customChoice;
  options = createOptions_gini(chartID, customChoice);
  console.log(options);

  return createApexChart(canvasID, options);
}

function createOptions_gini(chartID, gini_coefficient) {
  let data = window.chart_data[chartID].data;
  let data_hash = {};
  Object.keys(data).forEach((pLine, i) => {
    data_hash[pLine] = makeHash(data[pLine], "year");
  });

  let years = [];
  for (
    let year = window.chart_data[chartID].years.start,
      end = window.chart_data[chartID].years.end;
    year <= end;
    ++year
  )
    years.push(year);

  let series = [
    { name: "Absolute", data: [] },
    { name: "Relative", data: [] },
  ];
  years.forEach((year) => {
    Object.keys(data).forEach((pLine, i) => {
      let data_row = data_hash[pLine][year];
      if (i === gini_coefficient) {
        if (data_row && i === gini_coefficient) {
          series[0].data.push(data_row["all_countries"]);
          series[1].data.push(data_row["all_countries_w/o_china"]);
        } else {
          series[0].data.push(null);
          series[1].data.push(null);
        }
      }
    });
  });

  let options = {
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
      },
      axisTicks: {
        show: false,
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

  if (gini_coefficient == 0) {
    options.yaxis = {
      tickAmount: 5,
      forceNiceScale: true,
      min: 0,
      labels: {
        formatter: (val, index) => (val < 1 && val != 0 ? val.toFixed(1) : val),
      },
    };
  } else {
    options.yaxis = {
      tickAmount: 5,
      forceNiceScale: true,
      min: 0,
      max: 1,
      labels: {
        formatter: (val, index) => (val < 1 && val != 0 ? val.toFixed(1) : val),
      },
    };
  }
  options["chart"].id = chartID;
  options["xaxis"] = {
    categories: years,
    tickAmount: 30,
    tooltip: { enabled: false },
  };
  options.series = series;

  return options;
}

// Function to change gini coefficientö
function setChoice_inequality_gini_coefficient(choice) {
  const chartID = "inequality_gini_coefficient";
  let chart = window.charts[chartID];
  let data = window.chart_data[chartID];
  window.chart_data[chartID].customChoice = choice;

  let btn1 = document.getElementById(`inequality_gini_coefficient-choice-1`);
  let btn2 = document.getElementById(`inequality_gini_coefficient-choice-2`);

  if (choice == 0) {
    btn1.innerHTML = `<i class="fa-solid fa-square-check"></i>Absolute gini coefficient`;
    btn2.innerHTML = `<i class="fa-solid fa-square"></i>Relative gini coefficient`;
    let options = createOptions_gini(chartID, choice);
    chart.updateOptions(options);
  } else if (choice == 1) {
    btn1.innerHTML = `<i class="fa-solid fa-square"></i>Absolute gini coefficient`;
    btn2.innerHTML = `<i class="fa-solid fa-square-check"></i>Relative gini coefficient`;
    let options = createOptions_gini(chartID, choice);
    chart.updateOptions(options);
  }
}
