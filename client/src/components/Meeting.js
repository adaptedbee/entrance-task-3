import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

class Meeting extends Component {
  constructor(props) {
    super(props);

    const date = props.date ? new Date(props.date) : new Date();
    const dateStr = date.toISOString().slice(0, 10);
    this.state = {
      meetingTitle: "",
      meetingDate: dateStr,
      startTime: props.startTime.length === 5 ? props.startTime : "08:00",
      endTime: "23:00",
      selectedUsers: null,
      selectedRoom: props.room || null,
      message: ""
    };

    this.updateMeetingTitle = this.updateMeetingTitle.bind(this);
    this.updateMeetingDate = this.updateMeetingDate.bind(this);
    this.updateStartTime = this.updateStartTime.bind(this);
    this.updateEndTime = this.updateEndTime.bind(this);

    this.isValid = this.isValid.bind(this);
    this.saveMeeting = this.saveMeeting.bind(this);
  }

  updateMeetingTitle(event) {
    this.setState({
      meetingTitle: event.target.value
    });
  }

  updateMeetingDate(event) {
    this.setState({
      meetingDate: event.target.value
    });
  }

  updateStartTime(event) {
    this.setState({
      startTime: event.target.value
    });
  }

  updateEndTime(event) {
    this.setState({
      endTime: event.target.value
    });
  }

  updateSelectedUsers = (values) => {
    let usersIds = values.map((value) => value.id);
    this.setState({
      selectedUsers: usersIds
    });
  }

  chooseRoom = (roomId) => (event) => {
    this.setState({
      selectedRoom: roomId
    });
  }

  unchooseRoom = (event) => {
    event.stopPropagation();
    this.setState({
      selectedRoom: null
    });
  }

  isValid() {
    if (this.state.meetingTitle === "" || this.state.meetingDate === "" ||
      this.state.startTime === "" || this.state.endTime === "" ||
      this.state.selectedRoom === null) {
      return false;
    } else {
      return true;
    }
  }

  saveMeeting() {
    if (!this.isValid()) {
      return;
    } else {
      let dateStart = new Date(`${this.state.meetingDate}T${this.state.startTime}:00.001Z`);
      let dateEnd = new Date(`${this.state.meetingDate}T${this.state.endTime}:00.001Z`);
      dateStart.setHours(this.state.startTime.slice(0, 2));
      dateEnd.setHours(this.state.endTime.slice(0, 2));

      this.props.CreateMeetingMutation({
        variables: {
          input: {
            title: this.state.meetingTitle,
            dateStart: dateStart,
            dateEnd: dateEnd
          },
          usersIds: this.state.selectedUsers,
          roomId: this.state.selectedRoom
        }
      }).then(({ data }) => {
        this.props.hide(data);
      }).catch((error) => {
        console.log("Ошибка при отправке запроса", error);
      });
    }

  }

