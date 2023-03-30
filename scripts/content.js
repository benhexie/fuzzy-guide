const popupName = generatePopupName();
const popup = document.createElement("div");
popup.setAttribute("class", popupName);
popup.setAttribute(
  "style",
  `position: fixed !important; 
  bottom: 0 !important; 
  right: 0 !important;
  left: 0 !important;
  top: 0 !important;
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
      console.log(data);
      pushNotification(data.response);
    }
  }, 1000);
}

function pushNotification(message) {
  const popup = document.getElementsByClassName(popupName)[0];
  popup.innerHTML = "";
  popup.insertAdjacentHTML(
    "beforeend",
    `
    <h1>${message}</h1>
  `
  );
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
