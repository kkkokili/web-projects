// jshint esversion:6
fetch('https://dog.ceo/api/breeds/image/randoms')
    .then(response => {if (response.ok == false) {throw Error(response.status);}})
    .catch(error => console.log(error.message));