  render() {
    let users = this.props.UsersQuery.users;
    let rooms = this.props.RoomsQuery.rooms;

    return (
      <section className="meeting">
        <div className="meeting__inner">
          <header className="meeting__header">
            <h2 className="meeting__headline">Новая встреча</h2>
            <button className="round-button round-button--close" onClick={this.props.hide}>
              <span className="visually-hidden">Закрыть</span>
            </button>
          </header>
          <div className="meeting__wrapper">
            <div className="meeting__column">
              <div className="meeting__element">
                <label className="label" htmlFor="meeting-theme">Тема</label>
                <input className="text-input" type="text" name="meeting-theme" id="meeting-theme" placeholder="О чём будете говорить?" value={this.state.meetingTitle} onChange={this.updateMeetingTitle} required />
              </div>
            </div>
            <div className="meeting__column">
              <div className="meeting__element-wrapper">
                <div className="meeting__element meeting__element--date">
                  <label className="label" htmlFor="meeting-date">Дата<span className="label__mobile">&nbsp;и&nbsp;время</span></label>
                  <input className="text-input" type="date" name="meeting-date" id="meeting-date" required value={this.state.meetingDate} onChange={this.updateMeetingDate} />
                </div>
                <div className="meeting__element meeting__element--start">
                  <label className="label" htmlFor="meeting-start">Начало</label>
                  <input className="text-input" type="text" name="meeting-start" id="meeting-start" required value={this.state.startTime} onChange={this.updateStartTime} />
                </div>
                <div className="meeting__element meeting__element--end">
                  <label className="label" htmlFor="meeting-end">Конец</label>
                  <input className="text-input" type="text" name="meeting-end" id="meeting-end" required value={this.state.endTime} onChange={this.updateEndTime} />
                </div>
              </div>
            </div>
          </div>
          <div className="meeting__wrapper">
            <div className="meeting__column">
              {users ? <div className="meeting__element meeting__element--members">
                <label className="label" htmlFor="meeting-members">Участники</label>
                <Select
                  className="multiple-select" name="meeting-members" id="meeting-members"
                  value={this.state.selectedUsers}
                  onChange={this.updateSelectedUsers}
                  multi
                  placeholder="Например, Тор Одинович"
                  options={users}
                  labelKey="login"
                  valueKey="id"
                  optionComponent={SelectOption}
                  noResultsText="Не найдено"
                  clearAllText="Удалить все"
                />
              </div> : null}
            </div>
            <div className="meeting__column">
              <div className="meeting__element meeting__element--rooms">
                <label className="label">Рекомендованные переговорки</label>
                <ul className="meeting__rooms-list">
                  {rooms.map((room) => {
                    return(
                      <li className={`meeting__room ${this.state.selectedRoom === room.id ? "meeting__room--chosen" : ""}`}
                        key={room.id} onClick={this.chooseRoom(room.id)}>
                        <p className="meeting__room-time">
                          {this.state.startTime}&ndash;{this.state.endTime}
                        </p>
                        <h3 className="meeting__room-name-floor">{room.title} &bull; {room.floor}&nbsp;этаж</h3>
                        <button className="meeting__room-unchoose"
                          onClick={this.unchooseRoom}>
                          <span className="visually-hidden">Отменить выбор</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="meeting__element meeting__element--delete">
                <button className="meeting__delete-button">Удалить встречу</button>
              </div>
            </div>
          </div>
        </div>
        <div className="meeting__buttons">
          {this.state.message ?
            <div className="meeting__message">{this.state.message}</div> : null}
          <button className="button button--secondary" onClick={this.props.hide}>Отмена</button>
          <button className="button" onClick={this.saveMeeting}>Сохранить</button>
        </div>
      </section>
    );
  }
}

class SelectOption extends Component {
  constructor(props) {
    super(props);

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }

  handleMouseDown(event) {
    event.preventDefault();
    event.stopPropagation();
    this.props.onSelect(this.props.option, event);
  }

  handleMouseEnter(event) {
    this.props.onFocus(this.props.option, event);
  }

  handleMouseMove(event) {
    if (this.props.isFocused) return;
    this.props.onFocus(this.props.option, event);
  }

  render() {
    return(
      <div className="searchfield-item"
        onMouseDown={this.handleMouseDown}
        onMouseEnter={this.handleMouseEnter}
        onMouseMove={this.handleMouseMove}>
        <img className="searchfield-item__avatar"
          src={this.props.option.avatarUrl} width="24" height="24" alt={this.props.option.login} />
        <p className="searchfield-item__name-floor">
          <span className="searchfield-item__name">{this.props.option.login}</span> &bull; {this.props.option.homeFloor} этаж</p>
      </div>
    );
  }
}

Meeting.propTypes = {
  date: PropTypes.string,
  startTime: PropTypes.string,
  room: PropTypes.string,
  hide: PropTypes.func
};

SelectOption.propTypes = {
  option: PropTypes.obj,
  onSelect: PropTypes.func,
  onFocus: PropTypes.func
};

const USERS_QUERY = gql`query {
  users{
    id,
    login,
    avatarUrl,
    homeFloor
  }
}`;
const ROOMS_QUERY = gql`query {
  rooms{
    id,
    title,
    capacity,
    floor
  }
}`;
const CREATE_MEETING = gql`
  mutation createEvent($input: EventInput!, $usersIds: [ID], $roomId: ID!) {
    createEvent(input: $input, usersIds: $usersIds, roomId: $roomId) {
      id,
      dateStart,
      dateEnd,
      room {
        id,
        title,
        floor
      }
    }
  }
`;

const MeetingWithData = compose(
  graphql(USERS_QUERY, { name: "UsersQuery" }),
  graphql(ROOMS_QUERY, { name: "RoomsQuery" }),
  graphql(CREATE_MEETING, { name: "CreateMeetingMutation" }),
)(Meeting);
export default MeetingWithData;
