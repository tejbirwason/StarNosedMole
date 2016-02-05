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
camera.position.set(65,20,50);
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

var headGeometry = makeCube();
headGeometry.applyMatrix(new THREE.Matrix4().set(8,0,0,0, 0,8,0,0, 0,0,8,0, 0,0,0,1));

var noseGeometry = makeCube();
noseGeometry.applyMatrix(new THREE.Matrix4().set(4,0,0,0, 0,4,0,0, 0,0,3,0, 0,0,0,1));

var tailGeometry = makeCube();
tailGeometry.applyMatrix(new THREE.Matrix4().set(2,0,0,0, 0,2,0,0, 0,0,16,0, 0,0,0,1));

var lrgTentGeometry = makeCube();
lrgTentGeometry.applyMatrix(new THREE.Matrix4().set(0.2,0,0,0, 0,0.2,0,0, 0,0,4,0, 0,0,0,1));

var smallTentGeometry = makeCube();
smallTentGeometry.applyMatrix(new THREE.Matrix4().set(0.1,0,0,0, 0,0.1,0,0, 0,0,3,0, 0,0,0,1));

var pawGeometry = makeCube();
pawGeometry.applyMatrix(new THREE.Matrix4().set(4,0,0,0, 0,2,0,0, 0,0,8,0, 0,0,0,1));

var clawGeometry = makeCube();
clawGeometry.applyMatrix(new THREE.Matrix4().set(0.3,0,0,0, 0,0.3,0,0, 0,0,3,0, 0,0,0,1));


// MATRICES

// torso
var torsoMatrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,8, 0,0,1,0, 0,0,0,1);
var torsoRotMatrix = torsoMatrix

// head
var headMatrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,2, 0,0,1,16, 0,0,0,1);
var headTorsoMatrix = multiplyMatrices(torsoMatrix, headMatrix);
var headRotMatrix = headTorsoMatrix
var headAloneRotMatrix = headMatrix

// tail
var tailMatrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,-6, 0,0,1,-14, 0,0,0,1);
var tailTorsoMatrix = multiplyMatrices(torsoMatrix, tailMatrix);
var tailRotMatrix = tailTorsoMatrix
var tailAloneRotMatrix = tailMatrix

// nose
var noseMatrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,0, 0,0,1,5, 0,0,0,1);
var noseFinalMatrix = multiplyMatrices(headTorsoMatrix, noseMatrix);
var noseRotMatrix = noseFinalMatrix

// paws (clockwise order starting from front right)
var pawMatrix = [];
pawMatrix[0] = new THREE.Matrix4().set(1,0,0,-7, 0,1,0,-9, 0,0,1,12, 0,0,0,1);
pawMatrix[1] = new THREE.Matrix4().set(1,0,0,-7, 0,1,0,-9, 0,0,1,-9, 0,0,0,1);
pawMatrix[2] = new THREE.Matrix4().set(1,0,0,7, 0,1,0,-9, 0,0,1,-9, 0,0,0,1);
pawMatrix[3] = new THREE.Matrix4().set(1,0,0,7, 0,1,0,-9, 0,0,1,12, 0,0,0,1);
var pawMatrixFinal = [];
var pawRotMatrix = [];
var pawAloneRotMatrix = [];
for(var i=0;i<4;i++){
  pawMatrixFinal[i] = multiplyMatrices(torsoMatrix, pawMatrix[i]);
  pawRotMatrix[i] = pawMatrixFinal[i];
  pawAloneRotMatrix[i] = pawMatrix[i];
}

// claws
var clawMatrix = [];
var clawMatrixFinal = [];
var k=0;
for(var i=0;i<4;i++){
  var temp = pawMatrixFinal[i];
  for(var j=0;j<5;j++){
    clawMatrix[k] = new THREE.Matrix4().set(1,0,0,(j-2)/1.2, 0,1,0,-0.5, 0,0,1,5, 0,0,0,1);
    clawMatrixFinal[k] = multiplyMatrices(temp, clawMatrix[k]);
    k++;
  }
}

