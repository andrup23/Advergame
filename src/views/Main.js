import { useState, useEffect, useRef } from 'react';
import './Main.css';
import 'aframe';
import {Entity, Scene} from 'aframe-react';
import * as THREE from 'three'
//Componentes AFRAME
import '../components/AframeComponents/movement-controls';
import '../components/AframeComponents/interactable-product';
import Timer from '../components/Timer/Timer'
import ScorePanel from '../components/ScorePanel/ScorePanel'
import {gksave} from '../components/Scripts/GoalkeeperSave'
import {restart} from '../components/Scripts/Restart'


require('aframe-extras');
require('aframe-physics-system');
//require('aframe-physics-extras');
require('aframe-orbit-controls-component-2');





function useMouse(){
    const [isShooting, setIsShooting] = useState(false)
    const [firstShot, setFirstShot] = useState(true)
    const [mousePosition, setMousePosition]=useState({
      x: null,
      y: null,
      xa: null,
      ya: null
    });

    useEffect(() => {
      if(isShooting && firstShot){
        shot(mousePosition);
        setIsShooting(false)
        //setFirstShot(false)
        gksave()
      }
    }, [mousePosition]);


    useEffect(()=>{
      function handledowntouch(e){
        //console.log("down")
        setMousePosition({
          xa: e.touches[0].clientX,
          ya: e.touches[0].clientY,
          x: 0,
          y: 0
        })
      }
      document.addEventListener("touchstart",handledowntouch)
      return ()=> document.removeEventListener("touchstart",handledowntouch)
    })

    useEffect(()=>{
      function handleuptouch(e){
        //console.log("up")
        setMousePosition({
          x: e.changedTouches[0].clientX,
          y: e.changedTouches[0].clientY,
          xa: mousePosition.xa,
          ya: mousePosition.ya
        })
        setIsShooting(true)
      }
      document.addEventListener("touchend",handleuptouch)
      return ()=> document.removeEventListener("touchend",handleuptouch)
    })

    useEffect(()=>{
      function handledown(e){
        //console.log("down")
        setMousePosition({
          xa: e.pageX,
          ya: e.pageY,
          x: 0,
          y: 0
        })
      }
      document.addEventListener("mousedown",handledown)
      return ()=> document.removeEventListener("mousedown",handledown)
    })


    useEffect(()=>{
      function handleup(e){
        //console.log("up")
        
        setMousePosition({
          x: e.pageX,
          y: e.pageY,
          xa: mousePosition.xa,
          ya: mousePosition.ya
        })
        setIsShooting(true)
      }
      document.addEventListener("mouseup",handleup)
      return ()=> document.removeEventListener("mouseup",handleup)
    })

    

    return mousePosition;
}

function shot(mousePosition){
  //console.log("click")
  var el = document.querySelector('#ball');
  var speed = 1

  let pX = ((mousePosition.x - mousePosition.xa)/document.body.clientWidth)
  let pY = ((mousePosition.y - mousePosition.ya)/document.body.clientHeight)

  //console.log(pY)

  if(pX!==0 && pY!==0){
    el.body.applyImpulse(
      /* new CANNON.Vec3(0, 1, -1),
       new CANNON.Vec3().copy(el.getComputedAttribute('position')) */
       new THREE.Vector3(16*pX*speed, -8*pY*speed, -2*speed),
       new THREE.Vector3().copy(el.getAttribute("position"))
     );
  }
}



