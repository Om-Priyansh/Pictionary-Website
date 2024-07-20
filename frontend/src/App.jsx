import Forms from './components/Forms';
import {Route, Routes} from "react-router-dom";

import {toast, ToastContainer} from 'react-toastify';

import "./App.css";
import RoomPage from './pages/RoomPage';

import io from "socket.io-client";
import { useEffect, useState } from 'react';

const server = "http://localhost:3000";
const connectionOptions = {
  "force new connection":true,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
};

const socket = io(server, connectionOptions);


const App = () =>{

  const colors = {"bg-color":"#D2FDFF"}

  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

  const [wordToDraw, setWordToDraw] = useState("");
  const [wordToGuess, setWordToGuess] = useState("");
  
  useEffect(() => {


    
    socket.on("userIsJoined", (data) => {
      if(data.success){
        console.log("userJoined");
        setUsers(data.users);
      }
      else{
        console.log("error");
      }
    });

    socket.on("allUsers", data => {
      setUsers(data);
    })

    socket.on("userJoinedMessageBroadcasted", (data) => {
      // console.log(`${data} joined the game`);
      toast.info(`${data} joined the game`);
    });

    socket.on("userLeftMessafeBroadcasted", (data) =>{
      toast.info(`${data} left  the game`);
    });

    socket.on('wordToDraw', (word) => {
      setWordToDraw(word);
      // setWordToGuess(word);
      // console.log("wordtoguess:",wordToGuess);
  });

  socket.on("changePresenter", (userToSetPres)=>{
    console.log("ye");

  })

    socket.on('drawerReady', (word) => {
        toast.info('The drawer is ready! Wait for the drawing to start.');
        setWordToGuess(word);
      console.log("wordtoguess:",wordToGuess);

    });

    socket.on("correctGuess", (name) => {
      // console.log(name);
      
      toast.info(`${name} guessed the word correctly!`)
      // setUsers()
      ;
  });

  socket.on("wrongGuess", (word) => {
      toast.info('Wrong guess, try again!');
      // toast.info(`The word is: ${word}`)
  });


  }, []);


  const uuid = () => {
    var S4 = () => {
      return ((1+ Math.random())*0x10000 | 0).toString(16).substring(1);
    };
    return (
      S4() +
      "-"+
      S4() 
    );
  }
  return(
    <div>
      <ToastContainer />
      <Routes>
        <Route path = "/" element = {<Forms uuid = {uuid} socket = {socket} setUser = {setUser} />} />
        <Route path = "/:roomId" element = {<RoomPage user = {user} socket = {socket} users = {users} word = {wordToDraw} wordToGuess = {wordToGuess} />} />
      </Routes>
    </div>
  );
};
export default App
