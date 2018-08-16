// POSTS NO DATABASE
var database = firebase.database();
var USER_ID = window.location.search.match(/\?id=(.*)/)[1];
localStorage.setItem('userID', USER_ID);

var FOLLOWED_FRIENDS = [];
database.ref("friendship/" + USER_ID).once('value')
.then(function(snapshot) {
  snapshot.forEach(function(childSnapshot) {
    FOLLOWED_FRIENDS.push(childSnapshot.val().friend);
  });
});

$(document).ready(function() {

  database.ref("users/" + USER_ID).once('value')
    .then(function(snapshot) {
      var username = snapshot.val().name;
      $('#user-name').html('@' + username.toLowerCase());
  });

  getAllPostsFromDB();

  $('input[name=filter]').click(getAllPostsFromDB);
  $("#publish").click(addPostsClick);

  function addPostsClick(event) {
    event.preventDefault();

    var newPost = $("#textPub").val();
    var visualization = $("#visualization option:selected").val();
    var postFromDB = addPostToDB(newPost, visualization);

  }

  function addPostToDB(text, visualization) {
    return database.ref("posts/" + USER_ID).push({
      text: text,
      type: visualization
    });
  }

  function getAllPostsFromDB() {
    database.ref("posts").once('value')
    .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        getPostsList(childSnapshot);
      });
    });
  }

  function getPostsList(userIdPostsFromDB) {
    $("#msg").html('');
    var filterSelected = $('input[name=filter]:checked').val();
    var idOwnerPosts = userIdPostsFromDB.key;

    database.ref("posts/" + idOwnerPosts).once('value')
    .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        if(filterSelected === 'all' && childSnapshot.val().type !== 'private' && (idOwnerPosts === USER_ID || FOLLOWED_FRIENDS.indexOf(idOwnerPosts) >= 0)) {
          getOwnersPosts(idOwnerPosts, childSnapshot);
        }
        if (filterSelected === 'friends' && childSnapshot.val().type !== 'private' && FOLLOWED_FRIENDS.indexOf(idOwnerPosts) >= 0) {
          getOwnersPosts(idOwnerPosts, childSnapshot);
        }
        if (filterSelected === 'private' && childSnapshot.val().type === 'private' && idOwnerPosts === USER_ID) {
          getOwnersPosts(idOwnerPosts, childSnapshot);
        }
      });

      function getOwnersPosts(idOwnerPosts, childSnapshot) {
        database.ref("users/" + idOwnerPosts).once('value')
        .then(function(snapshot) {
          var nameOwnerPosts = snapshot.val().name;
          var idOfPost = childSnapshot.key;
          var post = childSnapshot.val().text;
          if (idOwnerPosts === USER_ID) {
            printOwnerPosts(nameOwnerPosts, idOfPost, post);
          } else {
            printAllPosts(nameOwnerPosts, post);
          }
        });
      }

      function printOwnerPosts(nameOwnerPosts, idOfPost, post) {
        $("#msg").append(`
          <div class="border-bottom border-verde media flex-column text-dark mb-4">
            <i id="delete-${idOfPost}" class="far fa-trash-alt align-self-end mb-2"></i>
            <i id="edit-${idOfPost}" class="fas fa-pen align-self-end mb-0"></i>
            <strong class="mb-1">@${nameOwnerPosts.toLowerCase()}</strong>
            <p>${post}</p>
          </div>
        `);
        $(`#edit-${idOfPost}`).click(function() {
          $(this).nextAll('p:first').attr('contentEditable', 'true').focus().blur(function() {
            var newText = $(this).html();
            database.ref("posts/" + USER_ID + "/" + idOfPost + "/text").set(newText);
            $(this).attr('contentEditable', 'false');
          })
        });
        $(`#delete-${idOfPost}`).click(function() {
          database.ref("posts/" + USER_ID + "/" + idOfPost).remove();
          $(this).parent().remove();
        });
        $('#publish').attr('disabled', 'true');
      }

      function printAllPosts(nameOwnerPosts, post) {
        $("#msg").append(`
        <div class="border-bottom border-verde media flex-column text-dark mb-4">
          <strong class="mb-1">@${nameOwnerPosts.toLowerCase()}</strong>
          <p>${post}</p>
        </div>
        `);
      }
    });
  }

  // FUNCIONALIDADES DOS POSTS
  var text = document.getElementById('textPub');
  $('#publish').attr('disabled', 'true');
  $('#publish').css('backgroundColor', '#a9a9a9');

  $('#publish').click(function onClickTweetar(e) {
    event.preventDefault(e);
    var value = $('#textPub').val();
    text.value = '';
    $('#publish').css('backgroundColor', '#a9a9a9');
  });

  $('#textPub').keyup(function stylesCounterBtn() {
    if ($('#textPub').val.length > 0) {
      $('#publish').removeAttr('disabled');
      $('#publish').css('backgroundColor', '#369736');
    }
    text.style.height = '';
    text.style.height = text.scrollHeight + 'px';
  });

  function autoResize() {
    while (text.scrollHeight > text.offsetHeight) {
      text.rows += 1;
    }
  }


// POSTAR FOTOS

//STORAGE
  $('#postPhoto').click(function(e) {
    var fileUpload = document.getElementById('photo').files[0];
    var storageRef = firebase.storage().ref('photos/' + USER_ID + '/' + fileUpload.name);
    storageRef.put(fileUpload);

//TELA
    var preview = document.querySelector('img');
    var file = document.querySelector('input[type=file]').files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
      preview.src = reader.result;
    }
    if (file) {
      reader.readAsDataURL(file);
    } else {
      preview.src = "";
    }

  });


// SEARCH
  $('#btn-search').click(function() {
    var searchValueFromNewsFeed = $('#input-search').val();
    localStorage.setItem('inputValue', searchValueFromNewsFeed);
    window.location = "search.html?id=" + USER_ID;
  });

  $('#profile-view').click(function() {
    window.location = "profile.html?id=" + USER_ID;
  });

});
