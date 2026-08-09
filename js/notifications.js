import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";


const notificationBell = document.getElementById("notificationBell");
const notificationPanel = document.getElementById("notificationPanel");
const notificationCount = document.getElementById("notificationCount");


// Open / close notification panel

if (notificationBell) {

    notificationBell.addEventListener("click", () => {

        if (notificationPanel.style.display === "block") {

            notificationPanel.style.display = "none";

        } else {

            notificationPanel.style.display = "block";

        }

    });

}


// Load notifications from Firebase

async function loadNotifications() {

    try {

        const querySnapshot = await getDocs(
            collection(db, "tickets")
        );

        let notifications = [];

        querySnapshot.forEach((ticketDoc) => {

            const ticket = ticketDoc.data();

            notifications.push({
                id: ticketDoc.id,
                title: ticket.title,
                status: ticket.status
            });

        });


        // Notification count

        if (notificationCount) {

            notificationCount.innerText = notifications.length;

        }


        // Notification panel

        if (notificationPanel) {

            notificationPanel.innerHTML = `
                <h3>Notifications</h3>
            `;


            if (notifications.length === 0) {

                notificationPanel.innerHTML += `
                    <div class="notification-item">
                        No notifications available.
                    </div>
                `;

            } else {

                notifications.slice(0, 5).forEach((ticket) => {

                    let icon = "🎫";
                    let message = "";

                    if (ticket.status === "Open") {

                        icon = "🟡";

                        message =
                            `Ticket "${ticket.title}" is currently open.`;

                    } else if (ticket.status === "Resolved") {

                        icon = "✅";

                        message =
                            `Ticket "${ticket.title}" has been resolved.`;

                    } else {

                        message =
                            `Ticket "${ticket.title}" has been updated.`;

                    }


                    notificationPanel.innerHTML += `
                        <div class="notification-item">
                            ${icon} ${message}
                        </div>
                    `;

                });

            }

        }

    } catch (error) {

        console.error(
            "Notification loading error:",
            error
        );

    }

}


loadNotifications();