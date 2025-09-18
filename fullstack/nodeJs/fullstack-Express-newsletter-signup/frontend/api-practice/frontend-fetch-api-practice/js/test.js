// jshint esversion:8
const gallery = document.getElementById('gallery');

async function extract() {
  const response = await fetch('https://randomuser.me/api/?results=12');
  const promise = await response.json();
  const data = promise.results;
  console.log(data);
  const img = data.picture.large;
  const first = data.name.first;
  const last = data.name.last;
  const email = data.email;
  const city = data.location.city;
  const state = data.location.state;
  const country = data.location.country;
  generateHTML(data, img, first, last, email, city, state, country);
}

extract();




function generateHTML(data, img, first, last, email, city, state, country) {
  const section = document.createElement('div');
  section.setAttribute("class", "card");
  gallery.appendChild(section);
  section.innerHTML = `
      <div class="card-img-container">
          <img class="card-img" src=${img} alt="profile picture">
      </div>
      <div class="card-info-container">
          <h3 id="name" class="card-name cap">${first} ${last}</h3>
          <p id="email" class="card-text">${email}</p>
          <p class="card-text cap">${city}, ${state}</p>
      </div>`;
  section.addEventListener('click', x);
}
