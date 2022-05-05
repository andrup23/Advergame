import {restart} from '../Scripts/Restart'

const AFRAME = window.AFRAME;
const THREE = window.THREE;



AFRAME.registerComponent('interactable-product', {
  
    init: function() {
        let el = this.el;

        //Código aquí********************************************************************
        el.addEventListener("click", function(){ 
            alert ('click')
        });
        //Código aquí********************************************************************

    },
  
  });


  /* Incluir prevención doble colisión ****************** */
  AFRAME.registerComponent('foo', {
    
    init: function() {
      let score = 0
      let firstCol = true
      
      this.el.addEventListener('collide', function(e) {
        //console.log('Player has collided with ', e.detail.body.el);
            if(e.detail.body.el.id ==="goal" && firstCol===true){
                alert ('GOOOOL')
                firstCol = false
                //console.log("col "+e.detail.body.el)
                score=50
                var event = new CustomEvent("update_data", { "detail": score });
                document.dispatchEvent(event)
                restart()
            }
            if(e.detail.body.el.className ==="gkcol" && firstCol===true){
              alert ('Fallaste')
              firstCol = false
              restart()
              //console.log("col "+e.detail.body.el.id)
              
          }
              if(e.detail.body.el.className ==="muro" && firstCol===true){
                alert ('Fallaste')
                firstCol = false
                restart()
                //console.log("col "+e.detail.body.el)
                
            }
      });
    }
  })

  AFRAME.registerComponent('log', {
  
    init: function() {
        let el = this.el;

        el.addEventListener('loaded', function () {
          el.setAttribute("material",{src: "#goalkeeperTexture0"})
        })

    },
  
  });