// jshint esversion:6
var y=['a','b','c'];

function generateOptions(x) {
  const options = y.map(item => `<option value="${item}">${item}</option>`);
  console.log(options);
}