// large tentacles
var lRTM = []; // large right tentacles matrix
var lRTMfinal = [];
var lRTRotMatrix = []; 
var lRTMalone = [];
var lLTM = []; // large left tentacles matrix
var lLTMfinal =[];
var lLTRotMatrix = []; 
var lLTMalone = [];
for(var i=0;i<9;i++){
  lRTM[i] = new THREE.Matrix4().set(1,0,0,2, 0,1,0,(i-4)/2.5, 0,0,1,3, 0,0,0,1);
  lLTM[i] = new THREE.Matrix4().set(1,0,0,-2, 0,1,0,(i-4)/2.5, 0,0,1,3, 0,0,0,1);
  lRTMfinal[i] = multiplyMatrices(noseFinalMatrix, lRTM[i]);
  lLTMfinal[i] = multiplyMatrices(noseFinalMatrix, lLTM[i]);
  lRTRotMatrix[i] = lRTMfinal[i];
  lLTRotMatrix[i] = lLTMfinal[i];
  lRTMalone[i] = lRTM[i];
  lLTMalone[i] = lLTM[i];
}

// small tentacles
var sRTM = []; // small right tentacles matrix
var sRTMfinal = [];
var sRTMalone = [];
var sLTM = []; // small left tentacles matrix
var sLTMfinal =[];
var sLTMalone = [];
for(var i=0;i<2;i++){
  sRTM[i] = new THREE.Matrix4().set(1,0,0,1, 0,1,0,1-2*i, 0,0,1,3, 0,0,0,1);
  sLTM[i] = new THREE.Matrix4().set(1,0,0,-1, 0,1,0,2*i-1, 0,0,1,3, 0,0,0,1);
  sRTMfinal[i] = multiplyMatrices(noseFinalMatrix, sRTM[i]);
  sLTMfinal[i] = multiplyMatrices(noseFinalMatrix, sLTM[i]);
  sRTMalone[i] = sRTM[i];
  sLTMalone[i] = sLTM[i];
}

// create torso
var torso = new THREE.Mesh(torsoGeometry,normalMaterial);
torso.setMatrix(torsoMatrix);
scene.add(torso);

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

//create large tentacles
var lRTmesh = []; // large right tentacles mesh
var lLTmesh = []; // large left tentacles mesh
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

//create small tentacles
var sRTmesh = []; // small right tentacles mesh
var sLTmesh = []; // small left tentacles mesh 
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

// paws
var pawMesh = [];
for(var i=0;i<4;i++){
  var paw = new THREE.Mesh(pawGeometry,normalMaterial);
  paw.setMatrix(pawMatrixFinal[i]);
  scene.add(paw);
  pawMesh[i] = paw;
}

// claws
var clawMesh = [];
for(var i=0;i<20;i++){
  var claw = new THREE.Mesh(clawGeometry,normalMaterial);
  claw.setMatrix(clawMatrixFinal[i]);
  scene.add(claw);
  clawMesh[i] = claw;
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
var jumpcut = false;

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
  var time = clock.getElapsedTime(); // t seconds passed since the clock started.
  if (time > time_end){
    p = p1;
    animate = false;
    return;
  }
  if (jumpcut){
    p = p1;
  } else {
    p = (p1 - p0)*((time-time_start)/time_length) + p0; // current frame 
  }

  switch(true)
  {
      // body up/down
    case((key == "U" || key == "E" )&& animate):
      torsoRotate(-p);
      break

      // head left/right
    case((key == "H" || key == "G" ) && animate):
      headRotate(-p);
      break

      // tail left/right
    case((key == "T" || key == "V" ) && animate):
      tailRotate(-p);
      break

      // tentacles fan out
    case((key == "N" ) && animate):
      tentaclesRotate(p);
      break

      // swim
    case((key == "S" ) && animate):
      if (jumpcut){
        p = p1;
        pawAngle = 0
        tailAngle = Math.PI/5
        headAngle = Math.PI/5
        tailStraightAngle = 0
      } else {
        pawAngle = (Math.PI/5)*((time-time_start)/time_length) - Math.PI/5;
        tailAngle = (2*Math.PI/5)*((time-time_start)/time_length) - Math.PI/5;
        headAngle = (2*Math.PI/5)*((time-time_start)/time_length) - Math.PI/5;
        tailStraightAngle = (-Math.PI/5)*((time-time_start)/time_length) + Math.PI/5;
      }

      // first half swim
      if(sCount%3 == 0){
        rotatePaw(1,p);
        rotatePaw(3,p);

        //head move right
        headRotate(-p);

        //tail move left
        tailRotate(-p);

        //tentacles fan out
        tentaclesRotate(p);

      }

      // next half swim
      else if (sCount%3 == 1){
        rotatePaw(1,-pawAngle);
        rotatePaw(3,-pawAngle);

        //tail move all the way right
        tailRotate(tailAngle);


        // activate opposite paws
        rotatePaw(0,p);
        rotatePaw(2,p);

        //turn head all the way left
        headRotate(headAngle);

      }
      // go to original
      else if(sCount%3 == 2){
        //back to original postion for paws
        rotatePaw(0,-pawAngle);
        rotatePaw(2,-pawAngle);

        // tail back to normal postion
        tailRotate(tailStraightAngle);

        // head back to original position
        headRotate(-pawAngle);

        //tentacles fan in
        tentaclesRotate(-pawAngle);
      }
      break;

    // custom digging motion
    case((key == "D" ) && animate):
      digPaw(0,p);
      digPaw(3,p);
      break;

      default:
        break;
    }
}

