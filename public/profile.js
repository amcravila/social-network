var database = firebase.database();
var USER_ID = window.location.search.match(/\?id=(.*)/)[1];

$(document).ready(function() {

  $('.container').html('');

  database.ref("users/" + USER_ID).once('value')
  .then(function(snapshot) {
    var profileName = snapshot.val().name;
    var profileEmail = snapshot.val().email;
    var profileType = snapshot.val().type;

    $('.container').append(`
    <i class="fas fa-user-circle fa-10x mb-2"></i>
    <h3 class="mb-4 text-dark">${profileName}</h3>
    <h5 class="mb-4">${profileEmail}</h5>
    <h5>Tipo de perfil: ${profileType}</h5>    
  `);
  });

  $('.fa-arrow-left').click(function() {
    window.location = "posts.html?id=" + USER_ID;
  })

});