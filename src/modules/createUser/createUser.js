
document.addEventListener('DOMContentLoaded',init);


import {initializePage,loadTranslations,getCurrentLanguage} from '../../../js/translationManager.js';
import {createUserUrl} from '../../../js/constant.js';
import {showErrorPage,showSuccessMessage,navigatePage,loadErrorPage,loadSuccessPage, hideErrorPage,changeErrorButtonName, hideSuccessPage,goBack} from '../../components/components.js';
async function init(){
    initializePage();
    const savedLanguage = await getCurrentLanguage();
    const translations = await loadTranslations();
    document.getElementById('userName').placeholder=translations["enterUsername"][savedLanguage]
    document.getElementById('email').placeholder=translations["enterEmail"][savedLanguage]
    document.getElementById('password').placeholder=translations["enterPassword"][savedLanguage]
    document.getElementById('conPassword').placeholder=translations["confirmPassword"][savedLanguage]

    


    console.log("init is called");
    layui.use(() =>{
        const form = layui.form;
        var util = layui.util;
        
        form.verify({
            // Username: Only letters, numbers, and underscores, 4-16 characters
            userName: function(value) {
                if (!/^[a-zA-Z0-9_]{4,16}$/.test(value)) {
                    return translations["usernameInvalidMessage"][savedLanguage];
                }
            },
            // Email: Standard email format
            email: function(value) {
                if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
                    return translations["emailInvalidMessage"][savedLanguage];
                }
            },
            password: function(value){
                if (!/^[a-zA-Z0-9_]{4,16}$/.test(value)) {
                    return translations["passwordInvalidMessage"][savedLanguage];
                }
                
            },
            conPassword: function(value){
                var password = document.querySelector("#password").value; 
                if (!/^[a-zA-Z0-9_]{4,16}$/.test(value)) {
                    return translations["passwordInvalidMessage"][savedLanguage];
                }else if(value!==password){
                    return translations["passwordNotMatch"][savedLanguage];

                }

            }

            
        });

        form.on('submit(formSubmit)', function(data){
            let userName = data.field.userName;
            let email = data.field.email;
            let password = data.field.password;
            let conPassword = data.field.conPassword;
            
            console.log(`Username: ${userName},Email: ${email} Password: ${password}, ConfirmPassword: ${conPassword}`);
            sendData();
            

        });
       

        util.on({
            onCreateUser: function(){
                console.log("onCreateUser");

                let password = document.querySelector('#password').value;
                let conPassword = document.querySelector('#conPassword').value;
                console.log(`password: ${password} conPassword: ${conPassword}`)

                
            }
        });


    });


   await loadErrorPage();
   await loadSuccessPage();
         changeErrorButtonName('Close');
}

async function sendData() {
    event.preventDefault(); // Prevent the form from refreshing the page
    layui.use('layer', async function () {

        const layer = layui.layer;
        const loading = layer.load(2); // Show loading spinner


        let username = document.getElementById('userName').value;
        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;
        let conPassword = document.getElementById('conPassword').value;

        
        const payload = {
            username: username,
            password: password,
            email: email,

        };



      //  url = "http://192.168.29.177:8000/registerUser"
        const  url= createUserUrl;





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
            if (response.ok) {
                const data = await response.json();
                if (data.code === "1") {
                    showSuccessMessage(data.message,"1",function(){
                       
                        document.getElementById('successBtn').addEventListener('click',function(){
                            goBack();
    
                        });
                       

                    });

                }
                else {
                    showErrorPage(data.message,"2",function(){
                   
                    document.getElementById('errorBtn').addEventListener('click',function(){
                        hideErrorPage();

                    });

                    });
                }
            } else {
                //  alert("Error: " + response.status);
                showErrorPage("Error: " + response.status,"3",function(){
                    document.getElementById('errorBtn').addEventListener('click',function(){
                        hideErrorPage();

                    });

                });
            }
        } catch (error) {
            //   console.error('Error:', error);
            // alert('Failed to send data');
            console.error('Error:', error);
            showErrorPage(error,"4",function(){
                document.getElementById('errorBtn').addEventListener('click',function(){
                    hideErrorPage();

                });

            });
        }
        finally {
            layer.close(loading);
        }


    });




}





