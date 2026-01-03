import React from "react";
import "./UserInfoPanel.css";

function UserInfoPanel({ visible, video }) {
  if (!visible || !video) return null;

  return (
    <div className="user-info-panel">
      <img src={video.profilePic} alt="profile" className="userinfo-avatar" />

      <div className="userinfo-content">
        <h3>@{video.username}</h3>
        <p>{video.description}</p>
        <span className="userinfo-song">🎵 {video.song}</span>
      </div>
    </div>
  );
}

export default UserInfoPanel;