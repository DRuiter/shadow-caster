function Point(x, y){
	this.x = x;
	this.y = y;

	return this;
}

Point.prototype.draw = function (ctx, options){
	if(!ctx.canvas || !ctx) throw 'Point.draw > No context specified';
	if(options == null) options = {};

	ctx.fillStyle = options.fillStyle || 'red';
	ctx.strokeStyle = options.fillStyle || '#ddd';

	var radius = options.radius || 3;

	ctx.beginPath();
	ctx.arc(this.x, this.y, radius, 0, Math.PI*2, true);
	ctx.closePath();
	ctx.fill();

	return this;
}

Point.prototype.lineTo = function (ctx, Point, options){
	if(!ctx.canvas || !ctx) throw 'Point.lineTo > No context specified';
	if(options == null) options = {};

	ctx.strokeStyle = options.strokeStyle || 'green';
	ctx.strokeWidth = options.strokeWidth || '2px';

	ctx.beginPath();
	ctx.moveTo(this.x, this.y);
	ctx.lineTo(Point.x, Point.y);
	ctx.closePath();
	ctx.stroke();

	return this;
}

Point.prototype.copy = function (){
	return new Point(this.x, this.y);
}

Point.prototype.get2DVector = function (Point, options){
	if(options == null) options = {};

	options.reverse = options.reverse || false;

	var x,y;

	if(!options.reverse) {
		x = this.x-Point.x;
		y = this.y-Point.y;
	} else {
		x = Point.x-this.x;
		y = Point.y-this.y;
	}

	return new DDVector(x, y);
}

Point.prototype.translate = function (DDVector, options) {
	if(DDVector == null) throw 'Point.translate > No 2DVector specified';
	if(options == null) options = {};

	options.scale = options.scale || 1;
	options.apply = options.apply || false;

	var x = this.x+(DDVector.x*options.scale),
		y = this.y+(DDVector.y*options.scale);

	if(options.apply){
		this.x = x;
		this.y = y;
	} else {
		return new Point(x, y);
	}
}

Point.prototype.offset = function (x, y, options){
	if(options == null) options = {};

	options.apply = options.apply || false;

	if(options.apply){
		this.x = this.x+x;
		this.y = this.y+y;
	} else {
		return new Point(this.x+x, this.y+y);
	}
}

function DDVector (x, y){
	this.x = x;
	this.y = y;

	this.magnitude 	= Math.sqrt(Math.pow(x, 2)+Math.pow(y, 2));
	this.angle		= Math.atan2(y, x)*180/Math.PI;

	if(x < 0 && y < 0) this.angle = this.angle+180;

	return this;
}

DDVector.prototype.angleFromVector = function ( vec ){
	return Math.acos(((this.x*vec.x)+(this.y*vec.y))/(this.magnitude*vec.magnitude)) //(A.B)/(A.mag*B.mag)
}

function Line (point1, point2) {
	this.points = [point1, point2];
}

Line.prototype.draw = function (ctx, options){
	if(!ctx.canvas || !ctx) throw 'Line.draw > No context specified';
	if(options == null) options = {};

	ctx.strokeStyle = options.strokeStyle || 'white';

	ctx.beginPath();
	ctx.moveTo(this.points[0].x, this.points[0].y);
	ctx.lineTo(this.points[1].x, this.points[1].y);
	ctx.closePath();

	ctx.stroke();
}

Line.prototype.getCenter = function(){
	return new Point((this.points[0].x+this.points[1].x)/2, (this.points[0].y+this.points[1].y)/2)
}


function Geometry( points ){
	this.points = points;
}

Geometry.prototype.draw = function (ctx, options){
	if(!ctx.canvas || !ctx) throw 'Geometry.draw > No context specified';
	if(options == null) options = {};

	var self = this;

	options.fill 	= options.fill || true;
	options.stroke 	= options.stroke || true;

	ctx.fillStyle = options.fillStyle || '#ddd';
	ctx.strokeStyle = options.strokeStyle || '#bbb';
	
	ctx.beginPath();
	ctx.moveTo(this.points[0].x, this.points[0].y);

	this.points.forEach(function (p, i, a){
		if(i === 0) return false;

		ctx.lineTo(p.x, p.y);

		if(i === a.length-1) ctx.lineTo(self.points[0].x, self.points[0].y);
	})

	ctx.closePath();
	
	if(options.fill) 	ctx.fill();
	if(options.stroke) 	ctx.stroke();
}

Geometry.prototype.getCenter = function (){
	var tx = 0, ty = 0;
	
	this.points.forEach(function (p){
		tx += p.x;
		ty += p.y;
	})

	return new Point(tx/this.points.length, ty/this.points.length);
}

Geometry.prototype.translate = function (DDVector, options){
	if(DDVector == null) throw 'Geometry.translate > No 2Dvector specified';
	if(options == null) options = {};

	options.apply 	= options.apply || false;

	var points, tp = [];

	if(options.apply){
		this.points.forEach(function (point){
			point = point.translate(DDVector, options);
		});
	} else {
		points = this.points.slice();

		points.forEach(function (point){
			tp.push(point.translate(DDVector, options));
		});

		return new Geometry(tp);
	}

	return this;
}

