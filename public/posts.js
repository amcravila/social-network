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
    return database.ref("posts/").push({
      text: text
    });
  }

  function getPostsFromDB() {
    database.ref("posts/").once('value')
      .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          var childKey = childSnapshot.key;
          var childData = childSnapshot.val();
          createListItem(childData.text, childKey)
        });
      });
  }

  function createListItem(text, key) {
    // $("#msg").append(`
    //   <p>
    //     <input type="text" data-post-id=${key} />
    //     <span>${text}</span>
    //   </p>`);

    $(`input[data-post-id="${key}"]`).click(function() {
      database.ref("posts/" + "/" + key).remove();
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
    $("<p />", { text: value }).appendTo("#msg");
    text.value = '';
    $('#publish').css('backgroundColor', '#a9a9a9');
  });

  $('#textPub').keyup(function stylesCounterBtn() {
    if ($('#textPub').val.length > 0) {
      $('#publish').removeAttr('disabled');
      $('#publish').css('backgroundColor', '#1da1f2');
    }
    text.style.height = '';
    text.style.height = text.scrollHeight + 'px';
  });

  function autoResize() {
    while (text.scrollHeight > text.offsetHeight) {
      text.rows += 1;
    }
  }

  function addZero(i){
    if (i < 10) {
      i = '0' + i;
    }
    return i;
  }

  $('#publish').click(function currentTime() {
    var date = new Date();
    var hour = document.createElement('span');
    var gHour = addZero(date.getHours());
    var gMinutes = addZero(date.getMinutes());
    hour.textContent = 'Hora: ' + gHour + ':' + gMinutes;
    msg.appendChild(hour);
  });

});
