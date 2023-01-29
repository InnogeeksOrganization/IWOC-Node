const dark = document.querySelector(".dark");
const light = document.querySelector(".light");
const logo = document.getElementById("mainLogo");

dark.addEventListener("click", function () {
  document.querySelector("body").classList.add("darkMode");
  light.classList.remove("active");
  dark.classList.add("active");
  logo.setAttribute('src','../public/img/iwoc_logo_light.png');
});

light.addEventListener("click", function () {
  document.querySelector("body").classList.remove("darkMode");
  dark.classList.remove("active");
  light.classList.add("active");
  logo.setAttribute('src','../public/img/iwoc_logo_dark.png');
});
