// Uses d3 library

function transposeCSV(csv) {
  var data = {};
  for (var key in csv[0]){
    data[key] = []
  };
  csv.map(function(row) {
    for (var key in row){
      data[key].push(row[key])
    }
  }); 
  return data;
}

function render_demo2(canvasID) {

  var chartID = "demo2"
  d3.csv(`${window.path_to_charts}/${chartID}/${chartID}.csv`, (csv) => {
    var data = transposeCSV(csv)

    var options = {
      chart: {
        type: 'bar',
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
          enabled: false
        },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -5,
      },
      yaxis: {
        decimalsInFloat: 2,
      },
      series: [{
        name: 'var1',
        data: data['var1']
      },{
        name: 'var2',
        data: data['var2']
      },{
        name: 'var3',
        data: data['var3']
      }],
      xaxis: {
        categories: data['year']
      }
    }

    var chart = createApexChart(canvasID, chartID, options);
  });
}

createChartInterface({
  chartID:'demo2',
  chartTitle:"Demo2 Chart Title",
  chartDescription:"Demo2 Chart Description",
  chartSources:"Demo2 Chart Sources",
  renderFunc:render_demo2,
})