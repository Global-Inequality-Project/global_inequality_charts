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

function render_demo1(canvasID) {

  var chartID = "demo1"
  d3.csv(`${window.charts_path}/${chartID}/${chartID}.csv`, (csv) => {
    var data = transposeCSV(csv);

    // console.log(data)
    var options = {
      chart: {
        type: 'line',
        toolbar: {
          show: false,
        },
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
      },
      grid: {
          padding: {
              bottom: 0,
              left: 10,
              right: 0,
              top: 0,
          }
      },
    }

    function callback(chart) {
      chart.hideSeries('var2');
      chart.hideSeries('var3');
    }

    var chart = createApexChart(canvasID, chartID, options, callback);
    
  });
}

createChartInterface({
  chartID:'demo1',
  renderFunc:render_demo1,
})