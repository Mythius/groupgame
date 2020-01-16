Node.prototype.on=(a,b,c)=>{this.addEventListener(a,b,c)} // replace addEventListener with .on

var width,height; // Screen and canvas width / height
var canvas=obj('canvas'),ctx=canvas.getContext('2d');
var mouse = false,mousepos;
const SHOW_HITBOXES = false; // Makes green hitbox apear around every 'Sprite'

// More of these functions in helpers.js file
function radians(deg){return deg*Math.PI/180} // computer works in radians
function getDir(x,y){return (Math.atan(y/x)+(x<0?0:Math.PI))*180/Math.PI} // Gets direction to a point (delta x, delta y)
function getPointIn(dir,dist,ox=0,oy=0){
	// get a point in a location based on distance and direction from original point
	let x = ox + Math.cos(dir) * dist;
	let y = oy + Math.sin(dir) * dist;
	return new Vector(x,y);
}
function destroy(thing){
	// remove all pointers and hope garbage collection does its job
	for(let array of allarr){
		if(array.includes(thing)) array.splice(array.indexOf(thing),1);
	}
}
function resize(){
	// scales canvas, i really wish i could make static sized pages (maybe electron will work)
	width = window.innerWidth;
	height = window.innerHeight;
	canvas.width = width;
	canvas.height = height;
}
function outOfBounds(x,y,margin=100){
	// checks point to see of out of bounds with margin
	return (x<-margin||x>width+margin||y<-margin||y>height+margin);
}

var mousepos = new Vector(0,0);
var mousedown=false;

document.on('mousemove',e=>{
	mousepos.x = e.clientX + 16;
	mousepos.y = e.clientY + 16;
});

document.on('mousedown',e=>{
	mousedown = true;
});

document.on('mouseup',e=>{
	mousedown = false;
})


resize();
window.onresize = resize;

function setBackdrop(image){
	// set backdrop (signifies next level);
	canvas.style.backgroundImage = `url(${image})`;
}

function preload(){ // Load images before runtime
	function add(url){
		let l = create('img');
		l.src=url;
		document.head.appendChild(l); // load into head as not to be seen
		l.onload = function(){
			l.remove();
		}
	}
	// name: folder name, max: last image (image names are numbered) 
	var flist = [{name:'bullet',max:7},{name:'cactus',max:15},{name:'player',max:19}];
	for(let f of flist){
		let base = f.name;
		let len = (f.max+'').length;
		for(let i=0;i<=f.max;i++){
			let url = base + '/' + ('0'.repeat(len)+(i+'')).slice(-len) + '.png';
			add(url);
		}
	}
}
preload();