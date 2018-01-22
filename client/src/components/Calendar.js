import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-pikaday-datepicker';

class CalendarPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: props.date,
      calendarOpen: false
    };

    this.openCalendar = this.openCalendar.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.setDateToToday = this.setDateToToday.bind(this);
    this.setNextDate = this.setNextDate.bind(this);
    this.setPrevDate = this.setPrevDate.bind(this);
  }

  openCalendar() {
    if (this.state.calendarOpen) {
      this.setState({
        calendarOpen: false
      });
    } else {
      this.setState({
        calendarOpen: true
      });
    }
  }

  setDateToToday() {
    let date = new Date();
    this.setState({
      date: date.toISOString(),
      calendarOpen: false
    });
    this.props.updateDate(date);
  }

  onDateChange(date) {
    this.setState({
      date: date.toISOString()
    });
    this.props.updateDate(date);
  }

  setNextDate() {
    let currentDate = new Date(this.state.date);
    let date = currentDate.getDate();
    currentDate.setDate(date + 1);

    this.setState({
      date: currentDate.toISOString()
    });
    this.props.updateDate(currentDate);
  }

  setPrevDate() {
    let currentDate = new Date(this.state.date);
    let date = currentDate.getDate();
    currentDate.setDate(date - 1);

    this.setState({
      date: currentDate.toISOString()
    });
    this.props.updateDate(currentDate);
  }

  render() {
    let date = new Date(this.state.date);
    let dateString = date.toLocaleString("ru", {
      month: "short",
      day: "numeric"
    });
    dateString = dateString.slice(0, dateString.length - 1);

    let numberOfMonths = 3;
    const i18nConfig = {
      previousMonth: "Предыдущий месяц",
      nextMonth: "Следующий месяц",
      months: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
      weekdays: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
      weekdaysShort: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"]
    };

    return (
      <div className="planner__date-wrapper">
        <button className="round-button round-button--prev" onClick={this.setPrevDate}>
          <span className="visually-hidden">Предыдущая дата</span>
        </button>
        <div className={`planner__date ${this.state.calendarOpen ? "planner__date--active" : ""}`}>
          <span className="planner__datefield"
            onClick={this.openCalendar}>{dateString}</span> &bull; <span onClick={this.setDateToToday}>Сегодня</span>
        </div>
        <button className="round-button round-button--next" onClick={this.setNextDate}>
          <span className="visually-hidden">Следующая дата</span>
        </button>
        <section className={`calendar-popup ${this.state.calendarOpen ? "calendar-popup--active" : ""}`}>
          <div className="calendar-popup__inner"
            ref={(div) => { this.calendarField = div }}>
            <DatePicker
              field={null}
              value={new Date(date)}
              bound={false}
              numberOfMonths={numberOfMonths}
              firstDay={1}
              i18n={i18nConfig}
              onChange={this.onDateChange}
              keyboardInput={false}
            />
          </div>
        </section>
      </div>
    );
  }
}

CalendarPopup.propTypes = {
  date: PropTypes.string,
  updateDate: PropTypes.func
};

export default CalendarPopup;