// Helper methods
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

function torsoRotate(angle){
  torsoRotMatrix = multiplyMatrices(torsoMatrix,rot_x(angle));
  torso.setMatrix(torsoRotMatrix); 
  tailRotMatrix = multiplyMatrices(torsoRotMatrix,tailMatrix);
  tail.setMatrix(tailRotMatrix);
  headRotMatrix = multiplyMatrices(torsoRotMatrix,headAloneRotMatrix);
  head.setMatrix(headRotMatrix);
  noseRotMatrix = multiplyMatrices(headRotMatrix,noseMatrix);
  nose.setMatrix(noseRotMatrix);
  for(var i=0;i<9;i++){
    lRTRotMatrix[i] = multiplyMatrices(noseRotMatrix,lRTMalone[i]);
    lRTmesh[i].setMatrix(lRTRotMatrix[i]);
    lLTRotMatrix[i] = multiplyMatrices(noseRotMatrix,lLTMalone[i]);
    lLTmesh[i].setMatrix(lLTRotMatrix[i]);
  }
  for(var i=0;i<2;i++){
    var smallRightTentRotMatrix = multiplyMatrices(noseRotMatrix,sRTMalone[i]);
    sRTmesh[i].setMatrix(smallRightTentRotMatrix);
    var smallLeftTentRotMatrix = multiplyMatrices(noseRotMatrix,sLTMalone[i]);
    sLTmesh[i].setMatrix(smallLeftTentRotMatrix);
  }
  for(var i=0;i<4;i++){
    pawRotMatrix[i] = multiplyMatrices(torsoRotMatrix,pawAloneRotMatrix[i]);
    pawMesh[i].setMatrix(pawRotMatrix[i]);
  }
  var k=0;
  for(var i=0;i<4;i++){
    for(var j=0;j<5;j++){
      var clawRotMatrix = multiplyMatrices(pawRotMatrix[i],clawMatrix[k]);
      clawMesh[k].setMatrix(clawRotMatrix);
      k++;
    }
  }
}

function headRotate(angle){
      headAloneRotMatrix = multiplyMatrices(headMatrix,rot_y(angle));
      headRotMatrix = multiplyMatrices(torsoRotMatrix,headAloneRotMatrix);
      head.setMatrix(headRotMatrix); 
      noseRotMatrix = multiplyMatrices(headRotMatrix,noseMatrix);
      nose.setMatrix(noseRotMatrix);
      for(var i=0;i<9;i++){
        lRTRotMatrix[i] = multiplyMatrices(noseRotMatrix,lRTMalone[i]);
        lRTmesh[i].setMatrix(lRTRotMatrix[i]);
        lLTRotMatrix[i] = multiplyMatrices(noseRotMatrix,lLTMalone[i]);
        lLTmesh[i].setMatrix(lLTRotMatrix[i]);
      }
      for(var i=0;i<2;i++){
        var smallRightTentRotMatrix = multiplyMatrices(noseRotMatrix,sRTMalone[i]);
        sRTmesh[i].setMatrix(smallRightTentRotMatrix);
        var smallLeftTentRotMatrix = multiplyMatrices(noseRotMatrix,sLTMalone[i]);
        sLTmesh[i].setMatrix(smallLeftTentRotMatrix);
      }
}

