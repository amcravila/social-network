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
      </p>`);

    $(`input[data-post-id="${key}"]`).click(function() {
      edit_post(database.ref("posts/" + USER_ID + "/" + key));
    });

    function edit_post(ref){
      var data = {text: text}
      console.log(data);
      var updates = {};
      updates['/posts/' + USER_ID + "/" + key] = data;
      var newRef = database.ref().child('posts/' + USER_ID + "/" + key)
      ref.update(updates).then(function(){
        ref.on('value', function(snapshot) {
          var postEdited = prompt("Editar Post");
          data.text = postEdited;
        });
      }).catch(function(error) {alert("Dados não editados: " + error);});
    };






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
  })


});
