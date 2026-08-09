import { auth } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-auth.js";


onAuthStateChanged(auth, (user) => {

    if (user) {

        // Display user's name
        document.getElementById("profileName").textContent =
            user.displayName || "Demo User";

        // Display user's email
        document.getElementById("profileEmail").textContent =
            user.email;

        // Display role
        document.getElementById("profileRole").textContent =
            "Employee";

    } else {

        // User is not logged in
        window.location.href = "login.html";

    }

});