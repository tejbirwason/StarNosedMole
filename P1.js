// UBC CPSC 314 (2015W2) -- P1
// HAVE FUN!!! :)

// ASSIGNMENT-SPECIFIC API EXTENSION
THREE.Object3D.prototype.setMatrix = function(a) {
  this.matrix=a;
  this.matrix.decompose(this.position,this.quaternion,this.scale);
}

// SETUP RENDERER & SCENE
var canvas = document.getElementById('canvas');
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xFFFFFF); // white background colour
canvas.appendChild(renderer.domElement);

// SETUP CAMERA
var camera = new THREE.PerspectiveCamera(30,1,0.1,1000); // view angle, aspect ratio, near, far
camera.position.set(45,20,40);
camera.lookAt(scene.position);
scene.add(camera);

// SETUP ORBIT CONTROLS OF THE CAMERA
var controls = new THREE.OrbitControls(camera);

// ADAPT TO WINDOW RESIZE
function resize() {
  renderer.setSize(window.innerWidth,window.innerHeight);
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
}

// EVENT LISTENER RESIZE
window.addEventListener('resize',resize);
resize();

//SCROLLBAR FUNCTION DISABLE
window.onscroll = function () {
     window.scrollTo(0,0);
   }

// SETUP HELPER GRID
// Note: Press Z to show/hide
var gridGeometry = new THREE.Geometry();
var i;
for(i=-50;i<51;i+=2) {
    gridGeometry.vertices.push( new THREE.Vector3(i,0,-50));
    gridGeometry.vertices.push( new THREE.Vector3(i,0,50));
    gridGeometry.vertices.push( new THREE.Vector3(-50,0,i));
    gridGeometry.vertices.push( new THREE.Vector3(50,0,i));
}

var gridMaterial = new THREE.LineBasicMaterial({color:0xBBBBBB});
var grid = new THREE.Line(gridGeometry,gridMaterial,THREE.LinePieces);

/////////////////////////////////
//   YOUR WORK STARTS BELOW    //
/////////////////////////////////

// MATERIALS
// Note: Feel free to be creative with this! 
var normalMaterial = new THREE.MeshNormalMaterial();

// function drawCube()
// Draws a unit cube centered about the origin.
// Note: You will be using this for all of your geometry
function makeCube() {
  var unitCube = new THREE.BoxGeometry(1,1,1);
  return unitCube;
}

// GEOMETRY
var torsoGeometry = makeCube();
var non_uniform_scale = new THREE.Matrix4().set(16,0,0,0, 0,16,0,0, 0,0,24,0, 0,0,0,1);
torsoGeometry.applyMatrix(non_uniform_scale);

// TO-DO: SPECIFY THE REST OF YOUR STAR-NOSE MOLE'S GEOMETRY. 
// Note: You will be using transformation matrices to set the shape. 
// Note: You are not allowed to use the tools Three.js provides for 
//       rotation, translation and scaling.
// Note: The torso has been done for you (but feel free to modify it!)  
// Hint: Explicity declare new matrices using Matrix4().set     

var headGeometry = makeCube();
headGeometry.applyMatrix(new THREE.Matrix4().set(8,0,0,0, 0,8,0,0, 0,0,8,0, 0,0,0,1));

var noseGeometry = makeCube();
noseGeometry.applyMatrix(new THREE.Matrix4().set(4,0,0,0, 0,4,0,0, 0,0,3,0, 0,0,0,1));

var tailGeometry = makeCube();
tailGeometry.applyMatrix(new THREE.Matrix4().set(2,0,0,0, 0,2,0,0, 0,0,12,0, 0,0,0,1));

var lrgTentGeometry = makeCube();
lrgTentGeometry.applyMatrix(new THREE.Matrix4().set(0.2,0,0,0, 0,0.2,0,0, 0,0,4,0, 0,0,0,1));

var smallTentGeometry = makeCube();
smallTentGeometry.applyMatrix(new THREE.Matrix4().set(0.1,0,0,0, 0,0.1,0,0, 0,0,3,0, 0,0,0,1));



// MATRICES
function rot_x(angle){
    return new THREE.Matrix4().set(1,0,0,0, 0,Math.cos(angle),-Math.sin(angle),0, 0,Math.sin(angle),Math.cos(angle),0, 0,0,0,1);
}
function rot_z(angle){
    return new THREE.Matrix4().set(Math.cos(angle),-Math.sin(angle),0,0, Math.sin(angle),Math.cos(angle),0,0, 0,0,1,0, 0,0,0,1);
}
function rot_y(angle){
    return new THREE.Matrix4().set(Math.cos(angle),0,Math.sin(angle),0, 0,1,0,0,  -Math.sin(angle),0,Math.cos(angle),0, 0,0,0,1);
}
function multiplyMatrices(a,b){
    return new THREE.Matrix4().multiplyMatrices(a, b);
}

var torsoMatrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,8, 0,0,1,0, 0,0,0,1);

// TO-DO: INITIALIZE THE REST OF YOUR MATRICES 
// Note: Use of parent attribute is not allowed.
// Hint: Keep hierarchies in mind!   
// Hint: Play around with the headTorsoMatrix values, what changes in the render? Why?   

var headMatrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,8, 0,0,1,16, 0,0,0,1);
var headTorsoMatrix = multiplyMatrices(torsoMatrix, headMatrix);

// tail
var tailMatrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,-6, 0,0,1,-16, 0,0,0,1);
var tailTorsoMatrix = multiplyMatrices(torsoMatrix, tailMatrix);

// nose
var noseMatrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,0, 0,0,1,5, 0,0,0,1);
var noseFinalMatrix = multiplyMatrices(headTorsoMatrix, noseMatrix);

// large tentacles
var lRTM = [];
var lRTMfinal = [];
var lLTM = [];
var lLTMfinal =[];

for(var i=0;i<9;i++){
  lRTM[i] = new THREE.Matrix4().set(1,0,0,2, 0,1,0,(i-4)/2.5, 0,0,1,3, 0,0,0,1);
  lLTM[i] = new THREE.Matrix4().set(1,0,0,-2, 0,1,0,(i-4)/2.5, 0,0,1,3, 0,0,0,1);
  lRTMfinal[i] = multiplyMatrices(noseFinalMatrix, lRTM[i]);
  lLTMfinal[i] = multiplyMatrices(noseFinalMatrix, lLTM[i]);
}

// small tentacles
var sRTM = [];
var sRTMfinal = [];
var sLTM = [];
var sLTMfinal =[];

for(var i=0;i<2;i++){
  sRTM[i] = new THREE.Matrix4().set(1,0,0,1, 0,1,0,1-2*i, 0,0,1,3, 0,0,0,1);
  sLTM[i] = new THREE.Matrix4().set(1,0,0,-1, 0,1,0,2*i-1, 0,0,1,3, 0,0,0,1);
  sRTMfinal[i] = multiplyMatrices(noseFinalMatrix, sRTM[i]);
  sLTMfinal[i] = multiplyMatrices(noseFinalMatrix, sLTM[i]);
}


// CREATE BODY
var torso = new THREE.Mesh(torsoGeometry,normalMaterial);
torso.setMatrix(torsoMatrix)
scene.add(torso);

// TO-DO: PUT TOGETHER THE REST OF YOUR STAR-NOSED MOLE AND ADD TO THE SCENE!
// Hint: Hint: Add one piece of geometry at a time, then implement the motion for that part. 
//             Then you can make sure your hierarchy still works properly after each step.

// create head
var head = new THREE.Mesh(headGeometry,normalMaterial);
head.setMatrix(headTorsoMatrix);
scene.add(head);

// create tail
var tail = new THREE.Mesh(tailGeometry,normalMaterial);
tail.setMatrix(tailTorsoMatrix);
scene.add(tail);

//create nose
var nose = new THREE.Mesh(noseGeometry,normalMaterial);
nose.setMatrix(noseFinalMatrix);
scene.add(nose);

//create large tentacles (array edition)
var lRTmesh = [];
var lLTmesh = [];
for(var i=0;i<9;i++){
  var lrgTentRight = new THREE.Mesh(lrgTentGeometry,normalMaterial);
  lrgTentRight.setMatrix(lRTMfinal[i]);
  scene.add(lrgTentRight);
  lRTmesh[i] = lrgTentRight;

  var lrgTentLeft = new THREE.Mesh(lrgTentGeometry,normalMaterial);
  lrgTentLeft.setMatrix(lLTMfinal[i]);
  scene.add(lrgTentLeft);
  lLTmesh[i] = lrgTentLeft;
}

//create small tentacles (array edition)
var sRTmesh = [];
var sLTmesh = [];
for(var i=0;i<2;i++){
  var smallTentRight = new THREE.Mesh(smallTentGeometry,normalMaterial);
  smallTentRight.setMatrix(sRTMfinal[i]);
  scene.add(smallTentRight);
  sRTmesh[i] = smallTentRight;

  var smallTentLeft = new THREE.Mesh(smallTentGeometry,normalMaterial);
  smallTentLeft.setMatrix(sLTMfinal[i]);
  scene.add(smallTentLeft);
  sLTmesh[i] = smallTentLeft;
}


