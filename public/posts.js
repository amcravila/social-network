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
      <p>
        <input type="image" src="../images/edit.jpg" width="18" data-post-id=${key} />
        <input type="image" src="../images/delete.png" width="18" data-post2-id=${key} />
        <span>${text}</span>
      </p>
    `);

    $(`input[data-post-id="${key}"]`).click(function() {
      $(this).nextAll('span:first').attr('contentEditable', 'true').blur(function() {
        var newText = $(this).html();
        database.ref("posts/" + USER_ID + "/" + key).set({
          text: newText
        });
        $(this).attr('contentEditable', 'false');
      })         
    });

    $(`input[data-post2-id="${key}"]`).click(function() {
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
// const ref = firebase.storage().ref();
// const file = document.querySelector('#photo').files[0]
// const name = (+new Date()) + '-' + file.name;
// const metadata = {
//   contentType: file.type
// };
// const task = ref.child(name).put(file, metadata);
// task
//   .then(snapshot => snapshot.ref.getDownloadURL())
//   .then((url) => {
//     console.log(url);
//     document.querySelector('#someImageTagID').src = url;
//   })
//   .catch(console.error);

  $('#btn-search').click(function() {
    var searchValueFromNewsFeed = $('#input-search').val();
    localStorage.setItem('inputValue', searchValueFromNewsFeed);
    window.location = "search.html?id=" + USER_ID;
  });

  $('#profile-view').click(function() {
    window.location = "profile.html?id=" + USER_ID;
  });
  
});
