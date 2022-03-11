// External Dependencies
import React, { Component } from 'react';

// Internal Dependencies
import './style.css';
// import './_gip_chart_interface-main/style.css';


class Charts extends Component {

  static slug = 'glich_charts';

  render() {
    const Content = this.props.content;

    return (
      <div className="glich">
        <h1>Global Inequality chart</h1>
        <Content/>
      </div>
    );
  }
}

export default Charts;
