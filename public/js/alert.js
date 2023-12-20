/* eslint-disable */

const hideAlert = () => {
  const alertEl = document.querySelector('.alert');
  const alertParent = alertEl?.parentNode;
  alertParent?.removeChild(alertEl);
};

export const showAlert = (type, msg) => {
  hideAlert();
  const alertEl = document.createElement('div');
  alertEl.innerHTML = msg;
  alertEl.classList.add('alert');
  alertEl.classList.add(`alert--${type}`);
  document.querySelector('body').appendChild(alertEl);

  window.setTimeout(() => {
    hideAlert();
  }, 3000);
};
