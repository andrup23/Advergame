import React from 'react'
import { useState, useEffect, forwardRef, useRef, useImperativeHandle } from 'react';
import './Timer.css';

const Timer = forwardRef(({ seconds, setTimeFinalized,/*  pauseInRec */}, ref) => {
    const [timeLeft, setTimeLeft] = useState(seconds);
    const [minutos, setMinutos] = useState(Math.floor((seconds / (60)) % 60));
    const [segundos, setSegundos] = useState(Math.floor((seconds) % 60));
    const [paused, setPaused] = useState(false);
    //const [srcIcon, setSrcIcon] = useState("pausa.png");
    
  
    useEffect(() => {
      if (!timeLeft){
        setTimeFinalized(true)
        return;
      } 

      const intervalId = setInterval(() => {
        if(!paused){
          setTimeLeft(timeLeft - 1);
          setMinutos(Math.floor(((timeLeft-1) / (60)) % 60));
          setSegundos( Math.floor((timeLeft-1) % 60));
        }
        
      }, 1000);
  
      return () => clearInterval(intervalId);

    }, [timeLeft]);

    /* const pauseTime = ()=>{
      if(paused){
        setTimeLeft(timeLeft-1);
        setPaused(false)
        setSrcIcon("pausa.png")
      }else{
        setTimeLeft(timeLeft+1);
        setPaused(true)
        setSrcIcon("play.png")
        //stop recording
        pauseInRec()
      }
  } */

  useImperativeHandle(ref, () => ({
    reiniciar: ()=> {
      setTimeLeft(seconds)
      setMinutos(Math.floor(((seconds-1) / (60)) % 60));
      setSegundos( Math.floor((seconds-1) % 60));
        /* setPlaying(true);
        videoRef.current.play(); */
    },
}));
  
    return (
      <div className="ui-timer">
          
            {/* <button style={{border:"none", background:"none", marginRight:"0.5em", zIndex:3}} onClick={pauseTime}>
              <img style={{height:"1.5em", opacity:0.7}} src={process.env.PUBLIC_URL+"/Images/Iconos/"+srcIcon} /></button> */}
            <p className="text-title" style={{margin:0, color:"white", background:"#AE3A8F", fontFamily:"myGreasy"}}>TIEMPO</p>
            <h1 style={{fontFamily:"myGreasy", color: "white", marginBottom:0, minWidth:"3em",marginTop:0/*  height: "1rem" */}}>{ String(minutos).padStart(2, '0') + ":" + String(segundos).padStart(2, '0') }</h1>
        
        
        
      </div>
    );
  });

export default Timer;
