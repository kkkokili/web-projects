// jshint esversion:8
// ---------------------------------------------
//                  Fetch Requests
// ---------------------------------------------
$.ajax({
  url: 'https://randomuser.me/api/?results=12&nat=us',
  dataType: 'json',
  success: function(data) {
    displayData(data.results);
  }
});
// ---------------------------------------------
//                  Variables
// ---------------------------------------------
const card = document.querySelector('.card');
const gallery = document.querySelector('.gallery');
const body = document.querySelector('body');
// ---------------------------------------------
//                  FUNCTIONS
// ---------------------------------------------
/*Creates HTML elements, displays 12 random user from the fetched data results and calls the displayModal function when a user card is clicked*/
function displayData(data){
data.map(person => {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
        <div class="card-img-container">
            <img class="card-img" src="${person.picture.large}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${person.name.first} ${person.name.last}</h3>
            <p class="card-text">${person.email}</p>
            <p class="card-text cap">${person.location.city}, ${person.location.state}</p>
        </div>
    </div>
    `;
    gallery.append(card);
    card.addEventListener('click',() => {
      displayModal(data, person);
    });
  });
}
/*Creates the HTML from the fetched user data, displays the modal view when clicked and hides it when the X button is clicked*/
function displayModal(data, clicked){
  const modalDiv = document.createElement('div');
  modalDiv.className = 'modal-container';
//Creates a new date object to format birthday
  const dob = new Date(clicked.dob.date);
  modalDiv.innerHTML = `
      <div class="modal">
          <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
          <div class="modal-info-container">
              <img class="modal-img" src="${clicked.picture.large}" alt="profile picture">
              <h3 id="name" class="modal-name cap">${clicked.name.first} ${clicked.name.last}</h3>
              <p class="modal-text">${clicked.email}</p>
              <p class="modal-text cap"> ${clicked.location.city}, ${clicked.location.state}</p>
              <hr>
              <p class="modal-text">${clicked.cell}</p>
              <p class="modal-text">${clicked.location.street.number} ${clicked.location.street.name} ${clicked.location.postcode}</p>
              <p class="modal-text">Birthday: ${dob.toLocaleDateString('en-us')}</p>
          </div>
      </div>`;
      body.append(modalDiv);
  let closeBtn = document.querySelector('button');
  closeBtn.className = 'modal-close-btn';
  //Listens for user to click the close button and closes modal window
  modalDiv.addEventListener('click', () => {
    modalDiv.style.display = 'none';
  })
  //Listens for user to click the outside the modal window and closes it
  window.addEventListener('click', () => {
    if (event.target === modalDiv){
    modalDiv.style.display = 'none';
    }
  })
};
