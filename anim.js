function Animation(element,file){
	var FILE = JSON.parse(file);
	var frames=[],curr_frame=0;
	var frLists=FILE.frames.map(e=>e.frames),animID=0;
	var names = FILE.frames.map(e=>e.name);
	var img = element;
	var isLoop=true,isPlaying=false;
	var fps=30, frame_count = FILE.count;
	var directory = FILE.dirname;
	var n = (''+frame_count).length;
	for(let i=0;i<frame_count;i++){
		frames.push(directory+'/'+(('0'.repeat(n)+i).slice(-n))+'.png');
	}
	element.src=frames[0];
	this.setFrame=function(f){
		img.src = frames[f];
	}
	this.play=function(name,isl){
		var index = names.indexOf(name);
		if(index!=-1){
			fps = FILE.frames[index].fps;
			animID = index;
			curr_frame=0;
			isLoop=isl;
			loop();
			var prom = new Promise(res=>{
				var i = setInterval(l,1000/fps);
				function l(){
					if(!isPlaying){
						res();
						clearInterval(i);
					}
				}
			});
			return prom;
		}
	}
	function loop(){
		isPlaying=true;
		if(curr_frame>=frLists[animID].length){
			if(isLoop){
				curr_frame=0;
				loop();
			} else {
				isPlaying=false;
				cancelAnimationFrame(loop);
				img.src=frames[frLists[animID][frLists[animID].length-1]];
			}
		} else {
			setTimeout(function(){
				requestAnimationFrame(loop);
			},1000/fps);
			img.src=frames[frLists[animID][curr_frame]];
			curr_frame++;
		}
	}
	this.getImage=()=>img;
	this.setFPS=function(f){fps=f;}
	this.playCustom=function(c,isl){
		if(c<frLists.length){
			animID=c;
			curr_frame=0;
			isLoop=isl;
			loop();
		}
	}
	this.stop=function(){
		cancelAnimationFrame(loop);
		isPlaying=false;
		isLoop=false;
		img.src=frames[frLists[animID][frLists[animID].length-1]];
		curr_frame=frLists[animID].length;
	}
	this.getFrame=()=>curr_frame;
	this.isLoop=()=>isLoop;
	this.isPlaying=()=>isPlaying;
}