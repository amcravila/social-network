// POSTS NO DATABASE
var database = firebase.database();
var USER_ID = window.location.search.match(/\?id=(.*)/)[1];

var FOLLOWED_FRIENDS = [];
database.ref("friendship/" + USER_ID).once('value')
.then(function(snapshot) {
  snapshot.forEach(function(childSnapshot) {
    FOLLOWED_FRIENDS.push(childSnapshot.val().friend);
  });
});

$(document).ready(function() {
  getAllPostsFromDB();
  $('input[name=filter]').click(getAllPostsFromDB);  
  $("#publish").click(addPostsClick);

  function addPostsClick(event) {
    event.preventDefault();

    var newPost = $("#textPub").val();
    var visualization = $("#visualization option:selected").val();
    var postFromDB = addPostToDB(newPost);

    createListItem(newPost, postFromDB.key)
  }

  function addPostToDB(text, visualization) {
    return database.ref("posts/" + USER_ID).push({
      text: text
      // visualization: visualization
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
        if (filterSelected === 'friends' && childSnapshot.val().type === 'friends' && FOLLOWED_FRIENDS.indexOf(idOwnerPosts) >= 0) {
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
          var post = childSnapshot.val().text;
          printAllPosts(nameOwnerPosts, post);
        });
      }

      function printAllPosts(nameOwnerPosts, post) {
        $("#msg").append(`
          <p class="">
            <h6>${nameOwnerPosts}</h6>
            <br>
            <span class="mt-2">${post}</span>
          </p>
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
// var uploader = document.getElementById('photo');
//   var fileButton = document.getElementById('postPhoto');
//   fileButton.addEventListener('change', function(e){
//   var file = e.target.files[0];
//   var storageRef = firebase.storage().ref('photos/'+file.name);
//   var task = storageRef.put(file);
//   task.on('state_changed', function progress(snapshot) {
//     var percentage = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
//     uploader.value = percentage;
//
//   }, function error(err) {
//     alert('erro upload');
//
//   },function complete() {
//     alert('upload complete');
//   });
// });



$('#postPhoto').click(function() {
var fileUpload = document.getElementById("photo").files[0];
var fileButton = document.getElementById('postPhoto');
var storageRef = firebase.storage().ref('photos/' + fileUpload.name);
var uploadTask = storageRef.put(fileUpload);
var imagesRef = storageRef.child('avatar_company.png');
var mountainImagesRef = storageRef.child('photos/avatar_company.png');
fileButton.addEventListener('change', function(evt) {
    var firstFile = evt.target.files[0];
    var uploadTask = storageRef.put(firstFile);
    uploadTask.on('state_changed', function progress(snapshot) {
      var percentage = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
      uploader.value = percentage;
      console.log(snapshot.totalBytesTransferred);
  });
});
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
