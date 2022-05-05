export const gksave = () => {
  
    let el2 = document.querySelector('#goalkeeper');
    let el3 = document.querySelector('#gk');
    
  
    let pos = el2.getAttribute("position")
    //console.log(pos.x)
    if(pos.x>=0){
        el3.setAttribute("rotation","0 0 -45")
        el2.setAttribute("material",{src: "#goalkeeperTexture1"})
    }else{
        el3.setAttribute("rotation","0 180 -45")
        el2.setAttribute("material",{src: "#goalkeeperTexture2"})
    }
    
    
  }