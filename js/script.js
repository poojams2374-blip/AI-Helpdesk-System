import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-auth.js";

import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";
const GEMINI_API_KEY = "AQ.Ab8RN6LSvu0hjFm48c0TnCGFhz6dlgYXdhxCrQfbO8NrlSnc_g";

async function classifyTicket(description) {
    try {
        const response = await fetch(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent',
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": GEMINI_API_KEY
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: `Classify this helpdesk ticket into exactly one category: Hardware, Software, Network, Account/Access, or Other. Only reply with the category name, nothing else.\n\nTicket: ${description}`
                                }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();
        const category = data.candidates[0].content.parts[0].text.trim();
        return category;

    } catch (error) {
        console.error("Classification error:", error);
        return "Other";
    }
}

// ---------------- Register ----------------

const registerBtn = document.getElementById("registerBtn");

if (registerBtn) {

    registerBtn.addEventListener("click", () => {

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        createUserWithEmailAndPassword(auth, email, password)

            .then(() => {

                alert("Registration Successful!");

                window.location.href = "login.html";

            })

            .catch((error) => {

                alert(error.message);

            });

    });

}

// ---------------- Login ----------------

const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {

    loginBtn.addEventListener("click", () => {

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        signInWithEmailAndPassword(auth, email, password)

            .then(() => {

                alert("Login Successful!");

                window.location.href = "dashboard.html";

            })

            .catch((error) => {

                alert(error.message);

            });

    });

}
// ---------------- Raise Ticket ----------------

const submitTicket = document.getElementById("submitTicket");

if (submitTicket) {

    submitTicket.addEventListener("click", async () => {

        const title = document.getElementById("title").value;
        const description = document.getElementById("description").value;

        try {
            const category = await classifyTicket(description);
            await addDoc(collection(db, "tickets"), {

                title: title,
                description: description,
                status: "Open",
                category: category,
                createdAt: new Date()

            });

            alert("Ticket Submitted Successfully!");

            document.getElementById("title").value = "";
            document.getElementById("description").value = "";

        } catch (error) {

            alert(error.message);

        }

    });

} 

// ---------------- Show Tickets ----------------

const ticketList = document.getElementById("ticketList");

if (ticketList) {

    async function loadTickets() {

        ticketList.innerHTML = "";

        try {

            const querySnapshot = await getDocs(
                collection(db, "tickets")
            );

            querySnapshot.forEach((ticketDoc) => {

                const ticket = ticketDoc.data();
                const ticketId = ticketDoc.id;

                let actionButtons = "";

                // Show Close button only for Open tickets
                if (ticket.status === "Open") {

                    actionButtons = `
                        <button onclick="closeTicket('${ticketId}')">
                            Close Ticket
                        </button>
                    `;

                }

                // Edit button
                actionButtons += `
                    <button onclick="editTicket('${ticketId}')">
                        Edit
                    </button>
                `;

                // Delete button
                actionButtons += `
                    <button onclick="deleteTicket('${ticketId}')">
                        Delete
                    </button>
                `;


                ticketList.innerHTML += `

                    <div class="card">

                        <h3>${ticket.title}</h3>

                        <p>${ticket.description}</p>

                        <p>
                            <b>Category:</b>
                            ${ticket.category || "Other"}
                        </p>

                        <p>
                            <b>Status:</b>
                            ${ticket.status}
                        </p>

                        ${actionButtons}

                    </div>

                `;

            });

        } catch (error) {

            console.error("Error loading tickets:", error);

        }

    }

    loadTickets();

}

// ---------------- Admin Panel ----------------

const adminTicketList = document.getElementById("adminTicketList");

if (adminTicketList) {

    const searchInput =
        document.getElementById("searchInput");

    const statusFilter =
        document.getElementById("statusFilter");

    const categoryFilter =
        document.getElementById("categoryFilter");


    let allTickets = [];


    // Load tickets from Firebase
    async function loadAdminTickets() {

        try {

            adminTicketList.innerHTML = "";

            const querySnapshot =
                await getDocs(collection(db, "tickets"));


            allTickets = [];


            querySnapshot.forEach((ticketDoc) => {

                allTickets.push({

                    id: ticketDoc.id,

                    ...ticketDoc.data()

                });

            });


            console.log(
                "Admin tickets loaded:",
                allTickets
            );


            displayTickets(allTickets);


        } catch (error) {

            console.error(
                "Error loading admin tickets:",
                error
            );

            adminTicketList.innerHTML = `
                <p style="color:red;">
                    Error loading tickets.
                </p>
            `;

        }

    }


    // Display tickets
    function displayTickets(tickets) {

        adminTicketList.innerHTML = "";


        if (tickets.length === 0) {

            adminTicketList.innerHTML = `
                <div class="card">
                    <h3>No tickets found</h3>
                    <p>
                        No tickets match the selected filters.
                    </p>
                </div>
            `;

            return;

        }


        tickets.forEach((ticket) => {

            adminTicketList.innerHTML += `

                <div class="card">

                    <h3>${ticket.title}</h3>

                    <p>
                        ${ticket.description}
                    </p>

                    <p>
                        <b>Category:</b>
                        ${ticket.category || "Other"}
                    </p>

                    <p>
                        <b>Status:</b>
                        ${ticket.status}
                    </p>

                    ${
                        ticket.status === "Open"
                        ?
                        `
                        <button
                            onclick="updateStatus('${ticket.id}')">
                            Mark as Resolved
                        </button>
                        `
                        :
                        `
                        <p style="color:green;">
                            ✅ Ticket Resolved
                        </p>
                        `
                    }

                </div>

            `;

        });

    }


    // Apply search and filters
    function applyFilters() {

        const searchText =
            searchInput.value.toLowerCase().trim();


        const selectedStatus =
            statusFilter.value;


        const selectedCategory =
            categoryFilter.value;


        const filteredTickets =
            allTickets.filter((ticket) => {


                const title =
                    (ticket.title || "").toLowerCase();


                const category =
                    ticket.category || "Other";


                const matchesSearch =
                    title.includes(searchText);


                const matchesStatus =
                    selectedStatus === "All" ||
                    ticket.status === selectedStatus;


                const matchesCategory =
                    selectedCategory === "All" ||
                    category === selectedCategory;


                return (
                    matchesSearch &&
                    matchesStatus &&
                    matchesCategory
                );

            });


        displayTickets(filteredTickets);

    }


    // Search
    searchInput.addEventListener(
        "input",
        applyFilters
    );


    // Status filter
    statusFilter.addEventListener(
        "change",
        applyFilters
    );


    // Category filter
    categoryFilter.addEventListener(
        "change",
        applyFilters
    );


    // Load tickets
    loadAdminTickets();

}
// ---------------- Update Ticket Status ----------------

