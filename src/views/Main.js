import { useState, useEffect } from 'react';
//import { Physics, useBox} from '@react-three/cannon'
import './Main.css';
import 'aframe';
import {Entity, Scene} from 'aframe-react';
import {
  Link
} from "react-router-dom";
import * as THREE from 'three'
//Componentes AFRAME
import '../components/AframeComponents/movement-controls';
import '../components/AframeComponents/interactable-product';

require('aframe-extras');
require('aframe-physics-system');
//require('aframe-physics-extras');
require('aframe-orbit-controls-component-2');

let prueba1 = true

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
        setFirstShot(false)
      }
    }, [mousePosition]);


    useEffect(()=>{
      function handledowntouch(e){
        console.log("down")
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
        console.log("up")
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
        console.log("down")
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
        console.log("up")
        
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

  console.log(pY)

  if(pX!==0 && pY!==0){
    el.body.applyImpulse(
      /* new CANNON.Vec3(0, 1, -1),
       new CANNON.Vec3().copy(el.getComputedAttribute('position')) */
       new THREE.Vector3(8*pX*speed, -4*pY*speed, -1*speed),
       new THREE.Vector3().copy(el.getAttribute("position"))
     );
  }
}

function restart(){
  //console.log(document.querySelector('#ball').body.position);  
  /* var el = document.querySelector('#ball');
  el.setAttribute("position",{x:0 ,y:0, z:0}) */
  //console.log(el)
  /* const event = new Event('reset');
  var elem = document.querySelector('#ball');
  elem.dispatchEvent(event) */
  window.location.reload(false);
  
}

function Main() {
  const {x,y,xa,ya} = useMouse();
  const [boxVisible, set_boxVisible] = useState(false);
  const [scene_visible, set_scene_visible] = useState(true);

  useEffect(()=>{
    document.body.onkeyup = function(e){
      if(e.key === ' '){
        // set_boxVisible(true);
      }

      if(e.key === 'Enter'){
        // set_scene_visible(true);
      }

      // console.log(e.keyCode);
  }
  },[]);

  

  return (
    <div>
        <div id="aframe-main-container">
            {scene_visible &&
            <Scene physics="debug: false" vr-mode-ui="enabled: false">
                <a-assets>
                    {/* <img crossOrigin="anonymous" id="groundTexture" src="https://cdn.aframe.io/a-painter/images/floor.jpg"/>
                    <img crossOrigin="anonymous" id="skyTexture" src="https://cdn.aframe.io/a-painter/images/sky.jpg"/> */}
                    <img crossOrigin="anonymous" id="groundTexture" src={process.env.PUBLIC_URL + "Assets/Images/Escenario/soccer1.jpg"}/>
                    <img crossOrigin="anonymous" id="skyTexture" src={process.env.PUBLIC_URL + "Assets/Images/Escenario/stadium_01.jpg"}/>
                    <img crossOrigin="anonymous" id="goalTexture" src={process.env.PUBLIC_URL + "Assets/Images/Escenario/goal.png"}/>
                    <img crossOrigin="anonymous" id="goalkeeperTexture" src={process.env.PUBLIC_URL + "Assets/Images/Escenario/goalkeeper.png"}/>
                    <img crossOrigin="anonymous" id="ballTexture" src={process.env.PUBLIC_URL + "Assets/Images/Escenario/ball.png"}/>


                    {/* src={process.env.PUBLIC_URL + "Assets/3DModels/Characters/Personaje1.glb"} */}
                    
                </a-assets>

                {/********************************* CÁMARA Y JUGADOR *********************************/}
                <Entity id="mouseCursor" cursor="rayOrigin: mouse" raycaster="far: 10; objects: .clickable"></Entity>
                <Entity
                  id="camera"
                  class="aframe-game-element"
                  camera="active: true; fov: 80; zoom: 1;"
                  position="0 2 0"
                  />
           
    
                {/********************************* CÁMARA Y JUGADOR *********************************/}


                {/********************************* ENTORNO *********************************/}
                <Entity primitive="a-light" type="ambient" color="#445451"/>
                <Entity primitive="a-light" type="point" intensity="2" position="2 4 4"/>
                <Entity primitive="a-sky" height="2048" radius="30" src="#skyTexture" theta-length="180" width="2048" rotation="0 90 0"/>

                <Entity primitive="a-box" height="1" width="30" depth="25" static-body="shape:box" position="0 -0.5 6.27" rotation="0 90 0" src="#groundTexture" />
               
                <Entity foo id="goal" static-body="shape:box" primitive="a-box" material="src: #goalTexture; transparent:false; alphaTest:0.7;" shadow="cast:true; receive:true"height="4" width="7" depth="0.1" position="0 1.9 -6.6" rotation="0 0 0" />
                <Entity  static-body="shape:box" primitive="a-box" material="src: #goalkeeperTexture; transparent:false; alphaTest:0.7; shader:flat" shadow="cast:true; receive:true"height="3" width="3" depth="0.1" position="-2.5 1.363 -6.4" rotation="0 0 0"
                animation="property: position; from: -2.5 1.363 -6.4; to: 2.5 1.363 -6.4; dir:alternate; loop:true; easing:linear">
                  
                </Entity>

                <Entity id="ball" dynamic-body="shape:sphere; sphereRadius:0.3; mass:0.3; angularDamping:1.0" primitive="a-box" material="src: #ballTexture; transparent:false; alphaTest:0.7;" shadow="cast:true; receive:true"height="0.7" width="0.7" depth="0.001" position="-0.07 1.44 -2.794" rotation="0 0 0" />

                <a-box static-body="shape:box" position="0 .3 4" width="3" height=".6" depth="1"></a-box>
                
                {/* <a-box dynamic-body="shape:box" color="#f55" position="0 2 -3" ></a-box>
                <a-box dynamic-body="shape:box" color="#55f" position="-2 2 -3" ></a-box> */}

                {/********************************* ENTORNO *********************************/}


                {/********************************* INTERACTIVOS *********************************/}
                {/* <a-entity class="product-entity">
                  <a-plane 
                    class="clickable"
                    interactable-product
                    width='0.6' height='0.6'
                    color="#ccc"
                    position="-0.34 2.118 -1.40">

                    <a-image 
                      id="button-producto"
                      src={process.env.PUBLIC_URL + "logo512.png"}
                      width='0.5' height='0.5'
                      position="0 0 0.01">
                    </a-image>
                  </a-plane>
                </a-entity> */}
                {/********************************* INTERACTIVOS *********************************/}
                
            </Scene>
            }
        </div>

        <div id='main-ui-container'>
          
            <h1 style={{color:'white'}}>Hola React-Aframe</h1>
            {/* <p>first X is {xa}</p>
            <p>first Y is {ya}</p>
            <p>last X is {x}</p>
            <p>last Y is {y}</p> */}
            <button className='interactable-ui'onClick={restart}>REINICIAR</button>
        </div>
    </div>
    
  );
}

export default Main;