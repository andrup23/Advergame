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

  AFRAME.registerComponent('foo', {
    init: function() {
      this.el.addEventListener('collide', function(e) {
        //console.log('Player has collided with ', e.detail.body.el);
            if(e.detail.body.el.id ==="ball"){
                alert ('GOOOOL')
            }
      });
    }
  })