import React from "react";
import axios from "./axios.js";
import { Link } from "react-router-dom";

// import express from "express";

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            code: "",
            emailConfirmed: false,
            codeConfirmed: false,
            // resetConfirmed: false,
            error: "",
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSendEmail = this.handleSendEmail.bind(this);
        this.handleSendCode = this.handleSendCode.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    handleSendEmail(e) {
        // console.log("handleSendEmail ran");
        e.preventDefault();
        // console.log("this.state.email: ", this.state.email);
        axios
            .post("/resetpassword/email", this.state)
            .then((response) => {
                // console.log("/resetpassword/email response: ", response);
                this.setState({
                    emailConfirmed: true,
                });
            })
            .catch((err) => {
                // console.log("/resetpassword/email err: ", err);
                this.setState({
                    error: "Something went wrong. Please re-submit",
                });
            });
    }

    handleSendCode(e) {
        console.log("handleSendCode ran");
        e.preventDefault();
        // const { password, code } = this.state;
        axios
            .post("/resetpassword/code", this.state)
            .then((response) => {
                // console.log(
                //     "client-side /resetpassword/code response: ",
                //     response
                // );
                this.setState({
                    codeConfirmed: true,
                });
            })
            .catch((err) => {
                // console.log("client-side /resetpassword/code err: ", err);
                this.setState({
                    error: "Something went wrong. Please re-submit.",
                });
            });
    }

    getCurrentDisplay() {
        if (!this.state.emailConfirmed && !this.state.codeConfirmed) {
            console.log(
                "if (!this.state.emailConfirmed && !this.state.codeConfirmed) ran"
            );
            return (
                <div id="resetpassword-1-div" className="component">
                    <p>reset password below:</p>
                    <form onSubmit={this.handleSendEmail}>
                        <input
                            type="text"
                            name="email"
                            placeholder="email address"
                            onChange={this.handleChange}
                            key="1"
                        ></input>
                        <button>submit</button>
                    </form>
                    <br />
                    {this.state.error && (
                        <p className="error">
                            an error occured. please re-enter your details
                        </p>
                    )}
                </div>
            );
        } else if (this.state.emailConfirmed && !this.state.codeConfirmed) {
            console.log("else if (this.state.emailConfirmed)");
            return (
                <div id="resetpassword-2-div" className="component">
                    <p>reset password below:</p>
                    <form onSubmit={this.handleSendCode}>
                        <input
                            type="password"
                            name="password"
                            placeholder="new password"
                            onChange={this.handleChange}
                            key="2"
                        ></input>
                        <input
                            type="text"
                            name="code"
                            placeholder="6-character code"
                            onChange={this.handleChange}
                            key="3"
                        ></input>
                        <button>submit</button>
                    </form>
                    <br />
                    {this.state.error && (
                        <p className="error">
                            an error occured. please re-enter your details
                        </p>
                    )}
                </div>
            );
        } else {
            console.log("else ran");
            return (
                <div id="resetpassword-3-div" className="component">
                    <h3>your password has been updated successfully!</h3>
                    <Link to="/login">Login -Registration component-</Link>
                    {this.state.error && (
                        <p className="error">
                            an error occured. please re-try.
                        </p>
                    )}
                </div>
            );
        }
    }

    render() {
        return (
            <div id="resetpassword-div" className="component">
                <div>{this.getCurrentDisplay()}</div>
                <div>{this.state.error}</div>
            </div>
        );
    }
}
