// jshint esversion:6
// This test file is used to test the result of move the astroPromise(astrosUrl) out of click callback
// the result is that it also works!!
const astrosUrl = 'http://api.open-notify.org/astros.json';
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const peopleList = document.getElementById('people');

document.querySelector('button').addEventListener('click',
  () => {
    document.querySelector('button').remove();
  });
/**
 *  Step 1: Create promise
 *  We create the promise using the new keyword,followed by the Promise()
  constructor function. The Promise() constructor takes one argument,
  a callback with two perimeters, resolve for when the promise is fulfilled,
  and reject for when it's rejected.
 */
function astroPromise(url) {
  // typeof astroPromise(url) is an object
  return new Promise((resolve, reject) => {

    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.send();

    xhr.onload = () => {
      if (xhr.status === 200) {
        let data = JSON.parse(xhr.responseText);
        resolve(data);
      } else {
        reject(Error(xhr.statusText));
      }
    };
    xhr.onerror = () => {
      reject(Error('Request Error'));
    };
  });
}

astroPromise(astrosUrl)
  .then(
    x => {
      x.people.map(
        person => {
          astroPromise(wikiUrl + person.name)
            .then(z => {
              generateHTML(z);
            })
            .catch(h => {
              document.getElementById('people').innerHTML = h;
            });
        }
      );
    }
  )
  .catch(
    y => {
      document.getElementById('people').innerHTML = y;
    }
  );

// // Generate the markup for each profile
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
