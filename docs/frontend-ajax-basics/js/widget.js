// jshint esversion:6
// Emplyees Step 1: create an XMLHttpRequest
let xhr = new XMLHttpRequest();
//Employees Step 2: open a request
xhr.open('GET', 'data/employees.json');
//Employees Step 3: send the request
xhr.send();
//Employees Step 4: create a callback function shows the status of employees
xhr.onload = function() {
  if (xhr.status == 200) {
    let html = '<ul class="bulleted">';
    var employees = JSON.parse(xhr.responseText);
    for (i = 0; i < employees.length; i++) {
      if (employees[i].inoffice == true) {
        html += '<li class="in">';
      } else {
        html += '<li class="out">';
      }
      html += employees[i].name;
      html += '</li>';
    }
    html += '</ul>';
    document.getElementById('employeeList').innerHTML = html;

  } else if (xhr.status == 404) {
    document.getElementById('employeeList').innerHTML = '<h1>Not Found </h1>';
  } else if (xhr.status == 403) {
    document.getElementById('employeeList').innerHTML = '<h1>Forbidden </h1>';
  }
};

xhr.onerror = function() {
  document.getElementById('employeeList').innerHTML = '<h1>Request Error </h1>';
};
// end of the callback function of employees

// Meetingroom Step 1: create an XMLHttpRequest
let xhr1 = new XMLHttpRequest();
//Meetingroom Step 2: open a request
xhr1.open('GET', 'data/rooms.json');
//Meetingroom Step 3: send the request
xhr1.send();
//Meetingroom Step 4: create a callback function shows the status of meetingRooms
xhr1.onload = function() {
  if (xhr1.status == 200) {
    let html1 = '<ul class="rooms">';
    let rooms = JSON.parse(xhr1.responseText);
    for (i = 0; i < rooms.length; i++) {
      if (rooms[i].available == true) {
        html1 += '<li class="empty">';
      } else {
        html1 += '<li class="full">';
      }
      html1 += rooms[i].room;
      html1 += '</li>';
    }
    html1 += '</ul>';
    document.getElementById('roomList').innerHTML = html1;
  } else if (xhr1.status == 404) {
    document.getElementById('roomList').innerHTML = '<h1>Not Found </h1>';
  } else if (xhr1.status == 403) {
    document.getElementById('roomList').innerHTML = '<h1>Forbidden </h1>';
  }
};

xhr1.onerror = function() {
  document.getElementById('roomList').innerHTML = '<h1>Request Error</h1>';
};
// end of the callback function of rooms
