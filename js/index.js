let title = document.getElementById('title');
let i = 0;

function loadTitle() {
  if (i % 4 == 0) {
    title.innerHTML = 'Loading';
  } else {
    title.innerHTML += '#';
  }
  i++;
}

function showElements(className) {
  let content = document.getElementsByClassName(className);
  for (let i = 0; i < content.length; i++) {
    content[i].style.display = 'block';
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
    showElements('button');
    showElement('raspApi');
    pollSensorData();
    updateGitHubContributionAmount();
  }
}

let pollTimeout;
let isPollTimeOutCleared = true;

function pollSensorData() {
  fetch('https://allegiant-cichlid-1289.dataplicity.io/sensors.php')
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
    })
    .then(() => {
      pollTimeout = setTimeout(pollSensorData, 2000);
      isPollTimeOutCleared = false;
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

  fetch('https://allegiant-cichlid-1289.dataplicity.io/contributions.php')
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
  document.getElementById('homeButton').addEventListener('click', function () {
    hideElements('content');
    showElement('home');
    showElement('raspApi');
    title.innerHTML = 'Home';
    if (isPollTimeOutCleared) {
      pollSensorData();
    }
  });
  document.getElementById('projectsButton').addEventListener('click', function () {
    hideElements('content');
    showElement('projects');
    title.innerHTML = 'Projects';
    clearPollTimeout();
  });
  document.getElementById('skillsButton').addEventListener('click', function () {
    hideElements('content');
    showElement('skills');
    title.innerHTML = 'Skills';
    clearPollTimeout();
  });
  document.getElementById('aboutButton').addEventListener('click', function () {
    hideElements('content');
    showElement('about');
    title.innerHTML = 'About';
    updateGitHubContributionAmount();
    clearPollTimeout();
  });
  document.getElementById('contactButton').addEventListener('click', function () {
    hideElements('content');
    showElement('contact');
    title.innerHTML = 'Contact';
    clearPollTimeout();
  });
  document.getElementById('contactForm').setAttribute('action', 'https://formspree.io' + '/xwkebjeo');

});
