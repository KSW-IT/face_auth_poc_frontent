export async function loadErrorPage(){
    
    return  fetch("../../components/error.html") // Make sure error.html contains only the error message div
       .then(response => response.text())
       .then(html => {
         document.getElementById("error-container").innerHTML = html;
       })
       .catch(error => console.error("Error loading error page:", error));
   
   }

export async function loadSuccessPage(){
  return  fetch("../../components/success.html") 
       .then(response => response.text())
       .then(html => {
         document.getElementById("success-container").innerHTML = html;
       })
       .catch(error => console.error("Error loading Success page:", error));
   
   }



  export function hideErrorPage() {
    
    document.getElementById('main-content').style.display = 'block';
    document.getElementById('success-page').style.display = 'none';
    document.getElementById('error-page').style.display = 'none';

    
}

export function hideSuccessPage() {
    
  document.getElementById('main-content').style.display = 'block';
  document.getElementById('success-page').style.display = 'none';
  document.getElementById('error-page').style.display = 'none';

  
}

  export function changeErrorButtonName(name){
    document.getElementById('errorBtn').textContent=name;
  }
  export function showErrorPage(errorMessage,code,callback) {
    
    // code 1 =success, 2 = other error, 3 = password expired
    // Hide the main content
    document.getElementById('main-content').style.display = 'none';
    // Show the error page
    const errorPage = document.getElementById('error-page');
    errorPage.style.display = 'block';
    // Set the error message dynamically
    document.getElementById('error-message').textContent = errorMessage;
    callback(code);

   /* if (code === '3') {
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
    } */
}

export function showSuccessMessage(successMessage,code,callback) {
  document.getElementById('main-content').style.display = 'none';
  // Show the error page
  const errorPage = document.getElementById('error-page');
  errorPage.style.display = 'none';
  // Set the error message dynamically
  const successPage = document.getElementById('success-page');
  successPage.style.display = 'block';
  document.getElementById('success-message').textContent = successMessage;
  callback(code);
}

 export function navigatePage(pageName, username, directory = "") {
  if (!pageName) {
      console.error("Page name or username is missing.");
      return;
  }

  // Handle dynamic directory
  let  url ;
  if(username.toString().trim()!==""){

      url = `/face_login/${directory}${encodeURIComponent(pageName)}.html?string=${encodeURIComponent(username)}`;
      console.log(`Redirecting executed if part `);
  }
  else{
      url = `/face_login/${directory}${encodeURIComponent(pageName)}.html`;
      console.log(`executed else part`);
  }

  

  window.location.href = url;
}

export function goBack() {
    window.history.back(); // Goes to the previous page
}

function preventBack() {
  window.history.pushState(null, "", window.location.href);
  window.onpopstate = function () {
      window.history.pushState(null, "", window.location.href);
  };
}

// Function to prevent form resubmission on refresh
export function preventResubmit() {
  if (window.performance && window.performance.navigation.type === 2) {
      location.reload(); // Forces a fresh page load
  }
}

// Function to prevent both
export function preventBackAndResubmit() {
  preventBack();
  preventResubmit();
}

// Run automatically when the script loads
//preventBackAndResubmit();