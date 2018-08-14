// POSTS NO DATABASE
var database = firebase.database();
var USER_ID = window.location.search.match(/\?id=(.*)/)[1];

$(document).ready(function() {
  getPostsFromDB();
  $("#publish").click(addPostsClick);

  function addPostsClick(event) {
    event.preventDefault();

    var newPost = $("#textPub").val();
    var postFromDB = addPostToDB(newPost);

    createListItem(newPost, postFromDB.key)
  }

  function addPostToDB(text) {
    return database.ref("posts/" + USER_ID).push({
      text: text
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
      </p>`);

    // $(`input[data-post-id="${key}"]`).click(function() {
    //   database.ref("posts/" + USER_ID + "/" + key).edit_post();
    // });
    //
    // function edit_post(){
    //   var updates = {};
    //   updates['/users/' + user_id] = data;
    //   var ref = database.ref().child('users/' + user_id)
    //   ref.update(updates).then(function(){
    //      ref.on('value', function(snapshot) {
    //        alert("post updated");
    //     });
    //    }).catch(function(error) {alert("Dados não editados " + error);});
    //    };

    $(`input[data-post2-id="${key}"]`).click(function() {
      database.ref("posts/" + USER_ID + "/" + key).remove();
      $(this).parent().remove();
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

  $('#btn-search').click(function() {
    var searchValueFromNewsFeed = $('#input-search').val();
    localStorage.setItem('inputValue', searchValueFromNewsFeed);
    window.location = "search.html?id=" + USER_ID;
  })

});
