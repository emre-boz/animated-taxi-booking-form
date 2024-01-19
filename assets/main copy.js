const formBox = document.querySelector("form");
const userName = document.querySelector("#name");
const userTel = document.querySelector("#telNumber");
const userAdress = document.querySelector("#userAdress");
const userReservationDate = document.querySelector("#userReservationDate");
const userReservationHour = document.querySelector("#userReservationHour");
const userReservationMinute = document.querySelector("#userReservationMinute");
const submitButton = document.querySelector("#submitButton");

const hours = userReservationHour.querySelectorAll("option");

const car = document.querySelector("#car");
const carBox = document.querySelector(".carBox");
let targetPosition;
let isMoving = false;

const wheel = document.querySelectorAll(".wheel");

function resetElements() {
  let inputs = document.querySelectorAll("input");
  inputs.forEach((item) => {
    item.value = "";
  });

  let selects = document.querySelectorAll("select");
  selects.forEach((item, index) => {
    if (index == 0) {
      item.value = "hh";
    } else {
      item.value = "mm";
    }
  });
}
resetElements();

//modal
const closeModal = document.querySelector("#closeModal");
const btnAlertModal = document.querySelector("#btnAlertModal");
const alertModal = document.querySelector(".alertModal");
const alertText = document.querySelector("#alertText");

let formSubmited = false;

closeModal.addEventListener("click", () => {
  alertModal.style.display = "none";
  if (formSubmited) {
    setTimeout(() => {
      location.reload();
    }, 500);
  }
  formSubmited = false;
});

function stopCar() {
  car.classList.remove("carMove");
  wheel.forEach((item) => item.classList.remove("moveToRight"));
  wheel.forEach((item) => item.classList.remove("moveToLeft"));
}

const targetPositions = [0];
function targetPositionGenerator() {
  targetPositions.length = 1;
  let carBoxWidth = carBox.offsetWidth;
  let carWidth = car.offsetWidth;

  let distanceRange = carBoxWidth - carWidth;

  Math.floor((distanceRange / 100) * 75);
  targetPositions.push(Math.floor((distanceRange / 100) * 20));
  targetPositions.push(Math.floor((distanceRange / 100) * 40));
  targetPositions.push(Math.floor((distanceRange / 100) * 60));
  targetPositions.push(Math.floor((distanceRange / 100) * 80));
  targetPositions.push(distanceRange);
}
targetPositionGenerator();

window.addEventListener("resize", targetPositionGenerator);

function restrictDate() {
  let today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth();
  if (month < 10) {
    month = "0" + month;
  }
  let day = today.getDate();
  if (day < 10) {
    day = "0" + day;
  }

  let newStartDate = `${year}-${month + 1}-${day}`;
  userReservationDate.setAttribute("min", newStartDate);
  userReservationDate.value = newStartDate;
}

restrictDate();

function restrictHour() {
  let today = new Date();
  let day = today.getDate();
  if (day < 10) {
    day = "0" + day;
  }
  let dateArr = userReservationDate.value.match(/[0-9]{1,}/g);
  console.log("day", day);
  console.log("dateArr[2]", dateArr[2]);

  let hour = today.getHours();
  if (day == dateArr[2]) {
    for (let i = 1; i < hours.length; i++) {
      if (hours[i].value <= hour + 3) {
        hours[i].disabled = true;
      }
    }
  } else {
    for (let i = 1; i < hours.length; i++) {
      hours[i].disabled = false;
    }
  }
}

restrictHour();

function trueCounter(arr) {
  let counter = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == true) {
      counter += 1;
    }
  }
  return counter;
}

