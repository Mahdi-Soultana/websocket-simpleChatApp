var socket = io("http://localhost:3000/");
const form = document.querySelector("form");
const name = form.name;
const messageInput = form.message;
const ul = document.querySelector(".messages ul");

const messagesContainer = document.querySelector(".messages");
const presence = document.querySelector(".presence");
const number = document.querySelector(".Number");
const submitBtn = document.querySelector("[type='submit']");
const errorMsg = document.querySelector(".errorMsg");
const messageContainer = document.querySelector("#message-container");
const nameContainer = document.querySelector("#name-container");
const burger = document.querySelector(".burger");
let INTERVAL = 2000;
let timer;
let msgs = [];
const errorFn = (function () {
  let count = 0;
  return () => {
    count++;
    if (count > 1) {
      errorMessage("Message Missing !");
    }
  };
})();
name.focus();
// console.log(submit);
form.addEventListener("submit", function (e) {
  e.preventDefault();
  //Action Add Message To Soclet Backend
  if (name.value.trim()) {
    message.focus();
    submitBtn.innerText = "Send Message";
    submitBtn.classList.remove("register");
    messageContainer.classList.remove("none");
    messagesContainer.classList.remove("none");
    nameContainer.classList.add("none");
    if (messageInput.value.trim()) {
      socket.emit("addMsg", { name: name.value, message: message.value });
      clearTimeout(timer);
    } else {
      errorFn();
    }
  } else {
    errorMessage("Name Missing !");
  }

  messageInput.value = "";
});
//error Message Functionnalty
function errorMessage(Msg) {
  //default Msg is hide
  //active Meesage
  //set TimeOUt
  //eHide Error
  errorMsg.innerHTML = Msg;
  errorMsg.classList.add("active");
  timer = setTimeout(() => {
    errorMsg.classList.remove("active");
  }, INTERVAL);
}

////Ssocet Implementation
socket.on("connect", () => {
  console.log("connected");
  presence.classList.add("connect");
});

socket.on("disconnect", () => {
  presence.classList.remove("connect");
});
socket.on("pushMsg", ({ Msgs: data, activeUsers }) => {
  number.innerText = activeUsers;
  msgs = [...data];
  render(msgs);
});

function timeFormat(stamp) {
  const timeObj = new Date(stamp);
  let hour =
    timeObj.getHours() < 10 ? "0" + timeObj.getHours() : timeObj.getHours();
  let min =
    timeObj.getMinutes() < 10
      ? "0" + timeObj.getMinutes()
      : timeObj.getMinutes();
  let sec =
    timeObj.getSeconds() < 10
      ? "0" + timeObj.getSeconds()
      : timeObj.getSeconds();
  let date =
    timeObj.getDate() < 10 ? "0" + timeObj.getDate() : timeObj.getDate();
  let month =
    timeObj.getMonth() + 1 < 10
      ? "0" + (timeObj.getMonth() + 1)
      : timeObj.getMonth() + 1;
  const hoursSec = `${hour}:${min}:${sec}`;
  const monthDate = `${month}-${date}`;
  return { hoursSec, monthDate };
}

function render(data) {
  const htmlData = data
    .map(
      (item) => `
            <li>
              <div class="text">
                <i class="fas fa-sms"></i>
                <p>${item.message}</p>
              </div>
              <div class="user">
                  <div>
                      <cite>${item.name}</cite>
                      <br/>
                    <time datetime="${item.time}">
                    ${timeFormat(item.time).hoursSec}</time>
                      <br/>
                    <time datetime="${item.time}">
                    ${timeFormat(item.time).monthDate}</time>

                  </div>

                <i class="fas fa-user"></i>
              </div>
            </li>`,
    )
    .join("");

  //   console.log(htmlData);
  ul.innerHTML = htmlData;
}

const navLinks = document.querySelector("nav ul");
burger.addEventListener("click", () => navLinks.classList.toggle("show"));
