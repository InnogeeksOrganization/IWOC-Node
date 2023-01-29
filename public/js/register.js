
let form, name,email,phone,libid,git,dialog,loader;

window.onload = ()=>{
    // console.log("Loaded");
    form = document.getElementById('reg');
    name = document.getElementById('name');
    email = document.getElementById('email');
    phone = document.getElementById('phone');
    libid = document.getElementById('libid');
    git = document.getElementById('git');
    dialog = document.getElementById('dialogCard');
    dialogCross = document.getElementById('cross');
    loader = document.getElementById('wheel-and-hamster');
    // console.log(loader);
}
function submitForm() {
    document.regi-form.submit();
    document.regi-form.reset();
    }



// form.addEventListener('submit', (e) => {
//     e.preventDefault();
//     console.log("Submit Clicked");
// })

async function validateForm(e){
    e.preventDefault();

    const name_val = name.value.trim();
    const email_val = email.value.trim();
    const phone_val = phone.value.trim();
    const libid_val = libid.value.trim();
    const git_val = git.value.trim();


    var valid = true;

    let inputControl = name.parentElement;
    let errorDisplay = inputControl.querySelector('.error');

    var regExp = /[0-9]/;

    if(valid && (name_val == '' || name_val==null || regExp.test(name_val))){
        // console.log("Name");
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
        // console.log("Email");
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
        // console.log("Libid");
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

    regExp = /[a-zA-Z]/g;

    if(valid && (phone_val == '' || phone_val==null || regExp.test(phone_val) || phone_val.length != 10)){
        // console.log("Phone");
        valid=false;
        errorDisplay.innerText = 'Enter a valid phone number.';
        inputControl.classList.add('error');
        inputControl.classList.remove('success');
    }
    else if(valid){
        errorDisplay.innerText = '';
    }



    inputControl = git.parentElement;
    errorDisplay = inputControl.querySelector('.error');

    if(valid && (git_val == '' || git_val==null)){
        // console.log("Git");
        valid=false;
        errorDisplay.innerText = 'Enter a valid git username.';
        inputControl.classList.add('error');
        inputControl.classList.remove('success');
    }
    else if(valid){
        errorDisplay.innerText = '';
    }


    if(valid){

        // console.log(loader.classList);
        loader.classList.add('load');
        // console.log(loader.classList);


        const data = {
            name: name_val,
            email: email_val,
            libid: libid_val,
            phone: phone_val,
            git: git_val
        }
        // console.log(data);

        // const waitFor = delay => new Promise(resolve => setTimeout(resolve, delay));
        // await waitFor(30000);

        await fetch("/register", {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(data) // body data type must match "Content-Type" header
          }).then((response) => response.json()).then((data)=>{
            // console.log(data);

            // const id = data.id;
            const content = document.getElementById('dContent');
            const title = content.children[0].children[0];
            const msg = content.children[1];

            title.innerHTML = data.title;
            msg.innerHTML = data.message;

            dialog.classList.remove('disabled');
            dialog.classList.add('enabled');

            loader.classList.remove('load');

            // console.log("status = ", data.status);

            if(data.status === 200){
                redirected()
            }

            name.value=''
            email.value=''
            libid.value=''
            phone.value=''
            git.value=''
            
          });

          

    }

    // console.log("Submit Clicked");
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