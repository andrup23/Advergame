export const restart = () => {
    /* const event = new Event('reset');
    var elem = document.querySelector('#ball');
    elem.dispatchEvent(event) */
    //window.location.reload(false);
    let el2 = document.querySelector('#goalkeeper');
    el2.setAttribute("material",{src: "#goalkeeperTexture0"})
  
    var el = document.querySelector('#ball');
    var sc = document.querySelector('#aframe-scene');
    sc.removeChild(el);

    let newBall = document.createElement("a-box");
    
    newBall.setAttribute("id","ball")
    newBall.setAttribute("dynamic-body","shape:sphere; sphereRadius:0.3; mass:0.3; angularDamping:1.0")
    newBall.setAttribute("material","src: #ballTexture; transparent:false; alphaTest:0.7; shader:flat")
    newBall.setAttribute("position","-0.07 0.74 -2.794")
    newBall.setAttribute("height","1.3")
    newBall.setAttribute("width","1.3")
    newBall.setAttribute("depth","0.001")
    newBall.setAttribute("shadow","cast:true; receive:true")
    newBall.setAttribute("foo","")

    sc.appendChild(newBall)
    //console.log(newBall)
    
    
  }