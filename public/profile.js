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

  getPostsFromDB();

  $('.fa-arrow-left').click(function() {
    window.location = "posts.html?id=" + USER_ID;
  });

});

function getPostsFromDB() {
    database.ref("posts/" + USER_ID).once('value')
      .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          var childKey = childSnapshot.key;
          var childData = childSnapshot.val();
          createListItem(childData.text, childKey);
        });
      });
      // createListImages();
  }

  function createListItem(text, key) {
    $("#msg").append(`
      <p class="h-25">
        <img src="../images/edit.jpg" width="18" id="edit-${key}" class="mr-2">
        <img src="../images/delete.png" width="18" id="delete-${key}">
        <br>
        <span class="mt-2">${text}</span>
      </p>
    `);

    $(`#edit-${key}`).click(function() {
      $(this).nextAll('span:first').attr('contentEditable', 'true').focus().blur(function() {
        var newText = $(this).html();
        database.ref("posts/" + USER_ID + "/" + key + "/text").set(newText);
        $(this).attr('contentEditable', 'false');
      })
    });

    $(`#delete-${key}`).click(function() {
      database.ref("posts/" + USER_ID + "/" + key).remove();
      $(this).parent().remove();
    });
      $('#publish').attr('disabled', 'true');
  }

  function createListImages() {
    firebase.storage().ref('photos/' + USER_ID + '/' + file.name).getDownloadURL().then(function(url) {
      var img = document.querySelector('#photo-storage');
      img.src = url;
    }).catch(function(error) {
    });
  }
