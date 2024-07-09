import React, { useState, useEffect } from "react";
import { TbSquareRoundedPlus, TbSettings } from "react-icons/tb";
import "../../assets/styles/Rooms.css";
import CreateRoom from "./CreateRoom";
import { createPortal } from "react-dom";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";

const Rooms = () => {
  const navigate = useNavigate();
  const cookies = new Cookies();

  // getting username from cookies
  const username = cookies.get("username");
  const profilePic = cookies.get("profilePic");
  const [rooms, setRooms] = useState([]);
  const [searchedRooms, setSearchedRooms] = useState([]);
  const [joinText, setJoinText] = useState("Join");
  const [fetchComplete, setFetchComplete] = useState(false);
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);

  // for searching room with name
  const [roomName, setRoomName] = useState("");

  const handleChangeRoomName = (e) => {
    setRoomName(e.target.value);
  };

  // search room 
  const handleSearchRoom = async (e) => {
    e.preventDefault();
    const url = "https://hagnout-backend.onrender.com/rooms/search-room";
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roomName }),
    })
      .then((response) => response.json())
      .then((data) => {
        const room = rooms.find((r) => r.roomName === roomName);
        if (room) {
          setJoinText("Joined");
        } else {
          setJoinText("Join");
        }
        setSearchedRooms(data);
      });
  };

  // Fetch rooms the user has joined
  useEffect(() => {
    const url = "https://hagnout-backend.onrender.com/rooms/fetch-rooms";
    async function fetchRooms() {
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username }),
      })
        .then((response) => response.json())
        .then((data) => {
          setRooms(data);
          setFetchComplete(true);
        });
    }
    fetchRooms();
  }, [username]);

  if (fetchComplete) {
    window.location.reload(); // Reload the page once fetch is complete
    window.stop();
  }


  // Join room function. When user clicks join then this func is called 
  const joinRoomHandler = async (roomId) => {
    const url = "https://hagnout-backend.onrender.com/rooms/join-room";
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roomId: roomId,
        username: username,
        userId: cookies.get("senderId"),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        setJoinText("Joined");
      });
  };

  const goToChatRoom = (roomid, roomName) => {
    navigate(`room/${roomName}/${roomid}`);
  };

  return (
    <div className="rooms-container grid grid-rows-12">
      <div className="search--room row-span-1 my-auto">
        <form
          method="post"
          className="search--room p-2"
          onSubmit={handleSearchRoom}
        >
          <input
            type="text"
            placeholder="Type room name and hit enter"
            value={roomName}
            onChange={handleChangeRoomName}
            className="px-3"
          />
        </form>
      </div>

      <div className="rooms row-span-10">
        <div className="searched--rooms">
          {searchedRooms.map((room, index) => (
            <div
              key={index}
              className=""
              onClick={() => goToChatRoom(room._id, room.roomName)}
            >
              <div className="join--room flex justify-between m-2 p-2">
                <div className="room px-1 my-auto">{room.roomName}</div>

                <button
                  className="join--button py-1 px-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    joinRoomHandler(room.roomId);
                  }}
                >
                  {joinText}
                </button>
              </div>
            </div>
          ))}
        </div>
        {rooms.map((room, index) => (
          <div
            key={index}
            className=""
            onClick={() => goToChatRoom(room._id, room.roomName)}
          >
            <div className="room m-2 p-3 cursor-pointer">{room.roomName}</div>
          </div>
        ))}
      </div>

      <div className="flex justify-between p-2">
        <div className="username flex py px-1">
          <div className="mt-2 profile--picture  h-12 w-12 mr-3 text-white text-2xl flex items-center justify-center">
            <img
              src={profilePic}
              alt="avatar"
className="w-full h-full object-cover"
            />
          </div>
          <div className="username my-auto">{username}</div>
        </div>

        <div className="add--settings flex p-4 px-1">
          <div className="add--room my-auto">
            <TbSquareRoundedPlus
              className="add mx-2 cursor-pointer text-3xl"
              onClick={() => setShowCreateRoomModal(true)}
            />
            {showCreateRoomModal &&
              createPortal(
                <CreateRoom onClose={() => setShowCreateRoomModal(false)} />,
                document.body
              )}
          </div>

          <TbSettings className="settings mx-2 cursor-pointer my-auto text-3xl" />
        </div>
      </div>
    </div>
  );
};

export default Rooms;

