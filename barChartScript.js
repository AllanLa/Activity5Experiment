var barData = [20, 30, 45, 90, 0, 15, 20, 1, 5, 10, 50, 80, 90, 80, 80,
				3];

/* sorts the data in accending order
barData.sort(function compareNumbers(a,b){
	return a - b 
})
*/

var margin = { top: 30, right: 30, bottom: 40, left: 50 }

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

var colors = d3.scale.linear()
	.domain([0, d3.max(barData)]) 
	.range(['#FFB832', '#C61C6F'])

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
	.style('background', '#E7E0CB')
    .attr('width', width + margin.left + margin.right)
	.attr('height', height + margin.top + margin.bottom)
	.style('background', '#C9D7D6')
	.append('g')
	//moves graphic over x px using margin.left and y using margin.top
	.attr('transform', 'translate(' + margin.left + ', ' + margin.top +')')
	.selectAll('rect').data(barData)
	.enter().append('rect')
		.style('fill', colors)  //so over here would create a function
		.attr('width', xScale.rangeBand())//passing in colors(i) for horizontal change;
		.attr('height', 0)
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


/*
handling events in d3
*/
.on('mouseover', function(d){

	//whatever the mouse is over, sets the opacity to .5
	d3.select(this).style('opacity', .5)

	//delay is a transition after a certain amount of value
	//.transition().delay(value).duration(value) 
	toolTip.transition()
		.style('opacity', .9)

	//this will show a lil value when mouse is hovered over the chart
	toolTip.html(d)
		.style('left', (d3.event.pageX) +'px')
		.style('top', (d3.event.pageY) + 'px')

})

//when mouse leaves, changes opacity back

//transition to make chart spring up vertically, and horizontally
.on('mouseout', function(d){
	d3.select(this).style('opacity', 1)
})

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
	.ticks(10) //so 10 ticks

//used to actually add the y-axis to the chart
var yGuide = d3.select('svg').append('g')
	yAxis(yGuide)
	//creates the y-axis based on the chart, not hardcoded!
	yGuide.attr('transform', 'translate(' + margin.left + ', ' + margin.top +')') //move 25 px right, 10 pixel down, we wouldnt have seen the y-axis cause to far to the left
	yGuide.selectAll('path')
		.style({fill: 'none', stroke: "#000"})
	yGuide.selectAll('line') //creates the tick marks and sets it to 0
		.style({stroke: "#000"})	


//creates the x axis for us
var xAxis = d3.svg.axis()
	.scale(xScale)
	.orient('bottom')
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
	xGuide.selectAll('line') //creates the tick marks and sets it to 0
		.style({stroke: "#000"})	
