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

var certi_button = document.getElementById("certificate").addEventListener("click", click(user.name.split(' ')[0]))

function click(user_name) {
  var theForm, newInput1;
  theForm = document.createElement('form');
  theForm.action = '/certi';
  theForm.method = 'POST';
  newInput1 = document.createElement('input');
  newInput1.type = 'hidden';
  newInput1.name = 'name';
  newInput1.value = user_name;
  theForm.appendChild(newInput1);
  document.getElementById('certificate').appendChild(theForm);
  theForm.submit()
}
