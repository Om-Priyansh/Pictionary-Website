import { useState, useRef, useEffect } from "react";
import {toast, ToastContainer} from 'react-toastify';


const Chat = ({user,socket, setColorUser, colorUser, word, wordToGuess}) => {
    

    // var randomWord = word;
    const [chat, setChat] = useState([]);
    const [message, setMessage] = useState("");
    
    useEffect(()=>{
        socket.on("messageResponse", (data)=>{
            // console.log("yes3");
            setChat((prevChats) => [...chat, data]);
        });
    },[]);

    const handleSubmit = (e) => {
        
        e.preventDefault();
        socket.emit('guessWord', message, user);
    //     console.log(colorUser);
    //     console.log(wordToGuess);
    //     if(!user?.presenter){
    //         if(message == wordToGuess){
    //             // var element = document.getElementById("users");
    //             // element.classList.add("right-guess");
    //             console.log("right guezs");
    //             toast.info(`Guessed the Word!`);
    //             socket.emit("rightGuess");
    //             setColorUser("green");
    //         }else{
    //             console.log("not right guess");
    //         }
    // }

        if(message.trim() != ""){
            // console.log("yes");
            socket.emit("message", {message});
            
            setChat((prevChats)=>[...chat, {message, name: "You" }]);
            setMessage("");
        };
        
    };


    return (
    <div style = {{height:"100%"}}>
        <div className="w-100 m-1 p-2 border border-1 border-white rounded-3" style = {{height:"80%"}}>
            
            {
                chat.map((msg, index) => (
                    <p key = {index*999} className="my-2 text-center w-100">
                        {msg.name}: {msg.message}
                    </p>
                ))
            }
        </div>
        <form onSubmit={handleSubmit} className="w-100 mt-5 d-flex text-white rounded-3">
            <input type ="text" placeholder="Enter Message" className="h-100 border-0 text-white"
            style= {{
                "background-color":"transparent",
                width:"90%",
            }} 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            />
            <button type = "submit" onSubmit={handleSubmit} className="btn btn-primary rounded-2">Send</button>

        </form>
    </div>);
};

export default Chat;