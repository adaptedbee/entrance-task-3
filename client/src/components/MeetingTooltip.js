import React, { Component } from 'react';
import PropTypes from 'prop-types';

class MeetingTooltip extends Component {
  render() {
    const dateStart = new Date(this.props.meeting.dateStart);
    const dateEnd = new Date(this.props.meeting.dateEnd);
    const dateStartString = dateStart.toLocaleString("ru", {
      month: "long",
      day: "numeric"
    });
    const timeStartString = dateStart.toLocaleString("ru", {
      hour: "numeric",
      minute: "numeric"
    });
    const timeEndString = dateEnd.toLocaleString("ru", {
      hour: "numeric",
      minute: "numeric"
    });

    return (
      <section className={`meeting-tooltip ${this.props.open ? "meeting-tooltip--active" : ""}`}>
        <h5 className="meeting-tooltip__name">{this.props.meeting.title}</h5>
        <p className="meeting-tooltip__time-place">
          {`${dateStartString}, ${timeStartString}—${timeEndString}`} &nbsp;&bull;&nbsp; {this.props.room.title}
        </p>
        <div className="meeting-tooltip__members">
          <img className="meeting-tooltip__member-photo" src={this.props.meeting.users[0].avatarUrl} width="24" height="24" alt={this.props.meeting.users[0].login} />
          <p className="meeting-tooltip__member-info">
            <span className="meeting-tooltip__member-name">{this.props.meeting.users[0].login}</span>
              &nbsp;и&nbsp;{this.props.meeting.users.length - 1}&nbsp;участников
          </p>
        </div>
        <button className="round-button round-button--edit">
          <span className="visually-hidden">Редактировать встречу</span>
        </button>
      </section>
    );
  }
}

MeetingTooltip.propTypes = {
  open: PropTypes.bool
};

export default MeetingTooltip;
