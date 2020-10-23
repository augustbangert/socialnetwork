import React from "react";
import Registration from "./registration";
import Login from "./login";
import axios from "./axios";
import { HashRouter, Route } from "react-router-dom";
import ResetPassword from "./resetpassword";

export default function Welcome() {
    return (
        <div id="welcome-div" className="component">
            <h1>Welcome to Bassbook</h1>
            <div id="bass-logo-div">
                <img id="bass-logo" src="./bass-logo.png" />
            </div>
            <br />
            <br />
            {/* <Registration /> */}
            <HashRouter>
                <>
                    <Route path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route path="/resetpassword" component={ResetPassword} />
                </>
            </HashRouter>
        </div>
    );
}
