import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import VideoCard from './components/VideoCard';
import BottomNavbar from './components/BottomNavbar';
import TopNavbar from './components/TopNavbar';
// New import for exercise 5:
import UserInfoPanel from './components/UserInfoPanel';

// This array holds information about different videos
const videoUrls = [
  {
    url: require('./videos/video1.mp4'),
    profilePic: 'https://p16-sign-useast2a.tiktokcdn.com/tos-useast2a-avt-0068-giso/9d429ac49d6d18de6ebd2a3fb1f39269~c5_100x100.jpeg',
    username: 'csjackie',
    description: 'Lol nvm #compsci #chatgpt #ai #openai #techtok',
    song: 'Original sound - Famed Flames',
    likes: 430,
    comments: 13,
    saves: 23,
    shares: 1,
  },
  {
    url: require('./videos/video2.mp4'),
    profilePic: 'https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/eace3ee69abac57c39178451800db9d5~c5_100x100.jpeg',
    username: 'dailydotdev',
    description: 'Every developer brain #developerjokes #programming',
    song: 'Original sound - Chaplain J Rob',
    likes: '13.4K',
    comments: 3121,
    saves: 254,
    shares: 420,
  },
  {
    url: require('./videos/video3.mp4'),
    profilePic: 'https://p77-sign-va.tiktokcdn.com/tos-maliva-avt-0068/4e6698b235eadcd5d989a665704daf68~c5_100x100.jpeg',
    username: 'wojciechtrefon',
    description: '#programming #softwareengineer #vscode',
    song: 'help so many people are using my sound - Ezra',
    likes: 5438,
    comments: 238,
    saves: 12,
    shares: 117,
  },
  {
    url: require('./videos/video4.mp4'),
    profilePic: 'https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/4bda52cf3ad31c728153859262c329db~c5_100x100.jpeg',
    username: 'faruktutkus',
    description: 'Wait for the end | RTX 4090 TI',
    song: 'Original sound',
    likes: 9689,
    comments: 230,
    saves: 1037,
    shares: 967,
  },
];

function App() {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const videoRefs = useRef([]);

  const [activeIndex, setActiveIndex] = useState(0);

  // Exercise 5: control visibility of user info panel
  const [showPanel, setShowPanel] = useState(false);

  // Drag
  const dragStartY = useRef(null);
  const dragEndY = useRef(null);

  const scrollToVideo = (index) => {
    if (videoRefs.current[index]) {
      videoRefs.current[index].scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      setActiveIndex(index);
    }
  };

  // Load videos
  useEffect(() => {
    setVideos(videoUrls);
    setFilteredVideos(videoUrls); // question 7
  }, []);

  // Intersection Observer
  useEffect(() => {
    if (videos.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.8,
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        const videoElement = entry.target;

        if (entry.isIntersecting) {
          videoElement.play();

          // Update activeIndex when video becomes visible (new code for question 3)
          const index = videoRefs.current.indexOf(videoElement);
          if (index !== -1) setActiveIndex(index);

        } else {
          videoElement.pause();
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    videoRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [videos]);

  // Exercise 5: Show panel automatically when video changes
  useEffect(() => {
    if (videos.length === 0) return;

    // Show panel when a new video becomes active
    setShowPanel(true);

    // Auto-hide after 2 seconds
    const timer = setTimeout(() => setShowPanel(false), 2000);

    return () => clearTimeout(timer);
  }, [activeIndex]);

  // Wheel scroll
  useEffect(() => {
    const handleWheel = (e) => {
      if (e.deltaY > 0) {
        scrollToVideo(Math.min(activeIndex + 1, videos.length - 1));
      } else {
        scrollToVideo(Math.max(activeIndex - 1, 0));
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });

    return () => window.removeEventListener('wheel', handleWheel);
  }, [activeIndex, videos.length]);

  // Exercise 5: Show panel when pressing the Right Arrow key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight") {
        setShowPanel(true);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Drag gesture
  useEffect(() => {
    const handleMouseDown = (e) => {
      dragStartY.current = e.clientY;
    };

    const handleMouseUp = (e) => {
      dragEndY.current = e.clientY;

      if (!dragStartY.current || !dragEndY.current) return;

      const diff = dragStartY.current - dragEndY.current;
      if (Math.abs(diff) >= 40) {
        if (diff > 0) {
          scrollToVideo(Math.min(activeIndex + 1, videos.length - 1));
        } else {
          scrollToVideo(Math.max(activeIndex - 1, 0));
        }
      }

      dragStartY.current = null;
      dragEndY.current = null;
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [activeIndex, videos.length]);

  // Exercise 7: Search videos by hashtag
  const handleSearch = (query) => {
    if (!query.startsWith("#")) {
      query = "#" + query;
    }

    const result = videos.filter((v) =>
      v.description.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredVideos(result);
    setActiveIndex(0);

    if (videoRefs.current[0]) {
      videoRefs.current[0].scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="app">
      <div className="container">
        <TopNavbar onSearch={handleSearch} />

        <UserInfoPanel
          visible={showPanel}
          video={videos[activeIndex]}
        />

        {filteredVideos.map((video, index) => (
          <VideoCard
            key={index}
            {...video}
            autoplay={index === 0}
            setVideoRef={(ref) => (videoRefs.current[index] = ref)}
          />
        ))}

        <BottomNavbar />
      </div>
    </div>
  );
}

export default App;