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

  //console.log(database);
  var nameT = "";
  var count = 0;
  var data=[];
  
  

$(document).ready(function(){ 

  database.ref("/schedule").on("child_added", function(snapshot) {
    // storing the snapshot.val() in a variable for convenience
    var sv = snapshot.val();
    count=sv.count;
  });
    
  database.ref("/id").on("child_added", function(snapshot) {
    // storing the snapshot.val() in a variable for convenience
    var sv = snapshot.val();
    data=sv.deleteId;
  });

$("#submit-info").on("click", function(event){
  count++;
  event.preventDefault();
  nameT = $("#train-name").val().trim();
  destinationT = $("#destination-name").val().trim();
  firstT = $("#first-time").val();
  frequencyT = $("#frequency-time").val().trim();
    
 var tMinutesTillTrain = minAway(firstT,frequencyT);
 var nextA = nextArrival(tMinutesTillTrain);
    //console.log(tMinutesTillTrain+" "+nextA);

  //console.log(name);

  var dataId = database.ref("/schedule").push({
    name: nameT,
    destination: destinationT,
    firstTime: firstT,
    frequencyTime: frequencyT,
    nextArrival: nextA,
    minAway: tMinutesTillTrain,
    count:count
  });

  data[count] = dataId.toString().substring(48);
 // deleteId = "deleteId"+count;

  database.ref("/id").push({
  deleteId: data
  });

  $("#train-name").val("");
  $("#destination-name").val("");
  $("#first-time").val("");
  $("#frequency-time").val("");

});


database.ref("/schedule").on("child_added", function(snapshot) {
    var sv = snapshot.val();
    
    var newRow = $("<tr>");
    var newCol1 = $("<td>");
    var newCol2 = $("<td>");
    var newCol3 = $("<td>");
    var newCol4 = $("<td>");
    var newCol5 = $("<td>");
    var update = $("<td>");
    var remove = $("<td>");


    //console.log("NAME: " +sv.name + " Destination: " +sv.destination +" First-time: "+ sv.firstTime+ " Frequency: "+sv.frequencyTime);
    
    $(".tableInsert").append(newRow);
    newRow.append(newCol1);
    newCol1.text(sv.name);
    newCol1.attr("id","row1col1");
    newCol1.addClass("table-success table-hover");
    newCol1.attr("contenteditable","true")

    newRow.append(newCol2);
    newCol2.text(sv.destination);
    newCol2.addClass("row"+count);
    newCol2.addClass("table-success table-hover");
    newCol2.attr("contenteditable","true")

    newRow.append(newCol3);
    newCol3.text(sv.frequencyTime);
    newCol3.addClass("row"+count);
    newCol3.attr("contenteditable","true")
    newCol3.addClass("table-success table-hover");

    newRow.append(newCol4);
    newCol4.text(sv.nextArrival);
    newCol4.addClass("row"+count);
    newCol4.addClass("table-success table-hover");

    newRow.append(newCol5);
    newCol5.text(sv.minAway);
    newCol5.addClass("row"+count);
    newCol5.addClass("table-success table-hover");

    newRow.append(update);
    update.text("Update");
    update.addClass("row"+count);
    update.addClass("table-success table-hover btn-success updateEdit");
    update.attr("id","updateEdit"+count);

    newRow.append(remove);
    remove.text("Remove");
    remove.attr("id","removeData"+count);
    database.ref("/id").on("child_added", function(snapshot) {
      var id = snapshot.val();
      //console.log("Count = "+count+" ID= "+id.deleteId[count]);
    $("#removeData"+count).attr("data-id",id.deleteId[count]);
    $("#updateEdit"+count).attr("data-id",id.deleteId[count]);
    });
    remove.addClass("row"+count);
    remove.addClass("table-danger table-hover btn-danger removeData");
    

    // Handle the errors
  }, function(errorObject) {
    //console.log("Errors handled: " + errorObject.code);
  });


  $(document).on("click", ".removeData", function(event){
  //console.log($(".row1col1").val());
  var target = event.currentTarget.id;
  var deleteId = $("#"+target).attr("data-id");
    //console.log(database.ref('schedule/'+deleteId));
  var item = database.ref('schedule/'+deleteId)
  item.remove()
  .then(function(){
    location.reload();
  })
  .catch(function(err){console.log(err)})
  });


  /*$(document).on("click", ".updateEdit", function(event){
    console.log(event);
    var target = event.currentTarget.classList[0];
    console.log("target = "+"#"+target);
    var deleteId = $("#updateEdit1").attr("data-id");
      console.log(deleteId);
    //var item = database.ref('schedule/'+deleteId);
    console.log("ID = "+deleteId+" "+$('#row1col1').html());

    var nameU ="";
    var destinationU="";
    var firstTimeU="";
    
    database.ref("/schedule").on("child_added", function(snapshot) {
      var sv = snapshot.val();
      nameU = sv.name;
      destinationU = sv.destination;
      firstTimeU = sv.firstTime;

    });

      database.ref('schedule/'+deleteId).set({
         
         name: $('#row1col1').html(),
         destination: destinationU,
         firstTime : firstTimeU
        });
   //alert(editable.contents());




  });*/



});



function minAway(firstT,frequencyT) {
// First Time (pushed back 1 year to make sure it comes before current time)
var firstTimeConverted = moment(firstT, "HH:mm").subtract(1, "years");
//console.log(firstTimeConverted);

// Current Time
var currentTime = moment();
////console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

// Difference between the times
var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
//console.log("DIFFERENCE IN TIME: " + diffTime);

// Time apart (remainder)
var tRemainder = diffTime % frequencyT;
//console.log(tRemainder);

// Minute Until Train
var tMinutesTillTrain = frequencyT - tRemainder;
//console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

return tMinutesTillTrain;

}

function nextArrival(tMinutesTillTrain) {
// Next Train
var nextT = moment().add(tMinutesTillTrain, "minutes");
//console.log("ARRIVAL TIME: " + moment(nextT).format("hh:mm"));
var nextA = moment(nextT).format("hh:mm");
return nextA;
}

//To reduce minutes away till 0
//Until minuterAway>0 count-- every minute = 60000 in setInterval
//everytime count -- is called get into firebase and update it in each ID whose minuter away are

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