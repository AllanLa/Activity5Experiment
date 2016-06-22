
function createStackedChart(chartID, matrix){
	//referenced from https://gist.github.com/anotherjavadude/2940908
    var w = 75,
    h = 500
    // create canvas
    var svg = d3.select(chartID)
    .append("svg")
	.style('background', '#C9D7D6')    
    .attr("width", w)
    .attr("height", h)
    .append("svg:g")
    .attr("align", "center")
    .attr("transform", "translate(25,470)");

    x = d3.scale.ordinal().rangeRoundBands([0, w-50])
    y = d3.scale.linear().range([0, h-50])            


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

    d3.select(chartID).attr("align","center");   
    d3.selectAll("g.valgroup").attr("align", "center");

    information = generateStackedDots();
    return information;
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

	ranNum = Math.floor(Math.random() * 2);

    if (ranNum == 0){
    	currentAdaptation = "none";
   	} else{
   		currentAdaptation = "adjacentBars";
    	generateAdjacentBars(value1, value2);
    }

    return [currentCorrectAnswer, currentAdaptation];
}			