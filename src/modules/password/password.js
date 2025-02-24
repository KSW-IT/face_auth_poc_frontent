import {initializePage,loadTranslations,getCurrentLanguage} from '../../../js/translationManager.js';
import {changePasswordUrl} from '../../../js/constant.js';
document.addEventListener('DOMContentLoaded', init);

async function init(){
    initializePage();
    const savedLanguage = await getCurrentLanguage();
    const translations = await loadTranslations();
    document.getElementById('enterCurrentPassword').placeholder=translations["enterCurrentPassword"][savedLanguage]
    document.getElementById('enterNewPassword').placeholder=translations["enterNewPassword"][savedLanguage]
    document.getElementById('confirmPassword').placeholder=translations["confirmPassword"][savedLanguage]

    layui.use(function(){
        
    });
    
    
}
async function onChangePassword() {
    const email = localStorage.getItem('email');
    console.debug("Email: "+email);

    event.preventDefault(); // Prevent the form from refreshing the page
    layui.use('layer', async function () {

        const layer = layui.layer;
        const loading = layer.load(2); // Show loading spinner




        let password = document.getElementById('newPassword').value;
        let conPassword = document.getElementById('conPassword').value;
        let curPassword = document.getElementById('curPassword').value;
        

        const payload = {
            email: email,
            currentPassword:curPassword,
            newPassword: password

        };



        url = "http://192.168.0.140:8080/changePassword"
      //  url= "http://192.168.0.140:8080/login"



        try {
            // Send the POST request
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            // Handle the response
            if (response.ok) {
                const data = await response.json();
                if (data.code === "1") {
                    showSuccessMessage(data.message)

                }
                else {
                    showErrorPage(data.message)
                }
            } else {
                //  alert("Error: " + response.status);
                showErrorPage("Error: " + response.status)
            }
        } catch (error) {
            //   console.error('Error:', error);
            // alert('Failed to send data');
            console.error('Error:', error)
            showErrorPage(error)
        }
        finally {
            layer.close(loading);
        }


    });




}












