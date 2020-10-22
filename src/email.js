import React, { useState } from "react";
import axios from "./axios";
let credentials; // = require("./smtp.json");
// process.env.NODE_ENV === "production"
//     ? (credentials = process.env)
//     : (credentials = require("./smtp.json"));

export default function Email() {
    const [input, setInput] = useState({});
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    function preventDefault(e) {
        e.preventDefault();
    }

    function submitEmail() {
        var databaseMessage = "";
        axios
            .post("/email/submit", input)
            .then((response) => {
                console.log('axios.post("/email/submit" success: ', response);
                databaseMessage = "Success";
                sendEmail(databaseMessage);
                setSuccess(true);
                setError(false);
            })
            .catch((err) => {
                console.log('axios.post("/email/submit" error: ', err);
                databaseMessage = "Failed";
                sendEmail(databaseMessage);
                setError(true);
                setSuccess(false);
            });
    }

    function sendEmail(message) {
        var bodyContent =
            "The following email address would like to join the b&#228;rosaurus mailing list:" +
            "<br>" +
            `${input.email}` +
            "<br><br>Email address saved to database: " +
            message;

        // send smtp email, from on https://www.smtpjs.com/
        window.Email.send({
            // Host: credentials.smtpHost,
            // Username: credentials.smtpUsername,
            // Password: credentials.smtpPassword,
            // SecureToken: "13a0a10a-0e0b-49f1-8afa-bd254c50ed19",
            Host: "smtp.gmail.com",
            Username: "smtpemailband@gmail.com",
            Password: "G}#ihL_qm8.b",
            To: "baerosaurus@gmail.com",
            From: "smtpemailband@gmail.com",
            Subject: "New Email List Subscriber",
            Body: bodyContent,
        })
            .then((message) => {
                console.log("Email.send success: ", message);
            })
            .catch((err) => {
                console.log("Email.send error: ", err);
            });
    }

    return (
        <div>
            {success && (
                <p style={{ color: "green" }}>
                    Your email was added successfully!
                </p>
            )}
            {error && (
                <p style={{ color: "red" }}>
                    An error occured, please re-submit your email
                </p>
            )}
            <br />
            <form
                onSubmit={(e) => {
                    // submit(e);
                    preventDefault(e);
                    submitEmail();
                }}
            >
                <p>Enter your email address below to join:</p>
                <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="email address"
                    onChange={(e) => {
                        setInput({ email: e.target.value });
                    }}
                />
                <br />
                <br />
                <button>Submit</button>
            </form>
        </div>
    );
}
