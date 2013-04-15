
var canvasChart = function(options){
	this.options = options || false; 
	this.chartData = [];
}

canvasChart.prototype = {
	addData : function(data){
		this.chartData.push(data);
	},

	render : function(){

	  var canvasId = this.options.canvasId;
	  var height = this.options.height;
	  var width = this.options.width;
	  var posX = this.options.posX;
	  var posY = this.options.posY;
	  var max = this.options.max;

	  var canvasBlock = document.getElementById(canvasId);
   	  var canvas = canvasBlock.getContext('2d');
   	  var x_unitSize = Math.floor(width/this.chartData.length)/2;
   	  


   	  var renderData = [];
   	  /* 1. calculate positions */
   	  for(var i=0; i<this.chartData.length; i++){
   	  	var dataRecord = this.chartData[i];
   	  	renderData.push({x:dataRecord.x*x_unitSize, y:height-(dataRecord.y*height)});
   	  }

   	  console.log(renderData);

   	  /* 2. render on canvas */

   	  for(var i=0; i<renderData.length; i++){ //points
   	    canvas.beginPath();
   	  	canvas.arc(renderData[i].x, renderData[i].y, 3, 0, 2 * Math.PI, false);
       	canvas.lineWidth = 3;
      	canvas.strokeStyle = '#dedede';
      	canvas.stroke();
      	canvas.fillStyle = "#dedede";
        canvas.fill();
        canvas.closePath();
   	  }

   	  for(var i=0; renderData.length; i++){
   	  	canvas.beginPath();
	    	canvas.moveTo(renderData[i].x,renderData[i].y);
		    canvas.lineTo(renderData[i+1].x,renderData[i+1].y);
		    canvas.lineWidth = 3;
      	canvas.strokeStyle = '#dedede';
		    canvas.stroke();
   	  }
	}
}