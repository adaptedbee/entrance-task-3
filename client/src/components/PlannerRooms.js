import React, { Component } from 'react';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class PlannerRooms extends Component {
  constructor(props) {
    super(props);

    this.getFloorsData = this.getFloorsData.bind(this);
  }

  getFloorsData() {
    let rooms;
    let floorsNumbers;
    if (this.props.data.rooms) {
      rooms = Array.from(this.props.data.rooms);
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

    return (
      <div className="planner-rooms">
        {floorsNumbers ? floorsNumbers.map((floor) => {
          return (
            <section className="planner-rooms__floor" key={floor}>
              <h3 className="planner-rooms__floor-name">{floor} этаж</h3>
              <ul className="planner-rooms__rooms-list">
                {rooms.filter((room) => room.floor === floor).map((room) => {
                  return (
                    <li className="planner-rooms__room" key={room.id}>
                      <h4 className="planner-rooms__room-name">{room.title}</h4>
                      <p className="planner-rooms__room-capacity">{room.capacity} человек</p>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        }) : null}
      </div>
    );
  }
}

const ROOMS_QUERY = gql`query {
  rooms {
    id,
    title,
    floor,
    capacity
  }
}`;

const PlannerRoomsWithData = graphql(ROOMS_QUERY)(PlannerRooms);
export default PlannerRoomsWithData;
