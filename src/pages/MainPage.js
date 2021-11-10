import React from 'react';

function MainPage(props) {
  const user_seq = localStorage.getItem('user_seq');

  return (
    <div>
      <h1>ONIT 🔥</h1>
      <p>Main page</p>
      <button
        type='button'
        onClick={() => {
          window.location.assign(`/${user_seq}/normal`);
        }}
      >
        my 페이지
      </button>
      <button
        type='button'
        onClick={() => {
          window.location.assign(`/3/normal`);
        }}
      >
        juepark 페이지
      </button>
      <button
        type='button'
        onClick={() => {
          window.location.assign(`/4/normal`);
        }}
      >
        heom 페이지
      </button>
    </div>
  );
}

export default MainPage;
