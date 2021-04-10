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
  }
}

let pollTimeout;

function pollSensorData() {
  fetch('https://allegiant-cichlid-1289.dataplicity.io/sensors')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response not ok!');
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
    })
    .catch(error => {
      document.getElementById('raspApi').style.display = 'none';
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
  clearTimeout(pollTimeout);
}

document.addEventListener('DOMContentLoaded', function() {

  writeIntro();
  document.getElementById('homeButton').addEventListener('click', function() {
    hideElements('content');
    showElement('home');
    showElement('raspApi');
    title.innerHTML = 'Home';
    pollSensorData();
  });
  document.getElementById('projectsButton').addEventListener('click', function() {
    hideElements('content');
    showElement('projects');
    title.innerHTML = 'Projects';
  });
  document.getElementById('skillsButton').addEventListener('click', function() {
    hideElements('content');
    showElement('skills');
    title.innerHTML = 'Skills';
  });
  document.getElementById('aboutButton').addEventListener('click', function() {
    hideElements('content');
    showElement('about');
    title.innerHTML = 'About';
  });
  document.getElementById('contactButton').addEventListener('click', function() {
    hideElements('content');
    showElement('contact');
    title.innerHTML = 'Contact';
  });
  document.getElementById('contactForm').setAttribute('action', 'https://formspree.io' + '/xwkebjeo');

});
