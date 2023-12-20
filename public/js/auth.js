/*eslint-disable */

import { showAlert } from './alert.js';

export const authAccount = async (type, data) => {
  try {
    document.querySelector('.btn--form').classList.add('disable-el');
    const url =
      type === 'login'
        ? 'http://127.0.0.1:3100/api/v1/users/login'
        : 'http://127.0.0.1:3100/api/v1/users/signup';
    const res = await axios({
      method: 'POST',
      url,
      data,
    });
    // console.log(res);

    if (res.data?.status === 'success') {
      showAlert('success', 'Login successfully');
      window.setTimeout(() => {
        location.assign('/');
        document.querySelector('.btn--form').classList.remove('disable-el');
      }, 1000);
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response?.data.message);
    document.querySelector('.btn--form').classList.remove('disable-el');
  }
};
