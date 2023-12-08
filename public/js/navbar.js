if(window.innerWidth>768){
	window.addEventListener('scroll', function () {
	var navLogo = document.querySelector('.nav-logo');
	if (window.scrollY > 500) {
	  navLogo.classList.remove("none") 
	} else {
	  navLogo.classList.add("none")
	}
});
}
else{
	var navLogo = document.querySelector('.nav-logo');
	navLogo.classList.remove("none") 
}

// window.onscroll = function() {scrollFunction()};

// function scrollFunction() {
//   if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
//     document.getElementById("navbar").style.padding = "20px 10px";
//     document.getElementById("nav-logo").style.fontSize = "25px";
//   } else {
//     document.getElementById("navbar").style.padding = "40px 10px";
//     document.getElementById("nav-logo").style.fontSize = "35px";
//   }
// }
(function($) { "use strict";

	document.querySelector(function() {
		var header = document.querySelector(".start-style");
		document.querySelector(window).scroll(function() {    
			var scroll = document.querySelector(window).scrollTop;
		
			if (scroll >= 10) {
				header.classList.remove('start-style').classList.add("scroll-on");
			} else {
				header.classList.remove("scroll-on").classList.add('start-style');
			}
		});
	});		
		
	//Animation
	
	document.querySelector(document).ready(function() {
		document.querySelector('body.hero-anime').classList.remove('hero-anime');
	});

	//Menu On Hover
		
	document.querySelector('body').addEventListener('mouseenter mouseleave','.nav-item',function(e){
			if (document.querySelector(window).width() > 750) {
				var _d=document.querySelector(e.target).closest('.nav-item');_d.classList.add('show');
				setTimeout(function(){
				_d[_d.is(':hover')?'addClass':'removeClass']('show');
				},1);
			}
	});	
  })