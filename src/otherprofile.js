import React from "react";
import axios from "./axios";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            first: "",
            last: "",
            profilepic: "",
            bio: "",
            id: "",
        };
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {
        axios
            .get(`/api/user/${this.props.match.params.id}`)
            .then((response) => {
                // console.log(
                //     "otherprofile axios success response.data: ",
                //     response.data
                // );
                const { first, last, profilepic, bio, id } = response.data[0];
                this.setState({
                    first: first,
                    last: last,
                    profilepic: profilepic,
                    bio: bio,
                    id: id,
                });
            })
            .catch((err) => {
                console.log("otherprofile axios error", err);
            });
    }

    render() {
        return (
            <div id="otherprofile">
                <img
                    src={this.state.profilepic || "./blankphoto.jpg"}
                    alt={`${this.state.first} ${this.state.last}'s profile pic`}
                />
                <p>{`${this.state.first} ${this.state.last}'s Bio:`}</p>
                <br />
                <p id="other-editor">{this.state.bio}</p>
            </div>
        );
    }
}
