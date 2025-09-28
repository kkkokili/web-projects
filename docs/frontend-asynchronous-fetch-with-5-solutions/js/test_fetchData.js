// It's Success

// jshint esversion:6
const astroUrl = 'http://api.open-notify.org/astros.json';
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const peopleList = document.getElementById('people');
const btn = document.querySelector('button');


// ------------------------------------------
//  Event LISTENER
// ------------------------------------------
// btn.addEventListener('click', functionX);

// ------------------------------------------
//  Fetch FUNCTIONS
// ------------------------------------------
fetchData(astroUrl)
  .then(promise => {return assemble(promise.people);})
  .then(data => console.log(data));






// Promise.all(fetchArray(fetchData(astroUrl)))
//   .then(response => console.log(response));
// ------------------------------------------
//  HELPER FUNCTIONS
// ------------------------------------------
function fetchData(url) {
  return fetch(url)
          .then(response => {if (!response.ok) { throw Error(response.status); }
                             else {return response.json();}})
          .catch(err => console.log(err.message));
}

function assemble(peopleList) {
  const wikiUrlList = peopleList.map(item => wikiUrl+item.name);
  return wikiUrlList;
}

// The input data is the array of WikiURL, so 'data.map(item => fetch(item))'
//  will produce a list of function/fetch array which can be passed into
// promise.all
// function fetchArray(data) {
//   data => data.map(item => fetchData(item));
//    console.log(data);
// }
//
// function generateHTML(data) {
//   const section = document.createElement('section');
//   peopleList.appendChild(section);
//   // Check if request returns a 'standard' page from Wiki
//   if (data.type === 'standard') {
//     section.innerHTML = `
//     <img src=${data.thumbnail.source}>
//     <h2>${data.title}</h2>
//     <p>${data.description}</p>
//     <p>${data.extract}</p>
//   `;
//   } else {
//     section.innerHTML = `
//     <img src="img/profile.jpg" alt="ocean clouds seen from space">
//     <h2>${data.title}</h2>
//     <p>Results unavailable for ${data.title}</p>
//     ${data.extract_html}
//   `;
//   }
// }
