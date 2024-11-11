// client/postData.js
const axios = require("axios");

function sendData() {
    const data = {
        message: "Hello from client",
        number: Math.floor(Math.random() * 100)
    };

    axios.post("http://localhost:3000/send-data", data)
        .then(response => {
            console.log("Server response:", response.data);
        })
        .catch(error => {
            console.error("Error:", error);
        });
}

setInterval(sendData, 5000); // Send data every 5 seconds
