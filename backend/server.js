const express = require("express");
const app = express();

const server = require("http").createServer(app);
const { Server } = require("socket.io");

const {addUser, getUser, removeUser} = require("./utils/users.js");

const io = new Server(server);

const words = [
    "apple", "bicycle", "cat", "dog", "elephant", "flower", "guitar", "house",
    "ice cream", "jacket", "kite", "lamp", "moon", "notebook", "octopus",
    "pencil", "queen", "rainbow", "sun", "tree"
];

const rooms = {};

function getRandomWord() {
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
}

// routes
app.get("/", (req,res) => {
    // res.send("Server");
    return res.status(234).send("HEloooo");
});

const ROUND_DURATION = 60; // in seconds

let roomIdGlobal ,imgURLGlobal;

io.on("connection", (socket) => {
    // console.log("User connected");
    socket.on("userJoined",(data) => {
        const {name, userId, roomId, host, presenter} = data;
        roomIdGlobal = roomId;
        socket.join(roomId);
        const users = addUser({name, userId, roomId, host, presenter, socketId:socket.id});


        
        if(data.presenter){
            const word = getRandomWord();
            rooms[roomId] = {
                word,
                gameActive: true,
                timeLeft: ROUND_DURATION,
                presenterId: socket.id
            };

            console.log(word);
            socket.emit('wordToDraw', word); // Send the word to the drawer
            socket.broadcast.to(roomId).emit('wordToDraw', word); // Notify others that the drawer is ready
        };
        
        socket.on('guessWord', (guess, user) => {
            // const word = rooms[roomIdGlobal].word;
            const { word, gameActive, presenterId } = rooms[roomId];

            if (!gameActive || !word) return; // Check if game is active

            // console.log(word, guess);
            if (guess.toLowerCase() == word) {
                console.log("correct");
                io.to(roomId).emit('correctGuess', user.name); // Notify all users of the correct guess

                // Update presenter

                // io.to(roomId).emit("createNewRoomNow", users, user);
                
                // io.to(roomId).emit("changePresenter", user);

                // console.log("user who guessed before:", user);
                // user.presenter = true;
                // console.log("user who guessed after:", user);

                // const prvUserId = rooms[roomId].presenterId;
                
                
            // rooms[roomId].presenterId = socket.id;
            // rooms[roomId].gameActive = false; // Stop the current round
            // const newWord = getRandomWord(roomId);
            // rooms[roomId].word = newWord;

                console.log(users);

            // // Notify new presenter with the new word
            // io.to(roomId).emit('newPresenter', socket.id); // Notify all users about the new presenter
            // io.to(socket.id).emit('wordToDraw', newWord); // Send the new word to the new presenter

            } else {
                socket.emit('wrongGuess', word); // Notify the guesser that their guess is wrong
            }
        });

        socket.emit("userIsJoined", {success:true, users});
        socket.broadcast.to(roomId).emit("userJoinedMessageBroadcasted", name);
        socket.broadcast.to(roomId).emit("allUsers", users);
        socket.broadcast.to(roomId).emit("whiteboardDataResponse", {imgURL: imgURLGlobal,})
    });

    socket.on("startRound", () => {
        const user = getUser(socket.id);
        if (!user || !user.host) return;
        const roomId = user.roomId;
        if (rooms[roomId]) {
            rooms[roomId].gameActive = true;
            rooms[roomId].timeLeft = ROUND_DURATION; // Reset timer for the new round
            startRoundTimer(roomId);
        }
    });

    socket.on("whiteboardData", (data) => {
        imgURLGlobal = data;
        socket.broadcast.to(roomIdGlobal).emit("whiteboardDataResponse", {imgURL: data,})
    });

    socket.on("rightGuess", () => {
        socket.broadcast.to(roomIdGlobal).emit("rightGuessBroadcasted");
    })

    socket.on("message", (data) =>{
        // console.log(socket.id);
        const {message} = data;
        const user = getUser(socket.id);
        if (user)
            {
            // console.log("yes2-4");
            socket.broadcast.to(roomIdGlobal).emit("messageResponse", {message, name:user.name});
        }
    })

    socket.on("disconnect", () =>{
        const user = getUser(socket.id);
        
        
        if(user){
            removeUser(socket.id);
            console.log("user left");
            
            socket.broadcast.to(roomIdGlobal).emit("userLeftMessafeBroadcasted", user.name)
            }
        
    });
})

const port = process.env.PORT || 5000;

server.listen(port, () => console.log("server is running on http://localhost:5000"))