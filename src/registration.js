import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            first: "",
            last: "",
            email: "",
            password: "",
            error: false,
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
        console.log("handleSubmit ran");
        e.preventDefault();
        // console.log("this.state", this.state);
        // post request will be made by axios with following arguements
        axios
            .post("/registration", this.state)
            .then((result) => {
                // console.log("success from axios.post()", result);
                location.replace("/");
            })
            .catch((err) => {
                // console.log("error from axios.post()", err);
                this.setState({ error: err });
            });
    }

    // #### new axios.post() syntax for csrf avoidance #### //
    // axios.post('/login', { email, password }, {
    //     xsrfCookieName: 'mytoken',
    //     xsrfHeaderName: 'csrf-token' // the csurf middleware automatically checks this header for the token
    // });

    // handleChange(e) {
    //     this.setState({
    //         name: e.target.value,
    //     });
    // }
    render() {
        return (
            <div id="registration-div" className="component">
                {/* <Link></Link> */}
                <p>sign up below:</p>
                <form onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        name="first"
                        placeholder="first name"
                        onChange={this.handleChange}
                    ></input>
                    <input
                        type="text"
                        name="last"
                        placeholder="last name"
                        onChange={this.handleChange}
                    ></input>
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
                    <button>sign up</button>
                </form>
                <br />
                {this.state.error && (
                    <p className="error">
                        an error occured. Please re-enter your details.
                    </p>
                )}
                <Link to="/login">already a member? click here to login</Link>
                <br />
                <br />
            </div>
        );
    }
}
