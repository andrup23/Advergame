import React from 'react'
import { useState, useEffect, forwardRef, useRef, useImperativeHandle } from 'react';
import '../Timer/Timer.css';

const ScorePanel = forwardRef(({ score, setTimeFinalized,/*  pauseInRec */}, ref) => {
    
    const [scorevalue, setScoreValue] = useState(score);
    //const [srcIcon, setSrcIcon] = useState("pausa.png");
    
 
  useImperativeHandle(ref, () => ({
        reanudar: ()=> {
        
        },
    }));
  
    return (
      <div className="ui-timer" style={{background:"#F7EC32", marginTop:0, borderRadius:"0 0 25px 25px", padding:"0 1em 0"}}>
          
            {/* <button style={{border:"none", background:"none", marginRight:"0.5em", zIndex:3}} onClick={pauseTime}>
              <img style={{height:"1.5em", opacity:0.7}} src={process.env.PUBLIC_URL+"/Images/Iconos/"+srcIcon} /></button> */}
            <p className="text-title" style={{margin:0, marginTop:"0.3em",color:"#367EC1", fontFamily:"myGreasy"}}>PUNTAJE</p>
            <h1 style={{fontFamily:"myGreasy", color: "#AE3A8F", marginBottom:0, minWidth:"3em",marginTop:0/*  height: "1rem" */}}>{String(score).padStart(5, '0')}</h1>
        
        
        
      </div>
    );
  });

export default ScorePanel;