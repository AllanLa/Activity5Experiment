function start(){
	createBarChart("chart", [1,2,3,4,5]);
}

function createBarChart(chartID, barData){
	/*a target chartID of where to place the chart and
	data in the form of an array to create the barchart*/

	/*
	var barData = [];
	for (var i=0, t=5; i<t; i++) {
    	barData.push(Math.round(Math.random() * 40) + 3)
	}
	*/	
	var margin = { top: 30, right: 30, bottom: 40, left: 50 };

	var height = 400 - margin.top - margin.bottom,
		width = 600 - margin.left - margin.right,
		barWidth = 50,
		varOffset = 5;

	var yScale = d3.scale.linear()
			.domain([0, d3.max(barData)])
			.range([0, height])
	/*
	the domain is the original information,
	the range is the thing we want to fit it into,
	remaps the Y value so that everything will fit into the
	size of the chart, using a quantitative scale
	*/

	var xScale = d3.scale.ordinal()
			.domain(d3.range(0,barData.length))
			.rangeBands([0, width])
			//.rangeBands([0, width]), .2), the .2 gives padding between each bar
	/*
	ordinal scales are used to scale horizontally, essentially the
	horizontal positioning of the data, rangeBands allows more
	control with the padding between elements and width of the
	element as well, use rangeBands to set the ordinal scale
	and rangeBand to find the width of the element
	*/


	/*would use bardata.length isntead of max(barData) if want to
	change color depending on horizontal value */

	/*Color scale, so basically the smaller the data, it will be the color
	on the left, whereas the larger the data, the closer it will be to the
	right, so color changes depending on the Y value*/

	var toolTip = d3.select('body').append('div')
		.style('position', 'absolute')
		.style('padding', '0 10px')
		.style('background', 'white')
		.style('opacity', 0)

	/*position = absolute will allow toolTip to follow
	in relation to the page
	padding would be 0 px on the top and bottom, and 10
	from side to side*/

	var chart = d3.select('#chart').append('svg')
		.style('background', 'white')
	    .attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
		.style('background', '#C9D7D6')
		.append('g')
		//moves graphic over x px using margin.left and y using margin.top
		.attr('transform', 'translate(' + margin.left + ', ' + margin.top +')')
		.selectAll('rect').data(barData)
		.enter().append('rect')
			.style('fill', 'none')  //so over here would create a function
			.style("stroke", "black")
			.attr('width', xScale.rangeBand())//passing in colors(i) for horizontal change;
			.attr('height', function(d){
				return yScale(d);
			})
			.attr('x', function(d, i){
				return xScale(i);
			})
	/*
	like how d is passed in as an element from barData, i is also passed
	in as the index of the element from the data
	*/		
			.attr('y' , height)

	/*
	selects the chart ID from the html document, adds a <svg>
	tag after it with the cavas 400 x 600, so the selectAll('rect') selects
	all the rectangles that don't exist yet, but we are creating rectangles
	which then it selects it, then it styles it up, etc.
	*/


	chart.transition()
		.attr('height', function(d){
			return yScale(d);
		})
		.attr('y', function(d,i){
			return height - yScale(d);
		})
		.delay(function(d,i){
			return i * 10;
		})
		.duration(1000) //slows down the drawing of each bar by a second
		.ease('elastic') //makes it bounce up and down

	var yGuideScale = d3.scale.linear()
		.domain([0, d3.max(barData)])
		.range([height, 0]) // makes the range backgrounds so y axis looks right

	var yAxis = d3.svg.axis()
		.scale(yGuideScale)
		.orient('left') //allignment of the scale
		.tickFormat(""); //so 10 ticks

	//used to actually add the y-axis to the chart
	var yGuide = d3.select('svg').append('g')
		yAxis(yGuide)
		//creates the y-axis based on the chart, not hardcoded!
		yGuide.attr('transform', 'translate(' + margin.left + ', ' + margin.top +')') //move 25 px right, 10 pixel down, we wouldnt have seen the y-axis cause to far to the left
		yGuide.selectAll('path')
			.style({fill: 'none', stroke: "#000"})



	//creates the x axis for us
	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient('bottom')
		.tickFormat("")
		.tickValues(xScale.domain().filter(function(d,i){
			return !(i % (barData.length / 4));
		}))/*the way to create x ticks is because
			initially we might not know how many values we have for the
			x axis, could be 10 ticks, or 20 ticks, so the way to do
			this is with the function. The filter prevents a tick
			on every single bar so we use that*/

	//actually adds the x axis to the chart
	var xGuide = d3.select('svg').append('g')
		xAxis(xGuide)
		xGuide.attr('transform', 'translate(' + margin.left + ', ' + 
				(margin.top + height) +')')
		xGuide.selectAll('path')
			.style({fill: 'none', stroke: "#000"})


	d3.select(chartID).attr("align","center");	

	generateBarDots();
}

