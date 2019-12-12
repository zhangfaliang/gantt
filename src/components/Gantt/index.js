import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Generator from './Generator';
import TimeLine from 'react-gantt-timeline';
import './index.css';

class Gantt extends Component {
  constructor(props) {
    super(props);
    let result = Generator.generateData();
    this.data = result.data;
    this.state = {
      itemheight: 20,
      data: [],
      links: result.links
    };
  }

  onHorizonChange = (start, end) => {
    //Return data the is in the range
    let result = this.data.filter(item => {
      return (
        (item.start < start && item.end > end) ||
        (item.start > start && item.start < end) ||
        (item.end > start && item.end < end)
      );
    });
    console.log('Calculating ');
    this.setState({ data: result });
  };

  render() {
    return (
      <div className="app-container">
        <div className="nav-container">
          <div className="mode-container-title">
            On Horizon Change Demo with client side Filtering
          </div>
        </div>
        <div className="time-line-container">
          <TimeLine
            data={this.state.data}
            links={this.state.links}
            onHorizonChange={this.onHorizonChange}
          />
        </div>
      </div>
    );
  }
}

export default Gantt;
