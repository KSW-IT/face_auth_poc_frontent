

document.addEventListener('DOMContentLoaded', init);
 

 import {loginUrl} from '../../../js/constant.js';
 async function onLogIn() {
    event.preventDefault(); // Prevent the form from refreshing the page
    console.log("clicked onLogIn")
    layui.use('layer', async function () {

        const layer = layui.layer;
        const loading = layer.load(2); // Show loading spinner

        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;

        const payload = {
            email: email,
            password: password

        };




        // url = "http://192.168.29.177:8000/login"

      // const url = "http://192.168.0.140:8080/login"
      const url = loginUrl;



        try {
            // Send the POST request
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            // Handle the response
            // code =1 ->success;2 -> "wrong password";
            // 3 -> no user found;
            // 4 -> face not register

            if (response.ok) {
                const data = await response.json();
                if (data.code === "1") {
                    localStorage.setItem('email', email);
                   // redirectToWelcomePage(email);
                   navigatePage("welcome","","")

                }
                else if (data.code == "4") { // code = 4 face not registered
                    localStorage.setItem('email', email);
                   // redirectToFaceRegistrationPage()
                   navigatePage("face_registration","","")


                }
                else {
                    if (data.code == "3") {
                        localStorage.setItem('email', email);
                    }
                    showErrorPage(data.message, data.code)
                }
            } else {
                //  alert("Error: " + response.status);
                showErrorPage("Error: " + response.status, "2")
            }
        } catch (error) {
            //   console.error('Error:', error);
            // alert('Failed to send data');
            console.error('Error:', error)
            showErrorPage(error, "2")
        }
        finally {
            layer.close(loading);
        }


    });




}

 function validate() {
    let userName = document.getElementById("userName").value.toString();
    let password = document.getElementById("password").value.toString();
    console.log("Username: " + userName + ", Password: " + password.toString())

    if (userName === "test" && password === "test") {

        return true;
    }
    else {
        return false;
    }



}

 function redirectToFaceRegistrationPage() {
    console.log("Redirecting...");
    window.location.href = "face_registration.html";
}
 function redirectToFaceAuthPage() {
    console.log("Redirecting...");
    window.location.href = "face_auth.html";
}
 /*function navigatePage(path, username) {
    const pathObject = getLastPath(path)
    const pathName = pathObject.path;
    const name = pathObject.name;
    console.log(`path: ${pathName} name: ${name}`);
    
    if (!pageName || !username) {
        console.error("Page name or username is missing.");
        return;
    }
    
    const url = `/${encodeURIComponent(pageName)}.html?string=${encodeURIComponent(username)}`;
    console.log(`Redirecting to: ${url}`);
    
    window.location.href = url;
}*/

function navigatePage(pageName, username, directory = "") {
    if (!pageName) {
        console.error("Page name or username is missing.");
        return;
    }

    // Handle dynamic directory
    let  url ;
    if(username.toString().trim()!==""){

        url = `${directory}${encodeURIComponent(pageName)}.html?string=${encodeURIComponent(username)}`;
        console.log(`Redirecting executed if part `);
    }
    else{
        url = `${directory}${encodeURIComponent(pageName)}.html`;
        console.log(`executed else part`);
    }

    

    window.location.href = url;
}

 function changeButtonText(newText) {
    const button = document.getElementById("backBtn");
    if (button) {
        button.textContent = newText; // Update the button's text
    }
}

 function showErrorPage(errorMessage, code) {
    
    // code 1 =success, 2 = other error, 3 = password expired
    // Hide the main content
    document.getElementById('main-content').style.display = 'none';
    // Show the error page
    const errorPage = document.getElementById('error-page');
    errorPage.style.display = 'block';
    // Set the error message dynamically
    document.getElementById('error-message').textContent = errorMessage;
    if (code === '3') {
        let newText = 'Change Password';
        const button = document.getElementById("backBtn");
        if (button) {
            button.textContent = newText; // Update the button's text
            button.addEventListener("click", redirectToChangePassword);
        }

    }
    else {
        let newText = 'Back';
        const button = document.getElementById("backBtn");
        if (button) {
            button.textContent = newText; // Update the button's text
            button.addEventListener("click", redirectToLoginPage);
        }
    }
}


 function showSuccessMessage(successMessage) {
    document.getElementById('main-content').style.display = 'none';
    // Show the error page
    const errorPage = document.getElementById('error-page');
    errorPage.style.display = 'none';
    // Set the error message dynamically
    const successPage = document.getElementById('success-page');
    successPage.style.display = 'block';
    document.getElementById('success-message').textContent = successMessage;
}

import {printTestMsg,initializePage,updateLanguage} from '../../../js/translationManager.js';
import {loadErrorPage,hideErrorPage} from "../../components/components.js"
 function init(){
    layui.use(['form','util'], function () {
        var form = layui.form;
        var util = layui.util;
        
        

        // Retrieve saved selection from localStorage and set the radio button
        var savedLanguage = localStorage.getItem('selectedLanguage');
        if (savedLanguage) {
            document.querySelector(`input[name="language"][value="${savedLanguage}"]`).checked = true;
            form.render('radio'); // Re-render radio buttons to apply the checked state
        }

        // Listen for language selection changes
        form.on('radio(languageRadio)', function (data) {
            console.log("Selected language:", data.value); // Logs the selected language
            localStorage.setItem('selectedLanguage', data.value); // Save selection to localStorage
            updateLanguage(data.value);
        });
        form.on('submit(loginBtn)',function (data){
            onLogIn()

        });
        
        util.on({
            faceAuth: function(){
            console.log("clicked on faceAuth");
            navigatePage('faceAuth',document.getElementById('email'),"/src/modules/face/");
            },
            faceRegister: function(){
            console.log("clicked on faceRegister");
            navigatePage('faceRegister',"","/src/modules/face/");

            },
            onErrorPageBtn:function(){
                hideErrorPage();
                
            }

        });

    });
    printTestMsg();
    initializePage();
    loadErrorPage();
    onCreateUser();

}

function onCreateUser(){
    document.getElementById('onCreateUser').addEventListener('click',()=>{
        console.log("clicked on faceRegister");
        navigatePage('createUser',"","/src/modules/createUser/");
        

    });
}



 
const pathObject = new Object();
function getLastPath(path) {
    if (!path) {
        console.error("Path is empty or invalid.");
        return null;
    }

    // Split the path by '/' and get the last part
    const parts = path.split('/');
    pathObject.path=getParentPath(path);
    pathObject.name= parts[parts.length - 1];
    return pathObject;
}

function getParentPath(path) {
    if (!path) {
        console.error("Path is empty or invalid.");
        return null;
    }

    // Find the last '/' and extract the substring before it
    const lastSlashIndex = path.lastIndexOf('/');
    return path.substring(0, lastSlashIndex);
}



 
