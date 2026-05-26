// Tearable cloth physics engine (cloth.js)
// -------------------------------------------------
// This script creates a canvas with id "c" and runs the cloth simulation.
// It is intended to be used on the landing page.

// CONFIGURATION
var canvas, ctx;
var cloth, boundsx, boundsy;

var gravity = 0.2;
var damping = 0.99;
var mouse_influence = 20;
var mouse_cut = 5;
var tear_distance = 60;
var cloth_height = 30;
var cloth_width = 50;
var spacing = 7;
var start_y = 20;
var physics_accuracy = 2;

var mouse = { down: false, button: 1, x: 0, y: 0, px: 0, py: 0 };

function initCloth() {
  canvas = document.getElementById('c');
  if (!canvas) { console.error('Canvas #c not found'); return; }
  ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  start();
}
// Expose init function for React component
window.initCloth = initCloth;

window.onresize = function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  boundsx = canvas.width - 1;
  boundsy = canvas.height - 1;
};

function start() {
  canvas.onmousedown = function(e) {
    mouse.button = e.which;
    mouse.px = mouse.x;
    mouse.py = mouse.y;
    var rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.down = true;
    e.preventDefault();
  };

  canvas.onmouseup = function(e) {
    mouse.down = false;
    e.preventDefault();
  };

  canvas.onmousemove = function(e) {
    mouse.px = mouse.x;
    mouse.py = mouse.y;
    var rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    e.preventDefault();
  };

  canvas.oncontextmenu = function(e) { e.preventDefault(); };

  boundsx = canvas.width - 1;
  boundsy = canvas.height - 1;
  ctx.strokeStyle = '#888';
  cloth = new Cloth();
  update();
}

window.requestAnimFrame = (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(cb){ setTimeout(cb, 1000/60); });

function update() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  cloth.update();
  cloth.draw();
  requestAnimFrame(update);
}

var Cloth = function(){
  this.points = [];
  var start_x = canvas.width/2 - cloth_width*spacing/2;
  for(var y=0; y<=cloth_height; y++){
    for(var x=0; x<=cloth_width; x++){
      var p = new Point(start_x + x*spacing, start_y + y*spacing);
      if(y===0) p.pin(p.x,p.y);
      if(x!==0) p.attach(this.points[this.points.length-1]);
      if(y!==0) p.attach(this.points[x + (y-1)*(cloth_width+1)]);
      this.points.push(p);
    }
  }
};
Cloth.prototype.update = function(){
  var i=this.points.length;
  while(i--){ this.points[i].resolve_constraints(); }
  i=this.points.length;
  while(i--){ this.points[i].update(0.016); }
};
Cloth.prototype.draw = function(){
  ctx.beginPath();
  var i=this.points.length;
  while(i--){ this.points[i].draw(); }
  ctx.stroke();
};

var Point = function(x,y){
  this.x=x; this.y=y; this.px=x; this.py=y; this.vx=0; this.vy=0;
  this.constraints=[]; this.pin_x=null; this.pin_y=null;
};
Point.prototype.pin=function(px,py){ this.pin_x=px; this.pin_y=py; };
Point.prototype.attach=function(p){ this.constraints.push(new Constraint(this,p)); };
Point.prototype.remove_constraint=function(c){ this.constraints.splice(this.constraints.indexOf(c),1); };
Point.prototype.resolve_constraints=function(){
  if(this.pin_x!==null){ this.x=this.pin_x; this.y=this.pin_y; return; }
  var i=this.constraints.length;
  while(i--){ this.constraints[i].resolve(); }
  if(this.x>boundsx) this.x=2*boundsx - this.x; else if(this.x<1) this.x=2 - this.x;
  if(this.y>boundsy) this.y=2*boundsy - this.y; else if(this.y<1) this.y=2 - this.y;
};
Point.prototype.add_force=function(x,y){ this.vx+=x; this.vy+=y; };
Point.prototype.update=function(delta){
  if(mouse.down){
    var dx=this.x-mouse.x, dy=this.y-mouse.y, d=Math.hypot(dx,dy);
    if(mouse.button==1 && d<mouse_influence){ this.px = this.x - (mouse.x-mouse.px)*1.8; this.py = this.y - (mouse.y-mouse.py)*1.8; }
    else if(d<mouse_cut){ this.constraints=[]; }
  }
  this.add_force(0,gravity);
  delta*=delta;
  var nx = this.x + ((this.x - this.px)*damping) + ((this.vx/2)*delta);
  var ny = this.y + ((this.y - this.py)*damping) + ((this.vy/2)*delta);
  this.px=this.x; this.py=this.y; this.x=nx; this.y=ny; this.vx=0; this.vy=0;
};
Point.prototype.draw=function(){
  var i=this.constraints.length;
  while(i--){ this.constraints[i].draw(); }
};

var Constraint = function(p1,p2){ this.p1=p1; this.p2=p2; this.length=spacing; };
Constraint.prototype.resolve=function(){
  var dx=this.p1.x - this.p2.x, dy=this.p1.y - this.p2.y, d=Math.hypot(dx,dy);
  if(d>tear_distance){ this.p1.remove_constraint(this); return; }
  var diff = (this.length - d)/d;
  var ox = dx*diff*0.5, oy = dy*diff*0.5;
  this.p1.x += ox; this.p1.y += oy; this.p2.x -= ox; this.p2.y -= oy;
};
Constraint.prototype.draw=function(){ ctx.moveTo(this.p1.x,this.p1.y); ctx.lineTo(this.p2.x,this.p2.y); };
