import CreateRoomForm from "./CreateRoomForm";
import "./index.css";
import JoinRoomForm from "./JoinRoomForm";

const Forms  = ({uuid, socket, setUser}) => {
    return (
    <div className="row h-100 pt-5 mainpage ">
        <div className="form-box col-md-4 py-3 px-5 mt-5 mx-auto border rounded-2 border-2 d-flex flex-column align-items-center"
        
        >
            <h1>Join Room</h1>
            <JoinRoomForm uuid = {uuid} socket = {socket} setUser = {setUser} />
        </div>
        <div className="form-box col-md-4 py-3 px-5 mt-5 mx-auto border rounded-2 border-2 d-flex flex-column align-items-center">
            <h1>Create Room</h1>
            <CreateRoomForm uuid = {uuid} socket = {socket} setUser = {setUser} />
        </div>
    </div>
        
);

};

export default Forms;