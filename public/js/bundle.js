/* eslint-disable */ /*eslint-disable */ /* eslint-disable */ const $2f76aec48001c457$var$hideAlert = ()=>{
    const alertEl = document.querySelector(".alert");
    const alertParent = alertEl?.parentNode;
    alertParent?.removeChild(alertEl);
};
const $2f76aec48001c457$export$de026b00723010c1 = (type, msg)=>{
    $2f76aec48001c457$var$hideAlert();
    const alertEl = document.createElement("div");
    alertEl.innerHTML = msg;
    alertEl.classList.add("alert");
    alertEl.classList.add(`alert--${type}`);
    document.querySelector("body").appendChild(alertEl);
    window.setTimeout(()=>{
        $2f76aec48001c457$var$hideAlert();
    }, 3000);
};


const $607fd9e6f90f6f35$export$1ca8632be81e33f = async (type, data)=>{
    try {
        document.querySelector(".btn--form").classList.add("disable-el");
        const url = type === "login" ? "http://127.0.0.1:3100/api/v1/users/login" : "http://127.0.0.1:3100/api/v1/users/signup";
        const res = await axios({
            method: "POST",
            url: url,
            data: data
        });
        // console.log(res);
        if (res.data?.status === "success") {
            (0, $2f76aec48001c457$export$de026b00723010c1)("success", "Login successfully");
            window.setTimeout(()=>{
                location.assign("/");
                document.querySelector(".btn--form").classList.remove("disable-el");
            }, 1000);
        }
    } catch (err) {
        console.log(err);
        (0, $2f76aec48001c457$export$de026b00723010c1)("error", err.response?.data.message);
        document.querySelector(".btn--form").classList.remove("disable-el");
    }
};


