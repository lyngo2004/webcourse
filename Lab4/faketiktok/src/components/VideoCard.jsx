import React, { useRef, useEffect } from 'react';
import FooterLeft from './FooterLeft';
import FooterRight from './FooterRight';
import './VideoCard.css';

const VideoCard = (props) => {
  const { url, username, description, song, likes, shares, comments, saves, profilePic, setVideoRef, autoPlay } = props;
  const videoRef = useRef(null);

  useEffect(() => {
    if (autoPlay) {
      videoRef.current.play();
    }
  }, [autoPlay]);

  const onVideoPress = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  return (
    <div className='video'>
      {/* The video element */}
      <video
        className='player'
        onClick={onVideoPress}
        ref={(ref) => {
          videoRef.current = ref;
          setVideoRef(ref);
        }}
        loop
        muted
        src={url}
      ></video>
      <div className='bottom-controls'>
        <div className='footer-left'>
          {/* The left part of the container */}
          <FooterLeft username={username} description={description} song={song} />
        </div>
        <div className='footer-right'>
          { /* The right part of the container */}
          <FooterRight likes={likes} shares={shares} comments={comments} saves={saves}
            profilePic={profilePic} videoRef={videoRef} url={url} />
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
