import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateRoomForm = ({uuid, socket, setUser}) =>{

    const[roomId, setRoomId] = useState(uuid());
    
    const [name, setName] = useState("");

    const navigate = useNavigate();

    socket.on("createNewRoomNow", (users, userToPres) => {
        // e.preventDefault();

        
        const newRoomId = roomId+"&";
        
        console.log("users",users);
        users.map((usr, index) => {
            console.log("usr",usr);
            
            const {name, prvRoomId, userId, host, presenter} = usr;
            
            if(usr == userToPres){
                const roomData = { name, newRoomId, userId, host: true, presenter: true,};
                setUser(roomData);
                navigate(`/${roomId}`);
                console.log(roomData);
                socket.emit("userJoined", roomData);
            }
            else{
                const roomData = { name, newRoomId, userId, host: false, presenter: false};
                setUser(roomData);
                navigate(`/${roomId}`);
                console.log(roomData);
                socket.emit("userJoined", roomData);
            }
        })

        // {name, roomId, userId, host, presenter}

        const roomData = { name, roomId, userId: uuid(), host: true, presenter: true,};
        setUser(roomData);
        navigate(`/${roomId}`);
        // console.log(roomData);
        socket.emit("userJoined", roomData);
    });

    const handleCreateRoom = (e) => {
        e.preventDefault();

        // {name, roomId, userId, host, presenter}

        const roomData = { name, roomId, userId: uuid(), host: true, presenter: true,};
        setUser(roomData);
        navigate(`/${roomId}`);
        // console.log(roomData);
        socket.emit("userJoined", roomData);
    }

    return(
        <form className="form col-md-12 mt-5">
            <div className="form-group">
            <input type = "text" className="form-control my-2" placeholder="Enter your Name" value = {name} onChange={ (e) => setName(e.target.value)}></input>
            </div>
            <div className="form-group">
                
                <div className="input-group-append d-flex gap-1">
                    <button className="btn btn-primary btn-sm" type = "button" onClick={() => setRoomId(uuid)}>
                        Generate Room Code          
                    </button>
                    <button className="btn btn-outline-danger btn-sm" type = "button">Copy</button>
                </div>
                <div className="input-group d-flex">
                    <input type = "text" className="form-control my-2" disabled placeholder="Room Code Appears Here" value = {roomId}></input>
                </div>
            </div>
        <button type = "submit" onClick={handleCreateRoom} className="mt-4 btn-primary btn-block form-control">Generate Room</button>
        </form>
    );
};

export default CreateRoomForm;