const popupName = generatePopupName();
const popup = document.createElement("div");
popup.setAttribute("id", popupName);
popup.setAttribute(
  "style",
  `position: fixed !important; 
  bottom: 0 !important; 
  right: 0 !important;
  left: 0 !important;
  top: 0 !important;
  z-index: 9999999999999;
  pointer-events: none;
  `
);
document.body.appendChild(popup);

function getAllText() {
  let previous = "";
  let n = 1;
  setInterval(async () => {
    const current = document.body.innerText;
    const previousMod = previous.split(/[0-9]+:[0-9]+:*[0-9]*/).join();
    const currentMod = current.split(/[0-9]+:[0-9]+:*[0-9]*/).join();
    if (previousMod !== currentMod) {
      console.log(++n);
      previous = current;
      const response = await fetch("http://127.0.0.1:80/answer", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: current }),
      });
      const data = await response.json();
      pushNotification(data.response);
    }
  }, 1000);
}

let squareShow = false;
function pushNotification(message) {
  popup.innerHTML = "";
  const circleName = generatePopupName();
  if (!message.toLowerCase().includes("no questions found")) {
    const popup = document.getElementById(popupName);
    popup.insertAdjacentHTML(
      "beforeend",
      `
      <div id="${circleName}">
          <img src="../assets/show.png" alt="" />
      </div>
      <div>
          <textarea disabled>${message}</textarea>
      </div>
  
      <style>
  
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
          }
  
          #${circleName} + div {
              position: absolute;
              bottom: 50px;
              right: 50px;
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
          }
  
          #${circleName} + div > textarea {
              text-align: end;
              resize: none;
              padding: 10px;
              background-color: inherit;
              border: none;
              border-radius: 10px;
              color: black;
              width: 300px;
              height: 100px;
              overflow-y: auto;
              font-size: medium;
          }
  
          ::-webkit-scrollbar {
              background-color: inherit;
              border-radius: 20px;
              width: 10px;
          }
  
          ::-webkit-scrollbar-thumb {
              background-color: #C80000;
              border-radius: 20px;
          }
  
      </style>
    `
    );

    document.getElementById(circleName).addEventListener("click", () => {
      const square = document.querySelector(`#${circleName} + div`);
      if (squareShow) square.style.display = "none";
      else square.style.display = "inline";
      squareShow = !squareShow;
    });
  }
}

function generatePopupName() {
  const length = Math.floor(Math.random() * 10) + 10;
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < 10) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

getAllText();