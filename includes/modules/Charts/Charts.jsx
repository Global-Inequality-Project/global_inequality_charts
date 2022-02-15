// External Dependencies
import React, { Component } from 'react';

// Internal Dependencies
// import '../../../style.css';
// import './_gip_chart_interface-main/style.css';


class Charts extends Component {

  static slug = 'glich_charts';

  render() {
    const Content = this.props.content;

    return (
      <h1>
        <Content/>
      </h1>
    );
  }
}

export default Charts;
