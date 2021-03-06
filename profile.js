var database = firebase.database();
var USER_ID = localStorage.getItem('userID');

$(document).ready(function() {

  $('.container').html('');

  database.ref("users/" + USER_ID).once('value')
  .then(function(snapshot) {
    var profileName = snapshot.val().name;
    var profileEmail = snapshot.val().email;
    var profileType = snapshot.val().type;

    $('.container').append(`
    <i class="fas fa-user-circle fa-10x mb-2"></i>
    <h3 class="mb-4 text-gray">${profileName}</h3>
    <p class="mb-4">${profileEmail}</p>
    <p>Tipo de perfil: ${profileType}</p>
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
          createListItem(childData.text, childData.img, childKey);
        });
      });
  }

  function createListItem(text, img, key) {
    if (text === undefined) {
      text = '';
    }
    if (img === undefined) {
      img = '';
    }
    $("#msg").append(`
      <div class="border-bottom border-verde media flex-column text-dark mb-4">
        <i id="delete-${key}" class="far fa-trash-alt align-self-end mb-2"></i>
        <i id="edit-${key}" class="fas fa-pen align-self-end mb-0"></i>
        <p>${text}</p>
        <img class="w-100 mb-2" src="${img}">
      </div>
    `);
    $(`#edit-${key}`).click(function() {
      $(this).nextAll('p:first').attr('contentEditable', 'true').focus().blur(function() {
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
