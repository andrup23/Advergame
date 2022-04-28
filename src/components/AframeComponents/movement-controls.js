const AFRAME = window.AFRAME;
const THREE = window.THREE;

AFRAME.registerComponent('head', {
    tick: function() { 
        var player = document.querySelector("#Player");
        if(player){
            this.el.setAttribute('position', {x: player.getAttribute("position")["x"], y: player.getAttribute("position")["y"]+ 1.7, z: player.getAttribute("position")["z"]});
        }
    },
    
});

AFRAME.registerComponent('look-cursor', {
  tick: function() { 
      var player = document.querySelector("#camera");
      if(player){
          this.el.setAttribute('rotation', {x: player.getAttribute("rotation")["x"], y: player.getAttribute("rotation")["y"], z: player.getAttribute("rotation")["z"]});
      }
  },
});



const COMPONENT_SUFFIX = '-controls',
MAX_DELTA = 0.2, // ms
EPS = 10e-6;

AFRAME.registerComponent('movement-controls-super', {

  /*******************************************************************
   * Schema
   */

  dependencies: ['rotation'],

  schema: {
    enabled:            { default: true },
    controls:           { default: ['keyboard-touch'] },
    speed:              { default: 0.3, min: 0 },
    fly:                { default: false },
    constrainToNavMesh: { default: false },
    camera:             { default: '[movement-controls] [camera]', type: 'selector' },
  },

  /*******************************************************************
   * Lifecycle
   */

  init: function () {
    const el = this.el;
    if (!this.data.camera) {
      this.data.camera = el.querySelector('[camera]')
    }
    this.velocityCtrl = null;

    this.velocity = new THREE.Vector3();
    this.heading = new THREE.Quaternion();

    // Navigation
    this.navGroup = null;
    this.navNode = null;

    if (el.sceneEl.hasLoaded) {
      this.injectControls();
    } else {
      el.sceneEl.addEventListener('loaded', this.injectControls.bind(this));
    }
  },

  update: function (prevData) {
    const el = this.el;
    const data = this.data;
    const nav = el.sceneEl.systems.nav;
    if (el.sceneEl.hasLoaded) {
      this.injectControls();
    }
    if (nav && data.constrainToNavMesh !== prevData.constrainToNavMesh) {
      data.constrainToNavMesh
        ? nav.addAgent(this)
        : nav.removeAgent(this);
    }
  },

  injectControls: function () {
    const data = this.data;
    var name;

    for (let i = 0; i < data.controls.length; i++) {
      name = data.controls[i] + COMPONENT_SUFFIX;
      if (!this.el.components[name]) {
        this.el.setAttribute(name, '');
      }
    }
  },

  updateNavLocation: function () {
    this.navGroup = null;
    this.navNode = null;
  },

  /*******************************************************************
   * Tick
   */

  tick: (function () {
    const start = new THREE.Vector3();
    const end = new THREE.Vector3();
    const clampedEnd = new THREE.Vector3();

    return function (t, dt) {
      if (!dt) return;

      const el = this.el;
      const data = this.data;

      if (!data.enabled) return;

      this.updateVelocityCtrl();
      const velocityCtrl = this.velocityCtrl;
      const velocity = this.velocity;

      if (!velocityCtrl){
        document.querySelector("#player-model").setAttribute('animation-mixer', {
            clip: 'Idle'
        });
        return
      } 

      // Update velocity. If FPS is too low, reset.
      if (dt / 1000 > MAX_DELTA) {
        velocity.set(0, 0, 0);
      } else {
        this.updateVelocity(dt); 
        document.querySelector("#player-model").setAttribute('animation-mixer', {
            clip: 'Walking'
        });
      }

      if (data.constrainToNavMesh
          && velocityCtrl.isNavMeshConstrained !== false) {

        if (velocity.lengthSq() < EPS) return;

        start.copy(el.object3D.position);
        end
          .copy(velocity)
          .multiplyScalar(dt / 1000)
          .add(start);

        const nav = el.sceneEl.systems.nav;
        this.navGroup = this.navGroup === null ? nav.getGroup(start) : this.navGroup;
        this.navNode = this.navNode || nav.getNode(start, this.navGroup);
        this.navNode = nav.clampStep(start, end, this.navGroup, this.navNode, clampedEnd);
        el.object3D.position.copy(clampedEnd);
      } else if (el.hasAttribute('velocity')) {
        el.setAttribute('velocity', velocity);
      } else {
        el.object3D.position.x += velocity.x * dt / 1000;
        el.object3D.position.y += velocity.y * dt / 1000;
        el.object3D.position.z += velocity.z * dt / 1000;
      }

    };
  }()),

  /*******************************************************************
   * Movement
   */

  updateVelocityCtrl: function () {
    const data = this.data;
    if (data.enabled) {
      for (let i = 0, l = data.controls.length; i < l; i++) {
        const control = this.el.components[data.controls[i] + COMPONENT_SUFFIX];
        if (control && control.isVelocityActive()) {
          //console.log("control", control)
          this.velocityCtrl = control;
          return;
        }
      }
      this.velocityCtrl = null;
    }
  },

  updateVelocity: (function () {
    const vector2 = new THREE.Vector2();
    const quaternion = new THREE.Quaternion();

    return function (dt) {
      let dVelocity;
      const el = this.el;
      const control = this.velocityCtrl;
      const velocity = this.velocity;
      const data = this.data;

      if (control) {
        if (control.getVelocityDelta) {
          dVelocity = control.getVelocityDelta(dt);
        } else if (control.getVelocity) {
          velocity.copy(control.getVelocity());
          return;
        } else if (control.getPositionDelta) {
          velocity.copy(control.getPositionDelta(dt).multiplyScalar(1000 / dt));
          return;
        } else {
          throw new Error('Incompatible movement controls: ', control);
        }
      }

      if (el.hasAttribute('velocity') && !data.constrainToNavMesh) {
        velocity.copy(this.el.getAttribute('velocity'));
      }

      if (dVelocity && data.enabled) {
        const cameraEl = data.camera;
        //const cameraEl = document.querySelector("#camera");
        // Rotate to heading

        quaternion.copy(cameraEl.object3D.quaternion);
        //quaternion.premultiply(el.object3D.quaternion);
        dVelocity.applyQuaternion(quaternion);
        //avatar.object3D.rotation.y = cameraEl.object3D.rotation.y + Math.PI;
        el.object3D.rotation.y = cameraEl.object3D.rotation.y;

        const factor = dVelocity.length();
        if (data.fly) {
          velocity.copy(dVelocity);
          velocity.multiplyScalar(this.data.speed * 16.66667);
        } else {
          vector2.set(dVelocity.x, dVelocity.z);
          vector2.setLength(factor * this.data.speed * 16.66667);
          velocity.x = vector2.x;
          velocity.z = vector2.y;
        }
      }
    };

  }())
});  






