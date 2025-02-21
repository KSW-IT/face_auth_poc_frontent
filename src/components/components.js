export async function loadErrorPage(){
    
    return  fetch("../../components/error.html") // Make sure error.html contains only the error message div
       .then(response => response.text())
       .then(html => {
         document.getElementById("error-container").innerHTML = html;
       })
       .catch(error => console.error("Error loading error page:", error));
   
   }

  export function hideErrorPage() {
    
    document.getElementById('main-content').style.display = 'block';
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

 export function navigatePage(pageName, username, directory = "") {
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