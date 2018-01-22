import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MeetingTooltip from '../components/MeetingTooltip';
import { LEFT_PADDING, HOUR_WIDTH, DAY_START, DAY_END } from '../constants'

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

class PlannerDiagram extends Component {
  constructor() {
    super();
    this.state = {
      tooltipOpen: null,
      showButton: false
    };

    this.Buttons = [];
    this.Tooltips = [];
    this.getFloorsData = this.getFloorsData.bind(this);
  }

  openMeetingTooltip = (eventId) => () => {
    if (this.state.tooltipOpen) {
      this.setState({
        tooltipOpen: null
      });
      this.props.hideMenu(false);
    } else {
      this.setState({
        tooltipOpen: eventId
      });
      this.props.hideMenu(true);
    }
  }

  getMeetingLeft(startDate) {
    const date = new Date(startDate);
    const hours = date.getHours();
    const minutes = date.getMinutes();

    if (hours <= DAY_START) {
      return `${LEFT_PADDING}px`;
    } else if (hours >= DAY_END) {
      return `${LEFT_PADDING + (DAY_END - DAY_START) * HOUR_WIDTH}px`;
    } else {
      return `${LEFT_PADDING + (hours - DAY_START) * HOUR_WIDTH + (minutes / 60) * HOUR_WIDTH }px`;
    }
  }

  getMeetingWidth(startDate, endDate) {
    const dateStart = new Date(startDate);
    const dateEnd = new Date(endDate);
    const minutes = (dateEnd - dateStart) / (1000 * 60);
    const HOUR_WIDTH = 66;

    return `${(minutes / 60) * HOUR_WIDTH}px`;
  }

  showAddButton = (roomId) => (event) => {
    let addButton = this.Buttons[roomId];
    addButton.style.left = event.nativeEvent.offsetX + "px";
    addButton.classList.add("planner-diagram__add-button--active");
  }

  hideAddButton = (roomId) => () => {
    let button = this.Buttons[roomId];
    button.classList.remove("planner-diagram__add-button--active");
  }

  isDateToday = (date) => {
    let today = new Date(this.props.date);
    let otherDate = new Date(date);

    if (today.getYear() === otherDate.getYear() &&
      today.getMonth() === otherDate.getMonth() &&
      today.getDay() === otherDate.getDay()) {
      return true;
    } else {
      return false;
    }
  }

  getFloorsData() {
    let rooms;
    let floorsNumbers;
    if (this.props.RoomsQuery.rooms) {
      rooms = Array.from(this.props.RoomsQuery.rooms);
      rooms.sort((a, b) => {
        return a.floor - b.floor;
      });

      floorsNumbers = rooms.map((room) => {
        return room.floor;
      }).filter((elem, pos, arr) => {
        return arr.indexOf(elem) === pos;
      });
    }

    return { rooms, floorsNumbers };
  }

  render() {
    let { rooms, floorsNumbers } = this.getFloorsData();
    let events = this.props.EventsQuery.events;

    return (
      <div className="planner-diagram">
        {floorsNumbers ? floorsNumbers.map((floor) => {
          return(
            <section className="planner-diagram__floor" key={floor}>
              {rooms.filter((room) => room.floor === floor).map((room) => {
                return(
                  <div className="planner-diagram__line-wrapper"
                    onMouseEnter={this.showAddButton(room.id)}
                    onMouseLeave={this.hideAddButton(room.id)} key={room.id}>
                    {events ? events.filter((event) => {
                      return this.isDateToday(event.dateStart) && event.room.id === room.id;
                    }).map((event) => {
                      return(
                        <div className={`planner-diagram__meeting ${this.state.tooltipOpen === event.id ? "planner-diagram__meeting--active" : ""}`}
                          style={{left: this.getMeetingLeft(event.dateStart),
                          width: this.getMeetingWidth(event.dateStart, event.dateEnd)}}
                          onClick={this.openMeetingTooltip(event.id)}
                          key={event.id}>
                          <MeetingTooltip meeting={event} room={room}
                            open={this.state.tooltipOpen === event.id}
                            ref={(tooltip) => this.Tooltips[event.id] = tooltip} />
                        </div>
                      );
                    }) : null}
                    <div className="planner-diagram__line"></div>
                    <button className="planner-diagram__add-button"
                      ref={(button) => this.Buttons[room.id] = button}
                      onClick={this.props.newMeeting(room.id, this.props.date)}>
                      <span className="visually-hidden">Создать встречу</span>
                    </button>
                  </div>
                );
              })}
            </section>
          )
        }) : null}
        {this.isDateToday(Date.now()) ? <div className="planner-diagram__current-time" style={{left: this.getMeetingLeft(Date.now())}}></div> : null}
      </div>
    );
  }
}

PlannerDiagram.propTypes = {
  hideMenu: PropTypes.func,
  date: PropTypes.string,
  newMeeting: PropTypes.func
};

const ROOMS_QUERY = gql`query {
  rooms {
    id,
    title,
    floor,
    capacity
  }
}`;
const EVENTS_QUERY = gql`query {
  events{
    id,
    title,
    users {
      id,
      login,
      homeFloor,
      avatarUrl
    },
    dateEnd,
    dateStart,
    room {
      id
    }
  }
}`;

const PlannerDiagramWithData = compose(
  graphql(ROOMS_QUERY, { name: "RoomsQuery" }),
  graphql(EVENTS_QUERY, { name: "EventsQuery" })
)(PlannerDiagram);
export default PlannerDiagramWithData;
