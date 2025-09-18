// jshint esversion:6
const select = document.getElementById('breeds');
const card = document.querySelector('.card');
const form = document.querySelector('form');
let z=document.createElement('p');
z.setAttribute("id", "returnWords");
// .map(breed=> addBreed(breed))
// ------------------------------------------
//  FETCH FUNCTIONS
// ------------------------------------------
function fetchData(url) {
  return fetch(url)
          .then(
            response => {
              // 这里我猜显示的是status code的那种error,如果path有问题会显示在这
              if (!response.ok) {throw Error(response.status);}
              else {return response.json();}
            })
          // fetch will fire an autonomous function to catch the request error
          // without reaching the server ,
          // the object just calls "error"， if it's domain name problem(here>>
        // dog.ceo), it will also be shown here not above
          .catch(error => console.log(error.message));
}


fetchData('https://dog.ceo/api/breeds/image/random')
  .then(
    promise => card.innerHTML=`
                               <img src="${promise.message}" alt="image">
                               <p>Select the breed to view images of different breed.</p>
                               `);

fetchData('https://dog.ceo/api/breeds/list')
  .then(data => addBreed(data.message));

// ------------------------------------------
//  HELPER FUNCTIONS
// ------------------------------------------
//
function addBreed (data) {
  const breedOption = data.map(item => `<option value="${item}">${item}</option>`);
  select.innerHTML='<option value="">--Please choose an option--</option>'+breedOption.join('');
}

function passValue () {
  var value=select.value;
  fetchData(`https://dog.ceo/api/breed/${value}/images/random`)
    .then(promise => card.innerHTML=`
                               <img src="${promise.message}" alt="${value}">
                               <p>Click to view more images of ${value} breed.</p>
                               `);
}

function postData(e) {
  // prevent page from reloading
  e.preventDefault();
  const name=document.getElementById('name').value;
  const comment=document.getElementById('comment').value;

  fetch('https://jsonplaceholder.typicode.com/posts/1/comments',{
    method:'POST',
    headers:{
      'content-type': 'application/json'
    },
    body: JSON.stringify({name:name,comment:comment})
  })
  .then(response=>response.json())
  .then(()=> document.querySelector('form').appendChild(z))
  .then(()=> z.innerHTML='Thanks for comment! We have received it!');
}

// ------------------------------------------
//  EVENT LISTENERS
// ------------------------------------------

select.addEventListener('change', passValue);
card.addEventListener('click',passValue);
form.addEventListener('submit',postData);





//
// ------------------------------------------
//  POST DATA
// ------------------------------------------
