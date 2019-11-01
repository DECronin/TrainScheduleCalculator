var firebaseConfig = {
  apiKey: "AIzaSyAeo0OGAEevssR2lz_FiZwsjh89unT72xo",
  authDomain: "trainstop-calculator-dec.firebaseapp.com",
  databaseURL: "https://trainstop-calculator-dec.firebaseio.com",
  projectId: "trainstop-calculator-dec",
  storageBucket: "trainstop-calculator-dec.appspot.com",
  messagingSenderId: "618789775875",
  appId: "1:618789775875:web:fa2176c52b8d9eee3b3c36"
};

firebase.initializeApp(firebaseConfig);
let database = firebase.database();
var trainNumber = 1;

function initializingTable(myObject) {
  var freq = myObject.val().frequency;
  var first = myObject.val().first;

  var newRow = $('<tr id="row-' + trainNumber + '">');
  var name = $('<td id="d-name">');
  name.html(myObject.val().name);
  var destination = $('<td id="d-destination">');
  destination.html(myObject.val().destination);
  var frequency = $('<td id="d-frequency">');
  frequency.html(freq);

  var next = $('<td id="d-next">');
  var upcoming = calcTime(freq, first);
  next.html(upcoming);

  var away = $('<td id="d-m-away">');
  var diff = calcAway(upcoming);
  away.html(diff);

  newRow.append(name, destination, frequency, next, away);
  $('#schedule-list-rows').append(newRow);
};

function calcAway(upcoming){
  var minutes = moment().diff(moment(upcoming, "HH:mm"), "m");
  var minutes = (minutes*-1);
  return minutes
}

function calcTime(freq, first){
  var firstConverted = moment(first, "HH:mm").subtract(1, "years");
  var diffTime = moment().diff(moment(firstConverted), "minutes");
  var remainder = diffTime % freq;
  var next = freq - remainder;
  var nextTrain = moment().add(next, "minutes");
  var display = moment(nextTrain).format('HH:mm');
  return display
}

database.ref().on('child_added', function (snapshot) {
  initializingTable(snapshot);
}, function(errorObject) {
  console.log("Errors handled: " + errorObject.code);
});

$("#submit").on("click", function (event) {
  event.preventDefault();
  var trainName = $("#name").val().trim();
  var destination = $("#destination").val().trim();
  var frequency = $("#frequency").val().trim();
  var first = $("#first").val().trim();
  database.ref().push({
      name: trainName,
      destination: destination,
      frequency: frequency,
      first: first,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
  })
  $("#name").val('');
  $("#destination").val('');
  $("#frequency").val('');
  $("#first").val('');
});