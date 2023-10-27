let notificationText= "";
const popupName = generateName();
const circleName = generateName();
const popup = document.createElement("div");
popup.setAttribute("id", popupName);
popup.setAttribute(
  "style",
  `position: fixed !important; 
  bottom: 0 !important; 
  right: 0 !important;
  left: 0 !important;
  top: 0 !important;
  z-index: 9999999999999 !important;
  pointer-events: none;`
);
document.body.appendChild(popup);

function getAllText() {
  let previous = "";
  setInterval(async () => {
    const escapedNotificationText = notificationText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const re = new RegExp(`[0-9]+ *:[0-9]+ *:*[0-9]* *|${escapedNotificationText}`);
    const current = document.body?.innerText;
    const previousMod = previous.split(re).join();
    const currentMod = current.split(re).join();
    if (previousMod !== currentMod) {
      previous = current;
      try {
        const response = await fetch("http://127.0.0.1:5000/answer", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: current, sourceUrl: window.location.href }),
        });
        const data = await response.json();
        if (!data.error) pushNotification(data.response);
      } catch (error) {}
    }
  }, 1000);
}

let squareShow = false;
function pushNotification(message) {
  popup.innerHTML = "";
  if (!/no question found/i.test(message)) {
    notificationText = message;

    if (/quilgo.com/i.test(window.location.href)) {
      document.querySelectorAll(".rounded-1")?.forEach(option => {
          if (message?.toLowerCase().includes(option.innerText?.trim()?.toLowerCase())) {
            option.classList.add("option-italic-style");
          } else {
            option.classList.remove("option-italic-style");
          }
      })
      return;
    }

    const popup = document.getElementById(popupName);
    popup.insertAdjacentHTML(
      "beforeend",
      `<div id="${circleName}">
        <i class="fa-solid fa-eye"></i>
        <i class="fa-solid fa-eye-slash"></i>
      </div>
      <div style="display: ${squareShow ? "inline" : "none"};">
          <textarea disabled>${message}</textarea>
      </div>`
    );

    document.getElementById(circleName).addEventListener("click", () => {
      const square = document.querySelector(`#${circleName} + div`);
      if (squareShow) {
        square.style.display = "none";
        document.querySelector(
          `#${circleName} > i:nth-child(1)`
        ).style.display = "none";
        document.querySelector(
          `#${circleName} > i:nth-child(2)`
        ).style.display = "inline";
      } else {
        square.style.display = "inline";
        document.querySelector(
          `#${circleName} > i:nth-child(2)`
        ).style.display = "none";
        document.querySelector(
          `#${circleName} > i:nth-child(1)`
        ).style.display = "inline";
      }
      squareShow = !squareShow;
    });
  }
}

function generateName() {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < 10) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

function addStyles() {
  document.body.insertAdjacentHTML("afterbegin", `
    <style>
      .option-italic-style {
        font-style: italic !important;
      }

      #${circleName} {
          width: 50px !important;
          height: 50px !important;
          background-color: inherit;
          border-radius: 50px;
          position: absolute;
          bottom: 20px;
          right: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 0px 0px 5px #C80000;
          color: #C80000;
          z-index: 1;
          opacity: 0.5;
          cursor: pointer;
          pointer-events: all;
      }

      #${circleName}:hover {
          background-color: #C80000 !important;
          box-shadow: 0px 0px 10px black;
          opacity: 1;
          color: white;
          z-index: 3;
      }

      #${circleName}:active {
        background-color: black !important;
        box-shadow: none;
        opacity: 1;
        color: white;
        z-index: 3;
      }

      #${circleName} > i:nth-child(1) {
        display: ${squareShow ? "inline" : "none"}
      }

      #${circleName} > i:nth-child(2) {
        display: ${!squareShow ? "inline" : "none"}
      }

      #${circleName}:hover + div {
        opacity: 1;
      }

      #${circleName} + div {
        position: absolute;
        bottom: 50px !important;
        right: 50px !important;
        width: fit-content;
        height: fit-content;
        border-radius: 10px;
        background-color: white;
        border: solid 1px #C80000;
        opacity: 0.3;
        direction: rtl;
        padding: 3px;
        pointer-events: all;
        cursor: default;
        display: ${squareShow ? "inline" : "none"};
      }

      #${circleName} + div:hover {
        opacity: 1;
        z-index: 2;
      }

      #${circleName} + div > textarea {
        text-align: end;
        resize: none;
        padding: 10px;
        background-color: inherit;
        border: none;
        border-radius: 10px;
        color: black;
        width: 300px !important;
        height: 100px !important;
        overflow-y: auto;
        font-size: medium;
      }

      #${circleName} + div::-webkit-scrollbar {
        background-color: inherit;
        border-radius: 20px;
        width: 10px;
      }

      #${circleName} + div::-webkit-scrollbar-thumb {
        background-color: #C80000;
        border-radius: 20px;
      }
    </style>
  `)
}

addStyles();
getAllText();