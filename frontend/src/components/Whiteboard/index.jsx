import { useEffect, useLayoutEffect, useState } from 'react';
import rough from 'roughjs';

const roughGenerator = rough.generator();

const WhiteBoard = ({canvasRef, ctxRef, elements, setElements, color, user, socket}) => {
    

    const[img,setImg] = useState(null);


useEffect(()=>{
    socket.on("whiteboardDataResponse", (data)=>{
        setImg(data.imgURL);
    });
},[]);
// console.log("User:", user);
// console.log("User presenter:", user?.presenter);

    if (!user || !user.presenter){
        // console.log("not pres");
        return(
            
            <div   
            // onMouseDown={handleMouseDown}
            // onMouseMove={handleMouseMove}
            // onMouseUp={handleMouseUp}
            className="border border-dark w-100 overflow-hidden " style={{height:"500px", background:"white"}}>
            
            {/* <canvas ref = {canvasRef} /> */}
            <img src ={img} alt = "Whiteboard shared by presenter"
            // className='w-100' 
            />
            </div>
        )
    }


    
const [isDrawing, setIsDrawing] = useState(false);


    useEffect (() => {
        const canvas = canvasRef.current;
        canvas.height = window.innerHeight*0.6;
        canvas.width = window.innerWidth;
        const ctx = canvas.getContext("2d");

        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.lineCap = "round";

        ctxRef.current = ctx;
    }, []);

    useEffect(() =>{
        ctxRef.current.strokeStyle = color;
    }, [color]);

    useLayoutEffect(() => {
        if (canvasRef){
        const roughCanvas = rough.canvas(canvasRef.current);

        elements.forEach((element) => {
            roughCanvas.linearPath(element.path, {
                stroke: element.stroke,
                strokeWidth: 5  ,
                roughness: 0,
            });
        })

        const canvasImage = canvasRef.current.toDataURL();
        socket.emit("whiteboardData", canvasImage);
        // console.log(canvasImage);
    }

    }, [elements])


    // useEffect(() => {});

    const handleMouseDown = (e) => {
        // console.log("mouse down", e);
        setIsDrawing(true);
        const {offsetX, offsetY} = e.nativeEvent;

        setElements((prevElements) => [
            ...prevElements,
            {
                type:"pencil",
                offsetX,
                offsetY,
                path: [[offsetX,offsetY]],
                stroke: color,
            },
        ]);

        
        // console.log(offsetX, offsetY);
    }
    const handleMouseUp = (e) => {
        // console.log("mouse up", e);
        setIsDrawing(false);
    }
    const handleMouseMove = (e) => {
        // console.log("mouse move", e);
        const {offsetX, offsetY} = e.nativeEvent;
        if (isDrawing){
        // console.log(offsetX, offsetY);
        const {path} = elements[elements.length -1];
        const newPath = [...path, [offsetX, offsetY]]

        setElements((prevElements) => 
            prevElements.map((ele,index) => {
                if(index == elements.length -1){
                    return{
                        ...ele,
                        path: newPath,
                    };
                }else{
                    return ele;
                }
            })
        );

        
        }


    };



    return (
    <div   
    onMouseDown={handleMouseDown}
    onMouseMove={handleMouseMove}
    onMouseUp={handleMouseUp}
    className="border border-dark  w-100 overflow-hidden">
    
    <canvas ref = {canvasRef} />
    
    </div>
    )
}

export default WhiteBoard