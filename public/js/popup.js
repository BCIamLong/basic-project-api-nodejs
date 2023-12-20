/*eslint-disable */

export const showPopup = () => {
  const popupEl = document.createElement('div');
  popupEl.className = 'popup flex flex--direct-col popup--user-active';
  popupEl.innerHTML = `<a class="popup-link" href="#">Add an existing account</a>
  <a class="popup-link" href="/logout">Logout this user</a>`;
  document.querySelector('.nav-item--user').appendChild(popupEl);
  document.querySelector('.container').classList.add('popup--user-hide');
};

export const hidePopup = () => {
  const popupEl = document.querySelector('.popup');
  const parentEl = popupEl?.parentNode;
  parentEl?.removeChild(popupEl);
  document.querySelector('.container').classList.remove('popup--user-hide');
};

export const showProfilePopup = () => {
  const user = JSON.parse(document.querySelector('.account').dataset.user);
  // console.log(user);
  const birthday = `${new Date(user.joinedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  })}, ${new Date(user.joinedAt).getFullYear()}`;

  const popupEl = document.createElement('div');
  popupEl.className = 'profile-popup';
  popupEl.innerHTML = `<div class="profile">
  <div class="profile-heading flex flex--align-ct">
    <button class="btn btn--close">
      <ion-icon class="profile-icon profile-icon--close" name="close-outline"></ion-icon>
    </button>
    <p>Edit profile</p>
    <button class="btn btn--profile btn--profile-save">Save</button>
  </div>
  <div class="background-photo background-photo--profile" style="background-image: linear-gradient(rgb(33, 37, 41, 0.5), rgb(33, 37, 41, 0.5)), url(/imgs/users/${user.backgroundPhoto})">
  <label for="backgroundPhoto">
    <!-- <button class="btn btn--add-photo"> -->
      <ion-icon class="add-photo-icon btn btn--add-photo" name="camera-outline"></ion-icon>
    <!-- </button> -->
    </label>
    <input id="backgroundPhoto" name="backgroundPhoto" type="file" />
  </div>
  <div class="user-photo--profile flex margin--bottom-md">
    <img
      class="account-photo account-photo--profile"
      src="/imgs/users/${user.photo}"
      alt="${user.name} photo"
    />
    <label for="photo">
    <!--<button class="btn btn--add-photo-2">-->
      <ion-icon class="add-photo-icon btn btn--add-photo-2" name="camera-outline"></ion-icon>
      <!--</button>-->
    </label>
    <input id="photo" name="photo" type="file" />
  </div>
</div>
<div class="profile-info">
  <div class="profile-info-item">
    <label for="name">Name</label><br />
    <input id="name" type="text" value="${user.name}" />
  </div>
  <div class="profile-info-item">
    <label for="email">Email</label><br />
    <input id="email" type="email" value="${user.email}" />
  </div>
  <div class="profile-birthday">
    <p class="date-title"><span>Birth date</span>&middot;<a>Edit</a></p>
    <p class="date-time">${birthday}</p>
  </div>
</div>`;

  document.querySelector('body').appendChild(popupEl);
  document.querySelector('.container').classList.add('show-popup');
};

export const hideProfilePopup = () => {
  const popupEl = document.querySelector('.profile-popup');
  const parentEl = popupEl?.parentNode;
  parentEl?.removeChild(popupEl);
  document.querySelector('.container').classList.remove('show-popup');
};

export const showSettingsPopup = () => {
  const user = JSON.parse(document.querySelector('.account').dataset.user);
  const changedAt = `${new Date(user.passwordChangedAt).toLocaleDateString(
    'en-US',
    {
      month: 'long',
      day: 'numeric',
    },
  )}, ${new Date(user.passwordChangedAt).getFullYear()}`;
  const popupEl = document.createElement('div');
  popupEl.className = 'profile-popup';
  popupEl.innerHTML = `<div class="profile">
  <div class="profile-heading flex flex--align-ct">
    <button class="btn btn--close">
      <ion-icon class="profile-icon profile-icon--close" name="close-outline"></ion-icon>
    </button>
    <p>Edit Settings</p>
    <button class="btn btn--profile btn--settings-save">Save</button>
  </div>
</div>
<div class="profile-info">
  <p class="profile-info-heading">Password</p>
  <div class="profile-info-item">
    <label for="currentPassword">Current password</label><br />
    <input
      id="currentPassword"
      type="password"
      placeholder="••••••••"
      required
    />
  </div>
  <div class="profile-info-item">
    <label for="password">New password</label><br />
    <input id="password" type="password" placeholder="••••••••" />
  </div>
  <div class="profile-info-item">
    <label for="passwordConfirm">Confirm password</label><br />
    <input id="passwordConfirm" type="password" placeholder="••••••••" />
  </div>
  <div class="profile-birthday">
    <p class="date-title">
      <span>Change recently</span>&middot;<a>At</a>
    </p>
    <p class="date-time">${changedAt}</p>
  </div>
</div>`;
  document.querySelector('body').appendChild(popupEl);
  document.querySelector('.container').classList.add('show-popup');
};

export const hideSettingsPopup = () => {
  const popupEl = document.querySelector('.profile-popup');
  const parentEl = popupEl?.parentNode;
  parentEl?.removeChild(popupEl);
  document.querySelector('.container').classList.remove('show-popup');
};
