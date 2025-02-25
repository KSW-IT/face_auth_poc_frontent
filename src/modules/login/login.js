

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
            // 3 -> no user found,password expired;
            // 4 -> face not register
            // 5 -> password expired
           

            if (response.ok) {
               
                const data = await response.json();
                if (data.code === "1") {
                    localStorage.setItem('email', email);
                   // redirectToWelcomePage(email);
                  
                   navigatePage("welcome","","/");

                }
                else if(data.code == "2"){

                }
                else if(data.code =="3"){

                    showErrorPage(data.message,"2",function(){
                   
                        document.getElementById('errorBtn').addEventListener('click',function(){
                            hideErrorPage();
    
                        });
    
                        });

                }
                else if (data.code == "4") { // code = 4 face not registered
                    localStorage.setItem('email', email);
                   // redirectToFaceRegistrationPage()
                   navigatePage("faceRegister","","/src/modules/face/")
                  
                   


                } 
                else if(data.code == "5"){
                   
                    localStorage.setItem('email', email);
                    changeErrorButtonName("Go to change Password")
                    showErrorPage(data.message, data.code,function(){
                        document.getElementById('errorBtn').addEventListener('click',function(){

                            navigatePage("changePassword","","/src/modules/password/")
    
                        });

                    });

                }
                else {
                    if (data.code == "4") {
                        localStorage.setItem('email', email);
                    }
                    showErrorPage(data.message, data.code,function(){
                        document.getElementById('errorBtn').addEventListener('click',function(){
                           hideErrorPage();
    
                        });

                    });
                }
            } else {
                //  alert("Error: " + response.status);
               // showErrorPage("Error: " + response.status, "2")

                showErrorPage(data.message, data.code,function(){
                    document.getElementById('errorBtn').addEventListener('click',function(){
                       hideErrorPage()

                    });

                });
            }
        } catch (error) {
            //   console.error('Error:', error);
            // alert('Failed to send data');
            console.error('Error:', error)
           // showErrorPage(error, "2")
           showErrorPage(error, "2",function(){
            document.getElementById('errorBtn').addEventListener('click',function(){
              hideErrorPage()

            });

        });
        }
        finally {
            layer.close(loading);
        }


    });




}

import {printTestMsg,initializePage,updateLanguage,getCurrentLanguage,loadTranslations} from '../../../js/translationManager.js';
import {loadErrorPage,showErrorPage,showSuccessMessage,navigatePage,loadSuccessPage, hideErrorPage,changeErrorButtonName, hideSuccessPage,goBack} from "../../components/components.js"
 async function init(){

    
    const translations = await loadTranslations();
   
    printTestMsg();
    initializePage();
    loadErrorPage();
    loadSuccessPage();
    onCreateUser();

    layui.use(['form','util'], async function () {
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

        form.verify({
            email: function(value) {
                if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
                    return translations["emailInvalidMessage"][savedLanguage];
                }
            },
            password: function(value){
                if (!/^[a-zA-Z0-9_]{4,16}$/.test(value)) {
                    return translations["passwordInvalidMessage"][savedLanguage];
                }
            }
            
        });
        

    });

}

function onCreateUser(){
    document.getElementById('onCreateUser').addEventListener('click',()=>{
        console.log("clicked on onCreateUser");
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



 
