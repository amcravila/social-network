$(document).ready(function() {
  $('#btn-follow').click(followUser);
});

function followUser() {
  $(this).fadeOut();
  var following = $('<p></p>').html('Seguindo').addClass('following');
  $(this).parent().append(following);
}