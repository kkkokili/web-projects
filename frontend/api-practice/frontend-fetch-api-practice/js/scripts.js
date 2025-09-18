// jshint esversion:8
const gallery = document.getElementById('gallery');


// -----------------------------------------------------------------------------------------------------------------------
//  Show Employee DIRECTORY        *I push all the 12 data results into 'datalist' empty array (use the array method PUSH)
// -----------------------------------------------------------------------------------------------------------------------
var datalist = [];

async function extract() {
  const response = await fetch('https://randomuser.me/api/?results=12');
  const promise = await response.json();
  // map function contains the parameter of index which shows [0,11]
  const data = promise.results.map((item, index) => {

    var itemIndex = index;
    const img = item.picture.large;
    const first = item.name.first;
    const last = item.name.last;
    const email = item.email;
    const city = item.location.city;
    const state = item.location.state;
    const country = item.location.country;
    datalist.push(item);

    // generate cards: pass all the arguments to the generateHTML Function which
    // will generate 12 cards  using (img, first, last, email, city,
    //  state, country) in each item and laster pass the single itemIndex
    // argument to generateModal function for generating a single modal
    generateHTML(img, first, last, email, city, state, country, itemIndex);
  });
}


// generateHTML: pass all the arguments to the generateHTML Function which
// will generate 12 cards  using (img, first, last, email, city,
//  state, country) in each item and laster pass the single itemIndex
// argument to generateModal function for generating a single modal
function generateHTML(img, first, last, email, city, state, country, itemIndex) {
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
  section.addEventListener('click', ev => {
    // generate Modal
    generateModal(itemIndex);

  });
}



// This little helper function reformats the phone number to the desired format (xxx)-xxx-xxxx
function reformCell(cellNr) {
    // keep digits only using Regular Expression Patterns & replace:
    let retStr = cellNr.replace(/[^\d]/g, '');
    // And now we recreate the string in the desired format:
    retStr = `(${retStr.slice(0, 3)}) ${retStr.slice(3,6)}-${retStr.slice(6,retStr.length)}`;
    return retStr;
}



// -----------------------------------------------------------------------------
//  Present a Modal
// -----------------------------------------------------------------------------
function Modal(itemIndex) {
  const div = document.createElement('div');
  div.setAttribute("class", "modal-container");
  document.querySelector('body').appendChild(div);
  var address = `${datalist[itemIndex].location.street.number}  ${datalist[itemIndex].location.street.name}, ${datalist[itemIndex].location.city}, ${datalist[itemIndex].location.state}, ${datalist[itemIndex].location.country}, ${datalist[itemIndex].location.postcode}`;
  var cell = reformCell(datalist[itemIndex].cell);
  var birthday = datalist[itemIndex].dob.date;
  div.innerHTML = `<div class="modal">
      <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
      <div class="modal-info-container">
          <img class="modal-img" src=${datalist[itemIndex].picture.large} alt="profile picture">
          <h3 id="name" class="modal-name cap">${datalist[itemIndex].name.first} ${datalist[itemIndex].name.last}</h3>
          <p class="modal-text">${datalist[itemIndex].email}</p>
          <p class="modal-text cap">${datalist[itemIndex].location.city}</p>
          <hr>
          <p class="modal-text">${cell}</p>
          <p class="modal-text">${address}</p>
          <p class="modal-text">Birthday: ${birthday.slice(5,7)}/${birthday.slice(8,10)}/${birthday.slice(0,4)}</p>
      </div>
  </div>

  // IMPORTANT: Below is only for exceeds tasks
  <div class="modal-btn-container">
      <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
      <button type="button" id="modal-next" class="modal-next btn">Next</button>
  </div>`;

  document.querySelector('#modal-close-btn').addEventListener('click', ev => {
    document.querySelector('.modal-container').remove();
  });
}
// this Modal frame will always here (as well as the click ae)but the content of
// the inside tags will update as long as users click the 'pre' and 'next' button



function updateModalContent(itemIndex) {
  document.querySelector('.modal-img').setAttribute('src', `${datalist[itemIndex].picture.large}`);
  document.querySelector('.modal-name').innerHTML = `${datalist[itemIndex].name.first} ${datalist[itemIndex].name.last}`;
  document.getElementsByClassName('modal-text')[0].innerHTML = `${datalist[itemIndex].email}`;
  document.getElementsByClassName('modal-text')[1].innerHTML = `${datalist[itemIndex].location.city}`;
  document.getElementsByClassName('modal-text')[2].innerHTML = reformCell(`${datalist[itemIndex].cell}`);
  document.getElementsByClassName('modal-text')[3].innerHTML = `${datalist[itemIndex].location.street.number}  ${datalist[itemIndex].location.street.name}, ${datalist[itemIndex].location.city}, ${datalist[itemIndex].location.state}, ${datalist[itemIndex].location.country}, ${datalist[itemIndex].location.postcode}`;
  document.getElementsByClassName('modal-text')[4].innerHTML = `Birthday: ${datalist[itemIndex].dob.date.slice(5,7)}/${datalist[itemIndex].dob.date.slice(8,10)}/${datalist[itemIndex].dob.date.slice(0,4)}`;
}



function generateModal(itemIndex) {
  Modal(itemIndex);

  document.querySelector('#modal-prev').addEventListener('click', ev => {
    itemIndex = itemIndex - 1;
    updateModalContent(itemIndex);
  });

  document.querySelector('#modal-next').addEventListener('click', ev => {
    itemIndex = itemIndex + 1;
    updateModalContent(itemIndex);
  });
}



extract();

//  Search bar function
// document.querySelector('#search-input').addEventListener('keyup', ev => {
//
// });
