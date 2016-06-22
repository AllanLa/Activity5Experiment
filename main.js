var CHARTID = "#chart";
var TOTALQUESTIONS = 20;
var currentQuestion = 1;
var information; /*an array [currentCorrectAnswer, currentAdaptation, currentChart, currentUserAnswer]*/
var answerArray = []; //Used to keep track of objects containing information for each question
var users = []; //at the end of the survey, this array will store the user and all their answers
var userID;

function start(){
	//Begins the survey by clearing everything then adding what is needed
	d3.selectAll(".centerIt").remove();
	d3.selectAll(".wrapper").remove();
	userID = (new Date()).toString(36);
	main();
}

function end() {
	//closes the Window
	window.close()
}

function main(){
	generateText();
	information = generateGraph();
}

function generateGraph(){
	//generates number 0 and 3
	randomNumber = Math.floor(Math.random() * 3);
	chartWidth = 600;
	chartHeight = 400;
	/*answers is an array [currentCorrectAnswer, currentAdaptation, 
		currentChart]*/

	if (randomNumber == 1){

		data = generateData("BarChart");
		answers = createBarChart(CHARTID, data, chartHeight, chartWidth);
		answers.push("BarChart");

		return answers;
	}

	else if (randomNumber == 2){

		data = generateData("PieChart");	
		answers = createPieChart(CHARTID, data);
		answers.push("PieChart");

		return answers;
	}

	else {

		data = generateData("StackedChart");
		answers = createStackedChart(CHARTID, data);
		answers.push("StackedChart");

		return answers;
	}
}

function generateData(type){
	//returns data for a specific type of chart
	if (type == "BarChart"){

		var barData = [];
		for (var i=0, t=5; i<t; i++) {
	    	barData.push(Math.round(Math.random() * 40) + 3)
		}		
		return barData;

	} else if (type == "PieChart"){
		var data = [];
		for (var i=0, t=5; i<t; i++) {
	    	data.push({"value" : Math.round(Math.random() * 40) + 3});
		}
		return data;            		

	} else{
	    var matrix = []

		var data = [1];
		for (var i=0, t=5; i<t; i++) {
	    	data.push(Math.round(Math.random() * 100) + 20);
		}            

		matrix[0] = data;
		return matrix;
	}
}

function generateText(){
	/*Generates the dialouge for the experiemnt*/

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
	/*Chooses next chart after recording and refining user Answer*/

	currentUserAnswer = parseInt(d3.select("input").property("value"));	
	currentQuestion += 1;

	currentUserAnswer = parseInt(d3.select("input").property("value"));

	if ( typeof currentUserAnswer != 'number' || isNaN(currentUserAnswer)){
		alert("Please Enter a Number");
		return false;
	}

	information.push(currentUserAnswer);
	document.getElementById("myForm").reset();
	formatResults();

	d3.select("svg").remove(); //Will get rid of the current chart
	d3.select("#chart2").select("svg").remove() //get rid of the second chart

	if (currentQuestion > TOTALQUESTIONS){
		endSurvey();
	}	
	main();

}

function formatResults(){
	/*an array [currentCorrectAnswer, currentAdaptation, currentChart, currentUserAnswer]*/
	currentCorrectAnswer = information[0];
	currentAdaptation = information[1];
	currentChart = information[2];
	currentUserAnswer = information[3];

	//Error - log2(|judged% - true%| + 1/8)	
	var e = Math.log2(Math.abs(currentUserAnswer - currentCorrectAnswer) 
			+ (1.0/8.0));

	console.log("Your answer is " + currentUserAnswer);
	console.log("Current correct answer is " + currentCorrectAnswer);
	console.log("Current chart is a " + currentChart);
	console.log("Current adaptation is " + currentAdaptation);
	console.log("Error is " + e);
	console.log("");

	/*object created to hold the current question chart type,
	  currentUserAnswer, currentCorrectAnswer, and error*/
	var object = { chart: currentChart, adaptation: currentAdaptation, 
				userAnswer: currentUserAnswer, correctAnswer: currentCorrectAnswer, 
				error: e};

	answerArray.push(object);
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
	users.push({user: userID, arrayOfAnswers: answerArray});	

	//for some reason, if I do not have an error, the webpage just freezes
	document.clea();
}