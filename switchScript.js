var currentUserAnswer; //variable to store user answer
var currentCorrectAnswer; //variable to store the current correct Answer
var users = [];  //variable to store the user and their progress at the end of the experiment
var answers = []; //Used to keep track of each question's correct Answer, userAnswer, and error
var currentQuestion = 1; //count to keep track of number of questions
var margin = { top: 30, right: 30, bottom: 40, left: 50 };
var currentChart = "none";
var TOTALQUESTIONS = 6;
var userID;


function end() {
	//closes the Window
	window.close()
	}


function start() {
	//Begins the survey by clearing everything then adding what is needed
	d3.selectAll(".centerIt").remove();
	d3.selectAll(".wrapper").remove();
	userID = (new Date()).toString(36);
	generateGraph();
	generateText();
}	

function generateGraph(){
	//generates number 0 and 3
	randomNumber = Math.floor(Math.random() * 3);
	
	if (randomNumber == 1){
		currentChart = "BarChart";
		generateBarGraph();
	}

	else if (randomNumber == 2){
		currentChart = "PieChart";
		generatePieChart();
	}

	else {
		currentChart = "StackedChart";
		generateStacked();
	}
}

function generateStacked(){
	//referenced from https://gist.github.com/anotherjavadude/2940908
    var w = 75,
    h = 500
    // create canvas
    var svg = d3.select("#chart")
    .append("svg")
	.style('background', '#C9D7D6')    
    .attr("width", w)
    .attr("height", h)
    .append("svg:g")
    .attr("align", "center")
    .attr("transform", "translate(25,470)");

    x = d3.scale.ordinal().rangeRoundBands([0, w-50])
    y = d3.scale.linear().range([0, h-50])            


// 4 columns: ID,c1,c2,c3
    var matrix = []

	var data = [1];
	for (var i=0, t=5; i<t; i++) {
    	data.push(Math.round(Math.random() * 100) + 20);
	}            

	matrix[0] = data;

    var remapped =["c1","c2","c3", "c4", "c5"].map(function(dat,i){
        return matrix.map(function(d,ii){
            return {x: ii, y: d[i+1] };
        })
    });

    var stacked = d3.layout.stack()(remapped)
    x.domain(stacked[0].map(function(d) { return d.x; }));
    y.domain([0, d3.max(stacked[stacked.length - 1], function(d) { return d.y0 + d.y; })]);
 
    // Add a group for each column.
    var valgroup = svg.selectAll("g.valgroup")
    .data(stacked)
    .enter().append("svg:g")
    .attr("class", "valgroup")
    .style("fill", "none")
    .style("stroke", "black");


    // Add a rect for each date.            
    var rect = valgroup.selectAll("rect")
    .data(function(d){return d;})
    .enter().append("svg:rect")
    .attr("x", function(d) { return x(d.x); })
    .attr("y", function(d) { return -y(d.y0) - y(d.y); })
    .attr("height", function(d) { return y(d.y); })
    .attr("width", x.rangeBand());
/*
	Used to create X Axis
	var xAxis = d3.svg.axis()
	    .scale(x)
	    .tickSize(0)
	    .orient("bottom");

    svg.append("g")
    .attr("class", "x axis")
    .call(xAxis);
*/

    d3.select("#chart").attr("align","center");   
    d3.selectAll("g.valgroup").attr("align", "center");

    generateStackedDots();
}			

function generateStackedDots(){
	//Only for stacked bargraphs
	var together = d3.selectAll("rect");;
	var arrayOfIndividuals = together[0];


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

	value1 = d3.select(rectangle1).data()[0].y
	value2 = d3.select(rectangle2).data()[0].y

	//after selecting rectangles will now add circles to the rectangles
	width1 = d3.select(rectangle1).attr("width");
	height1 = d3.select(rectangle1).attr("height");
	x1 = d3.select(rectangle1).attr("x");
	y1 = d3.select(rectangle1).attr("y") ;

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
    .attr("transform", "translate(25,470)")
    .attr("cx", parseInt(x1) + parseInt(12))
    .attr("cy", parseInt(y1) + parseInt(20))
	.attr("align", "center");


	d3.select("svg")
	.append("circle")
    .style("stroke", "gray")
    .style("fill", "black")
    .attr("r", 5)
    .attr("transform", "translate(25,470)")    
    .attr("cx", parseInt(x2) + parseInt(12))
    .attr("cy", parseInt(y2) + parseInt(20))
    .attr("align", "center");


    if(area1 < area2){
    	currentCorrectAnswer = ((area1 / area2) * 100).toFixed(2);
    }
    else{
    	currentCorrectAnswer = ((area2 / area1) * 100).toFixed(2);
    }

   generateAdjacentBars(value1, value2);
}			