function generateBarDots(){
	//Only for rectangles, together selects all the Rectangles and puts it into
	//a nested array like [Array[8]], so gotta extract the children
	var together = d3.selectAll("rect");;
	var arrayOfValues = d3.selectAll("rect").data()
	var arrayOfIndividuals = together[0];
	var margin = { top: 30, right: 30, bottom: 40, left: 50 };

	//Picked two random parts of the rectangle
	ranNum1 = Math.floor(Math.random() * arrayOfIndividuals.length);
	ranNum2 = Math.floor(Math.random() * arrayOfIndividuals.length);

	while ( ranNum1 == ranNum2) {
		ranNum1 = Math.floor(Math.random() * arrayOfIndividuals.length);
	}

	rectangle1 = arrayOfIndividuals[ranNum1];
	rectangle2 = arrayOfIndividuals[ranNum2];

	d3.select(rectangle1).style("fill", "green");
	d3.select(rectangle2).style("fill", "green");

	if(ranNum1 < ranNum2){
		value1 = arrayOfValues[ranNum1];
		value2 = arrayOfValues[ranNum2];
	}

	else{
		value1 = arrayOfValues[ranNum2];
		value2 = arrayOfValues[ranNum1];		
	}


	//after selecting rectangles will now add circles to the rectangles
	width1 = d3.select(rectangle1).attr("width");
	height1 = d3.select(rectangle1).attr("height");
	x1 = d3.select(rectangle1).attr("x");
	y1 = d3.select(rectangle1).attr("y");

	width2 = d3.select(rectangle2).attr("width");
	height2 = d3.select(rectangle2).attr("height");
	x2 = d3.select(rectangle2).attr("x");
	y2 = d3.select(rectangle2).attr("y");

	area1 = width1 * height1;
	area2 = width2 * height2;

	d3.select("svg")
	.append("circle")
    .style("stroke", "gray")
    .style("fill", "black")
    .attr("r", 5)
    .attr('transform', 'translate(' + margin.left + ', ' + margin.top +')')
    .attr("cx", parseInt(x1) + parseInt(30))
    .attr("cy", parseInt(y1) - parseInt(10));

	d3.select("svg")
	.append("circle")
    .style("stroke", "gray")
    .style("fill", "black")
    .attr("r", 5)
    .attr('transform', 'translate(' + margin.left + ', ' + margin.top +')')
    .attr("cx", parseInt(x2) + parseInt(30))
    .attr("cy", parseInt(y2) - parseInt(10));

    if(area1 < area2){
    	currentCorrectAnswer = ((area1 / area2) * 100).toFixed(2);
    }
    else{
    	currentCorrectAnswer = ((area2 / area1) * 100).toFixed(2);
    }

    ranNum = Math.floor(Math.random() * 3);

    if (ranNum == 0){
    	currentAdaptation = "barLine";
   		generateBarLine(ranNum1, ranNum2);
   	} else if (ranNum == 1){
   		currentAdaptation = "adjacentBars";
    	generateAdjacentBars(value1, value2);
    } else{
    	currentAdaptation = "none";
    }

}