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