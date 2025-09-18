// jshint esversion:6
const astroUrl = 'http://api.open-notify.org/astros.json';
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const peopleList = document.getElementById('people');
const btn = document.querySelector('button');

// ------------------------------------------
//  Event LISTENER
// ------------------------------------------

btn.addEventListener('click', trigger);

// ------------------------------------------
//  Fetch FUNCTIONS
// ------------------------------------------

function trigger() {
  btn.innerHTML="Loading...";
  fetchData(astroUrl)
    .then(promise => promise.people.map(item => {
     
      return fetch(wikiUrl+item.name);
    }))
    .then(fetcharray =>  Promise.all(fetcharray))
    .then(response => response.map(item => item.json().then(data => generateHTML(data))))
    .finally(()=>btn.remove());


}

// ------------------------------------------
//  HELPER FUNCTIONS
// ------------------------------------------

function fetchData(url) {
  return fetch(url)
          .then(response => {if (!response.ok) { throw Error(response.status); }
                             else {return response.json();}})
                             // return promise object
          .catch(err => console.log(err.message));
}


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
