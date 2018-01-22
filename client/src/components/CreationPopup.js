import React from 'react';
import PropTypes from 'prop-types';

const CreationPopup = ({ data, active, closePopup }) => {
  const dateStart = new Date(data.dateStart);
  const dateEnd = new Date(data.dateEnd);
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
    <section className={`popup ${active ? "popup--active" : ""}`}>
      <img className="popup__emoji" src="./img/emoji/emoji2.svg" width="40" height="40" alt="Встреча создана" />
      <h3 className="popup__headline">Встреча создана!</h3>
      <p className="popup__text">{dateStartString}, {timeStartString}—{timeEndString}</p>
      <p className="popup__text">{data.room.title} &bull; {data.room.floor}&nbsp;этаж</p>
      <button className="button" onClick={closePopup}>Хорошо</button>
    </section>
  );
}

CreationPopup.propTypes = {
  data: PropTypes.object,
  active: PropTypes.bool,
  closePopup: PropTypes.func
};

export default CreationPopup;
