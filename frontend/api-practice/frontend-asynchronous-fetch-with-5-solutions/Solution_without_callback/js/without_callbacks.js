// jshint esversion:6
const astrosUrl = 'http://api.open-notify.org/astros.json';
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const peopleList = document.getElementById('people');


// Make an AJAX request
function trigger () {
  document.querySelector('button').remove();
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://api.open-notify.org/astros.json');
  xhr.send();
  xhr.onload = () => {
    if(xhr.status === 200) {
      let data = JSON.parse(xhr.responseText).people;
      for(i=0; i<data.length; i++) {
        let xhr1=new XMLHttpRequest();
        xhr1.open('GET', wikiUrl+data[i].name);
        xhr1.send();
        xhr1.onload = () => {
          if(xhr1.status === 200) {
            let data1=JSON.parse(xhr1.responseText);
            generateHTML(data1);
          }
        };
      }
    }
  };
}

// Generate the markup for each profile
function generateHTML(data) {
  const section = document.createElement('section');
  peopleList.appendChild(section);
  // Check if request returns a 'standard' page from Wiki
  if (data.type === 'standard') {
    section.innerHTML = `
      <img src=${data.thumbnail.source}>
      <h2>${data.title}</h2>
      <p>${data.description}</p>
      <p>${data.extract}</p>
    `;
  } else {
    section.innerHTML = `
      <img src="img/profile.jpg" alt="ocean clouds seen from space">
      <h2>${data.title}</h2>
      <p>Results unavailable for ${data.title}</p>
      ${data.extract_html}
    `;
  }
}

document.querySelector('button').addEventListener("click", trigger);
