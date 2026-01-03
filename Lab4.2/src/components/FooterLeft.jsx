import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic } from "@fortawesome/free-solid-svg-icons";

function FooterLeft({ username, description, song }) {
  return (
    <div className="footer-left">
      <h3>@{username}</h3>
      <p>{description}</p>

      <div className="song">
        <FontAwesomeIcon icon={faMusic} className="icon" />
        <marquee>{song}</marquee>
      </div>
    </div>
  );
}

export default FooterLeft;