import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUserFriends,
  faPlus,
  faCommentDots,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const BottomNavbar = () => {
  return (
    <div className="bottom-navbar">
      <div className="nav-item">
        <FontAwesomeIcon icon={faHome} className="icon active" />
        <span className="item-name">Home</span>
      </div>

      <div className="nav-item">
        <FontAwesomeIcon icon={faUserFriends} className="icon" />
        <span className="item-name">Friends</span>
      </div>

      <div className="nav-item">
        <span className="plus">+</span>
        <span className="item-name">Create</span>
      </div>

      <div className="nav-item" style={{ position: "relative" }}>
        <FontAwesomeIcon icon={faCommentDots} className="icon" />
        <span className="notification">1</span>
        <span className="item-name">Inbox</span>
      </div>

      <div className="nav-item">
        <FontAwesomeIcon icon={faUser} className="icon" />
        <span className="item-name">Profile</span>
      </div>
    </div>
  );
};

export default BottomNavbar;