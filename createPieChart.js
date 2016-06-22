function createPieChart(chartID, data){
	/*function to create a pieChart taking in a chartID
      and data in the form of an array consisting of object
      {data: value}*/


    var margin = { top: 30, right: 30, bottom: 40, left: 50 };
	var width = 300,                        //width
    height = 300,                            //height
    r = 150;                           //radius

    
    var vis = d3.select(chartID)
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

    d3.select(chartID).attr("align","center");


    if(value1 < value2){
    	currentCorrectAnswer = ((value1 / value2) * 100).toFixed(2);    	
    }
    else{
    	currentCorrectAnswer = ((value2 / value1) * 100).toFixed(2);
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