Node.prototype.on=(a,b,c)=>{this.addEventListener(a,b,c)}

var width,height;
var canvas=obj('canvas'),ctx=canvas.getContext('2d');
var mouse = false,mousepos;
const SHOW_HITBOXES = false;

function destroy(thing,array){
	array.splice(array.indexOf(thing),1);
}

function resize(){
	width = window.innerWidth;
	height = window.innerHeight;
	canvas.width = width;
	canvas.height = height;
}
function loop(){

	ctx.clearRect(-1,-1,width+1,height+1);
	
	updateCacti();
	updateBullets();
	shoot();

	if(table.touches(dude)){
		let dx = dude.getData().x;
		let tx = table.getData().x;
		if(dx < tx){
			table.setDir(90);
		} else {
			table.setDir(270);
		}
	}


	table.draw();
	dude.step();
	cacti.draw();
}
function updateCacti(){
	let nl = cact.length;
	while(nl--){
		let n = cact[nl];
		let dat = n.getData();
		let pp = dude.getData();
		let dir = getDir(dat.x-pp.x,dat.y-pp.y);
		let d = getPointIn(dir,4);
		n.step(d.x,d.y);
		n.setDir(dir*180/Math.PI+90);
		if(n && n.touches(dude)){
			destroy(n,cact);
		}
		if(n && n.touches(table)){
			destroy(n,cact);
		}
	}
}
function updateBullets(){
	let bl = bullets.length;
	while(bl--){
		let b = bullets[bl];
		let pt = getPointIn(b.initialDir,10);
		b.setDir(b.initialDir * 180 / Math.PI + 90);
		b.step(pt.x,pt.y);
		for(let n of cact){
			if(b && b.touches(n)){
				destroy(b,bullets);
				destroy(n,cact);
			}
		}
		let d = b.getData();
		let offset = 100;
		if(d.x < -100 || d.x > width + 100 || d.y < -100 || d.y > height + 100){
			destroy(b,bullets);
		}
		if(b && b.touches(table)){
			destroy(b,bullets);
		}
	}
}
function shoot(){
	reload = Math.max(reload-1,0);
	if(mouse && reload == 0){
		reload = reload_speed;
		let bullet = new Sprite('boolet.png');
		let dat = dude.getData();
		let x = dat.x+dat.w/2;
		let y = dat.y-dat.h/2;
		bullet.goTo(x,y);
		let dir = getDir(x-mousepos.x-16,y-mousepos.y-25);
		bullet.initialDir = dir;
		bullets.push(bullet);
	}
}
function controls(){
	document.on('keydown',e=>{
		if(e.key == 'Escape') clearInterval(LOOP);
		if(e.key == ' '){
			let np = new Sprite('cactiball.png');
			let pp = dude.getData();
			let x = random(0,width);
			let y = random(0,height);
			np.goTo(x,y);
			np.initialDir = getDir(x - pp.x,y - pp.y) * 180 / Math.PI;
			cact.push(np);
		}
		if(!music_started){
			music_started = true;
			audio.play('song1.mp3',1,true);
		}
	});

	document.on('mousedown',e=>{
		mouse = true;
	});

	document.on('mousemove',e=>{
		mousepos = new Vector(e.clientX,e.clientY);
	})

	document.on('mouseup',e=>{
		mouse = false;
	});
}

var table = new Sprite('table/0.png');
table.goTo(400,500);

const audio = new auControl('music');
const fps = 30;
var LOOP;


var dude = new Sprite('Cowboy.png');
var cacti = new Sprite('cactus/0.png');
cacti.goTo(800,500);
var cacti_walk;

xml('cactus.anims',text=>{
	let img = cacti.getImg();
	cacti_walk = new Animation(img,text);
	cacti_walk.play('walk-forward',true);
});



dude.goTo(200,500);
var cact = [];
var bullets = [];
let reload = 0;
var reload_speed = 5;
let i=0;
var music_started = false;

resize();
window.onresize = resize;
dude.addControls();
controls();

LOOP = setInterval(loop,1000/fps);