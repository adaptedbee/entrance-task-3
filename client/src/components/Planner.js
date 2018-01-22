import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Calendar from '../components/Calendar';
import PlannerRooms from '../components/PlannerRooms';
import PlannerDiagram from '../components/PlannerDiagram';
import { LEFT_PADDING, HOUR_WIDTH, DAY_START, DAY_END } from '../constants'

class Planner extends Component {
  constructor() {
    super();

    let date = new Date();
    this.state = {
      date: date.toISOString(),
      scrolling: false,
      menuHidden: false
    };

    this.updateDate = this.updateDate.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.hideMenu = this.hideMenu.bind(this);
  }

  getLeftTimeMark() {
    let today = new Date();
    let hours = today.getHours();
    const minutes = today.getMinutes();

    if (hours <= DAY_START) {
      return `${LEFT_PADDING}px`;
    } else if (hours >= DAY_END) {
      return `${LEFT_PADDING + (DAY_END - DAY_START) * HOUR_WIDTH}px`;
    } else {
      return `${LEFT_PADDING + (hours - DAY_START) * HOUR_WIDTH + (minutes / 60) * HOUR_WIDTH }px`;
    }
  }

  generateHoursMarks() {
    let marks = [];

    for (let i = DAY_START; i <= DAY_END; i++) {
      marks.push(<li key={i}><span className="planner__hour-mark">{i}</span></li>);
    }

    return marks;
  }

  updateDate(date) {
    this.setState({
      date: date.toISOString()
    });
  }

  isDateToday = (date) => {
    let today = new Date(this.state.date);
    let otherDate = new Date(date);

    if (today.getYear() === otherDate.getYear() &&
      today.getMonth() === otherDate.getMonth() &&
      today.getDay() === otherDate.getDay()) {
      return true;
    } else {
      return false;
    }
  }

  handleScroll(event) {
    if (event.nativeEvent.target === this.PlannerWrapper) {
      this.setState({
        scrolling: true
      });
    }
  }

  hideMenu(flag) {
    this.setState({
      menuHidden: flag
    });
  }

  render() {
    let today = new Date();
    let todayTimeString = today.toLocaleString("ru", {
      hour: "numeric",
      minute: "numeric"
    });

    return (
      <section className="planner">
        <Calendar date={this.state.date} updateDate={this.updateDate} />
        <div className="planner__wrapper" onScroll={this.handleScroll}
          ref={(div) => this.PlannerWrapper = div}>
          <div className={`planner__left-column
            ${this.state.scrolling ? "planner__left-column--above" : ""}
            ${this.state.menuHidden ? "planner__left-column--hidden" : ""}`}>
            <PlannerRooms />
          </div>

          <div className="planner__right-column">
            <ul className="planner__hours-list">
              {this.isDateToday(Date.now()) ? <li className="planner__current-time" style={{left: this.getLeftTimeMark()}}>
                <span className="planner__hour-mark planner__hour-mark--current">
                  {todayTimeString}
                </span>
              </li> : null}
              {this.generateHoursMarks()}
            </ul>
            <PlannerDiagram newMeeting={this.props.newMeeting} date={this.state.date} hideMenu={this.hideMenu} />
          </div>
        </div>
      </section>
    );
  }
}

Planner.propTypes = {
  newMeeting: PropTypes.func
};

export default Planner;