Geometry.prototype.clear = function (ctx, options){
	if(!ctx.canvas || !ctx) throw 'Geometry.clear > No context specified';
	if(options == null) options = {};

	var self = this;

	ctx.save();
	ctx.globalCompositeOperation = 'destination-out';
	ctx.beginPath();
	ctx.moveTo(this.points[0].x, this.points[0].y);

	this.points.forEach(function (p, i, a){
		if(i === 0) return false;

		ctx.lineTo(p.x, p.y);

		if(i === a.length-1) ctx.lineTo(self.points[0].x, self.points[0].y);
	})

	ctx.closePath();
	ctx.fill();
	ctx.restore();
}

Geometry.prototype.moveTo = function (point){
	var offset = point.get2DVector(this.getCenter());

	this.points.map(function (p){
		p.x += offset.x;
		p.y += offset.y;
	})
}

function Canvas(element){
	this.el 	= element;
	this.ctx 	= element.getContext('2d');
	this.bgcolor= element.style.backgroundColor;

	return this;
}

Canvas.prototype.init = function(){

	this.el.width 	= this.el.offsetWidth;
	this.el.height	= this.el.offsetHeight;

	console.log(this.el.width, this.el.height)
	return this;
}

Canvas.prototype.clear = function(){
	this.ctx.clearRect(0, 0, this.el.width, this.el.height);
}

Canvas.prototype.getCenter = function (){
	return new Point(this.el.width/2, this.el.height/2);
}

function Light(point, radius, intensity, color){
	this.pos 		= point;
	this.radius 	= radius || 4;
	this.intensity	= intensity || 100;
	this.color 		= color || 'white';
}

Light.prototype.draw = function (ctx){
	var gradient = ctx.createRadialGradient(
		this.pos.x,
		this.pos.y, 
		this.radius, 
		this.pos.x, 
		this.pos.y, 
		this.radius+this.intensity
	);

	gradient.addColorStop(0, this.color);
	gradient.addColorStop(1, '#000');

	ctx.fillStyle = gradient;
	ctx.fillRect(0,0,window.innerWidth, window.innerHeight);
}

Light.prototype.moveTo = function (point){
	this.pos = point;
}

Light.prototype.getShadowFins = function (GeometryList, options){
	if(GeometryList == null || !Array.isArray(GeometryList)) throw 'Light.getShadowFins > No GeometryList specified.';
	if(options == null) options = {};

	options.debug = options.debug || false;

	var self 	= this,
		fins 	= [];

	GeometryList.forEach(function (g, i, a){
		var angle = 0, points = [];
	
		for (var i = 0; i < g.points.length-1; i++) {
		    for (var j = i+1; j <= g.points.length-1; j++) {
		        var v1 = self.pos.get2DVector(g.points[i]),
		        	v2 = self.pos.get2DVector(g.points[j]),
		        	a = v1.angleFromVector(v2);

		        if(a > angle){
		        	angle = a;
		        	points = [
		        		g.points[i],
		        		g.points[j]
		        	];
		        }
		    }
		}

		fins.push(points);
		if(options.debug){
			points.forEach(function (p){
				p.draw(options.canvas.ctx, {fillStyle: 'green'})
				p.lineTo(options.canvas.ctx, self.pos)
			})
		}
	})

	return fins;
}

Light.prototype.calcShadowGeometry = function ( shadowFins ){
	var self = this,
		shadowGeometry;

	shadowGeometry = shadowFins.map(function (finList){
		var geoPoints = [], geometry = [];
		
		finList.forEach(function (fin){
			var vec = self.pos.get2DVector(fin, {reverse:true}),
				ext = fin.translate(vec, {scale: 500});

			geoPoints.push(fin);
			geoPoints.push(ext);
		})

		geometry = new Geometry([
			geoPoints[0],
			geoPoints[1],
			geoPoints[3],
			geoPoints[2]
		]);

		return geometry;
	})

	return shadowGeometry;
}

Light.prototype.drawShadows = function (ctx, GeometryList, options){
	if(!ctx.canvas || !ctx) throw 'Light.drawShadows > No context specified';
	if(options == null) options = {};

	options.debug = options.debug || false;

	var fins = this.getShadowFins(GeometryList, options),
		geo  = this.calcShadowGeometry(fins);

	geo.forEach(function (g){
		g.clear(ctx);
	})

	GeometryList.forEach(function (g){
		g.draw(ctx)
	})
}

$(function(){
	var canvas 	= new Canvas(document.getElementsByTagName('canvas')[0]),
		light 	= new Light(canvas.getCenter(), 4, 350, '#ddd'),
		objects	= generateObjects(canvas.el.offsetWidth, canvas.el.offsetHeight),
		context = {
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
				size = Math.round(Math.random()*40)+20

			objects.push(
				new Geometry([
					new Point(start.x, start.y),
					new Point(start.x+size, start.y),
					new Point(start.x+size, start.y+size),
					new Point(start.x, start.y+size)
				])
			)
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
		this.light.draw(this.canvas.ctx)
		this.light.drawShadows(this.canvas.ctx, this.objects)
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
})
