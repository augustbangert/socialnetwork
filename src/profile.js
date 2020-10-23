import React from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import BioEditor from "./bioeditor";

export default function Profile(props) {
    // console.log("props in Profile: ", props);
    return (
        <>
            <h3>logged in as:</h3>
            <h2>
                {props.first} {props.last}
            </h2>
            <br />
            <div id="user-profile">
                <div id="profilepic">
                    <ProfilePic
                        first={props.first}
                        last={props.last}
                        profilepic={props.profilepic}
                        toggleModal={props.toggleModal}
                        turnOnModal={props.turnOnModal}
                        turnOffModal={props.turnOffModal}
                    />
                </div>
                <div id="bioeditor">
                    <BioEditor userBio={props.userBio} setBio={props.setBio} />
                </div>
            </div>
        </>
    );
}
