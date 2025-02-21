
document.addEventListener('DOMContentLoaded', init);

function init(){
    startCamera('faceAuth');
    startLiveAuthentication();
    
}

import {navigatePage} from "../../components/components.js";
function startCamera(videoElementId) {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            document.getElementById(videoElementId).srcObject = stream;
        })
        .catch(function (error) {
            console.error("Error accessing the camera:", error);
        });
}

 function authenticateFace(videoElementId, apiUrl) {
    let video = document.getElementById(videoElementId);



    let canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    let ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
        if (!blob) {
            console.error("Failed to capture image from video.");
            return;
        }

        let formData = new FormData();
        formData.append('file', blob, 'face.jpg');
        console.log(apiUrl);

        fetch(apiUrl, {
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
                console.log("Server Response:", data);

                let authStatus = document.getElementById('authStatus');
                if (data.code === "1") {
                    authStatus.innerText = "Face Authentication Success";
                    navigatePage("welcome",data.user_name.toString(),"/")
                    
                } else {
                    authStatus.innerText = "Face Authentication Failed";
                }
            })
            .catch(error => {
                document.getElementById('authStatus').innerText = "Face Authentication Failed.";
                console.error("Fetch error:", error.toString);
            });
    }, 'image/jpeg');
}

import {authenticateUrl} from "../../../js/constant.js"
function startLiveAuthentication() {

    setInterval(() => authenticateFace('faceAuth',authenticateUrl), 3000);
}