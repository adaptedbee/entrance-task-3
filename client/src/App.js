import React, { Component } from 'react';
import Header from './components/Header';
import Planner from './components/Planner';
import Meeting from './components/Meeting';
import CreationPopup from './components/CreationPopup';
import DeletePopup from './components/DeletePopup';
import { LEFT_PADDING, HOUR_WIDTH, DAY_START } from './constants'

import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:3001/graphql' }),
  cache: new InMemoryCache()
});

class App extends Component {
  constructor() {
    super();
    this.state = {
      plannerOpen: true,
      meetingOpen: false,
      popup: null,
      createdMeetingData: null,
      meetingFieldRoomId: null,
      meetingFieldDate: null,
    };

    this.getTimeFromLeftCoord = this.getTimeFromLeftCoord.bind(this);
    this.closeMeeting = this.closeMeeting.bind(this);
    this.closePopup = this.closePopup.bind(this);
  }

  openMeeting = (id, date) => (event) => {
    this.setState({
      plannerOpen: false,
      meetingOpen: true
    });

    if (id !== undefined && id !== null) {
      this.setState({
        meetingFieldDataRoomId: id
      });
    }

    if (date !== undefined && date !== null && date !== '') {
      let currentDate = new Date(date);
      this.setState({
        meetingFieldDate: currentDate.toISOString()
      });
    }

    const leftCoord = getComputedStyle(event.nativeEvent.target).left;
    if (leftCoord) {
      let timeStart = this.getTimeFromLeftCoord(leftCoord);
      this.setState({
        meetingFieldStartTime: timeStart
      });
    }

  }

  getTimeFromLeftCoord(leftCoord) {
    let px = parseInt(leftCoord.slice(0, -2), 10) - LEFT_PADDING;
    let hours = Math.floor(px/HOUR_WIDTH) + DAY_START;
    if (hours.toString().length < 2) {
      hours = '0' + hours.toString();
    }
    let minutes = (px%66)*60/66;
    minutes = minutes.toFixed(0);
    if (minutes.length < 2) {
      minutes = '0' + minutes;
    }

    return `${hours}:${minutes}`;
  }

  closeMeeting(data) {
    this.setState({
      plannerOpen: true,
      meetingOpen: false
    });

    if (data.createEvent !== undefined) {
      this.setState({
        popup: 'CreationPopup',
        createdMeetingData: data.createEvent
      });
    }
  }

  closePopup() {
    this.setState({
      popup: null
    });
  }

  render() {
    return (
      <ApolloProvider client={client}>
        <div className={`app ${this.state.popup !== null ? 'app--shadow' : ''}`}>
          <Header plannerOpen={this.state.plannerOpen} newMeeting={this.openMeeting} />

          <main>
            <h1 className="visually-hidden">Яндекс.Переговорки</h1>
            { this.state.plannerOpen ? <Planner newMeeting={this.openMeeting} /> : null }
            { this.state.meetingOpen ? <Meeting hide={this.closeMeeting}
              room={this.state.meetingFieldDataRoomId} date={this.state.meetingFieldDate} startTime={this.state.meetingFieldStartTime} /> : null }
          </main>

          { this.state.popup === 'CreationPopup' && this.state.createdMeetingData !== undefined ?
            <CreationPopup data={this.state.createdMeetingData} active={this.state.popup === 'CreationPopup'} closePopup={this.closePopup} /> : null }
          <DeletePopup active={this.state.popup === 'DeletePopup'} closePopup={this.closePopup} />
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
