// All code written by Matthias Southwick @mythius (github)




// GLOBAL VARIABLES
const audio = new auControl('music');
const fps = 60;
var sprites = [],bullets=[],bad_projectile=[],obsticles=[];
var allarr = [sprites,bullets,bad_projectile,obsticles];
var cowboy,boss;
var started = false;
var bullet_speed=10,reload_speed=30,reload=0;
var boss_reload_speed=20,boss_reload=0,HEALTH = 5;

var level = 0;
var setups = [level1_setup,level2_setup,level3_setup];
var bossturn = [level1_bossturn,level2_bossturn,level3_bossturn];
// Determine what the boss will do, and what functions will run based on level


// FUNCTIONS
function drawAll(){ // Sprite must be in sprites array to be drawn
	let temp = sprites.sort((a,b)=>b.layer-a.layer);
	for(let t of temp) if(t.getImg().src) t.draw();
}
function controls(){
	document.on('keydown',e=>{
		if(e.key == 'Escape'){
			clearInterval(LOOP);
			audio.stopAll();
			for(let s of sprites){
				let a = s.anim();
				if(a) a.stop();
			}
		}
		if(e.key == ' ' && !started) start();
	});
}



function loop(){ // main game loop

	ctx.clearRect(-1,-1,width+1,height+1); // Erase Screen
	
	// Update Sprites
	cowboy.step();
	for(let b of bullets){
		b.step(bullet_speed);
	}
	for(let b of bad_projectile){
		b.step(7);
		// b.pointAt(cowboy);
	}

	reload = Math.max(reload-1,0);
	if(mousedown && reload == 0){
		reload = reload_speed;
		let b = new Sprite();
		b.addAnimation('bullet/BulletAnimation.anims',true).then(()=>{
			b.anim().play('Flames',true);
		});
		b.goTo(cowboy);
		b.pointTowards(mousepos.x,mousepos.y);
		sprites.push(b);
		bullets.push(b);
		audio.play('shoot.m4a',.1);
	}

	boss_reload = Math.max(boss_reload-1,0);

	if(boss_reload == 0){
		bossturn[level]();
	}


	let bc = bad_projectile.length;
	while(bc--){
		let b = bad_projectile[bc];
		if(!b) continue;
		let bd = b.getData();
		if(!cowboy.touches) continue;
		if(cowboy.touches(b)){
			destroy(b);
			obj('p').innerHTML = 'OOFD';
			setTimeout(()=>{obj('p').innerHTML=''},1000);
			HEALTH = Math.max(HEALTH-1,0);
			var hpath = `Health/${5-HEALTH}.png`;
			obj('#health').src=hpath;
		}
		if(outOfBounds(bd.x,bd.y)){
			destroy(b);
		}
		for(let bu of bullets){
			if(!bu.touches || !b.touches) continue;
			if(bu.touches(b)){
				destroy(b);
				destroy(bu);
			}
		}
	}

	let buc = bullets.length;
	while(buc--){
		let s = bullets[buc];
		let d = s.getData();
		if(outOfBounds(d.x,d.y)){
			destroy(s);
		}
	}




	drawAll();
}

function setup(){
	cowboy = new Sprite();
	cowboy.addControls((keys,cd)=>{
		if(cowboy.anim() && !cowboy.anim().isPlaying()){
			if(keys.w) cowboy.anim().play('Walk-Up');
			if(keys.a) cowboy.anim().play('Walk-Left');
			if(keys.d) cowboy.anim().play('Walk-Right');
			if(keys.s) cowboy.anim().play('Walk-Down');
		}
		if(outOfBounds(cd.x,cd.y,-30)){
			return false;
		} 

		return true;
	});

	cowboy.addAnimation('player/Character.anims');
	cowboy.moveTo(200,500);
	sprites.push(cowboy);


	obj('#health').src=`Health/${5-HEALTH}.png`;

}




function level1_setup(){
	boss = new Sprite();
	boss.moveTo(800,500);
	boss.addAnimation('cactus/cactus.anims').then(()=>{
		boss.anim().play('walk-forward',true);
	});
	sprites.push(boss);

	let t1 = new Sprite('gravestone.png');
	t1.moveTo(400,600);
	sprites.push(t1);

	setBackdrop('Saloon.png');
	audio.play('song2.mp3',.3,true);

	let amount = random(3,7);
	for(let i=0;i<amount;i++){
		let table = new Sprite('table.png');
	}
}

function level1_bossturn(){
	boss_reload = boss_reload_speed;
	let poke = new Sprite('spike.png');
	poke.goTo(boss);
	poke.pointAt(cowboy);
	sprites.push(poke);
	bad_projectile.push(poke);
}

function level2_setup(){}
function level2_bossturn(){}
function level3_setup(){}
function level3_bossturn(){}

function next_level(){
	level++;
	HEALTH = 5;
	reset_level();
	setups[level]();
}

function reset_level(){
	for(let a of allarr){
		a = [];
	}
	sprites=[cowboy];
}


// 			TO DO
// ----------------------------
// 1) [ ] Player Gets Hit animation
// 2) [ ] Additional levels
// 3) [ ] Screensize recommendations
// 4) [ ] Title Screen
// 5) [ ] Win Screen
// 6) [ ] Improve Boss Movement Controls
// 7) [ ] Make UI

// STAT GAME (on space)
function start(){
	setup();
	LOOP = setInterval(loop,1000/fps);
	obj('p').innerHTML = '';
	started=true;
	HEALTH = 5;
	reset_level();
	setups[level]();
}

controls();