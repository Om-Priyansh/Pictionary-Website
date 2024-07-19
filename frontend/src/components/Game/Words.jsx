const words = () =>{
    const words = [
        "apple",
        "bicycle",
        "cat",
        "dog",
        "elephant",
        "flower",
        "guitar",
        "house",
        "ice cream",
        "jacket",
        "kite",
        "lamp",
        "moon",
        "notebook",
        "octopus",
        "pencil",
        "queen",
        "rainbow",
        "sun",
        "tree"
    ];

    function getRandomWord() {
        const randomIndex = Math.floor(Math.random() * words.length);
        return words[randomIndex];
    }
    

}



export default words;