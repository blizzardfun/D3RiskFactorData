
//Behavioral Risk Factor State Survey (BRFSS) Data
// d3.csv("assets/data/data.csv", function(error, surveyData) {
        // if (error) throw error; 
// need version 5   Read CSV
d3.csv("assets/data/data.csv").then(function(surveyData) {
    
    // parse data
    surveyData.forEach(function(d) {
        d.poverty = +d.poverty
        d.povertyMoe = +d.povertyMoe
        d.age = +d.age
        d.income = +d.income
        d.obesity = +d.obesity
        d.obesityHigh = +d.obesityHigh
        d.obesityLow = +d.obesityLow
        d.smokes = +d.smokes
        d.smokesHigh = +d.smokesHigh
        d.smokesLow = +d.smokesLow;

      });
console.log(surveyData);





//  a function that automatically resizes the chart
function makeResponsive() {

    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
    var svgArea = d3.select("body").select("svg");
  
    // clear svg is not empty
    if (!svgArea.empty()) {
      svgArea.remove();
    }
  
    // SVG wrapper dimensions are determined by the current width and
    // height of the browser window.
    var svgWidth = window.innerWidth;
    var svgHeight = window.innerHeight;
  
    var margin = {
      top: 50,
      bottom: 50,
      right: 70,
      left: 50
    };
  
    var height = svgHeight - margin.top - margin.bottom;
    var width = svgWidth - margin.left - margin.right;
  
// ***********************************************
// graphing function definitions
//**************************************************
//function to allow chosing between x scales 
function xScale(surveyData, chosenXAxis){
    var XLinearScale=d3.scaleLinear ()
        .domain([d3.min(surveyData,d => d[chosenXAxis] *0.96), 
                 d3.max(surveyData,d => d[chosenXAxis] * 1.05)])
        .range([0,width]);
    return XLinearScale;
    }
//function to allow chosing between y scales
function yScale(surveyData, chosenYAxis){
    var YLinearScale=d3.scaleLinear ()
        .domain([d3.min(surveyData,d => d[chosenYAxis] * 0.94), 
                    d3.max(surveyData,d => d[chosenYAxis] * 1.05)])
        .range([height,0]);
    return YLinearScale;
    }

//***************************************************** */

    // Append SVG element
    var svg = d3.select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

   // Append group element
   var chartGroup = svg.append("g")
   .attr("transform", `translate(${margin.left}, ${margin.top})`);

// create initial scales *************
    //initial x and y scales poverty and obesity
    chosenXAxis= "obesity";
    chosenYAxis = "poverty"
  // xLinearScale function 
    var xLinearScale = xScale(surveyData, chosenXAxis);

    // yLinearScale function 
    var yLinearScale = yScale(surveyData, chosenYAxis);

//initial Axis and append ***************
  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .call(leftAxis);

// Initial data circles **********
  // append initial data blocks 
  //to contain circles and text
  var circlesGroup = chartGroup.selectAll("circle")
        .data(surveyData)
    var element = circlesGroup.enter()
        .append("g")
        .attr("transform",
            d=> `translate( ${xLinearScale(d.obesity)}, 
                       ${yLinearScale(d.poverty)})`)

        var circle= element.append("circle")
            .attr("r", 20)
            .classed("stateCircle" ,true)
            .attr("opacity", ".5");

        var text = element.append("text")
            .attr("text-anchor", "middle")
            .attr("dy",5)
            // .classed("stateText chart" ,true)
            .attr("text", d=> d.abbr);


  };  //function makeResponsive

makeResponsive();
d3.select(window).on("resize", makeResponsive);

}); // data read