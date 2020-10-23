import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
        // console.log("this.state", this.state);
        // console.log("e.target.name", e.target.name);
    }

    handleSubmit(e) {
        // console.log("handleSubmit ran");
        e.preventDefault();
        // console.log("this.state", this.state);
        // post request will be made by axios with following arguements
        axios
            .post("/login", this.state)
            .then((result) => {
                console.log("success from axios.post()", result);
                location.replace("/"); // what goes here!
            })
            .catch((err) => {
                console.log("error from axios.post()", err);
                this.setState({ error: err });
            });
    }

    render() {
        return (
            <div id="login-div" className="component">
                <p>log in below:</p>
                <form onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        name="email"
                        placeholder="email"
                        onChange={this.handleChange}
                    ></input>
                    <input
                        type="password"
                        name="password"
                        placeholder="password"
                        onChange={this.handleChange}
                    ></input>
                    <button>log in</button>
                </form>
                <br />
                {this.state.error && (
                    <p className="error">
                        An error occured. Please re-enter your details.
                    </p>
                )}
                <Link to="/resetpassword" className="link">
                    forgot password?
                </Link>
            </div>
        );
    }
}
