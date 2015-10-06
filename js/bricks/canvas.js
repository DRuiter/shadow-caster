function Canvas(element){
	this.el 			= element;
	this.ctx 			= element.getContext('2d');
	this.bgcolor	= element.style.backgroundColor;

	return this;
}

Canvas.prototype.init = function(){

	this.el.width 	= this.el.offsetWidth;
	this.el.height	= this.el.offsetHeight;

	return this;
};

Canvas.prototype.clear = function(){
	this.ctx.clearRect(0, 0, this.el.width, this.el.height);
};

Canvas.prototype.getCenter = function (){
	return new Point(this.el.width/2, this.el.height/2);
};
