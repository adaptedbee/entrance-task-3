import React from 'react';
import PropTypes from 'prop-types';

const Header = ({ plannerOpen, newMeeting }) => {
  return (
    <header className="header">
      <div className="header__inner">
        <a className="header__logo" href="./index.html">
          <img className="header__logo-image" src="./img/logo.svg" width="174" height="25" alt="Яндекс.Переговорки" />
        </a>
        {plannerOpen ? <button className="button button--header"
          onClick={newMeeting(null, null)}>Создать встречу</button> : null}
      </div>
    </header>
  );
}

Header.propTypes = {
  plannerOpen: PropTypes.bool,
  newMeeting: PropTypes.func
};

export default Header;
