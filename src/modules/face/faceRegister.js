
document.addEventListener('DOMContentLoaded', init);
import {initializePage,loadTranslations} from '../../../js/translationManager.js';
import {loadErrorPage,changeErrorButtonName,hideErrorPage,showErrorPage,navigatePage, loadSuccessPage} from '../../components/components.js';
async function init(){
    initializePage();
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    const translations = await loadTranslations();
    document.getElementById('email').placeholder=translations["enterEmail"][savedLanguage]
    document.getElementById('password').placeholder=translations["enterPassword"][savedLanguage]
    // $("#password").attr("placeholder",translations["enterPassword"][savedLanguage])
    startCamera('registerFace');
    

   
    layui.use(['util'],function(){
        var util = layui.util;

        util.on({
            registerFace: function (){
                registerFace();
                console.log("called registerFace");
                
            },
            onErrorPageBtn: function (){
                hideErrorPage();


            }
        });

    });

    await loadErrorPage();
    await loadSuccessPage();
    changeErrorButtonName('Close');


}

function startCamera(videoElementId) {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            document.getElementById(videoElementId).srcObject = stream;
        })
        .catch(function (error) {
            console.error("Error accessing the camera:", error);
        });
}



import {registerUrl} from '../../../js/constant.js'
async function registerFace() {

    layui.use('layer', function () {

        const layer = layui.layer;
        const loading = layer.load(2); // Show loading spinner

        let video = document.getElementById('registerFace');
        let canvas = document.createElement('canvas');
        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        let ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

       // url ="http://192.168.29.177:8000/register2";
        const url= registerUrl;


        canvas.toBlob(function (blob) {
            let formData = new FormData();
            formData.append('email', email);
            formData.append('password',password)
            formData.append('file', blob, 'face.jpg');


            fetch(url, {
                method: 'POST',
                body: formData

            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    //layer.msg(data.message);
                    layer.msg(data.message, { icon: 1, time: 2000 });
                    //  showPopup(data)
                    // redirectToLoginPage()
                    if (data.code === "1") {
                        showSuccessMessage(data.message,"1",function(){
                       
                            document.getElementById('successBtn').addEventListener('click',function(){
                                goBack();
        
                            });
                           
    
                        });

                    }
                    else {
                        const code = data.code;
                        showErrorPage(
                            data.message,
                            code,
                            (code) =>{
                                if(code ==="3"){
                                    let newText = 'Re register face';
                                    const button = document.getElementById("errorBtn");
                                    button.textContent=newText;
                                    button.addEventListener("click",() =>{
                                        hideErrorPage();
                                        registerFace();

                                    });
                                   
                                    
                                }
                                else{
                                    hideErrorPage();
                                }

                            }
                            );
                    }


                })
                .catch(error => {
                    const code ='2';
                    console.error('Error:', error)
                    showErrorPage(error,"2",function(){
                   
                        document.getElementById('errorBtn').addEventListener('click',function(){
                            hideErrorPage();
    
                        });
    
                        });
                })
                .finally(() => {
                    layer.close(loading); // Hide loading spinner
                });
        }, 'image/jpeg');


    });

}

function showPopup(data) {
    if (data.code === "1") {
        layer.open({
            title: data.message,  // Dialog title
            content: 'Please login again.', // Message content
            btn: ['OK'],  // Button text
            yes: function (index) {
                layer.close(index);
                redirectToLoginPage() // Close the dialog when OK is clicked
            }
        });

    }
    else {
        layer.open({
            title: data.message,  // Dialog title
            content: 'Please try again', // Message content
            btn: ['OK'],  // Button text
            yes: function (index) {
                layer.close(index);
                //redirectToLoginPage()

            }
        });
    }

}




