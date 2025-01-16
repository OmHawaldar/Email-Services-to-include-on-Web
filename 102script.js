document.getElementById("addRecipientForm").addEventListener("submit", function(event) {
    event.preventDefault();  // Prevent the form from submitting normally
    
    const emailInput = document.getElementById("emailInput");
    const email = emailInput.value.trim();

    // Simple email validation
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    // Send the email to the backend
    fetch("http://localhost:3000/add-recipient", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: email })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "Recipient added successfully!") {
            // Update the recipient list
            addRecipientToList(email);
            alert("Recipient added successfully!");
        } else {
            alert("Failed to add recipient: " + data.message);
        }
        emailInput.value = "";  // Clear the input field
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Failed to add recipient.");
    });
});

function addRecipientToList(email) {
    const recipientList = document.getElementById("recipientList");
    const li = document.createElement("li");
    li.textContent = email;
    recipientList.appendChild(li);
}

// Function to load existing recipients from backend (if needed)
function loadRecipients() {
    fetch("http://localhost:3000/get-recipients")
        .then(response => response.json())
        .then(data => {
            if (data.recipients && Array.isArray(data.recipients)) {
                data.recipients.forEach(email => {
                    addRecipientToList(email);
                });
            }
        })
        .catch(error => {
            console.error("Error loading recipients:", error);
        });
}

// Load recipients when the page is loaded
window.addEventListener("load", loadRecipients);
