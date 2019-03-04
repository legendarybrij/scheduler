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
  var name = "";

$("#submit-info").on("click", function(event){

  event.preventDefault();
  name = $("#train-name").val().trim();
  console.log(name);

  database.ref().push({
    name: name  
  });

});


/*database.ref().on("child_added", function(snapshot) {
    // storing the snapshot.val() in a variable for convenience
    var sv = snapshot.val();

   
    console.log(sv.name);
   

    // Handle the errors
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });*/






