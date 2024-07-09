import React, {useState, useEffect} from "react";
import "../../assets/styles/Messages.css"
import socket from "../socket/socket";

const Messages = ({roomid}) => {
  const [messageContainer, setMessageContainer] = useState([]);
	const [socketMessages, setSocketMessages] = useState([]);

  console.log(roomid)

  // let socketMessagePool = [];
  useEffect(() => {
	  setSocketMessages([]);
     const url = `https://hagnout-backend.onrender.com/messages/${roomid}`;
    // const url = `http://localhost:5000/messages/${roomid}`

    const results = fetch(url);
    results
      .then((response) => response.json())
      .then((data) => {
        setMessageContainer(data);
      });

	  socket.on("msg", (msgC) => {
      console.log(msgC)
		  setSocketMessages((prevMessages) => [...prevMessages, msgC]);

	  });

	  return () => {
		  socket.off("msg");
	  };
  }, [roomid]);

  console.log(socketMessages)

  return (
    <div className="message--container">
      {messageContainer.map((msg, idx) => (
        <div className="message-container mb-3" key={idx}>
          <div className="profile--username flex">
            <div className="mt-2 profile--picture  h-8 w-8 mr-3 text-white  flex items-center justify-center">
              <img
                src={msg.profile}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="my-auto">
              <div className="user-username my-auto mt-1">{msg.username}</div>
              <div className="message ml-auto ">{msg.messageContent}</div>
            </div>
          </div>
        </div>
      ))}

      {socketMessages.map((msg, idx) => (
         <div className="message-container mb-3" key={idx}>
          <div className="profile--username flex">
            <div className="mt-2 profile--picture  h-8 w-8 mr-3 text-white  flex items-center justify-center">
              <img
                src={msg.profilePic}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="my-auto">
              <div className="user-username my-auto mt-1">{msg.username}</div>
              <div className="message ml-auto ">{msg.messageContent}</div>
            </div>
          </div>
          </div>
      ))}
    </div>
  );
}


export default Messages;
