// jshint esversion:8
const astrosUrl = 'http://api.open-notify.org/astros.json';
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const peopleList = document.getElementById('people');
const btn = document.querySelector('button');


// Handle all fetch requests
async function decode() {
  try {
    const response = await fetch(astrosUrl);
    const promise = await response.json();
    // promise.poeple is an array of astros' names together with each one's relative craft
    const x = promise.people.map(async item => {
      const craft = item.craft;
      const name = item.name;
      const response1 = await fetch(wikiUrl + name);
      const promise1 = await response1.json();
      generateHTML(promise1, craft);
    });
  } catch(error) {
    throw error;
  }
}

// Generate the markup for each profile
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

btn.addEventListener('click', (event) => {
  event.target.textContent = "Loading...";
  decode().finally(()=>btn.remove());
});
