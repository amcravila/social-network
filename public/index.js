var database = firebase.database();

$(document).ready(function() {
  $(".sign-up-button").click(signUpClick);
  $(".sign-in-button").click(signInClick);
});

function signUpClick(event) {
  event.preventDefault();

  var email = $(".sign-up-email").val();
  var password = $(".sign-up-password").val();

  createUser(email, password);
}

function createUser(email, password) {
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function(response) {
      var userId = response.user.uid;
      writeUserData(userId, email);
      redirectToPosts(userId);
    })
    .catch(function(error) {
      handleError(error);
    });
}

function signInClick(event) {
  event.preventDefault();

  var email = $(".sign-in-email").val();
  var password = $(".sign-in-password").val();

  signInUser(email, password);
}

function signInUser(email, password) {
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function(response) {
      var userId = response.user.uid;
      redirectToPosts(userId);
    })
    .catch(function(error) {
      handleError(error)
    });
}

function handleError(error) {
  var errorMessage = error.message;
  alert(errorMessage);
}

function redirectToPosts(userId) {
  window.location = "posts.html?id=" + userId;
}

// Cadastra o usuário no DB
function writeUserData(userId, email) {
  firebase.database().ref('users/' + userId).set({
    email:email
  });
}
