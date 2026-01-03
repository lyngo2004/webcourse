import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faCommentDots,
  faBookmark,
  faShare
} from "@fortawesome/free-solid-svg-icons";

function FooterRight({ likes, comments, saves, shares, profilePic }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div className="footer-right">
      <img src={profilePic} alt="profile" className="profile-pic" />

      <div className="icon-block" onClick={() => setLiked(!liked)}>
        <FontAwesomeIcon
          icon={faHeart}
          className={liked ? "icon liked" : "icon"}
        />
        <span>{likes}</span>
      </div>

      <div className="icon-block">
        <FontAwesomeIcon icon={faCommentDots} className="icon" />
        <span>{comments}</span>
      </div>

      <div className="icon-block" onClick={() => setSaved(!saved)}>
        <FontAwesomeIcon
          icon={faBookmark}
          className={saved ? "icon saved" : "icon"}
        />
        <span>{saves}</span>
      </div>

      <div className="icon-block">
        <FontAwesomeIcon icon={faShare} className="icon" />
        <span>{shares}</span>
      </div>
    </div>
  );
}

export default FooterRight;