// POSTS NO DATABASE
var database = firebase.database();
var USER_ID = window.location.search.match(/\?id=(.*)/)[1];
localStorage.setItem('userID', USER_ID);

var FOLLOWED_FRIENDS = [];
database.ref('friendship/' + USER_ID).once('value')
.then(function(snapshot) {
  snapshot.forEach(function(childSnapshot) {
    FOLLOWED_FRIENDS.push(childSnapshot.val().friend);
  });
});

$(document).ready(function() {

  database.ref('users/' + USER_ID).once('value')
    .then(function(snapshot) {
      var username = snapshot.val().name;
      $('#user-name').html('@' + username.toLowerCase());
  });

  getAllPostsFromDB();

  $('input[name=filter]').click(getAllPostsFromDB);
  $('#publish').click(addPostsClick);

  function addPostsClick(event) {
    event.preventDefault();

    var newPost = $('#textPub').val();
    var visualization = $('#visualization option:selected').val();
    var postFromDB = addPostToDB(newPost, visualization);
  }

  function addPostToDB(text, visualization) {
    return database.ref('posts/' + USER_ID).push({
      text: text,
      type: visualization,
      likes: 0
    });
  }

  function getAllPostsFromDB() {
    database.ref('posts').once('value')
    .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        getPostsList(childSnapshot);
      });
    });
  }

  function getPostsList(userIdPostsFromDB) {
    $('#msg').html('');
    var filterSelected = $('input[name=filter]:checked').val();
    var idOwnerPosts = userIdPostsFromDB.key;

    database.ref('posts/' + idOwnerPosts).once('value')
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
        database.ref('users/' + idOwnerPosts).once('value')
        .then(function(snapshot) {
          var nameOwnerPosts = snapshot.val().name;
          var idOfPost = childSnapshot.key;
          var post = getTextPosts(childSnapshot);
          var postImg = getImgPosts(childSnapshot);
          var likesOfPost = childSnapshot.val().likes;
          if (idOwnerPosts === USER_ID) {
            printOwnerPosts(idOfPost, post, postImg, likesOfPost);
          } else {
            printAllPosts(nameOwnerPosts, idOwnerPosts, idOfPost, post, postImg, likesOfPost);
          }
        });
      }

      function getTextPosts(childSnapshot) {
        if (childSnapshot.val().text === undefined) {
          var post = '';
        } else {
          var post = childSnapshot.val().text;
        }
        return post;
      }

      function getImgPosts(childSnapshot) {
        if (childSnapshot.val().img === undefined) {
          var postImg = '';
        } else {
          var postImg = childSnapshot.val().img;
        }
        return postImg;
      }

      function printOwnerPosts(idOfPost, post, postImg, likesOfPost) {
        $('#msg').append(`
          <div class="border-bottom border-verde media flex-column text-dark mb-4 pb-2">
            <i id="delete-${idOfPost}" class="far fa-trash-alt align-self-end mb-2"></i>
            <i id="edit-${idOfPost}" class="fas fa-pen align-self-end mb-0"></i>
            <strong class="mb-1">meu post</strong>
            <p>${post}</p>
            <img class="w-100 mb-2" src="${postImg}">
            <i id="like-${idOfPost}" class="fas fa-hand-holding-heart" style="color: gray"> ${likesOfPost}</i>
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

      function printAllPosts(nameOwnerPosts, idOwnerPosts, idOfPost, post, postImg, likesOfPost) {
        $('#msg').append(`
        <div class="border-bottom border-verde media flex-column text-dark mb-4 pb-2">
          <strong class="mb-1">@${nameOwnerPosts.toLowerCase()}</strong>
          <p>${post}</p>
          <img class="w-100 mb-2" src="${postImg}">
          <i id="like-${idOfPost}" class="fas fa-hand-holding-heart"> ${likesOfPost}</i>
        </div>
        `);
        $(`#like-${idOfPost}`).click(function() {
          database.ref("posts/" + idOwnerPosts + "/" + idOfPost).once('value')
          .then(function(snapshot) {
            var addLike = snapshot.val().likes + 1;
            database.ref('posts/' + idOwnerPosts + "/" + idOfPost + "/likes").set(addLike);
          });
          $(this).html(likesOfPost + 1);
          $(this).attr('style', 'color: #369736');
        });
      }
    });
  }

  // FUNCIONALIDADES DOS POSTS
  var text = document.getElementById('textPub');
  $('#publish').attr('disabled', 'true');
  $('#publish').css('backgroundColor', '#a9a9a9');

  $('#publish').click(function onClickPost(event) {
    event.preventDefault(event);
    var value = $('#textPub').val();
    text.value = '';
    $('#publish').css('backgroundColor', '#a9a9a9');
    location.reload();
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
    var fileUpload = document.getElementsByClassName('photo')[0].files[0];
    var storageRef = firebase.storage().ref('/photos/' + USER_ID + '/' + fileUpload.name);
    storageRef.put(fileUpload);

  // DATABASE
  storageRef.getDownloadURL()
  .then(function(url) {
    var img = document.querySelector('#photo-storage');
    img.src = url;
    location.reload();

    var newURL = url;
    var visualization = $('#visualization option:selected').val();
    var photoFromDB = addPhotoToDB(newURL, visualization);

    function addPhotoToDB(url, visualization) {
    return database.ref('/posts/' + USER_ID).push({
      img: url,
      type: visualization,
      likes: 0
    }).catch(function(error) {
    });
    }

    });

});


// SEARCH
  $('#btn-search').click(function() {
    var searchValueFromNewsFeed = $('#input-search').val();
    localStorage.setItem('inputValue', searchValueFromNewsFeed);
    window.location = 'search.html?id=' + USER_ID;
  });

  $('#profile-view').click(function() {
    window.location = 'profile.html?id=' + USER_ID;
  });

});