function generatePieChart(){
	//Referenced from https://gist.github.com/enjalot/1203641
	var width = 300,                        //width
    height = 300,                            //height
    r = 150;                           //radius

	var data = [];
	for (var i=0, t=5; i<t; i++) {
    	data.push({"value" : Math.round(Math.random() * 40) + 3});
	}            


    
    var vis = d3.select("#chart")
        .append("svg")              //create the SVG element inside the <body>
		.style('background', 'white')
	    .attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
		.style('background', '#C9D7D6')
		.append('g')
		//moves graphic over x px using margin.left and y using margin.top
		.attr('transform', 'translate(' + margin.left + ', ' + margin.top +')')        
        .data([data])                   //associate our data with the document
            .attr("width", width)           //set the width and height of our visualization (these will be attributes of the <svg> tag
            .attr("height", height)
        .append("g")                //make a group to hold our pie chart
            .attr("transform", "translate(" + r + "," + r + ")")    //move the center of the pie chart from 0, 0 to radius, radius

    var arc = d3.svg.arc()              //this will create <path> elements for us using arc data
        .outerRadius(r);

    var pie = d3.layout.pie()           //this will create arc data for us given a list of values
        .value(function(d) { return d.value; });    //we must tell it out to access the value of each element in our data array

    var arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
        .data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
        .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
            .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
                .attr("class", "slice");    //allow us to style things in the slices (like text)
        arcs.append("svg:path")
                .attr("fill", "none" ) //set the color for each slice to be chosen from the color function defined above
                .attr("stroke", "black")
                .attr("d", arc);        //this creates the actual SVG path using the associated data (pie) with the arc drawing function
    


	//only for pie charts to generate dots
	var arrayOfSlices = d3.selectAll("g.slice")[0];

	//Picked two random parts of the pieChart
	ranNum1 = Math.floor(Math.random() * arrayOfSlices.length);
	ranNum2 = Math.floor(Math.random() * arrayOfSlices.length);	

	while ( ranNum1 == ranNum2) {
		ranNum1 = Math.floor(Math.random() * arrayOfSlices.length);
	}

	slice1 = arrayOfSlices[ranNum1];
	slice2 = arrayOfSlices[ranNum2];


	d3.select(slice1).append("circle")
		.style("stroke", "gray")
		.style("fill", "black")
		.attr("r", 5)                                   //add a label to each slice
    	.attr("transform", function(d) {                    //set the label's origin to the center of the arc
    	//we have to make sure to set these before calling arc.centroid
    	d.innerRadius = 0;
    	d.outerRadius = r;
    	return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
		})

	d3.select(slice2).append("circle")
		.style("stroke", "gray")
		.style("fill", "black")
		.attr("r", 5)                                   //add a label to each slice
        .attr("transform", function(d) {                    //set the label's origin to the center of the arc
        //we have to make sure to set these before calling arc.centroid
        d.innerRadius = 0;
        d.outerRadius = r;
        return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
    })

 	d3.select(slice1).select("path").attr("fill", "green")        
    d3.select(slice2).select("path").attr("fill", "green") 	

	value1= d3.select(slice1).data()[0].value
	value2= d3.select(slice2).data()[0].value                

    d3.select("#chart").attr("align","center");


    if(value1 < value2){
    	currentCorrectAnswer = ((value1 / value2) * 100).toFixed(2);    	
    }
    else{
    	currentCorrectAnswer = ((value2 / value1) * 100).toFixed(2);
    }

    generateAdjacentBars(value1, value2);
}

function generateBarGraph(){
	//var barData = [20, 30, 45, 90, 0, 15, 20, 1, 5, 10, 50, 80, 90, 80, 80,
	//				3];

	/* sorts the data in accending order
	barData.sort(function compareNumbers(a,b){
		return a - b 
	})
	*/

	var barData = [];
	for (var i=0, t=5; i<t; i++) {
    	barData.push(Math.round(Math.random() * 40) + 3)
	}


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
				return d;
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


	d3.select("#chart").attr("align","center");	

	generateBarDots();
}

