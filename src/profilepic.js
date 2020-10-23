import React from "react";

export default function ProfilePic(props) {
    // console.log("props in ProfilePic: ", props);
    // if the user is new, they will not have a profile pic, therefore they need a default image rendered for them

    return (
        <div className="component" id="profilepic-div">
            {/* <p>-profilepic element-</p> */}
            <img
                id="profilepic-img"
                src={props.profilepic || "./blankphoto.jpg"}
                onClick={props.turnOnModal}
                alt={`${props.first} ${props.last}'s profile pic`}
            />
            {/* <img src={props.profilePic} onClick={props.toggleModal} /> */}
        </div>
    );
}
