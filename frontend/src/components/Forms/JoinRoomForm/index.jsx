import { useState } from "react";
import { useNavigate } from "react-router-dom";

const JoinRoomForm = ({uuid, socket, setUser}) =>{

    const [roomId, setRoomId ] = useState("");
    const [name, setName] = useState("");
    
    const navigate  = useNavigate();

    const handleRoomJoin = (e) => {
        e.preventDefault();
        const roomData = { name, roomId, userId: uuid(), host: false, presenter: false};
        
        setUser(roomData);
        navigate(`/${roomId}`);
        // console.log(roomData);
        socket.emit("userJoined", roomData);
    }

    return(
        <form className="form col-md-12 mt-5">
            <div className="form-group">
            <input type = "text" className="form-control my-2" placeholder="Enter your Name" value = {name} onChange={(e) => setName(e.target.value)}></input>
            <input type = "text" className="form-control my-2" placeholder="Enter Room Code" value = {roomId} onChange={(e) => setRoomId(e.target.value)}></input>
            </div>

        <button type = "submit" className="mt-4 btn-primary btn-block form-control" onClick={handleRoomJoin}>Join Room</button>
        </form>
    );
};

export default JoinRoomForm;