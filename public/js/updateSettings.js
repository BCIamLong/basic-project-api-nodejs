/* eslint-disable */

import { showAlert } from './alert.js';

export const updateDataSettings = async (type, data) => {
  try {
    if (type === 'data')
      document.querySelector('.btn--profile-save').classList.add('disable-el');
    else
      document.querySelector('.btn--settings-save').classList.add('disable-el');
    const url =
      type === 'data' ? '/api/v1/users/me' : '/api/v1/users/update-password';

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });
    if (res.data.status === 'success') {
      showAlert('success', `Update your ${type} successfully`);

      if (type === 'data') {
        document
          .querySelector('.btn--profile-save')
          .classList.remove('disable-el');
        return window.setTimeout(() => location.reload(true), 1000);
      }
      document.querySelector('#currentPassword').value = '';
      document.querySelector('#password').value = '';
      document.querySelector('#passwordConfirm').value = '';
      document
        .querySelector('.btn--settings-save')
        .classList.remove('disable-el');
    }
  } catch (err) {
    showAlert('error', err.response?.data.message);
    if (type === 'data')
      return document
        .querySelector('.btn--profile-save')
        .classList.remove('disable-el');

    document
      .querySelector('.btn--settings-save')
      .classList.remove('disable-el');
  }
};
