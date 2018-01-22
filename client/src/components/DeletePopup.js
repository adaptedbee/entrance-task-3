import React from 'react';

const DeletePopup = () => {
  return (
    <section className="popup popup--delete">
      <img className="popup__emoji" src="./img/emoji/emoji1.svg" width="40" height="40" alt="Встреча создана" />
      <h3 className="popup__headline">Встреча будет<br/>удалена безвозвратно</h3>
      <div className="popup__buttons-wrapper">
        <button className="button button--secondary">Отмена</button>
        <button className="button button--secondary">Удалить</button>
      </div>
    </section>
  );
}

export default DeletePopup;
