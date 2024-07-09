// import React, {useState} from 'react';
// import '../../assets/styles/MusicPlayer.css'; // Don't forget to create a CSS file for styling
// import { FaSearch, FaMusic } from 'react-icons/fa'; // Import icons from react-icons library

// const MusicPlayer = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [currentSong, setCurrentSong] = useState(null);
//   const [isPlaying, setIsPlaying] = useState(false);

//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   const handlePlayPause = () => {
//     setIsPlaying(!isPlaying);
//   };

//   const handleSongSelect = (song) => {
//     setCurrentSong(song);
//     setIsPlaying(true); // Auto-play selected song
//   };

//   return (
//     <div className="music--player--container">
//       <div className="topBar">
//         <div className="searchBar pl-4">
//           <FaSearch />
//            <input
//             type="text"
//             placeholder="Search"
//             value={searchQuery}
//             onChange={handleSearchChange}
//           />
//         </div>
//         <div className="localMusicIcon pr-4">
//           <FaMusic />
//         </div>
//       </div>
//       <div className="content">
//         {/* Content of the music player */}
//          {/* Placeholder for music player */}
//         {currentSong && (
//           <div className="musicPlayer">
//             <div className="songInfo">
//               <div>{currentSong.title}</div>
//               <div>{currentSong.artist}</div>
//             </div>
//             <div className="controls">
//               <button onClick={handlePlayPause}>
//                 {isPlaying ? 'Pause' : 'Play'}
//               </button>
//             </div>
//           </div>
//         )}
//         {/* Placeholder for search results */}
//         {searchQuery && (
//           <div className="searchResults">
//             {/* Display search results here */}
//             <div className="song" onClick={() => handleSongSelect({ title: 'Song 1', artist: 'Artist 1' })}>
//               Song 1 - Artist 1
//             </div>
//             <div className="song" onClick={() => handleSongSelect({ title: 'Song 2', artist: 'Artist 2' })}>
//               Song 2 - Artist 2
//             </div>
//             <div className="song" onClick={() => handleSongSelect({ title: 'Song 3', artist: 'Artist 3' })}>
//               Song 3 - Artist 3
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MusicPlayer;








import React, { useState } from "react";
import '../../assets/styles/MusicPlayer.css';


const MusicPlayer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tracks, setTracks] = useState([
    { id: 1, title: "Song 1", artist: "Artist A", duration: "3:30" },
    { id: 2, title: "Song 2", artist: "Artist B", duration: "4:15" },
    { id: 3, title: "Song 3", artist: "Artist C", duration: "2:50" },
    { id: 4, title: "Song 4", artist: "Artist D", duration: "3:10" },
    { id: 5, title: "Song 5", artist: "Artist E", duration: "4:00" },
    { id: 6, title: "Song 6", artist: "Artist F", duration: "3:45" },
    { id: 7, title: "Song 7", artist: "Artist G", duration: "3:20" },
  ]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // Implement search functionality here based on searchTerm
  };

  return (
    <div className="music-player">
      {/* Top Bar with Search */}
      <div className="top-bar">
        <div className="logo">
          <img
            src="https://www.freepnglogos.com/uploads/spotify-logo-png/file-spotify-logo-png-4.png"
            alt="Spotify Logo"
          />
        </div>
        <input
          type="text"
          placeholder="Search for music..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Tracks List */}
        <div className="tracks">
          <h2>Tracks</h2>
          <div className="track-list">
            {tracks.map((track) => (
              <div key={track.id} className="track">
                <div className="track-info">
                  <h3>{track.title}</h3>
                  <p>{track.artist}</p>
                </div>
                <div className="track-duration">{track.duration}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Player Controls and Current Track */}
      <div className="player-controls">
        <div className="current-track">
          <h2>Now Playing</h2>
          <p>Song Title - Artist</p>
        </div>
        <div className="controls">
          <button className="control-btn">
            <i className="fas fa-backward"></i>
          </button>
          <button className="control-btn play-pause-btn">
            <i className="fas fa-play"></i>
          </button>
          <button className="control-btn">
            <i className="fas fa-forward"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
