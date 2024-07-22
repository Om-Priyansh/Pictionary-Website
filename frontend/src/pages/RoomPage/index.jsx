import WhiteBoard from "../../components/Whiteboard";
import Chat from "../../components/ChatBar";
import "./index.css";
import {useReducer, useState, useEffect} from "react";
import { useRef } from 'react';
import UserBar from "../../components/UserBar"


const RoomPage = ({user, socket, users, word,wordToGuess}) => {

    const canvasRef = useRef(null);
    const ctxRef = useRef(null);

    

    // console.log(word);

    const [tool, setTool] = useState("pencil");
    const [color, setColor] = useState("#000000");
    

    const [elements, setElements] = useState([]);
    const [history, setHistory] = useState([]);

    const [ colorUser, setColorUser] = useState("grey");

    let dashes = word.split('').map(char => '-').join('');
    // console.log(word, dashes);

    // const [openedUserTab, setOpenedUserTab] = useState(false);


    useEffect(()=>{
        return () =>{
            socket.emit("userLeft", user);
        };
    },[]);


    const handleUndo = () =>{
        
        setHistory((prevHistory) => [...prevHistory, elements[elements.length-1]]);
        setElements((prevElements) => prevElements.slice(0, prevElements.length -1));
        // console.log(elements, history);

    }

    const handleRedo = () =>{
                
        setElements((prevElements) => [...prevElements, history[history.length-1]]);
        setHistory((prevHistory) => prevHistory.slice(0, prevHistory.length -1));
        // console.log(elements, history);
        
    }

    const handleClearCanvas = () => {

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.fillRect = "white";
        ctx.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
        );

    

        
        setElements([]);
        setHistory([]);

        // console.log(elements, history);
    };

    function HandleName(){
        
        users.map((usr, index) => {
            
            
            if(user && user.userId == usr.userId){
                
                return (
                <p id = "user" key = {index*999} 
                    className="my-2 w-100 text-center border border-rounded p-2" 
                    style ={{background: colorUser}}>

                        {usr.name} 
                        {user && user.userId == usr.userId && "(You)"}
                        
                        </p>);
            }
            else{
                
                return(<p id = "user" key = {index*999} 

                    className="my-2 w-100 text-center border border-rounded p-2">
                        {usr.name} 
                        </p>)
            }
        }
        )

    }

    const handleChangePres = () => {
        user.presenter = true;
        console.log(user);
    };

    // const canvas = canvasRef.current;
    // const ctx = canvas.getContext("2d");
    // ctx.fillRect = "white";
    
    return (
        <div className="row-mid">
            
            <h1 className="text-center py-2">Pictionary App <span className="text-primary">[Players Playing : {users.length}]</span></h1>
            {/* <div className="col-md-12 gap-3 px-5 mt-4 mb-5 d-flex align-items-center justify-content-around"> */}
                {/* // <div className="d-flex col-md-4 justify-content-between">
                //     <input type="radio" name = "tool" value="pencil" onChange = {(e)=>setTool(e.target.value)} />
                // </div> */}
            
        <div className="d-flex mx-auto">

                <div className="col-sm overflow-hidden text-white bg-black col-md-1 order flex-fill text-center">All Users
                    <div className="w-100 mt-2">
                    {
                        users.map((usr, index) => (
                            <>
                            
                            {user && user.userId == usr.userId && "(You)"  &&<p id = "user" key = {index*999 } 

                        className="my-2 w-100 text-center border border-rounded p-2" 

                        style ={{background: colorUser}}>
                            {usr.name} 
                            {user && user.userId == usr.userId && "(You)"}
                            
                            </p>}
                            
                            {user && user.userId != usr.userId && usr.name &&                             <p id = "user" key = {index*999} 

className="my-2 w-100 text-center border border-rounded p-2" 

style ={{background: "grey"}}
>
{user && user.userId != usr.userId && usr.name} 

</p>}

                            </>
                            ))
                    }   
                    </div>
                </div>
                <div className="col-md-6 overflow-hidden d-flex flex-column align-items-center flex-shrink-0">
                {user?.presenter && (  
                    <div className="d-flex m-0 align-items-center justify-content-between col-md-6">
                        <div className="d-flex align-items-center">
                            <label htmlFor="color">Select Color:</label>
                            <input type = "color" id = "color" className="mt-1 ms-3" value = {color} onChange = {(e)=>setColor(e.target.value)} />
                        </div>
                        <div className="col-md-5 gap-1 d-flex">
                            <button className="btn btn-primary mt-1" disabled = {elements.length == 0} onClick={() => handleUndo()}>
                                
                                Undo</button>
                            <button className="btn btn-outline-primary mt-1" disabled = {history.length < 1} onClick={handleRedo}>
                                
                                Redo</button>
                            <button className="btn btn-danger mt-1" onClick={handleClearCanvas}>Clear Canvas</button>
                        </div>
                    </div>
                    )}
                
                <div className=" col-md-10 m-0 mt-4 canvas-box flex-fill">
                    <WhiteBoard canvasRef = {canvasRef}
                    ctxRef = {ctxRef}
                    elements = {elements}
                    setElements = {setElements}
                    color = {color}
                    handleClearCanvas
                    user = {user}
                    socket = {socket}
                    />
                </div>
                </div>
                <div className="col-sm
                // text-white bg-dark overflow-hidden col-md-1 h-70 flex-fill
                ">
                <Chat user = {user} socket = {socket} setColorUser = {setColorUser} colorUser = {colorUser} word = {word} wordToGuess = {wordToGuess} />
                </div>
        </div>
        
        <h1 className="text-center py-2">
            <span className="text-primary">
                
                {user?.presenter ? <span>Your word is: {word}</span> : <span>Guess!</span>}
                
                </span></h1>

        {/* <button className="btn btn-primary btn-sm" type = "button" onClick={handleChangePres}>
            Change Pres
        </button> */}

        </div>
        
        
    )
}

export default RoomPage;