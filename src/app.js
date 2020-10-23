import React from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";
import OtherProfile from "./otherprofile";
import FindPeople from "./findpeople";
// import { response } from "express";
import { Link, BrowserRouter, Route } from "react-router-dom";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: false,
            first: "",
            last: "",
            profilepic: "",
            userBio: "",
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.turnOnModal = this.turnOnModal.bind(this);
        this.turnOffModal = this.turnOffModal.bind(this);
        this.setImage = this.setImage.bind(this);
        this.setBio = this.setBio.bind(this);
    }

    componentDidMount() {
        // console.log("my component from app.js has mounted!");
        axios
            .get("/user")
            .then((response) => {
                // console.log("componentDidMount axios success: ", response.data);
                let pic;
                if (response.data.profilepic) {
                    pic = response.data.profilepic;
                } else {
                    pic = "blankphoto.jpg";
                }
                this.setState({
                    first: response.data.first,
                    last: response.data.last,
                    profilepic: pic,
                    userBio: response.data.bio,
                });
                // console.log("this.state: ", this.state);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    toggleModal() {
        if (this.state.uploaderIsVisible) {
            this.setState({
                uploaderIsVisible: false,
            });
        } else {
            this.setState({
                uploaderIsVisible: true,
            });
        }
    }

    turnOnModal() {
        if (!this.state.uploaderIsVisible) {
            this.setState({
                uploaderIsVisible: true,
            });
        }
    }

    turnOffModal() {
        if (this.state.uploaderIsVisible) {
            this.setState({
                uploaderIsVisible: false,
            });
        }
    }

    setImage(newProfilePic) {
        this.setState({
            profilepic: newProfilePic,
        });
    }

    setBio(input) {
        this.setState({
            userBio: input,
        });
    }

    render() {
        return (
            <div id="app-div" className="component">
                <BrowserRouter>
                    <div>
                        <div id="browser-router-1-div">
                            <a id="logout" href="/logout">
                                logout
                            </a>
                            <Link to="/users">
                                click here to find other bassists
                            </Link>
                            <Route
                                exact
                                path="/"
                                render={() => (
                                    <div id="profile-div">
                                        <Profile
                                            id={this.state.id}
                                            first={this.state.first}
                                            last={this.state.last}
                                            image={this.state.image}
                                            onClick={this.showUploader}
                                            bio={this.state.bio}
                                            setBio={this.setBio}
                                            userBio={this.state.userBio}
                                            profilepic={this.state.profilepic}
                                        />
                                        <br />
                                        <button onClick={this.toggleModal}>
                                            upload photo
                                        </button>
                                    </div>
                                )}
                            />
                            <Route
                                path="/user/:id"
                                render={(props) => (
                                    <>
                                        <OtherProfile
                                            key={props.match.url}
                                            match={props.match}
                                            history={props.history}
                                            user={this.state.id}
                                        />
                                    </>
                                )}
                            />
                            <Route
                                path="/users"
                                render={() => <FindPeople />}
                            />
                        </div>
                    </div>
                </BrowserRouter>
                {this.state.uploaderIsVisible && (
                    <div id="uploader">
                        <Uploader
                            turnOffModal={this.turnOffModal}
                            setImage={this.setImage}
                        />
                    </div>
                )}
            </div>
        );
    }
}
