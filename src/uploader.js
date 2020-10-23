import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            error: false,
        };
        this.uploadProfilePic = this.uploadProfilePic.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    uploadProfilePic(e) {
        e.preventDefault();
        var formData = new FormData();
        formData.append("file", this.state.file);

        axios
            .post("/upload", formData)
            .then((response) => {
                // console.log("response.data: ", response.data);
                // console.log("response.data[0]: ", response.data[0]);
                // console.log(
                //     "response.data.profilepic: ",
                //     response.data.profilepic
                // );
                // console.log("response: ", response);
                this.props.setImage(response.data.profilepic);
            })
            .catch((err) => {
                console.log("err: ", err);
            });
    }

    handleChange(e) {
        this.setState({
            file: e.target.files[0],
        });
    }

    render() {
        return (
            <div id="uploader-div">
                <p onClick={this.props.turnOffModal}>close X</p>
                {/* <p>-uploader component-</p> */}
                <br />
                {/* <p>upload image below</p> */}
                <form id="photo-form" onSubmit={this.uploadProfilePic}>
                    <input
                        type="file"
                        name="file"
                        onChange={this.handleChange}
                    ></input>
                    <button>Submit</button>
                </form>
                <br />
                {this.state.error && (
                    <p className="error">An error occured. Please re-submit.</p>
                )}
            </div>
        );
    }
}