// APPLY DIFFERENT JUMP CUTS/ANIMATIONS TO DIFFERNET KEYS
// Note: The start of "U" animation has been done for you, you must implement the hiearchy and jumpcut.
// Hint: There are other ways to manipulate and grab clock values!!
// Hint: Check THREE.js clock documenation for ideas.
// Hint: It may help to start with a jumpcut and implement the animation after.
// Hint: Where is updateBody() called?
var clock = new THREE.Clock(true);

var p0; // start position or angle
var p1; // end position or angle
var time_length; // total time of animation
var time_start; // start time of animation
var time_end; // end time of animation
var p; // current frame
var animate = false; // animate?

// function init_animation()
// Initializes parameters and sets animate flag to true.
// Input: start position or angle, end position or angle, and total time of animation.
function init_animation(p_start,p_end,t_length){
  p0 = p_start;
  p1 = p_end;
  time_length = t_length;
  time_start = clock.getElapsedTime();
  time_end = time_start + time_length;
  animate = true; // flag for animation
  return;
}

function updateBody() {
  switch(true)
  {
      case((key == "U" || key == "E" )&& animate):
      var time = clock.getElapsedTime(); // t seconds passed since the clock started.

      if (time > time_end){
        p = p1;
        animate = false;
        break;
      }

      p = (p1 - p0)*((time-time_start)/time_length) + p0; // current frame 

      var torsoRotMatrix = multiplyMatrices(torsoMatrix,rot_x(-p));
      torso.setMatrix(torsoRotMatrix); 
      var tailRotMatrix = multiplyMatrices(torsoRotMatrix,tailMatrix);
      tail.setMatrix(tailRotMatrix);
      var headRotMatrix = multiplyMatrices(torsoRotMatrix,headMatrix);
      head.setMatrix(headRotMatrix);
      var noseRotMatrix = multiplyMatrices(headRotMatrix,noseMatrix);
      nose.setMatrix(noseRotMatrix);
      for(var i=0;i<9;i++){
        var lrgRightTentRotMatrix = multiplyMatrices(noseRotMatrix,lRTM[i]);
        lRTmesh[i].setMatrix(lrgRightTentRotMatrix);
        var lrgLeftTentRotMatrix = multiplyMatrices(noseRotMatrix,lLTM[i]);
        lLTmesh[i].setMatrix(lrgLeftTentRotMatrix);
      }
      for(var i=0;i<2;i++){
        var smallRightTentRotMatrix = multiplyMatrices(noseRotMatrix,sRTM[i]);
        sRTmesh[i].setMatrix(smallRightTentRotMatrix);
        var smallLeftTentRotMatrix = multiplyMatrices(noseRotMatrix,sLTM[i]);
        sLTmesh[i].setMatrix(smallLeftTentRotMatrix);
      }


      break


      case((key == "H" || key == "G" ) && animate):
      var time = clock.getElapsedTime(); // t seconds passed since the clock started.

      if (time > time_end){
        p = p1;
        animate = false;
        break;
      }

      p = (p1 - p0)*((time-time_start)/time_length) + p0; // current frame 

      var headRotMatrix = multiplyMatrices(headMatrix,rot_y(-p));
      var headFinalRotMatrix = multiplyMatrices(torsoMatrix,headRotMatrix);
      head.setMatrix(headFinalRotMatrix); 
      var noseRotMatrix = multiplyMatrices(headFinalRotMatrix,noseMatrix);
      nose.setMatrix(noseRotMatrix);
      for(var i=0;i<9;i++){
        var lrgRightTentRotMatrix = multiplyMatrices(noseRotMatrix,lRTM[i]);
        lRTmesh[i].setMatrix(lrgRightTentRotMatrix);
        var lrgLeftTentRotMatrix = multiplyMatrices(noseRotMatrix,lLTM[i]);
        lLTmesh[i].setMatrix(lrgLeftTentRotMatrix);
      }
      for(var i=0;i<2;i++){
        var smallRightTentRotMatrix = multiplyMatrices(noseRotMatrix,sRTM[i]);
        sRTmesh[i].setMatrix(smallRightTentRotMatrix);
        var smallLeftTentRotMatrix = multiplyMatrices(noseRotMatrix,sLTM[i]);
        sLTmesh[i].setMatrix(smallLeftTentRotMatrix);
      }
      break


      case((key == "T" || key == "V" ) && animate):
      var time = clock.getElapsedTime(); // t seconds passed since the clock started.

      if (time > time_end){
        p = p1;
        animate = false;
        break;
      }

      p = (p1 - p0)*((time-time_start)/time_length) + p0; // current frame 

      var tailRotMatrix = multiplyMatrices(tailMatrix,rot_y(-p));
      var tailFinalRotMatrix = multiplyMatrices(torsoMatrix,tailRotMatrix);
      tail.setMatrix(tailFinalRotMatrix); 
      break

      case((key == "N" ) && animate):
      var time = clock.getElapsedTime(); // t seconds passed since the clock started.

      if (time > time_end){
        p = p1;
        animate = false;
        break;
      }

      p = (p1 - p0)*((time-time_start)/time_length) + p0; // current frame 

      for(var i=0;i<9;i++){
        var lrgTentRightRotMatrix = multiplyMatrices(lRTM[i],rot_y(p));
        var lrgTentRightFinalRotMatrix = multiplyMatrices(noseFinalMatrix,lrgTentRightRotMatrix);
        lRTmesh[i].setMatrix(lrgTentRightFinalRotMatrix); 

        var lrgTentLeftRotMatrix = multiplyMatrices(lLTM[i],rot_y(-p));
        var lrgTentLeftFinalRotMatrix = multiplyMatrices(noseFinalMatrix,lrgTentLeftRotMatrix);
        lLTmesh[i].setMatrix(lrgTentLeftFinalRotMatrix);
      }

      for(var i=0;i<2;i++){
        var smallTentRightRotMatrix = multiplyMatrices(sRTM[i],rot_y(p));
        var smallTentRightFinalRotMatrix = multiplyMatrices(noseFinalMatrix,smallTentRightRotMatrix);
        sRTmesh[i].setMatrix(smallTentRightFinalRotMatrix); 

        var smallTentLeftRotMatrix = multiplyMatrices(sLTM[i],rot_y(-p));
        var smallTentLeftFinalRotMatrix = multiplyMatrices(noseFinalMatrix,smallTentLeftRotMatrix);
        sLTmesh[i].setMatrix(smallTentLeftFinalRotMatrix);
      }
      break
      // TO-DO: IMPLEMENT JUMPCUT/ANIMATION FOR EACH KEY!
      // Note: Remember spacebar sets jumpcut/animate!
      


    default:
      break;
  }
}

