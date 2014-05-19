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