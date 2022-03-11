// External Dependencies
import React, { Component } from 'react';

// Internal Dependencies
import './style.css';
// import './_gip_chart_interface-main/style.css';


class Charts extends Component {

  static slug = 'glich_charts';

  render() {
    // currently used for divi editor rendering
    const chartType = this.props.charttype;
    console.log(chartType, this.props);
    return (

      <div className="glich-backend">
        <h1>Global Inequality chart</h1>
        <small className="glich-subtitle"> {chartType} </small>
      </div>
    );
  }
}

export default Charts;