function tailRotate(angle){
  tailAloneRotMatrix = multiplyMatrices(tailMatrix,rot_y(angle));
  var tailFinalRotMatrix = multiplyMatrices(torsoRotMatrix,tailAloneRotMatrix);
  tail.setMatrix(tailFinalRotMatrix); 
}

function tentaclesRotate(angle){
  for(var i=0;i<9;i++){
    lRTMalone[i] = multiplyMatrices(lRTM[i],rot_y(angle));
    lRTRotMatrix[i] = multiplyMatrices(noseRotMatrix,lRTMalone[i]);
    lRTmesh[i].setMatrix(lRTRotMatrix[i]); 

    lLTMalone[i] = multiplyMatrices(lLTM[i],rot_y(-angle));
    lLTRotMatrix[i] = multiplyMatrices(noseRotMatrix,lLTMalone[i]);
    lLTmesh[i].setMatrix(lLTRotMatrix[i]);
  }
  for(var i=0;i<2;i++){
    sRTMalone[i] = multiplyMatrices(sRTM[i],rot_y(angle));
    var smallTentRightFinalRotMatrix = multiplyMatrices(noseRotMatrix,sRTMalone[i]);
    sRTmesh[i].setMatrix(smallTentRightFinalRotMatrix); 

    sLTMalone[i] = multiplyMatrices(sLTM[i],rot_y(-angle));
    var smallTentLeftFinalRotMatrix = multiplyMatrices(noseRotMatrix,sLTMalone[i]);
    sLTmesh[i].setMatrix(smallTentLeftFinalRotMatrix);
  }
}

function rotatePaw(index, angle){
  var rightPawRotMatrix = multiplyMatrices(pawMatrix[index],rot_x(angle));
  var rightPawFinalRotMatrix = multiplyMatrices(torsoRotMatrix,rightPawRotMatrix);
  pawMesh[index].setMatrix(rightPawFinalRotMatrix); 
  for(var i=5*index;i<5*index+5;i++){
    clawMesh[i].setMatrix(multiplyMatrices(rightPawFinalRotMatrix,clawMatrix[i]));
  }
}

function digPaw(index, angle){
  pawAloneRotMatrix[index] = multiplyMatrices(pawMatrix[index],rot_x(angle));
  var rightPawFinalRotMatrix = multiplyMatrices(torsoRotMatrix,pawAloneRotMatrix[index]);
  pawMesh[index].setMatrix(rightPawFinalRotMatrix); 
  for(var i=5*index;i<5*index+5;i++){
    var clawRotMatrix = multiplyMatrices(rightPawFinalRotMatrix,clawMatrix[i]);
    clawMesh[i].setMatrix(multiplyMatrices(clawRotMatrix,rot_x(angle*5/4)));
  }
}

// LISTEN TO KEYBOARD
// Hint: Pay careful attention to how the keys already specified work!
var keyboard = new THREEx.KeyboardState();
var grid_state = false;
var key;
var sCount = -1;
keyboard.domElement.addEventListener('keydown',function(event){
  if (event.repeat)
    return;
  if(keyboard.eventMatches(event,"Z")){  // Z: Reveal/Hide helper grid
    grid_state = !grid_state;
    grid_state? scene.add(grid) : scene.remove(grid);}   
  else if(keyboard.eventMatches(event,"0")){    // 0: Set camera to neutral position, view reset
    camera.position.set(45,0,0);
    camera.lookAt(scene.position);}
  else if(keyboard.eventMatches(event," ")){ 
    jumpcut = !jumpcut;
    console.log(jumpcut);} 
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
  else if(keyboard.eventMatches(event,"D")){ 
    (key == "D")? init_animation(p1,p0,time_length) : (init_animation(0,Math.PI/5,1), key = "D")} 
  else if(keyboard.eventMatches(event,"S")){ 
      init_animation(0,Math.PI/5,1);
      key = "S"; 
      sCount++;
  } 
});

// SETUP UPDATE CALL-BACK
// Hint: It is useful to understand what is being updated here, the effect, and why.
function update() {
  updateBody();

  requestAnimationFrame(update);
  renderer.render(scene,camera);
}

update();