function moveForward() {
  let carBoxWidth = carBox.offsetWidth;
  let carWidth = car.offsetWidth;
  let carLeft = car.offsetLeft;
  let itemPosition = parseInt(getComputedStyle(car).left);
  let firstStep = (targetPosition - itemPosition) % 5;
  itemPosition = itemPosition + firstStep;
  const moveRightId = setInterval(moveRight, 10);

  function moveRight() {
    stopCar();
    wheel.forEach((item) => item.classList.add("moveToRight"));
    car.classList.add("carMove");

    if (itemPosition == targetPosition) {
      clearInterval(moveRightId);
      stopCar();
      if (itemPosition == targetPositions[targetPositions.length - 1]) {
        setTimeout(() => {
          formSubmited = true;
          alertModal.style.display = "flex";
          alertText.textContent = `Dear "${
            userName.value
          }", your reservation will be at the address you specified on "${
            userReservationDate.value
          }" at "${
            userReservationHour.value + "." + userReservationMinute.value
          }".`;
        }, 750);
      }
    } else {
      itemPosition += 5;
      car.style.left = itemPosition + "px";
    }
  }
}

function moveBackward() {
  let carBoxWidth = carBox.offsetWidth;
  let carWidth = car.offsetWidth;
  let carLeft = car.offsetLeft;

  let add = (carBoxWidth - carWidth * 5) / 4;

  let itemPosition = parseInt(getComputedStyle(car).left);

  let firstStep = (targetPosition - itemPosition) % 5;

  itemPosition = itemPosition + firstStep;

  const moveLeftId = setInterval(moveLeft, 10);

  function moveLeft() {
    stopCar();
    wheel.forEach((item) => item.classList.add("moveToLeft"));
    car.classList.add("carMove");
    if (itemPosition == targetPosition) {
      clearInterval(moveLeftId);
      stopCar();
    } else {
      itemPosition -= 5;
      car.style.left = itemPosition + "px";
    }
  }
}

function moveZero() {
  car.style.left = "0";
}

let checker = [false, false, false, false, false];

formBox.addEventListener("change", (e) => {
  restrictHour();

  if (userName.value.length > 0) {
    checker[0] = true;
  } else {
    checker[0] = false;
  }

  if (userTel.value.length > 0) {
    checker[1] = true;
  } else {
    checker[1] = false;
  }

  if (userAdress.value.length > 0) {
    checker[2] = true;
  } else {
    checker[2] = false;
  }

  if (
    userReservationHour.value !== "hh" &&
    userReservationMinute.value !== "mm"
  ) {
    checker[3] = true;
  } else {
    checker[3] = false;
  }
  let positionLocation;
  if (trueCounter(checker) == 0) {
    targetPosition = targetPositions[0];

    moveBackward();
  } else if (trueCounter(checker) == 1) {
    targetPosition = targetPositions[1];

    let itemPosition = parseInt(getComputedStyle(car).left);
    if (targetPosition > itemPosition) {
      moveForward();
    } else {
      moveBackward();
    }
  } else if (trueCounter(checker) == 2) {
    targetPosition = targetPositions[2];
    let itemPosition = parseInt(getComputedStyle(car).left);
    if (targetPosition > itemPosition) {
      moveForward();
    } else {
      moveBackward();
    }
  } else if (trueCounter(checker) == 3) {
    targetPosition = targetPositions[3];
    let itemPosition = parseInt(getComputedStyle(car).left);
    if (targetPosition > itemPosition) {
      moveForward();
    } else {
      moveBackward();
    }
  } else if (trueCounter(checker) == 4) {
    targetPosition = targetPositions[4];
    let itemPosition = parseInt(getComputedStyle(car).left);
    if (targetPosition > itemPosition) {
      moveForward();
    } else {
      moveBackward();
    }
  }
});

submitButton.addEventListener("click", (e) => {
  e.preventDefault();

  if (trueCounter(checker) == 4) {
    checker[4] = true;
  } else {
    checker[4] = false;
  }

  if (trueCounter(checker) == 5) {
    targetPosition = targetPositions[5];
    moveForward();
  } else {
    alertModal.style.display = "flex";
    alertText.textContent =
      "Please fill in the blank fields and review the date and time information.";
  }
});

// Due to height problems in some phones
addEventListener("load", function () {
  var viewport = document.querySelector("meta[name=viewport]");
  viewport.setAttribute(
    "content",
    viewport.content + ", height=" + window.innerHeight
  );
});
