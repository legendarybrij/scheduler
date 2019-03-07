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

  //var connectionsRef = database.ref("/schedule");

  console.log(database);
  var nameT = "";
  
  
  

$(document).ready(function(){ 

$("#submit-info").on("click", function(event){

  event.preventDefault();
  nameT = $("#train-name").val().trim();
  destinationT = $("#destination-name").val().trim();
  firstT = $("#first-time").val();
  frequencyT = $("#frequency-time").val().trim();


    

    // Time is firstT
    

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstT, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % frequencyT;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = frequencyT - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextT = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextT).format("hh:mm"));
    var nextA = moment(nextT).format("hh:mm");

  //console.log(name);

  var dataId = database.ref("/schedule").push({
    name: nameT,
    destination: destinationT,
    firstTime: firstT,
    frequencyTime: frequencyT,
    nextArrival: nextA,
    minAway: tMinutesTillTrain
  });

  dataId = dataId.toString().substring(48);

  database.ref("/id").push({
   deleteId: dataId
  });

  

  $("#train-name").val("");
  $("#destination-name").val("");
  $("#first-time").val("");
  $("#frequency-time").val("");
});


database.ref("/schedule").on("child_added", function(snapshot) {
    // storing the snapshot.val() in a variable for convenience
    var sv = snapshot.val();
    
    var newRow = $("<tr>");
    var newCol1 = $("<td>");
    var newCol2 = $("<td>");
    var newCol3 = $("<td>");
    var newCol4 = $("<td>");
    var newCol5 = $("<td>");
    var update = $("<td>");
    var remove = $("<td>");


    console.log("NAME: " +sv.name + " Destination: " +sv.destination +" First-time: "+ sv.firstTime+ " Frequency: "+sv.frequencyTime);
    
    $(".tableInsert").append(newRow);
    newRow.append(newCol1);
    newCol1.text(sv.name);
    newCol1.addClass("table-success table-hover");
    newCol1.attr("contenteditable","true")

    newRow.append(newCol2);
    newCol2.text(sv.destination);
    newCol2.addClass("table-success table-hover");
    newCol2.attr("contenteditable","true")

    newRow.append(newCol3);
    newCol3.text(sv.frequencyTime);
    newCol3.attr("contenteditable","true")
    newCol3.addClass("table-success table-hover");

    newRow.append(newCol4);
    newCol4.text(sv.nextArrival);
    newCol4.addClass("table-success table-hover");

    newRow.append(newCol5);
    newCol5.text(sv.minAway);
    newCol5.addClass("table-success table-hover");

    newRow.append(update);
    update.text("Update");
    update.addClass("table-success table-hover btn-success updateEdit");

    newRow.append(remove);
    remove.text("Remove");
    remove.attr("id","removeData");
    /*database.ref("/id").on("child_added", function(snapshot) {
      var sv = snapshot.val();
    remove.attr("id",sv.deleteId);
    });*/
    remove.addClass("table-danger table-hover btn-danger removeData");
    

    // Handle the errors
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });


  $("#removeData").on("click", function(){

  //  var deleteId = $(".removeData").attr("id");
   console.log("Calling REmove Method");
  /* var adaRef = firebase.database().ref('schedule/id/'+deleteId);
        adaRef.remove()
        .then(function() {
          console.log("Remove succeeded.")
        })
        .catch(function(error) {
          console.log("Remove failed: " + error.message)
        });*/

  });

  


  


  


  

  

});



//To reduce minutes away till 0
//Until minuterAway>0 count-- every minute = 60000 in setInterval
//everytime count -- is called get into firebase and update it in each ID whose minuter away are >0

/*function reduceTime() {
    
    timeMachine = setInterval(decrease, 1000);
  }

  function decrease(){
    
    if(time>0)
      { 
        time--;
        document.getElementById("minA").innerHTML = "Time Left: " + time;
      }else{

          game.timesUp();

      }
    
      
  }*/