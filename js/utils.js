

// Function to handle login
export function onLogIn() {
    let userName = document.getElementById("userName").value.trim();
    let password = document.getElementById("password").value.trim();

    if (!userName || !password) {
        alert("Please enter both username and password.");
        return;
    }

    redirectToWelcomePage(userName);
}


export function startCamera(videoElementId) {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            let video = document.getElementById(videoElementId);
            video.srcObject = stream
            video.onloadeddata = () => {
                console.log("Camera is ready!");

            }

        })
        .catch((error) => {
            console.error("Error accessing the camera:", error);
        });
}


export function authenticateFace(videoElementId, apiUrl) {
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
                    redirectToWelcomePage(data.user_name.toString());
                } else {
                    authStatus.innerText = "Face Authentication Failed";
                }
            })
            .catch(error => {
                document.getElementById('authStatus').innerText = "Face Authentication Failed.";
                console.error("Fetch error:", error);
            });
    }, 'image/jpeg');
}

export function redirectToWelcomePage(userName) {
    console.log(`Redirecting to welcome page for user: ${userName}`);
    window.location.href = `welcome.html?string=${encodeURIComponent(userName)}`;
}

