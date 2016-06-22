function generateAdjacentBars(value1, value2){
	//creates a two valued barChart for adjacent comparison

	data = [value1, value2]
	var myChart = createBarChart("#chart2", data, 200, 300);

}

function generateBarLine(ranNum1, ranNum2){
	/*Line Morph adaptation */

	var margin = { top: 30, right: 30, bottom: 40, left: 50 };
	var together = d3.selectAll("rect");;
	var arrayOfIndividuals = together[0];	
	rectangle1 = arrayOfIndividuals[ranNum1];
	rectangle2 = arrayOfIndividuals[ranNum2];	

	//after selecting rectangles will now add circles to the rectangles
	width1 = d3.select(rectangle1).attr("width");
	height1 = d3.select(rectangle1).attr("height");
	x1 = d3.select(rectangle1).attr("x");
	y1 = d3.select(rectangle1).attr("y");

	width2 = d3.select(rectangle2).attr("width");
	height2 = d3.select(rectangle2).attr("height");
	x2 = d3.select(rectangle2).attr("x");
	y2 = d3.select(rectangle2).attr("y");


	var height = 400 - margin.top - margin.bottom;

	area1 = width1 * height1;
	area2 = width2 * height2;


	if (area1 < area2){
		
		d3.select("svg").append("line")
		.attr("x1", function() {

			if (ranNum1 < ranNum2 || (parseInt(ranNum1) + parseInt(1) == ranNum2)){
				return x1;
			}
			else{
				return parseInt(x1) + parseInt(width1);
			}
		})
		.attr("x2", function() {

			if (ranNum1 < ranNum2 && (parseInt(ranNum1) + parseInt(1) == ranNum2)){
				return parseInt(x2) + parseInt(width2);
			}
			else if (ranNum1 < ranNum2){
				return parseInt(x2) + parseInt(width2);
			}

			else{
				return x2;
			}
		})
		.attr("y1", height - height1)
		.attr("y2", height - height1)
		.attr("stroke", "grey")
		.attr("stroke-width", 3)
		.attr("storke-dasharray", ("3 , 3"))
		    .attr('transform', 'translate(' + margin.left + ', ' + margin.top +')');
	}

	//area1 > area2
	else{
		d3.select("svg").append("line")
		.attr("x1", function() { 
			if (ranNum1 < ranNum2){
				return x1;
			}
			else{
				return parseInt(x1) + parseInt(width1);
			}
		})
		.attr("x2", function() { 
			if (ranNum2 < ranNum1){
				return x2;
			}
			else{
				return parseInt(x2) + parseInt(width2);
			}
		})
		.attr("y1", height - height2)
		.attr("y2", height - height2)
		.attr("stroke", "grey")
		.attr("stroke-width", 3)
		.attr("storke-dasharray", ("3 , 3"))
		    .attr('transform', 'translate(' + margin.left + ', ' + margin.top +')');
	}
}
