$(document).ready(function() {

  // PUBLICACAO
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
