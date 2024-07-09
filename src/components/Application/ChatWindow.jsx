import React, {useState} from 'react';
import { useParams } from 'react-router-dom';
import '../../assets/styles/ChatWindow.css'
import { TbDotsVertical  } from "react-icons/tb";
import EmojiPicker from 'emoji-picker-react';
import Messages from './Messages';
import Cookies from 'universal-cookie';
import socket from '../socket/socket.js';

import {storage} from '../../firebase/firebase.config.js'
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage';

const ChatWindow = () => {
	const cookie = new Cookies();
	const { roomid, roomName } = useParams();

  // Message state
	const [messageContent, setMessageContent] = useState('');

  // Toggle emoji picker
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
	const [fileUrl, setFileUrl] = useState('');

	const appendEmoji = (emoji) => {
		let message = messageContent;
		setMessageContent(message + emoji.emoji);
	}

	const toggleEmojiPicker = () => {
		setShowEmojiPicker(!showEmojiPicker);
	};


  // handle uploaded files
  const handleFileAttach = (e) => {
     const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setFilePreview(null);
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
  };

  const uploadFile = () => {
    const file = selectedFile;
    const folder = file.type.startsWith('image/')? 'images' : 'videos'
    if (file) {
      const storageRef = ref(storage,`${folder}/${selectedFile.name}` );

      // 'file' comes from the Blob or File API
      uploadBytes(storageRef, file).then((snapshot) => {
        console.log("Uploaded a blob or file!");
      });

      getDownloadURL(ref(storage, `${folder}/${selectedFile.name}` ))
        .then((url) => {
         
          console.log()
          // This can be downloaded directly:
          const xhr = new XMLHttpRequest();
          xhr.responseType = "blob";
          xhr.onload = (event) => {
            const blob = xhr.response;
          };
          xhr.open("GET", url);
          xhr.send();
			console.log(url);
			setFileUrl(url);
        })
        .catch((error) => {
          // Handle any errors
        });
    }
    return fileUrl;
  };


	// this function is called on submit
	const handleSubmitMessage = async (e) => {

		e.preventDefault();

		if(messageContent.length > 0 || selectedFile!= null){
			if(selectedFile) {
				uploadFile();
			}

			// make an API call for sending message
			const url= "https://hagnout-backend.onrender.com/messages/send";

			await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					messageContent: messageContent,
					file: fileUrl,
					senderId: cookie.get("senderId"),
					roomId: roomid
				})		
			}).then((response) => {
				// send real time message to the server 
				socket.emit("msg", {
					messageContent: messageContent,
					username: cookie.get("username")
				});
				setMessageContent('');
				return  response.json();
			}).then((data) => {
				console.log(data.message);
			})
		}
	};

	const handleMessageChange = (e) => {
		e.preventDefault();
		setMessageContent(e.target.value);
	}

	// To format the date
	const formatDate = (dateString) => {
		const options = { hour: '2-digit', minute: '2-digit' };
		return new Date(dateString).toLocaleTimeString([], options);
	};

	return (
    <div className="message--container grid grid-rows-12 ">
      <div className="top--bar my-auto px-4 row-span-1 flex ">
        <div className="text-2xl font-bold w-full room--name my-auto">
          <span className="tag">#</span>
          {roomName}
        </div>

        <div className="search--message more--options w-full flex justify-between">
          <input
            type="text"
            className=" my-auto px-3 py-2 text-white"
            placeholder="Search message"
          />
          <TbDotsVertical className=" text-3xl my-auto more--options" />
        </div>
      </div>

      <div className="message--pool row-span-10 p-4">
        <Messages roomid={roomid} />
      </div>

      <div className="message--input row-span-1 px-4 ">
        <div className="message--field  w-full py-4">
          <form action="" onSubmit={handleSubmitMessage}>
            <input
              type="text"
              onChange={handleMessageChange}
              value={messageContent}
              className="w-full px-3 py-2 text-white"
              placeholder={`#Type your message and hit enter`}
            />
            <span
              className="emoji-picker-icon absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={toggleEmojiPicker}
            >
              😀
            </span>
          </form>
          {showEmojiPicker && (
            <div className="emoji-picker-container absolute right-0 bottom-full mb-2">
              <EmojiPicker theme="dark" onEmojiClick={(e) => appendEmoji(e)} />
            </div>
          )}
        </div>
      </div>

      {/* <div className="message-input row-span-1 px-4 relative">
        {filePreview && (
          <div className="file-preview-container absolute bottom mb-2">
            <img
              src={filePreview}
              alt="File preview"
              className="file-preview-image"
            />
            <button onClick={handleRemoveFile} className="remove-file-button">
              Remove
            </button>
          </div>
        )}
        <div className="message-field w-full py-4 relative">
          <form action="" onSubmit={handleSubmitMessage}>
            <div className="input-container relative w-full">
              <span className="file-attach-icon absolute left-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
                📎
                <input
                  type="file"
                  className=" absolute left-0 top-0 opacity-0 cursor-pointer w-full h-full"
                  onChange={handleFileAttach}
                />
              </span>
              <input
                type="text"
                onChange={handleMessageChange}
                value={messageContent}
                className="message--input w-full pl-10 pr-10 py-2 text-white"
                placeholder={`#Type your message and hit enter`}
              />
              <span
                className="emoji-picker-icon absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={toggleEmojiPicker}
              >
                😀
              </span>
            </div>
          </form>
          {showEmojiPicker && (
            <div className="emoji-picker-container absolute right-0 bottom-full mb-2">
              <EmojiPicker theme="dark" onEmojiClick={(e) => appendEmoji(e)} />
            </div>
          )}
        </div>
      </div> */}
    </div>
  );
};

export default ChatWindow;
