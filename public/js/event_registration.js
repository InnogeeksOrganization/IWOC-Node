
let form, name,email,phone,libid,git,dialog,loader;

window.onload = ()=>{
    form = document.getElementById('reg');
    name = document.getElementById('name');
    email = document.getElementById('email');
    phone = document.getElementById('phone');
    libid = document.getElementById('libid');
    residence = document.getElementById('Residence')
    dialog = document.getElementById('dialogCard');
    dialogCross = document.getElementById('cross');
    loader = document.getElementById('wheel-and-hamster');
}
function submitForm() {
    document.regi-form.submit();
    document.regi-form.reset();
    }

async function validateForm(e){
    e.preventDefault();

    const name_val = name.value.trim();
    const email_val = email.value.trim();
    const phone_val = phone.value.trim();
    const libid_val = libid.value.trim();
    const residence_val = residence.value.trim();


    var valid = true;

    let inputControl = name.parentElement;
    let errorDisplay = inputControl.querySelector('.error');

    var regExp = /[0-9]/;

    if(valid && (name_val == '' || name_val==null || regExp.test(name_val))){
        valid=false;
        errorDisplay.innerText = 'Enter a valid name.';
        inputControl.classList.add('error');
        inputControl.classList.remove('success');
    }
    else if(valid){
        errorDisplay.innerText = '';
    }


    inputControl = email.parentElement;
    errorDisplay = inputControl.querySelector('.error');

    var chkExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if(valid && (email_val == '' || email_val==null || !chkExp.test(email_val))){
        valid=false;
        errorDisplay.innerText = 'Enter a valid email.';
        inputControl.classList.add('error');
        inputControl.classList.remove('success');
    }
    else if(valid){
        errorDisplay.innerText = '';
    }


    inputControl = libid.parentElement;
    errorDisplay = inputControl.querySelector('.error');

    if(valid && (libid_val == '' || libid_val==null)){
        valid=false;
        errorDisplay.innerText = 'Enter a valid library id.';
        inputControl.classList.add('error');
        inputControl.classList.remove('success');
    }
    else if(valid){
        errorDisplay.innerText = '';
    }



    inputControl = phone.parentElement;
    errorDisplay = inputControl.querySelector('.error');

    if(valid && (residence_val == '' || residence_val==null)){
        valid=false;
        errorDisplay.innerText = 'Enter a valid Residence';
        inputControl.classList.add('error');
        inputControl.classList.remove('success');
    }
    else if(valid){
        errorDisplay.innerText = '';
    }



    inputControl = phone.parentElement;
    errorDisplay = inputControl.querySelector('.error');

    regExp = /[a-zA-Z]/g;

    if(valid && (phone_val == '' || phone_val==null || regExp.test(phone_val) || phone_val.length != 10)){
        valid=false;
        errorDisplay.innerText = 'Enter a valid phone number.';
        inputControl.classList.add('error');
        inputControl.classList.remove('success');
    }
    else if(valid){
        errorDisplay.innerText = '';
    }
    if(valid){
        loader.classList.add('load');
        const data = {
            name: name_val,
            email: email_val,
            libid: libid_val,
            phone: phone_val,
            residence: residence_val,
        }
        await fetch("/eventRegister", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          }).then((response) => response.json()).then((data)=>{
            const content = document.getElementById('dContent');
            const title = content.children[0].children[0];
            const msg = content.children[1];

            title.innerHTML = data.title;
            msg.innerHTML = data.message;

            dialog.classList.remove('disabled');
            dialog.classList.add('enabled');

            loader.classList.remove('load');

            if(data.status === 200){
                redirected()
            }
            name.value=''
            email.value=''
            libid.value=''
            phone.value=''
            residence.value=''
          });
    }
    return false;
}
function hide(){
    dialog.classList.remove('enabled');
    dialog.classList.add('disabled');
}
function redirected() {
    setTimeout(function(){
        document.getElementById("hiddenInpurButton").click()
    }, 3000)
}