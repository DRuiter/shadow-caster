(function(){
	var canvas 	= new Canvas(document.getElementsByTagName('canvas')[0]),
			light 		= new Light(canvas.getCenter(), 4, 350, '#ddd'),
			objects		= generateObjects(canvas.el.offsetWidth, canvas.el.offsetHeight),
			context 	= {
				canvas: canvas,
				light: light,
				objects: objects
			};

	light.intensity = 600;
	canvas.init();

	function generateObjects(canvasWidth, canvasHeight){
		var objects = [];

		for(var i = 0, l = 20; i < l; i++){
			var start = {
					x: Math.round(Math.random()*canvasWidth),
					y: Math.round(Math.random()*canvasHeight)
				},
				size = Math.round(Math.random()*40)+20;

			objects.push(
				new Geometry([
					new Point(start.x, start.y),
					new Point(start.x+size, start.y),
					new Point(start.x+size, start.y+size),
					new Point(start.x, start.y+size)
				])
			);
		}

		return objects;
	}

	function onmousemove(e){
		var point = {
			x: e.clientX-this.canvas.el.offsetLeft,
			y: e.clientY-this.canvas.el.offsetTop
		};

		this.canvas.clear();
		this.light.moveTo(new Point(point.x, point.y));
		this.light.draw(this.canvas.ctx);
		this.light.drawShadows(this.canvas.ctx, this.objects);
	}

	function onmousewheel(e){
		if(e.deltaY < 0) this.light.intensity += 10;
		if(e.deltaY > 0) {
			if(this.light.intensity-10 > 0) this.light.intensity -= 10;
		}
		this.light.draw(this.canvas.ctx);
		this.light.drawShadows(this.canvas.ctx, this.objects);
	}

	document.getElementsByTagName('canvas')[0].onmousemove = onmousemove.bind(context);
	document.getElementsByTagName('canvas')[0].onmousewheel = onmousewheel.bind(context);

	if(window.ontouchstart){
		document.getElementsByTagName('canvas')[0].ontouchstart = onmousemove.bind(context);
	}

	onmousemove.bind(context)({
		clientX: (canvas.el.offsetWidth/2)+canvas.el.offsetLeft,
		clientY: (canvas.el.offsetHeight/2)+canvas.el.offsetTop
	});
})();
