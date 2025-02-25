import {initializePage,loadTranslations,getCurrentLanguage} from '../../../js/translationManager.js';
import {changePasswordUrl} from '../../../js/constant.js';
import {showErrorPage,showSuccessMessage,navigatePage,loadErrorPage,loadSuccessPage, hideErrorPage,changeErrorButtonName, hideSuccessPage,goBack} from '../../components/components.js';
document.addEventListener('DOMContentLoaded', init);

async function init(){
    await loadErrorPage();
    await loadSuccessPage();

    initializePage();
    
    const savedLanguage = await getCurrentLanguage();
    const translations = await loadTranslations();
    document.getElementById('curPassword').placeholder=translations["enterCurrentPassword"][savedLanguage]
    document.getElementById('newPassword').placeholder=translations["enterNewPassword"][savedLanguage]
    document.getElementById('confirmPassword').placeholder=translations["confirmPassword"][savedLanguage]

    layui.use(function(){
        
        const form = layui.form;
        form.on('submit(formSubmit)',function(data){
            console.log("change password is called.");
            onChangePassword();
        })

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
        //let conPassword = document.getElementById('conPassword').value;
        let curPassword = document.getElementById('curPassword').value;
        

        const payload = {
            email: email,
            currentPassword:curPassword,
            newPassword: password

        };

        console.log(`${email},${curPassword},${password}` );



       var url = changePasswordUrl;
      //  url= "http://192.168.0.140:8080/login"



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
                showErrorPage(data.message,"2",function(){
                   
                    document.getElementById('errorBtn').addEventListener('click',function(){
                        hideErrorPage();

                    });

                    });
            }
        } catch (error) {
            //   console.error('Error:', error);
            // alert('Failed to send data');
            console.error('Error:', error)
            showErrorPage(error,"2",function(){
                   
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












