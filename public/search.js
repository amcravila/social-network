var database = firebase.database();
var USER_ID = localStorage.getItem('userID');

var FOLLOWED_FRIENDS = [];
database.ref("friendship/" + USER_ID).once('value')
.then(function(snapshot) {
  snapshot.forEach(function(childSnapshot) {
    FOLLOWED_FRIENDS.push(childSnapshot.val().friend);
  });
});

$(document).ready(function() {

  var searchValueFromNewsFeed = localStorage.getItem('inputValue');
  $('#input-search').val(searchValueFromNewsFeed);
  toSearch();

  $('#btn-search').click(toSearch);

  $('.fa-arrow-left').click(function() {
    window.location = "posts.html?id=" + USER_ID;
  })

});

function toSearch() {
  $('main').html('');
  var searchValue = $('#input-search').val();
  database.ref("users").once('value')
  .then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      getSearchList(childSnapshot, searchValue);
    });
  });
}

function getSearchList(childSnapshot, searchValue) {
  var userIdFromDB = childSnapshot.key;
  var nameFromDB = childSnapshot.val().name;
  var typeFromDB = childSnapshot.val().type;

  if(FOLLOWED_FRIENDS.indexOf(userIdFromDB) >= 0) {
    var followStatus = '<p class="following">Seguindo</p>';
  } else {
    var followStatus = "<button id='btn-follow-" + userIdFromDB + "' type='button' class='btn btn-outline-light'>+ Seguir</button>";
  }

  if (nameFromDB.split(' ')[0].toUpperCase() === searchValue.toUpperCase()) {
  $('main').append(`
  <section class="item-search mb-5 d-flex justify-content-around align-items-center">
    <i class="fas fa-user-circle fa-3x"></i>
    <div>
      <h6>${nameFromDB}</h6>
      <p>Tipo de perfil: ${typeFromDB}</p>
    </div>
    ${followStatus}
  </section>
  `);
  var idOfBtnFollow = "#btn-follow-" + userIdFromDB;
  $(idOfBtnFollow).click(function() {
    insertFriendOnDB(USER_ID, userIdFromDB);
    $(this).fadeOut();
    var following = $('<p></p>').html('Seguindo').addClass('following');
    $(this).parent().append(following);
  });
  }
}

function insertFriendOnDB(USER_ID, userIdFromDB) {
  database.ref('friendship/' + USER_ID).push({
    friend: userIdFromDB
  });
}