import React, { useRef } from "react";
import FooterLeft from "./FooterLeft";
import FooterRight from "./FooterRight";

const VideoCard = ({
  url,
  username,
  description,
  song,
  likes,
  comments,
  saves,
  shares,
  profilePic,
  setVideoRef,
  autoplay,
}) => {
  const videoRef = useRef(null);

  return (
    <div className="video-card">
      <video
        ref={(el) => {
          videoRef.current = el;
          setVideoRef(el);
        }}
        src={url}
        loop
        autoPlay={autoplay}
        muted
        className="video-player"
      />

      <div className="footer">
        <FooterLeft username={username} description={description} song={song} />
        <FooterRight
          likes={likes}
          comments={comments}
          saves={saves}
          shares={shares}
          profilePic={profilePic}
        />
      </div>
    </div>
  );
};

export default VideoCard;