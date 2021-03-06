
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
    var svgArea = d3.select("#scatter").select("svg");
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
      bottom: 90,
      right: 40,
      left: 70
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

// function used for updating xAxis var upon click on axis label
function xRenderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }

  // function used for updating yAxis var upon click on axis label
function yRenderAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
  }
// function used to update circles on a change in x or y axis
function renderCircles (circlesGroup, xScale, yScale, chosenXAxis, chosenYAxis ){
    circlesGroup.selectAll("circle")
        .transition()
        .duration(1000)
        .attr("cx", d=> xScale(d[chosenXAxis]))
        .attr("cy", d =>yScale(d[chosenYAxis]));

      // circlesGroup.selectAll("text")
        newText.transition()
        .duration(1000)
        .attr("x", d=> xScale(d[chosenXAxis]))
        .attr("y", d =>yScale(d[chosenYAxis]-0.15));    
    return circlesGroup;
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
        .enter()

        /* circle for each block */
        var newCircle=circlesGroup.append("circle")
            .attr("cx", d=> xLinearScale(d[chosenXAxis]))
            .attr("cy", d =>yLinearScale(d[chosenYAxis]))
            .attr("r", 15)
            .classed("stateCircleObesity" ,true)
            .attr("opacity", ".5");

        /* Create the text for each block */
       var newText=circlesGroup.append("text")
            .attr("x", d=> xLinearScale(d[chosenXAxis]))
            .attr("y",d =>yLinearScale(d[chosenYAxis]-0.15))
            .classed("stateTextObesity" ,true)
            .text(d => d.abbr);

  // append group for  2 x- axis labels **************
  var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var obesityLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "obesity") // value to grab for event listener
    .classed("active", true)
    .text("Obese (%)");

  var smokesLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "smokes") // value to grab for event listener
    .classed("inactive", true)
    .text("Smokers (%)");

// append group for  2 y- axis labels **************
var ylabelsGroup = chartGroup.append("g")
.attr("transform", `translate(0, ${height/2}) rotate (-90)`);

var povertyLabel = ylabelsGroup.append("text")
.attr("x", 0)
.attr("y", -40)
.attr("value", "poverty") // value to grab for event listener
.classed("active", true)
.text("In Poverty (%)");

var incomeLabel = ylabelsGroup.append("text")
.attr("x", 0)
.attr("y", -60)
.attr("value", "income") // value to grab for event listener
.classed("inactive", true)
.text("Household Income (Median)");

     //  Initialize Tooltip
     var toolTip = d3.tip()
     .attr("class", "tooltip")
     .offset([80, -60])   //offset from page event
     .html(function(d) {
       if (chosenYAxis === 'income') {
        return (`<strong>${d.state} </strong><br> ${chosenXAxis}:${d[chosenXAxis]}% <br>${chosenYAxis} : $${d[chosenYAxis]}`);
       } else {
       return (`<strong>${d.state} </strong><br> ${chosenXAxis}:${d[chosenXAxis]}% <br>${chosenYAxis} : ${d[chosenYAxis]}%`);
       }
     });
  
  //
     // Step 2: Create the tooltip in chartGroup.
     chartGroup.call(toolTip);

/****************************************************** */
/* event listeners */
// x axis labels event listener
xlabelsGroup.selectAll("text")
.on("click", function() {
  // get value of selection
  var value = d3.select(this).attr("value");
  if (value !== chosenXAxis) {

    // replaces chosenXAxis with value
    chosenXAxis = value;

     // updates x scale for new data
    xLinearScale = xScale(surveyData, chosenXAxis);

    // updates x axis with transition
    xAxis = xRenderAxes(xLinearScale, xAxis);

    // updates circles with new x values
    circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

   
    // changes classes to change bold labels and colors
    if (chosenXAxis === "obesity") {
      newCircle
        .classed("stateCircleObesity", true)
        .classed("stateCircleSmoke", false);
      newText            
        .classed("stateTextObesity" ,true)
        .classed("stateTextSmoke" ,false);
      obesityLabel
        .classed("active", true)
        .classed("inactive", false);
      smokesLabel
        .classed("active", false)
        .classed("inactive", true);
    }
    else {
      newCircle
      .classed("stateCircleObesity", false)
      .classed("stateCircleSmoke", true);
      newText            
        .classed("stateTextObesity" ,false)
        .classed("stateTextSmoke" ,true);
      obesityLabel
        .classed("active", false)
        .classed("inactive", true);
      smokesLabel
        .classed("active", true)
        .classed("inactive", false);
    }
  }
});

// y axis labels event listener
ylabelsGroup.selectAll("text")
.on("click", function() {
  // get value of selection
  var value = d3.select(this).attr("value");
  if (value !== chosenYAxis) {

    // replaces chosenXAxis with value
    chosenYAxis = value;

    // updates x scale for new data
    yLinearScale = yScale(surveyData, chosenYAxis);

    // updates x axis with transition
    yAxis = yRenderAxes(yLinearScale, yAxis);

    // updates circles with new x values
    circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

    // changes classes to change bold text
    if (chosenYAxis === "poverty") {
      povertyLabel
        .classed("active", true)
        .classed("inactive", false);
      incomeLabel
        .classed("active", false)
        .classed("inactive", true);
    }
    else {
      povertyLabel
        .classed("active", false)
        .classed("inactive", true);
      incomeLabel
        .classed("active", true)
        .classed("inactive", false);
    }
  }
});

  // // "mouseover" event listener to display tooltip

      circlesGroup.selectAll("circle")
        .on("mouseover", function(d) {
          toolTip.show(d, this);
          })
      //  "mouseout" event listener to hide tooltip
        .on("mouseout", function(d) {
          toolTip.hide(d);
        });
  
  };  //end function makeResponsive

makeResponsive();
d3.select(window).on("resize", makeResponsive);

}); // end from data read