// LISTEN TO KEYBOARD
// Hint: Pay careful attention to how the keys already specified work!
var keyboard = new THREEx.KeyboardState();
var grid_state = false;
var key;
keyboard.domElement.addEventListener('keydown',function(event){
  if (event.repeat)
    return;
  if(keyboard.eventMatches(event,"Z")){  // Z: Reveal/Hide helper grid
    grid_state = !grid_state;
    grid_state? scene.add(grid) : scene.remove(grid);}   
  else if(keyboard.eventMatches(event,"0")){    // 0: Set camera to neutral position, view reset
    camera.position.set(45,0,0);
    camera.lookAt(scene.position);}
  else if(keyboard.eventMatches(event,"U")){ 
    (key == "U")? init_animation(p1,p0,time_length) : (init_animation(0,Math.PI/4,1), key = "U")}  
  else if(keyboard.eventMatches(event,"E")){ 
    (key == "E")? init_animation(p1,p0,time_length) : (init_animation(0,-Math.PI/4,1), key = "E")} 
  else if(keyboard.eventMatches(event,"H")){ 
    (key == "H")? init_animation(p1,p0,time_length) : (init_animation(0,Math.PI/5,1), key = "H")}   
  else if(keyboard.eventMatches(event,"G")){ 
    (key == "G")? init_animation(p1,p0,time_length) : (init_animation(0,-Math.PI/5,1), key = "G")} 
  else if(keyboard.eventMatches(event,"V")){ 
    (key == "V")? init_animation(p1,p0,time_length) : (init_animation(0,Math.PI/5,1), key = "V")} 
  else if(keyboard.eventMatches(event,"T")){ 
    (key == "T")? init_animation(p1,p0,time_length) : (init_animation(0,-Math.PI/5,1), key = "T")} 
  else if(keyboard.eventMatches(event,"N")){ 
    (key == "N")? init_animation(p1,p0,time_length) : (init_animation(0,Math.PI/5,1), key = "N")} 
  // TO-DO: BIND KEYS TO YOUR JUMP CUTS AND ANIMATIONS
  // Note: Remember spacebar sets jumpcut/animate! 
  // Hint: Look up "threex.keyboardstate by Jerome Tienne" for more info.



    });

// SETUP UPDATE CALL-BACK
// Hint: It is useful to understand what is being updated here, the effect, and why.
function update() {
  updateBody();

  requestAnimationFrame(update);
  renderer.render(scene,camera);
}

update();