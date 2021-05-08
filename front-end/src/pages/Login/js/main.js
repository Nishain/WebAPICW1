import * as $ from 'jquery'
export function fullHeight () {
	$('.js-fullheight').css('height', $(window).height());
	$(window).resize(function(){
		$('.js-fullheight').css('height', $(window).height());
	});
};
export function setPasswordToggler (){
	$(".toggle-password").on('click',function() {
		$(this).toggleClass("fa-eye fa-eye-slash");
		var input = $($(this).attr("toggle"));
		if (input.attr("type") == "password") {
		  input.attr("type", "text");
		} else {
		  input.attr("type", "password");
		}
	  });
}
