// POSTS NO DATABASE
var database = firebase.database();
var USER_ID = window.location.search.match(/\?id=(.*)/)[1];

$(document).ready(function() {
  getPostsFromDB();
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

  function getPostsFromDB() {
    database.ref("posts/" + USER_ID).once('value')
      .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          var childKey = childSnapshot.key;
          var childData = childSnapshot.val();
          createListItem(childData.text, childKey)
        });
      });
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
      $(this).nextAll('span:first').attr('contentEditable', 'true').blur(function() {
        var newText = $(this).html();
        database.ref("posts/" + USER_ID + "/" + key).set({
          text: newText
        });
        $(this).attr('contentEditable', 'false');
      })
    });

    $(`#delete-${key}`).click(function() {
      database.ref("posts/" + USER_ID + "/" + key).remove();
      $(this).parent().remove();
    });
      $('#publish').attr('disabled', 'true');
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
