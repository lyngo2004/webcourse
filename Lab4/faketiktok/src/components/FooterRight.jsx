import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faCircleCheck, faHeart, faCommentDots, faBookmark, faShare, faVolumeMute, faVolumeHigh, faXmark } from '@fortawesome/free-solid-svg-icons';
import './FooterRight.css';

function FooterRight({ likes, comments, saves, shares, profilePic, videoRef, url }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [userAddIcon, setUserAddIcon] = useState(faCirclePlus);
  const [muted, setMuted] = useState(true);
  const [showSharePopup, setShowSharePopup] = useState(false);

  const handleUserAddClick = () => {
    setUserAddIcon(faCircleCheck);
    setTimeout(() => {
      setUserAddIcon(null);
    }, 3000);
  };

  //convert likes count to a number
  const parseLikesCount = (count) => {
    if (typeof count === 'string') {
      if (count.endsWith('K')) {
        return parseFloat(count) * 1000;
      }
      return parseInt(count);
    }
    return count;
  };

  //format likes count
  const formatLikesCount = (count) => {
    if (count >= 10000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count;
  }

  const handleLikeClick = () => {
    setLiked((prevLiked) => !prevLiked);
  }

  const handleMuteClick = () => {
    if (videoRef && videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(!muted);
    }
  }

  const handleSaveClick = () => {
    setSaved(!saved);
    if (url) {
      navigator.clipboard.writeText(url).catch(err => console.error('Failed to copy URL:', err));
    }
  }

  const handleShareClick = () => {
    setShowSharePopup(!showSharePopup);
  }

  const handleShareSocial = (platform) => {
    const encodedUrl = encodeURIComponent(url);
    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'instagram':
        shareUrl = `https://www.instagram.com/`;
        break;
      case 'threads':
        shareUrl = `https://www.threads.net/`;
        break;
      default:
        return;
    }

    if (platform === 'facebook') {
      window.open(shareUrl, '_blank');
    }
  }

  return (
    <div className='footer-right'>
      <div className='sidebar-icon'>
        {profilePic ? (
          <img src={profilePic} className='userprofile' alt='Profile' style={{ width: '45px', height: '45px', color: '#616161' }} />
        ) : null}
        <FontAwesomeIcon icon={userAddIcon} className='useradd' style={{ width: '15px', height: '15px', color: '#FF0000' }}
          onClick={handleUserAddClick} />
      </div>

      <div className='sidebar-icon'>
        <FontAwesomeIcon
          icon={muted ? faVolumeMute : faVolumeHigh}
          style={{ width: '35px', height: '35px', color: 'white', marginBottom: '20px' }}
          onClick={handleMuteClick}
        />
      </div>

      <div className='sidebar-icon'>
        <FontAwesomeIcon
          icon={faHeart}
          style={{ width: '35px', height: '35px', color: liked ? 'FF0000' : 'white' }}
          onClick={handleLikeClick}
        />
        <p>{formatLikesCount(parseLikesCount(likes) + (liked ? 1 : 0))}</p>
      </div>

      <div className='sidebar-icon'>
        <FontAwesomeIcon icon={faCommentDots} style={{ width: '35px', height: '35px', color: 'white' }} />
        <p>{comments}</p>
      </div>

      <div className='sidebar-icon'>
        {saved ? (
          <FontAwesomeIcon
            icon={faBookmark}
            style={{ width: '35px', height: '35px', color: '#ffc107' }}
            onClick={() => handleSaveClick()}
          />
        ) : (
          <FontAwesomeIcon
            icon={faBookmark}
            style={{ width: '35px', height: '35px', color: 'white' }}
            onClick={() => handleSaveClick()}
          />
        )}
        <p>{saved ? saves + 1 : saves}</p>
      </div>

      <div className='sidebar-icon'>
        <FontAwesomeIcon icon={faShare} style={{ width: '35px', height: '35px', color: 'white' }} onClick={handleShareClick} />
        <p>{shares}</p>
      </div>

      {showSharePopup && (
        <div className='share-popup'>
          <div className='share-popup-header'>
            <h3>Share to</h3>
            <FontAwesomeIcon
              icon={faXmark}
              className='close-btn'
              onClick={() => setShowSharePopup(false)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
          </div>
          <div className='share-options'>
            <div className='share-option' onClick={() => handleShareSocial('facebook')}>
              <span>Facebook</span>
            </div>
            <div className='share-option' onClick={() => handleShareSocial('instagram')}>
              <span>Instagram</span>
            </div>
            <div className='share-option' onClick={() => handleShareSocial('threads')}>
              <span>Threads</span>
            </div>
          </div>
        </div>
      )}

      <div className='sidebar-icon record'>
        <img src="https://static.thenounproject.com/png/934821-200.png" alt='Record Icon' />
      </div>
    </div>
  );
}

export default FooterRight;
