// jshint esversion:6
const ASTRO_LOCAL = './data/astros.json';
const WIKI_SUMMARY = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const peopleList = document.getElementById('people');
const btn = document.querySelector('button');

// ------------------------------------------
//  Event LISTENER
// ------------------------------------------

btn.addEventListener('click', trigger);

// ------------------------------------------
//  Fetch FUNCTIONS
// ------------------------------------------

async function trigger() {
  btn.textContent = 'Loading...';
  try {
    const data = await fetch(ASTRO_LOCAL).then((r) => r.json());
    const results = await Promise.all(
      data.people.map(async (p) => {
        const res = await fetch(WIKI_SUMMARY + encodeURIComponent(p.name));
        const wiki = await res.json();
        return { wiki, craft: p.craft };
      }),
    );
    results.forEach(({ wiki, craft }) => generateHTML(wiki, craft));
  } catch (e) {
    peopleList.insertAdjacentHTML(
      'beforeend',
      `<p>Failed to load data: ${e}</p>`,
    );
  } finally {
    btn.remove();
  }
}

// ------------------------------------------
//  HELPER FUNCTIONS
// ------------------------------------------

function fetchData(url) {
  return (
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.status);
        } else {
          return response.json();
        }
      })
      // return promise object
      .catch((err) => console.log(err.message))
  );
}

function generateHTML(data, data1) {
  const section = document.createElement('section');
  peopleList.appendChild(section);
  // Check if request returns a 'standard' page from Wiki
  if (data.type === 'standard') {
    section.innerHTML = `
    <img src=${data.thumbnail.source}>
    <span>${data1}</span>
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
