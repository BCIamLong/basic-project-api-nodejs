/* eslint-disable */

import { authAccount } from './auth.js';
import {
  showPopup,
  hidePopup,
  showProfilePopup,
  hideProfilePopup,
  showSettingsPopup,
  hideSettingsPopup,
} from './popup.js';
import { updateDataSettings } from './updateSettings.js';

const mainEL = document.querySelector('main');
const sidebarEl = document.querySelector('aside');
const containerEl = document.querySelector('.container');
const postCardEls = document.querySelectorAll('.post-card');
const backBtn = document.querySelector('.btn--back');
const userBtn = document.querySelector('.nav-item--user button');
const editProfileBtn = document.querySelector('.btn--edit-profile');
// const closeProfileBtn = document.querySelector('.profile .btn--close');
const loginForm = document.querySelector('.login .form');
const signupForm = document.querySelector('.signup .form');

signupForm?.addEventListener('submit', function (e) {
  e.preventDefault();
  alert('hello');
  const name = document.querySelector('#name').value;
  const username = document.querySelector('#username').value;
  const email = document.querySelector('#email').value;
  const phone =
    document.querySelector('#phone').value !== ''
      ? document.querySelector('#phone').value
      : undefined;
  const password = document.querySelector('#password').value;
  const passwordConfirm = document.querySelector('#passwordConfirm').value;
  console.log(name, email, phone, password, passwordConfirm);
  authAccount('signup', {
    name,
    username,
    email,
    password,
    passwordConfirm,
    phone,
  });
});

loginForm?.addEventListener('submit', function (e) {
  e.preventDefault();
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;
  authAccount('login', { email, password });
});

postCardEls?.forEach(postCardEl => {
  postCardEl.addEventListener('click', function (e) {
    e.preventDefault();
    // alert('hello');
    if (e.target.closest('.user-link'))
      return location.assign(
        `${e.target.closest('.user-link').getAttribute('href')}`,
      );
    if (e.target.closest('.post-author-link'))
      return location.assign(
        `${e.target.closest('.post-author-link').getAttribute('href')}`,
      );
    const postId = e.currentTarget.dataset.id;
    if (postId) location.assign(`/posts/${postId}`);
  });
});
// console.log(closeProfileBtn);
// closeProfileBtn?.addEventListener('click', function (e) {
//   e.preventDefault();
//   alert('ok');
//   hideProfilePopup();
// });

editProfileBtn?.addEventListener('click', function (e) {
  e.preventDefault();
  // alert('hello');
  showProfilePopup();
});

userBtn?.addEventListener('click', function (e) {
  e.preventDefault();
  // alert('hello');
  if (!document.querySelector('.popup')) showPopup();
});

// backBtn?.addEventListener('click', function (e) {
//   e.preventDefault();
//   window.history.back();
// });

window.addEventListener('click', function (e) {
  // e.preventDefault() //! don't use e.preventDefault() in window if you don't want your window tab on browser disable all events like click, load,...
  //============================================BUTTON BACK FOR EVERY PAGES
  if (e.target.closest('.btn--back')) return window.history.back();

  //============================================FOR ACCOUNT PAGE
  if (
    document.querySelector('.profile-popup')?.classList.contains('disable-el')
  )
    return;
  if (e.target.closest('.btn--profile-save')) {
    const formData = new FormData();
    formData.append('name', document.querySelector('#name').value);
    formData.append('email', document.querySelector('#email').value);

    if (document.querySelector('#photo').files[0])
      formData.append('photo', document.querySelector('#photo').files[0]);
    console.log(document.querySelector('#backgroundPhoto').files[0]);
    if (document.querySelector('#backgroundPhoto').files[0])
      formData.append(
        'backgroundPhoto',
        document.querySelector('#backgroundPhoto').files[0],
      );

    return updateDataSettings('data', formData);
  }

  if (e.target.closest('.btn--settings-save')) {
    const currentPassword = document.querySelector('#currentPassword').value;
    const password = document.querySelector('#password').value;
    const passwordConfirm = document.querySelector('#passwordConfirm').value;
    return updateDataSettings('password', {
      currentPassword,
      password,
      passwordConfirm,
    });
  }

  // console.log(e.target, document.querySelector('.popup'));
  // console.log(e.target === document.querySelector('.profile-icon--close'));
  // ! we can use closest in this case, when we use closest it will find brother and parent elements have the class .profile-icon--close so if it's not find any it will be itself
  // * therefore the conditional in this case that the class name of this element is unique
  // * so in this case we can apply closest()
  if (e.target.closest('.profile-icon--close')) {
    hideProfilePopup();
    hideSettingsPopup();
    return;
  }
  // if (e.target === document.querySelector('.profile-icon--close'))
  //   return hideProfilePopup();
  if (e.target === editProfileBtn) return;
  if (e.target.closest('.btn--edit-settings')) return showSettingsPopup();
  //* use closest() to file the element have class name .profile-popup in this case the pointer-events is disable and so when click on window it's non element
  // * but if we click on this popup it's always closest with .profile-popup right so that how it works
  if (e.target.closest('.profile-popup')) return;

  //====================================POPUP FOR THE USER ICON ON NAVIGATION
  if (e.target === document.querySelector('.nav-item--user .user-photo'))
    return;
  //* use closest() to file the element have class name .popup--user-active nearest
  if (e.target.closest('.popup--user-active')) return;
  // containerEl.classList.remove('.show-popup');
  hidePopup();
  hideProfilePopup();
  hideSettingsPopup();
});

window.addEventListener('load', function () {
  if (mainEL.clientHeight <= sidebarEl.clientHeight)
    mainEL.classList.add('main--fix-height');

  // const userBG = document.querySelector('.background-photo--profile');
  // const user = document.querySelector('.account').dataset.user;
  // userBG.style.backgroundImage = `linear-gradient(rgb(33, 37, 41, 0.5), rgb(33, 37, 41, 0.5)), url(/imgs/users/${user.backgroundPhoto})`;
});
