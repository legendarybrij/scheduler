 // Initialize Firebase
 var config = {
    apiKey: "AIzaSyCsYzmBOh-GZQO12BF4kVtR84J2p-4jMhE",
    authDomain: "scheduler-59203.firebaseapp.com",
    databaseURL: "https://scheduler-59203.firebaseio.com",
    projectId: "scheduler-59203",
    storageBucket: "scheduler-59203.appspot.com",
    messagingSenderId: "988690421313"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

  console.log(database);
  var nameT = "";
  

$(document).ready(function(){ 

$("#submit-info").on("click", function(event){

  event.preventDefault();
  nameT = $("#train-name").val().trim();
  destinationT = $("#destination-name").val().trim();
  firstT = $("#first-time").val();
  frequencyT = $("#frequency-time").val().trim();


    var tFrequency = frequencyT;

    // Time is firstT
    var firstTime = firstT;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextT = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextT).format("hh:mm"));
    var nextA = moment(nextT).format("hh:mm");

  //console.log(name);

  database.ref().push({
    name: nameT,
    destination: destinationT,
    firstTime: firstT,
    frequencyTime: frequencyT,
    nextArrival: nextA,
    minAway: tMinutesTillTrain
  });

  $("#train-name").val("");
  $("#destination-name").val("");
  $("#first-time").val("");
  $("#frequency-time").val("");
});


database.ref().on("child_added", function(snapshot) {
    // storing the snapshot.val() in a variable for convenience
    var sv = snapshot.val();
    var newRow = $("<tr>");
    var newCol1 = $("<td>");
    var newCol2 = $("<td>");
    var newCol3 = $("<td>");
    var newCol4 = $("<td>");
    var newCol5 = $("<td>");

    console.log("NAME: " +sv.name + " Destination: " +sv.destination +" First-time: "+ sv.firstTime+ " Frequency: "+sv.frequencyTime);
    
    $(".tableInsert").append(newRow);
    newRow.append(newCol1);
    newCol1.text(sv.name);
    newCol1.addClass("table-success table-hover");
    newRow.append(newCol2);
    newCol2.text(sv.destination);
    newCol2.addClass("table-success table-hover");
    newRow.append(newCol3);
    newCol3.text(sv.frequencyTime);
    newCol3.addClass("table-success table-hover");
    newRow.append(newCol4);
    newCol4.text(sv.nextArrival);
    newCol4.addClass("table-success table-hover");
    newRow.append(newCol5);
    newCol5.text(sv.minAway);
    newCol5.addClass("table-success table-hover");

    // Handle the errors
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });
  

  console.log(database);

});

