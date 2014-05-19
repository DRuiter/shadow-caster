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
