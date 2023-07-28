import { start as startSnake, stop as stopSnake } from './snake.js';

let title = document.getElementById('title');
let i = 0;

function loadTitle() {
  if (i % 4 === 0) {
    title.innerHTML = 'Loading';
  } else {
    title.innerHTML += '#';
  }
  i++;
}

function showElements(className, displayStyle = 'block') {
  let content = document.getElementsByClassName(className);
  for (let i = 0; i < content.length; i++) {
    content[i].style.display = displayStyle;
  }
}

let introText = 'Welcome to the site showcasing some personal projects and more!';
let loadTitleInterval = setInterval(loadTitle, 500);
let index = 0;

function writeIntro() {
  if (index < introText.length) {
    document.getElementById('homeText').innerHTML += introText.charAt(index);
    index++;
    setTimeout(writeIntro, 60);
  } else {
    clearInterval(loadTitleInterval);
    title.innerHTML = 'Home';
    showElements('button', 'inline');
    showElement('raspApi');
    pollSensorData();
    updateGitHubContributionAmount();
  }
}

let pollTimeout;
let isPollTimeOutCleared = false;

function pollSensorData() {
  isPollTimeOutCleared = false;
  fetch(u)
    .then(response => {
      if (!response.ok) {
        throw Error(response.status + ' ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      document.getElementById('temp').innerHTML = data['temperature'].toPrecision(4);
      document.getElementById('hum').innerHTML = data['humidity'].toPrecision(4);
      document.getElementById('pres').innerHTML = data['pressure'].toPrecision(6);
      document.getElementById('cpuTemp').innerHTML = data['cpu_temp'].toPrecision(4);
      document.getElementById('co2').innerHTML = data['eco2'];
      document.getElementById('tvoc').innerHTML = data['tvoc'];
    })
    .then(() => {
      pollTimeout = setTimeout(pollSensorData, 2000);
    })
    .catch(error => {
      document.getElementById('raspApi').style.display = 'none';
      console.log(error.message);
    });
}

let lastClickedContributions = 0;

function updateGitHubContributionAmount() {
  if (Date.now() - lastClickedContributions < 10000) return;
  lastClickedContributions = Date.now();

  fetch(u2)
    .then(response => {
      if (!response.ok) {
        throw Error(response.status + ' ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      document.getElementById('contributionAmount').innerHTML = data['contributions'];
      document.getElementById('contributions').style.display = null;
    })
    .catch(error => {
      document.getElementById('contributions').style.display = 'none';
      console.log(error.message);
    });
}

function showElement(id) {
  document.getElementById(id).style.display = 'block';
}

function hideElements(className) {
  let content = document.getElementsByClassName(className);
  for (let i = 0; i < content.length; i++) {
    content[i].style.display = 'none';
  }
}

function clearPollTimeout() {
  clearTimeout(pollTimeout);
  isPollTimeOutCleared = true;
}

document.addEventListener('DOMContentLoaded', function () {
  writeIntro();
  // Home
  document.getElementById('homeButton').addEventListener('click', function () {
    hideElements('content');
    showElement('home');
    showElement('raspApi');
    title.innerHTML = 'Home';
    if (isPollTimeOutCleared) {
      pollSensorData();
    }
    stopSnake();
  });
  // Projects
  document.getElementById('projectsButton').addEventListener('click', function () {
    hideElements('content');
    showElement('projects');
    title.innerHTML = 'Projects';
    clearPollTimeout();
    stopSnake();
  });
  //Skills
  document.getElementById('skillsButton').addEventListener('click', function () {
    hideElements('content');
    showElement('skills');
    title.innerHTML = 'Skills';
    clearPollTimeout();
    stopSnake();

  });
  // About
  document.getElementById('aboutButton').addEventListener('click', function () {
    hideElements('content');
    showElement('about');
    title.innerHTML = 'About';
    updateGitHubContributionAmount();
    clearPollTimeout();
    stopSnake();

  });
  // Contact
  document.getElementById('contactButton').addEventListener('click', function () {
    hideElements('content');
    showElement('contact');
    title.innerHTML = 'Contact';
    clearPollTimeout();
    stopSnake();
  });
  // Snake
  document.getElementById('snakeButton').addEventListener('click', function () {
    hideElements('content');
    showElement('snake');
    title.innerHTML = 'Snake';
    clearPollTimeout();
    stopSnake();
    startSnake();
  });
  document.getElementById('contactForm').setAttribute('action', 'https://formspree.io' + '/xwkebjeo');
});

let _0xf464=["\x68\x74\x74\x70\x73\x3A\x2F\x2F\x70\x72\x6F\x66\x69\x63\x69\x65\x6E\x74\x2D\x67\x6F\x73\x68\x61\x77\x6B\x2D\x38\x31\x39\x36\x2E\x64\x61\x74\x61\x70\x6C\x69\x63\x69\x74\x79\x2E\x69\x6F\x2F\x65\x6E\x76\x2D\x61\x70\x69\x2F\x73\x65\x6E\x73\x6F\x72\x73"];let u=_0xf464[0]
let _0xab87=["\x68\x74\x74\x70\x73\x3A\x2F\x2F\x70\x72\x6F\x66\x69\x63\x69\x65\x6E\x74\x2D\x67\x6F\x73\x68\x61\x77\x6B\x2D\x38\x31\x39\x36\x2E\x64\x61\x74\x61\x70\x6C\x69\x63\x69\x74\x79\x2E\x69\x6F\x2F\x63\x6F\x6E\x74\x72\x69\x62\x75\x74\x69\x6F\x6E\x73"];let u2=_0xab87[0]
