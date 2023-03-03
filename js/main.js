// Requirments
// https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js
// https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.12.0/matter.min.js
// https://cdn.jsdelivr.net/npm/pathseg@1.1.0/pathseg.min.js - for SVG only
// https://rawgit.com/schteppe/poly-decomp.js/master/build/decomp.js - for concave shapes

    // module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Common = Matter.Common,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    World = Matter.World,
    Vertices = Matter.Vertices,
    Bodies = Matter.Bodies,
    Svg = Matter.Svg,
    
    // Width / height of Window
    width = window.innerWidth,
    height = window.innerHeight,
    
    // create an engine
    engine = Engine.create(),

    // create a renderer
    render = Render.create({
      element: document.body,
      engine: engine,
      options: {
        wireframes: false,
        background: 'transparent',
        width: width,
        height: height,
        pixelRatio: window.devicePixelRatio // here
      }
    }),
  
    // Bodies  
    ground = Bodies.rectangle(0, height, width*10, 1, { isStatic: true, render: {fillStyle: 'transparent'}}),
    wallOne = Bodies.rectangle(0, 0, 1, height*10, {isStatic: true, render: {fillStyle: 'transparent'}}),
    wallTwo = Bodies.rectangle(width, 0, 1, height*10, {isStatic: true,render: {fillStyle: 'transparent'}}),
    title = Bodies.rectangle(width / 2, height / 2, 110, 70, {isStatic: true,render: {fillStyle: 'transparent',strokeStyle: 'transparent'}}),
    
    // Arrays for Elements
    vertexSets = [],
    //color = ['#4798D3','#FF1D43','#2D3081','#FF8500','#FFCC00','#FFEF42','#DFCEA1','#74B700','#387339','#00A98C','#D1DFDF','#A7DAEC','#D7D5E3','#91388C','#DD358A','#FFCCDE'],
    color = ['#440099','#440099','#440099','#440099','#440099','#440099','#440099','#440099','#440099','#440099','#440099','#440099','#440099','#440099','#440099','#440099'],
    
    // Element Selctor
    elSVG = $('svg');


function init() {

  // Loop though SVG and make bodies out of paths
  elSVG.find('path').each(function(i, path){
    
    // elColour = Common.choose(color);
    elColour = color[i];
    var thisPath = Svg.pathToVertices(path);
    
    World.add(engine.world, Bodies.fromVertices(   
      (Math.random() * width / 2) + width / 4,
      // -100,
      Math.round(Math.random() * (-1 - -100) + -400),
      thisPath, 
      { 
        render: {
          fillStyle: elColour,
          strokeStyle: elColour,
          lineWidth: 1
        },
      },
    ));
 

  });
 
  // Engine
  engine.velocityIterations = 2;
  engine.world.gravity.scale = 0.001;
    
  // Create Static Bodies
  vertexSets.push(ground, wallOne, wallTwo, title)

  // add all of the bodies to the world
  World.add(engine.world, vertexSets);

  // run the engine
  Engine.run(engine);

  // run the renderer
  Render.run(render);
  
    // add mouse control
    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });

    World.add(engine.world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;
  
  
  
} //eo: init

 // add gyro control - Browser issues? 
var updateGravity = function(event) {
  var orientation = typeof window.orientation !== 'undefined' ? window.orientation : 0,
      gravity = engine.world.gravity;

  if (orientation === 0) {
    gravity.x = Common.clamp(event.gamma, -90, 90) / 90;
    gravity.y = Common.clamp(event.beta, -90, 90) / 90;
  } else if (orientation === 180) {
    gravity.x = Common.clamp(event.gamma, -90, 90) / 90;
    gravity.y = Common.clamp(-event.beta, -90, 90) / 90;
  } else if (orientation === 90) {
    gravity.x = Common.clamp(event.beta, -90, 90) / 90;
    gravity.y = Common.clamp(-event.gamma, -90, 90) / 90;
  } else if (orientation === -90) {
    gravity.x = Common.clamp(-event.beta, -90, 90) / 90;
    gravity.y = Common.clamp(event.gamma, -90, 90) / 90;
  }
};


init();

// Gyroscope on Mobile - Browser issues? 
// window.addEventListener('deviceorientation', updateGravity);

// Re-draw vertexSets on window re-size
$(window).resize(function() {
  
});

window.addEventListener('resize', () => { 
  render.bounds.max.x = element.clientWidth;
  render.bounds.max.y = element.clientHeight;
  render.options.width = element.clientWidth;
  render.options.height = element.clientHeight;
  render.canvas.width = element.clientWidth;
  render.canvas.height = element.clientHeight;
  Matter.Render.setPixelRatio(render, window.devicePixelRatio); // added this
});