function generateBarDots(){
	//Only for rectangles, together selects all the Rectangles and puts it into
	//a nested array like [Array[8]], so gotta extract the children
	var together = d3.selectAll("rect");;
	var arrayOfValues = d3.selectAll("rect").data()
	var arrayOfIndividuals = together[0];

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

    generateAdjacentBars(value1, value2);

}

function generateAdjacentBars(value1, value2){


	var barData = [value1, value2];

	
	var height = 200 - margin.top - margin.bottom,
		width = 300 - margin.left - margin.right,
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

	var chart = d3.select('#chart2').append('svg')
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
				return d;
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

	var chart2 = d3.select("#chart2").select("svg")[0][0];

	var yGuideScale = d3.scale.linear()
		.domain([0, d3.max(barData)])
		.range([height, 0]) // makes the range backgrounds so y axis looks right

	var yAxis = d3.svg.axis()
		.scale(yGuideScale)
		.orient('left') //allignment of the scale
		.tickFormat(""); //so 10 ticks

	//used to actually add the y-axis to the chart
	var yGuide = d3.select(chart2).append('g')
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

	var xGuide = d3.select(chart2).append('g')
		xAxis(xGuide)
		xGuide.attr('transform', 'translate(' + margin.left + ', ' + 
				(margin.top + height) +')')
		xGuide.selectAll('path')
			.style({fill: 'none', stroke: "#000"})


	d3.select("#chart2").attr("align","center");	
}

function generateText(){
	d3.select("div").classed("wrapper", true).html("Two values are marked with dots." 
		+ "<br/>" + "What do you think the percent of the smaller value is to the larger value?"
		+ "<br/>" + "Please input your answer below." + "<br/>"	+
		"e.g. If you think the smaller one is exactly a half of the bigger one" 
		+ "<br/>" + "please enter 50."
		+" <br/>" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" 
		+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" 
		+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" 
		+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" 
		+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" 
		+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" 
		+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
		+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
		+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
		+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
		+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
		+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
		+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
		+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" 
		+ currentQuestion + "/" + TOTALQUESTIONS);

	
	
	d3.selectAll("form").style("visibility", "visible");
	d3.select("form").on("submit", function() {
	d3.event.preventDefault();
  	return false;
	});	
}

function nextChart(){
	//Chooses the next chart after recording currentUserAnswer / Data
	currentUserAnswer = parseInt(d3.select("input").property("value"));

	if ( typeof currentUserAnswer != 'number' || isNaN(currentUserAnswer)){
		alert("Please Enter a Number");
		return false;
	}

	document.getElementById("myForm").reset();
	formatResults();

	currentQuestion += 1;
	d3.select("svg").remove(); //Will get rid of the current chart
	d3.select("#chart2").select("svg").remove() //get rid of the second chart

	if (currentQuestion > TOTALQUESTIONS){
		endSurvey();
	}

	generateText();
	generateGraph(); //Generate a different graph
}

function formatResults(){
	//Error - log2(|judged% - true%| + 1/8)	
	var e = Math.log2(Math.abs(currentUserAnswer - currentCorrectAnswer) 
			+ (1.0/8.0));

	console.log("Your answer is " + currentUserAnswer);
	console.log("Current correct answer is " + currentCorrectAnswer);
	console.log("Current chart is a " + currentChart);
	console.log("Error is " + e);

	/*object created to hold the current question chart type,
	  currentUserAnswer, currentCorrectAnswer, and error*/
	var object = { chart: currentChart, userAnswer: currentUserAnswer,
		correctAnswer: currentCorrectAnswer, error: e};

	answers.push(object);

}

function endSurvey(){
	/*
	Removes everything from the document
	*/
	d3.select(".wrapper")[0][0].remove();
	d3.select("form")[0][0].remove()
	d3.select(".container").remove();
	d3.select("div").classed("wrapper", true).html("Thanks for your participation!");	
	
	//pushes an object with the userID, and the arrayOfAnswers into the array of Users
	users.push({user: userID, arrayOfAnswers: answers});	
	//for some reason, if I do not have an error, the webpage just freezes
	//document.clea();
}