function Main() {
  const {x,y,xa,ya} = useMouse();
  const [timeFinalized, set_timeFinalized] = useState(false);
  const [scene_visible, set_scene_visible] = useState(true);
  const [scoreGame, set_scoreGame] = useState(0);
  const timerRef = useRef();

  useEffect(() => {
    if(timeFinalized){
      console.log("TIEMPO")
      alert("Tiempo agotado, tu puntuación es: "+scoreGame)
      //Reiniciar
      restart()
      set_scoreGame(0)
      set_timeFinalized(false)
      timerRef.current.reiniciar()
    }
  }, [timeFinalized]);

  useEffect(() => {
    console.log("score: "+scoreGame)
  }, [scoreGame]);
  

  useEffect(()=>{
    function handledata(e){
      //console.log(e)
      updateScore(e.detail)
    }
    document.addEventListener('update_data', handledata)
    return () =>{
      document.removeEventListener('update_data', handledata)
    }
  });

  function updateScore(puntaje) {
    set_scoreGame(scoreGame+puntaje)
    console.log(scoreGame)
  }

  /* useEffect(()=>{
    document.body.onkeyup = function(e){
      if(e.key === ' '){
        // set_boxVisible(true);
      }

      if(e.key === 'Enter'){
        // set_scene_visible(true);
      }

      // console.log(e.keyCode);
  }
  },[]); */

  

  return (
    <div>
        <div id="aframe-main-container">
            {scene_visible &&
            <Scene id="aframe-scene" physics="debug: true" vr-mode-ui="enabled: false">
                <a-assets>
                    {/* <img crossOrigin="anonymous" id="groundTexture" src="https://cdn.aframe.io/a-painter/images/floor.jpg"/>
                    <img crossOrigin="anonymous" id="skyTexture" src="https://cdn.aframe.io/a-painter/images/sky.jpg"/> */}
                    <img crossOrigin="anonymous" id="skyTexture" src={process.env.PUBLIC_URL + "/Assets/Images/Escenario/FondoEstadio.jpg"}/>
                    <img crossOrigin="anonymous" id="goalTexture" src={process.env.PUBLIC_URL + "/Assets/Images/Escenario/Porteria1.png"}/>
                    <img crossOrigin="anonymous" id="goalkeeperTexture0" src={process.env.PUBLIC_URL + "/Assets/Images/Portero/Portero0.png"}/>
                    <img crossOrigin="anonymous" id="goalkeeperTexture1" src={process.env.PUBLIC_URL + "/Assets/Images/Portero/Portero1.png"}/>
                    <img crossOrigin="anonymous" id="goalkeeperTexture2" src={process.env.PUBLIC_URL + "/Assets/Images/Portero/Portero2.png"}/>
                    <img crossOrigin="anonymous" id="ballTexture" src={process.env.PUBLIC_URL + "/Assets/Images/Escenario/Crispeta.png"}/>
                    <img crossOrigin="anonymous" id="crispetasBack1" src={process.env.PUBLIC_URL + "/Assets/Images/Escenario/CrispetasBack1.png"}/>
                    <img crossOrigin="anonymous" id="crispetasBack2" src={process.env.PUBLIC_URL + "/Assets/Images/Escenario/CrispetasBack2.png"}/>
                    <img crossOrigin="anonymous" id="pointTexture1" src={process.env.PUBLIC_URL + "/Assets/Images/Escenario/Point1.png"}/>
                    <img crossOrigin="anonymous" id="pointTexture2" src={process.env.PUBLIC_URL + "/Assets/Images/Escenario/Point2.png"}/>
                    <img crossOrigin="anonymous" id="pointTexture3" src={process.env.PUBLIC_URL + "/Assets/Images/Escenario/Point3.png"}/>
                </a-assets>

                {/********************************* CÁMARA Y JUGADOR *********************************/}
                <Entity id="mouseCursor" cursor="rayOrigin: mouse" raycaster="far: 10; objects: .clickable"></Entity>
                <Entity
                  id="camera"
                  className="aframe-game-element"
                  camera="active: true; fov: 80; zoom: 1;"
                  position="0 2 0"
                  />
           
    
                {/********************************* CÁMARA Y JUGADOR *********************************/}


                {/********************************* ENTORNO *********************************/}
                
                <Entity primitive="a-light" type="ambient" color="#445451"/>
                <Entity primitive="a-light" type="point" intensity="2" position="2 4 4"/>

                <Entity primitive="a-sky" height="2048" radius="30" color="#0B2660" /* src="#skyTexture" */ theta-length="90" width="2048" rotation="0 90 0"/>
                <Entity primitive="a-sky" height="2048" radius="30" color="#5ea947" /* src="#skyTexture" */ theta-length="90" width="2048" rotation="180 0 0"/>

                
                <Entity primitive="a-box" material="src: #skyTexture; shader:flat" height="23" width="46" depth="0.001" position="0 4 -10" rotation="0 0 0" static-body="shape:box" className="muro" />
                <Entity primitive="a-plane" material="src: #crispetasBack1; shader:flat; transparent:true; alphaTest:0.1" height="6" width="6" position="10 2 -8" rotation="0 0 0" />
                <Entity primitive="a-plane" material="src: #crispetasBack2; shader:flat; transparent:true; alphaTest:0.1" height="6" width="6" position="-10 2 -8" rotation="0 0 0" />
                {/* <Entity primitive="a-plane" material="src: #groundTexture; shader:flat; transparent:true; alphaTest:0.1" height="23" width="46" position="0 4 -10" rotation="0 0 0" /> */}

                <Entity primitive="a-box" height="1" width="35" depth="40" static-body="shape:box" position="0 -0.2 6.27" rotation="0 90 0" /* src="#groundTexture" */ material="visible: false" />
                <Entity className="muro" primitive="a-box" height="1" width="35" depth="40" static-body="shape:box" position="20 0 0" rotation="0 0 90" /* src="#groundTexture" */ material="visible: false" />
                <Entity className="muro" primitive="a-box" height="1" width="35" depth="40" static-body="shape:box" position="-20 0 0" rotation="0 0 90" /* src="#groundTexture" */ material="visible: false" />
                <Entity className="muro" primitive="a-box" height="1" width="35" depth="40" static-body="shape:box" position="0 17 0" rotation="0 90 0" /* src="#groundTexture" */ material="visible: false" />

                {/* PArte Portería */}
                <Entity primitive="a-box" material="src: #goalTexture; transparent:true; alphaTest:0.1; shader:flat" shadow="cast:true; receive:true"height="8" width="13" depth="0.1" position="0 2.7 -6.8" rotation="0 0 0" />
                {/* collider */}
                <Entity id="goal" static-body="shape:box" primitive="a-box" material="visible:true" height="4.1" width="11.8" depth="0.1" position="0 2.5 -6.8" rotation="0 0 0" />

                <Entity  log id="goalkeeper" /* static-body="shape:box" */ primitive="a-box" material="transparent:true; alphaTest:0.1; shader:flat" shadow="cast:true; receive:true" height="4" width="4" depth="0.001" scale="1.2 1.2 1"
                  animation="property: position; 
                  from: -4 2.2 -6.4; 
                  to: 4 2.2 -6.4; 
                  dir:alternate;
                  dur: 500; 
                  loop:true; 
                  easing:linear">
                    <Entity id="gk" >
                      <Entity className="gkcol" primitive="a-box" static-body="shape:box" height="1.6" width="2.1" depth="0.1" position="-0.1 0.2 0.05" material="visible: false" scale="1.2 1.2 1"></Entity>
                      <Entity className="gkcol" primitive="a-box" static-body="shape:box" height="1.9" width="1" depth="0.1" position="-0.3 -1.1 0.05" material="visible: false" scale="1.2 1.2 1"></Entity>                    
                      <Entity className="gkcol" primitive="a-box" static-body="shape:box" height="1.2" width="1.6" depth="0.1" position="0 1.25 0.05" material="visible: false" scale="1.2 1.2 1"></Entity> 
                    </Entity>

                    
                </Entity>

                <Entity foo id="ball" dynamic-body="shape:sphere; sphereRadius:0.3; mass:0.3; angularDamping:1.0" primitive="a-box" material="src: #ballTexture; transparent:false; alphaTest:0.7; shader:flat" shadow="cast:true; receive:true" height="1.3" width="1.3" depth="0.001" position="-0.07 0.74 -2.794" rotation="0 0 0" />

                {/* Puntos Bonus ****** */}
                <Entity id="bonus-points" position="0 0 -6.7">
                  <Entity primitive="a-plane" material="src: #pointTexture1; transparent:true; alphaTest:0.1; shader:flat" shadow="cast:true; receive:true" height="2.5" width="2.5" position="5 1 0" rotation="0 0 0" />
                  <Entity primitive="a-plane" material="src: #pointTexture1; transparent:true; alphaTest:0.1; shader:flat" shadow="cast:true; receive:true" height="2.5" width="2.5" position="-5 1 0" rotation="0 0 0" />
                  <Entity primitive="a-plane" material="src: #pointTexture2; transparent:true; alphaTest:0.1; shader:flat" shadow="cast:true; receive:true" height="1.8" width="1.8" position="4 3.3 0" rotation="0 0 0" />
                  <Entity primitive="a-plane" material="src: #pointTexture2; transparent:true; alphaTest:0.1; shader:flat" shadow="cast:true; receive:true" height="1.8" width="1.8" position="-4 3.3 0" rotation="0 0 0" />
                  <Entity primitive="a-plane" material="src: #pointTexture3; transparent:true; alphaTest:0.1; shader:flat" shadow="cast:true; receive:true" height="1" width="1" position="5.7 4.4 0" rotation="0 0 0" />
                  <Entity primitive="a-plane" material="src: #pointTexture3; transparent:true; alphaTest:0.1; shader:flat" shadow="cast:true; receive:true" height="1" width="1" position="-5.7 4.4 0" rotation="0 0 0" />
                </Entity>

                {/* Colisiones bonus */}
               {/*  <Entity position="0 0 -6.65">
                  <Entity  className="point3" static-body="shape:box" primitive="a-box" material="visible:true" height="0.6" width="0.6" depth="0.4" position="5.5 4.15 0" rotation="0 0 0" />
                </Entity> */}
                

                {/********************************* ENTORNO *********************************/}

                
            </Scene>
            }
        </div>

        <div id='main-ui-container'>
          <div className="timer-container">
            <Timer  
            seconds={60}
            setTimeFinalized = {set_timeFinalized}
            ref={timerRef}></Timer>

          </div>
          <div className="timer-container">
            <ScorePanel  
            score={scoreGame}
            ></ScorePanel>

          </div>
          
            {/* <h1 style={{color:'white'}}>Hola React-Aframe</h1>
            <p>first X is {xa}</p>
            <p>first Y is {ya}</p>
            <p>last X is {x}</p>
            <p>last Y is {y}</p>
            <button className='interactable-ui'onClick={restart}>REINICIAR</button> */}
        </div>
        <div id="logo" style={{position:"absolute"}}>
            <img src={process.env.PUBLIC_URL + "/Assets/Images/Logos/Logo.png"} alt="" style={{width:"9rem"}}></img>
        </div>
    </div>
    
  );
}

export default Main;