window.updateStatus = async function(id) {

    try {

        await updateDoc(doc(db, "tickets", id), {

            status: "Resolved"

        });

        alert("Ticket Resolved!");

        location.reload();

    } catch (error) {

        alert(error.message);

    }

}
// ---------------- Delete Ticket ----------------

window.deleteTicket = async function(id) {

    try {

        await deleteDoc(doc(db, "tickets", id));

        alert("Ticket Deleted Successfully!");

        location.reload();

    } catch (error) {

        alert(error.message);

    }

}

// ---------------- Edit Ticket ----------------

window.editTicket = async function(id) {

    try {

        const newTitle = prompt(
            "Enter new ticket title:"
        );

        if (newTitle === null) {
            return;
        }

        const newDescription = prompt(
            "Enter new ticket description:"
        );

        if (newDescription === null) {
            return;
        }

        await updateDoc(
            doc(db, "tickets", id),
            {
                title: newTitle,
                description: newDescription
            }
        );

        alert("Ticket Updated Successfully!");

        location.reload();

    } catch (error) {

        console.error("Edit ticket error:", error);

        alert(error.message);

    }

};
// ---------------- Close Ticket ----------------

window.closeTicket = async function(id) {

    const confirmClose = confirm(
        "Are you sure you want to close this ticket?"
    );

    if (!confirmClose) {
        return;
    }

    try {

        await updateDoc(
            doc(db, "tickets", id),
            {
                status: "Resolved"
            }
        );

        alert("Ticket closed successfully!");

        location.reload();

    } catch (error) {

        console.error("Close ticket error:", error);

        alert(error.message);

    }

};

// ---------------- Notification Count ----------------

const notificationCount = document.getElementById("notificationCount");

if (notificationCount) {

    async function loadNotificationCount() {

        const querySnapshot = await getDocs(collection(db, "tickets"));

        let openTickets = 0;

        querySnapshot.forEach((ticketDoc) => {

            const ticket = ticketDoc.data();

            if (ticket.status === "Open") {
                openTickets++;
            }

        });

        notificationCount.innerText = openTickets;

    }

    loadNotificationCount();

}

// ---------------- Dashboard Statistics ----------------

const chartCanvas = document.getElementById("ticketChart");

const totalTicketsElement = document.getElementById("totalTickets");
const openTicketsElement = document.getElementById("openTickets");
const resolvedTicketsElement = document.getElementById("resolvedTickets");

if (chartCanvas) {

    async function loadDashboardStatistics() {

        try {

            const querySnapshot = await getDocs(
                collection(db, "tickets")
            );

            let totalTickets = 0;
            let openTickets = 0;
            let resolvedTickets = 0;

            querySnapshot.forEach((ticketDoc) => {

                const ticket = ticketDoc.data();

                totalTickets++;

                if (ticket.status === "Open") {
                    openTickets++;
                }

                if (ticket.status === "Resolved") {
                    resolvedTickets++;
                }

            });

            // Update dashboard cards

            if (totalTicketsElement) {
                totalTicketsElement.innerText = totalTickets;
            }

            if (openTicketsElement) {
                openTicketsElement.innerText = openTickets;
            }

            if (resolvedTicketsElement) {
                resolvedTicketsElement.innerText = resolvedTickets;
            }


            // Create chart

            new Chart(chartCanvas, {

                type: "doughnut",

                data: {

                    labels: [
                        "Open",
                        "Resolved"
                    ],

                    datasets: [{

                        data: [
                            openTickets,
                            resolvedTickets
                        ],

                        borderWidth: 1

                    }]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {
                            position: "top"
                        }

                    }

                }

            });

        } catch (error) {

            console.error(
                "Dashboard statistics error:",
                error
            );

        }

    }

    loadDashboardStatistics();

}