/**
* Touch-to-move-forward controls for mobile.
*/
AFRAME.registerComponent('keyboard-touch-controls', {
  schema: {
    enabled: { default: true },
    reverseEnabled: { default: true },
    buttonForward: {type: 'selector', default: '#button-forward'},
  },

  init: function () {
    this.dVelocity = new THREE.Vector3();
    this.bindMethods();
    this.direction = 0;
  },

  play: function () {
    this.addEventListeners();
  },

  pause: function () {
    this.removeEventListeners();
    this.dVelocity.set(0, 0, 0);
  },

  remove: function () {
    this.pause();
  },

  addEventListeners: function () {
    const sceneEl = this.el.sceneEl;
    const canvasEl = sceneEl.canvas;

    
    if (!canvasEl) {
      sceneEl.addEventListener('render-target-loaded', this.addEventListeners.bind(this));
      return;
    }

    // canvasEl.addEventListener('touchstart', this.onTouchStart);
    // canvasEl.addEventListener('touchend', this.onTouchEnd);
    document.addEventListener('keydown', this.onKeyDown, false);
    document.addEventListener('keyup', this.onKeyUp, false);

    const buttonForeardEl = this.data.buttonForward;

    if(buttonForeardEl){
      console.log("boton", buttonForeardEl)
      buttonForeardEl.addEventListener("mousedown",this.onTouchStart, false);
      buttonForeardEl.addEventListener("mouseup",  this.onTouchEnd, false);
      buttonForeardEl.addEventListener('touchstart', this.onTouchStart);
      buttonForeardEl.addEventListener('touchend', this.onTouchEnd);
    }
  },

  removeEventListeners: function () {
    const canvasEl = this.el.sceneEl && this.el.sceneEl.canvas;
    if (!canvasEl) { return; }

    // canvasEl.removeEventListener('touchstart', this.onTouchStart);
    // canvasEl.removeEventListener('touchend', this.onTouchEnd);
    document.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('keyup', this.onKeyUp);
    
    const buttonForeardEl = this.data.buttonForward;

    if(buttonForeardEl){
      buttonForeardEl.removeEventListener("mousedown", this.onTouchStart);
      buttonForeardEl.removeEventListener("mouseup", this.onTouchEnd);
      buttonForeardEl.removeEventListener('touchstart', this.onTouchStart);
      buttonForeardEl.removeEventListener('touchend', this.onTouchEnd);
    }
  },

  isVelocityActive: function () {
    return this.data.enabled && !!this.direction;
  },

  getVelocityDelta: function () {
    this.dVelocity.z = this.direction;
    return this.dVelocity.clone();
  },

  bindMethods: function () {
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
  },

  onTouchStart: function (e) {
    this.direction = -1;
    // if (this.data.reverseEnabled && e.touches.length === 2) {
    //   this.direction = 1;
    // }
    e.preventDefault();
  },

  onTouchEnd: function (e) {
    this.direction = 0;
    e.preventDefault();
  },

  onKeyDown: function (e) {
    const keyName = e.code;
    // console.log("tecla", keyName || keyName=="KeyW" || keyName=="ArrowUp")
    if(keyName=="Space" || keyName=="KeyW" || keyName=="ArrowUp"){
      this.direction = -1;
    }
    e.preventDefault();
  },

  onKeyUp: function (e) {
    const keyName = e.code;
    if(keyName=="Space" || keyName=="KeyW" || keyName=="ArrowUp"){
      this.direction = 0;
    }
    e.preventDefault();
  },

});







