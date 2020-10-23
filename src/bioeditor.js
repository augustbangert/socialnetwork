import React from "react";
import axios from "./axios";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // define the component state
            bioEditorIsVisible: false,
            bioInput: "",
        };
        // this binding
        this.openBioEditor = this.openBioEditor.bind(this);
        this.updateBioInput = this.updateBioInput.bind(this);
        this.bioUpload = this.bioUpload.bind(this);
    }

    updateBioInput(e) {
        this.setState({
            bioInput: e.target.value,
        });
    }

    openBioEditor() {
        this.setState({
            bioEditorIsVisible: true,
        });
    }

    bioUpload(e) {
        e.preventDefault();
        const bio = this.state.bioInput;
        axios
            .post("/updatebio", { bio: bio })
            .then((response) => {
                // console.log("response.data[0].bio", response.data[0].bio);
                this.props.setBio(response.data[0].bio);
                this.setState({
                    bioEditorIsVisible: false,
                });
                // console.log("this.props.userBio", this.props.userBio);
            })
            .catch((err) => {
                console.log("/update axios error: ", err);
            });
    }

    render() {
        if (this.state.bioEditorIsVisible) {
            return (
                <>
                    <form onSubmit={this.bioUpload}>
                        <textarea onChange={this.updateBioInput}></textarea>
                        <button>Update</button>
                    </form>
                </>
            );
        } else if (this.props.userBio) {
            return (
                <>
                    <p className="user-bio">My Bio:</p>
                    <br />
                    <p>{this.props.userBio}</p>
                    <br />
                    <button onClick={this.openBioEditor}>edit bio </button>
                </>
            );
        } else {
            return <p onClick={this.openBioEditor}>create bio</p>;
        }
    }
}