/*eslint-disable */ const $d782502db626ddad$export$348d584e223bdf1b = ()=>{
    const popupEl = document.createElement("div");
    popupEl.className = "popup flex flex--direct-col popup--user-active";
    popupEl.innerHTML = `<a class="popup-link" href="#">Add an existing account</a>
  <a class="popup-link" href="/logout">Logout this user</a>`;
    document.querySelector(".nav-item--user").appendChild(popupEl);
    document.querySelector(".container").classList.add("popup--user-hide");
};
const $d782502db626ddad$export$bba5038aab73375b = ()=>{
    const popupEl = document.querySelector(".popup");
    const parentEl = popupEl?.parentNode;
    parentEl?.removeChild(popupEl);
    document.querySelector(".container").classList.remove("popup--user-hide");
};
const $d782502db626ddad$export$56a70b10aa80a56e = ()=>{
    const user = JSON.parse(document.querySelector(".account").dataset.user);
    // console.log(user);
    const birthday = `${new Date(user.joinedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric"
    })}, ${new Date(user.joinedAt).getFullYear()}`;
    const popupEl = document.createElement("div");
    popupEl.className = "profile-popup";
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
    document.querySelector("body").appendChild(popupEl);
    document.querySelector(".container").classList.add("show-popup");
};
const $d782502db626ddad$export$988938cd3a7d385f = ()=>{
    const popupEl = document.querySelector(".profile-popup");
    const parentEl = popupEl?.parentNode;
    parentEl?.removeChild(popupEl);
    document.querySelector(".container").classList.remove("show-popup");
};
const $d782502db626ddad$export$7eddb279b5f3c768 = ()=>{
    const user = JSON.parse(document.querySelector(".account").dataset.user);
    const changedAt = `${new Date(user.passwordChangedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric"
    })}, ${new Date(user.passwordChangedAt).getFullYear()}`;
    const popupEl = document.createElement("div");
    popupEl.className = "profile-popup";
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
      placeholder="\u{2022}\u{2022}\u{2022}\u{2022}\u{2022}\u{2022}\u{2022}\u{2022}"
      required
    />
  </div>
  <div class="profile-info-item">
    <label for="password">New password</label><br />
    <input id="password" type="password" placeholder="\u{2022}\u{2022}\u{2022}\u{2022}\u{2022}\u{2022}\u{2022}\u{2022}" />
  </div>
  <div class="profile-info-item">
    <label for="passwordConfirm">Confirm password</label><br />
    <input id="passwordConfirm" type="password" placeholder="\u{2022}\u{2022}\u{2022}\u{2022}\u{2022}\u{2022}\u{2022}\u{2022}" />
  </div>
  <div class="profile-birthday">
    <p class="date-title">
      <span>Change recently</span>&middot;<a>At</a>
    </p>
    <p class="date-time">${changedAt}</p>
  </div>
</div>`;
    document.querySelector("body").appendChild(popupEl);
    document.querySelector(".container").classList.add("show-popup");
};
const $d782502db626ddad$export$33071748e284fe9e = ()=>{
    const popupEl = document.querySelector(".profile-popup");
    const parentEl = popupEl?.parentNode;
    parentEl?.removeChild(popupEl);
    document.querySelector(".container").classList.remove("show-popup");
};


/* eslint-disable */ 
const $7997fb47429082d3$export$10a5d300cff42cf9 = async (type, data)=>{
    try {
        if (type === "data") document.querySelector(".btn--profile-save").classList.add("disable-el");
        else document.querySelector(".btn--settings-save").classList.add("disable-el");
        const url = type === "data" ? "http://127.0.0.1:3100/api/v1/users/me" : "http://127.0.0.1:3100/api/v1/users/update-password";
        const res = await axios({
            method: "PATCH",
            url: url,
            data: data
        });
        if (res.data.status === "success") {
            (0, $2f76aec48001c457$export$de026b00723010c1)("success", `Update your ${type} successfully`);
            if (type === "data") {
                document.querySelector(".btn--profile-save").classList.remove("disable-el");
                return window.setTimeout(()=>location.reload(true), 1000);
            }
            document.querySelector("#currentPassword").value = "";
            document.querySelector("#password").value = "";
            document.querySelector("#passwordConfirm").value = "";
            document.querySelector(".btn--settings-save").classList.remove("disable-el");
        }
    } catch (err) {
        (0, $2f76aec48001c457$export$de026b00723010c1)("error", err.response?.data.message);
        if (type === "data") return document.querySelector(".btn--profile-save").classList.remove("disable-el");
        document.querySelector(".btn--settings-save").classList.remove("disable-el");
    }
};


const $ba584a4f51330b8f$var$mainEL = document.querySelector("main");
const $ba584a4f51330b8f$var$sidebarEl = document.querySelector("aside");
const $ba584a4f51330b8f$var$containerEl = document.querySelector(".container");
const $ba584a4f51330b8f$var$postCardEls = document.querySelectorAll(".post-card");
const $ba584a4f51330b8f$var$backBtn = document.querySelector(".btn--back");
const $ba584a4f51330b8f$var$userBtn = document.querySelector(".nav-item--user button");
const $ba584a4f51330b8f$var$editProfileBtn = document.querySelector(".btn--edit-profile");
// const closeProfileBtn = document.querySelector('.profile .btn--close');
const $ba584a4f51330b8f$var$loginForm = document.querySelector(".login .form");
const $ba584a4f51330b8f$var$signupForm = document.querySelector(".signup .form");
$ba584a4f51330b8f$var$signupForm?.addEventListener("submit", function(e) {
    e.preventDefault();
    alert("hello");
    const name = document.querySelector("#name").value;
    const username = document.querySelector("#username").value;
    const email = document.querySelector("#email").value;
    const phone = document.querySelector("#phone").value !== "" ? document.querySelector("#phone").value : undefined;
    const password = document.querySelector("#password").value;
    const passwordConfirm = document.querySelector("#passwordConfirm").value;
    console.log(name, email, phone, password, passwordConfirm);
    (0, $607fd9e6f90f6f35$export$1ca8632be81e33f)("signup", {
        name: name,
        username: username,
        email: email,
        password: password,
        passwordConfirm: passwordConfirm,
        phone: phone
    });
});
$ba584a4f51330b8f$var$loginForm?.addEventListener("submit", function(e) {
    e.preventDefault();
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    (0, $607fd9e6f90f6f35$export$1ca8632be81e33f)("login", {
        email: email,
        password: password
    });
});
$ba584a4f51330b8f$var$postCardEls?.forEach((postCardEl)=>{
    postCardEl.addEventListener("click", function(e) {
        e.preventDefault();
        // alert('hello');
        if (e.target.closest(".user-link")) return location.assign(`${e.target.closest(".user-link").getAttribute("href")}`);
        if (e.target.closest(".post-author-link")) return location.assign(`${e.target.closest(".post-author-link").getAttribute("href")}`);
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
$ba584a4f51330b8f$var$editProfileBtn?.addEventListener("click", function(e) {
    e.preventDefault();
    // alert('hello');
    (0, $d782502db626ddad$export$56a70b10aa80a56e)();
});
$ba584a4f51330b8f$var$userBtn?.addEventListener("click", function(e) {
    e.preventDefault();
    // alert('hello');
    if (!document.querySelector(".popup")) (0, $d782502db626ddad$export$348d584e223bdf1b)();
});
// backBtn?.addEventListener('click', function (e) {
//   e.preventDefault();
//   window.history.back();
// });
window.addEventListener("click", function(e) {
    // e.preventDefault() //! don't use e.preventDefault() in window if you don't want your window tab on browser disable all events like click, load,...
    //============================================BUTTON BACK FOR EVERY PAGES
    if (e.target.closest(".btn--back")) return window.history.back();
    //============================================FOR ACCOUNT PAGE
    if (document.querySelector(".profile-popup")?.classList.contains("disable-el")) return;
    if (e.target.closest(".btn--profile-save")) {
        const formData = new FormData();
        formData.append("name", document.querySelector("#name").value);
        formData.append("email", document.querySelector("#email").value);
        if (document.querySelector("#photo").files[0]) formData.append("photo", document.querySelector("#photo").files[0]);
        console.log(document.querySelector("#backgroundPhoto").files[0]);
        if (document.querySelector("#backgroundPhoto").files[0]) formData.append("backgroundPhoto", document.querySelector("#backgroundPhoto").files[0]);
        return (0, $7997fb47429082d3$export$10a5d300cff42cf9)("data", formData);
    }
    if (e.target.closest(".btn--settings-save")) {
        const currentPassword = document.querySelector("#currentPassword").value;
        const password = document.querySelector("#password").value;
        const passwordConfirm = document.querySelector("#passwordConfirm").value;
        return (0, $7997fb47429082d3$export$10a5d300cff42cf9)("password", {
            currentPassword: currentPassword,
            password: password,
            passwordConfirm: passwordConfirm
        });
    }
    // console.log(e.target, document.querySelector('.popup'));
    // console.log(e.target === document.querySelector('.profile-icon--close'));
    // ! we can use closest in this case, when we use closest it will find brother and parent elements have the class .profile-icon--close so if it's not find any it will be itself
    // * therefore the conditional in this case that the class name of this element is unique
    // * so in this case we can apply closest()
    if (e.target.closest(".profile-icon--close")) {
        (0, $d782502db626ddad$export$988938cd3a7d385f)();
        (0, $d782502db626ddad$export$33071748e284fe9e)();
        return;
    }
    // if (e.target === document.querySelector('.profile-icon--close'))
    //   return hideProfilePopup();
    if (e.target === $ba584a4f51330b8f$var$editProfileBtn) return;
    if (e.target.closest(".btn--edit-settings")) return (0, $d782502db626ddad$export$7eddb279b5f3c768)();
    //* use closest() to file the element have class name .profile-popup in this case the pointer-events is disable and so when click on window it's non element
    // * but if we click on this popup it's always closest with .profile-popup right so that how it works
    if (e.target.closest(".profile-popup")) return;
    //====================================POPUP FOR THE USER ICON ON NAVIGATION
    if (e.target === document.querySelector(".nav-item--user .user-photo")) return;
    //* use closest() to file the element have class name .popup--user-active nearest
    if (e.target.closest(".popup--user-active")) return;
    // containerEl.classList.remove('.show-popup');
    (0, $d782502db626ddad$export$bba5038aab73375b)();
    (0, $d782502db626ddad$export$988938cd3a7d385f)();
    (0, $d782502db626ddad$export$33071748e284fe9e)();
});
window.addEventListener("load", function() {
    if ($ba584a4f51330b8f$var$mainEL.clientHeight <= $ba584a4f51330b8f$var$sidebarEl.clientHeight) $ba584a4f51330b8f$var$mainEL.classList.add("main--fix-height");
// const userBG = document.querySelector('.background-photo--profile');
// const user = document.querySelector('.account').dataset.user;
// userBG.style.backgroundImage = `linear-gradient(rgb(33, 37, 41, 0.5), rgb(33, 37, 41, 0.5)), url(/imgs/users/${user.backgroundPhoto})`;
});


//# sourceMappingURL=bundle.js.map
