function MatrixVisualization()
{
  var _margin     = {top: 185, right: 20, bottom: 20, left: 185};
  var _width      = 100;
  var _height     = _width;
  //var _colorScale = d3.scale.pow().exponent(.5).domain([0,1]).range([AugmentedNodeTrix._colorScaleStart,AugmentedNodeTrix._colorScaleEnd]);
  var _colorScale = d3.scale.linear().domain([0,1]).range([AugmentedNodeTrix._colorScaleStart,AugmentedNodeTrix._colorScaleEnd]);
  var _matrix, _matrixCopy, _adjacencyMatrix, _dissMatrix, _matrixSize, _matrixRowSize, _matrixColumnSize, _labelsData, _axisPositioningScale, _axisRowPositioningScale,_axisColumnPositioningScale, _matrixID, _originalDataset, _rowLabels, _columnLabels;  
  var _community_assignment_result, _alpha=0.0, _beta, _cellWidthScale = 12, _history;
  var _state="none";  //Other states will be "active" and "freezed"
  var _stateColors = {active: "green", freezed: "red", none: "white"};
  var _complementMatrix = false;

	// Assumes a parent SVG Id given along with data. Draws the matrix visualization inside it.	
	function chart(data, parentID)
	{
    // console.log(data);
      _originalDataset = jQuery.extend(true, {}, data); // Deep copy the original dataset backup
      _matrixID = parentID;

 			// _matrix = jQuery.extend(true, {}, data.matrixData);  //data.matrixData;
      _matrix = jQuery.extend(true, [], data.dissimilarityMatrix);
      // _matrix = jQuery.extend(true, [], data.adjacencyMatrix);
      _matrixCopy = jQuery.extend(true, [], data.dissimilarityMatrix);

      _dissMatrix = jQuery.extend(true,[],data.dissimilarityMatrix);
      _adjacencyMatrix = jQuery.extend(true,[],data.adjacencyMatrix);

      _dissMatrix = normalize_Matrix(_dissMatrix, _matrixRowSize, _matrixColumnSize);
      _adjacencyMatrix = normalize_Matrix(_adjacencyMatrix, _matrixRowSize, _matrixColumnSize);

			 // _labelsData = data.labelsData;
       _labelsData = data.rowLabels;
       _history =[];

      // _rowLabels = jQuery.extend(true, {}, data.rowLabels);
      // _columnLabels = jQuery.extend(true, {}, data.columnLabels);

      _rowLabels = data.rowLabels;
      _columnLabels = data.columnLabels;

      // console.log(_rowLabels);
      // console.log(_columnLabels);
      

      _matrixSize = _matrix.length;
      _matrixRowSize = data.rowSize;
      _matrixColumnSize = data.columnSize;
      _width  = _matrixColumnSize * _cellWidthScale;
      _height = _matrixRowSize * _cellWidthScale;

      _axisPositioningScale = d3.scale.ordinal().domain(d3.range(_matrixSize)).rangeBands([0, _width]);
      _axisColumnPositioningScale = d3.scale.ordinal().domain(d3.range(_matrixColumnSize)).rangeBands([0, _width]);
      _axisRowPositioningScale = d3.scale.ordinal().domain(d3.range(_matrixRowSize)).rangeBands([0, _height]);

      // if(_matrixSize >window.row){
      //   _axisRowPositioningScale = _axisPositioningScale;
      //   _axisColumnPositioningScale = _axisPositioningScale;
      // }
      // else{
      //     _axisRowPositioningScale = d3.scale.ordinal().domain(d3.range(_matrixRowSize)).rangeBands([0, _height]);  
      //      _axisColumnPositioningScale = d3.scale.ordinal().domain(d3.range(_matrixColumnSize)).rangeBands([0, _width]);      
      // }

      // detectCommunities();

      svg = d3.selectAll('#'+_matrixID)
      .attr("width", _width + _margin.left + _margin.right)
      .attr("height", _height + _margin.top + _margin.bottom)
      .attr("margin-left", -_margin.left + "px")
      .selectAll('g')
      .data([data])
      .enter()			    
      .append("g")
      .attr('class','parentGroup')
      .attr("transform", "translate(" + _margin.left + "," + _margin.top + ")");

      svg.append("rect")
      .attr("class", "drawnMatrix")
      .attr("width", _width)
      .attr("height", _height)
      .style("fill", 'lightgrey' );    


// Experimenting for different states of focus node
      // svg = d3.selectAll('#'+_matrixID > "stateCircle")
      svg.append("circle")
      .attr("class", "stateCircle")
      .attr("cx", -5)
      .attr("cy",-5)
      .attr("r",3)
      .style("fill", _stateColors.none)
      .style("opacity",0);

       svg.append("svg:image")
        .attr("class", "lock")
        .attr("x", -17)
        .attr("y",-17)
        .attr("width",10)
        .attr("height",10)
        .attr("xlink:href","images/lock.svg")
        .attr("opacity",0);

       // svg.append("line")
       //    .attr("stroke-width",2)
       //    // .attr("transform", "translate(0,10)")
       //    .style("stroke-opacity",1)
       //    .style("stroke","red")
       //    .attr("x1", 0)
       //    .attr("y1", _height +5)
       //    .attr("x2", _width)
       //    .attr("y2", _height +5);
// -----------------------------

var row = svg.selectAll(".row")
.data(_matrix)
.enter().append("g")
.attr("class", "row")
.attr("transform", function(d, i) { return "translate(0," + _axisRowPositioningScale(i) + ")"; })
.each(addCells);

row.append("line")
.attr("x2", _width) 



row.append("text")
.attr("x", -6)
.attr("y", _axisRowPositioningScale.rangeBand() / 2)
.attr("dy", ".3em")
.attr("text-anchor", "end")
.text(function(d, i) { 
  return _rowLabels[i].name;
  // return _columnLabels[i].name;
               // return _labelsData[i].name; 
             })
.attr('class','authorLabel')
.style('fill',function(d,i)
{ 
  if( _community_assignment_result && true == AugmentedNodeTrix._communityDetection )
  {
    var color = d3.scale.category10().domain(d3.range(0,10));
    return color(_community_assignment_result[ _columnLabels[i].id ]);
  }

  return '#505050';
})

var column = svg.selectAll(".column")
.data(function(d,i){
                        // console.log("matrix: ",d["matrixData"][0]);
                        return d["dissimilarityMatrix"][0];
                      })
.enter().append("g")
.attr("class", "column")
.attr("transform", function(d, i) { 
                         // console.log(data);
                         return "translate(" + _axisColumnPositioningScale(i) + ")rotate(-90)"; })

column.append("line")
.attr("x1", -_height)

column.append("text")
.attr("x", 6)
.attr("y", _axisColumnPositioningScale.rangeBand() / 2)
.attr("dy", ".3em")
.attr("text-anchor", "start")
.text(function(d, i) { 
                // console.log(i);
                // return "a";
                return _columnLabels[i].name;
                // return _rowLabels[i].name ; 
              })
.attr('class','authorLabel')
.style('fill',function(d,i)
{ 
  if( _community_assignment_result && true == AugmentedNodeTrix._communityDetection )
  {
    var color = d3.scale.category10().domain(d3.range(0,10));
    return color(_community_assignment_result[ _rowLabels[i].id ]);
  }

  return '#505050';
})

return this;
}

chart.getComplementMatrix = function()
{
  return _complementMatrix;
}

chart.setComplementMatrix = function(bool)
{
  _complementMatrix = bool;
  return this;
}

chart.restoreRectangularToSquareMatrix = function()
{
  // console.log(_originalDataset);
  _rowLabels = jQuery.extend(true, [], _originalDataset.rowLabels);
  _matrix = jQuery.extend(true, [], _matrixCopy)
  _matrixRowSize = _originalDataset.rowSize;
     //   _columnLabels=[];
     //  for(var i=0; i<clusters; i++)
     //  {
     //    temp = {name: 'cluster'+i, id:1000+i};
     //    _columnLabels.push(temp);
     //  }

     // // console.log(_columnLabels) ;

     // var tempMatrix = new Array(clusters);
     // for(var j=0;j<clusters;j++)
     // {
     //  tempMatrix[j] = new Array(_matrixColumnSize);
     //  for(var k=0; k<_matrixColumnSize; k++)
     //  {
     //    tempMatrix[j][k] = Math.random();
     //        // tempMatrix[j][_matrixColumnSize - k] =  tempMatrix[j][k];
     //      }
     //    }
     //    _matrix = tempMatrix;

     //    _matrixRowSize = clusters;
     _width  = _matrixColumnSize * _cellWidthScale;
     _height = _matrixRowSize * _cellWidthScale;
     _axisColumnPositioningScale = d3.scale.ordinal().domain(d3.range(_matrixColumnSize)).rangeBands([0, _width]);
     _axisRowPositioningScale = d3.scale.ordinal().domain(d3.range(_matrixRowSize)).rangeBands([0, _height]);
     this.renderUpdatedMatrixWithNewMatrixShape();
     return chart;
   }

   chart.deFocusNode = function(state)
   {

    _state = state;
    // console.log("state on defocus:", _state);
    $("#"+_matrixID+" .drawnMatrix").attr("style","filter:url()");

    var circle = d3.selectAll('#' +_matrixID + ' .stateCircle');
    var lock = d3.selectAll('#' +_matrixID + ' .lock');

    if(_state == "freezed")
    {
      circle.style("fill", _stateColors.freezed)
            .style("opacity",0);
      lock.style("opacity",1);
    }
      
    else
    {

      circle.style("fill", _stateColors.none)
            .style("opacity",0);
      lock.style("opacity",0);
    }
    

    return this;
  }

  chart.focusNode = function()
  {
    // console.log(_matrixID);
    // console.log("focussing on node with state:",_state);


// Trying to focus a node by shadowing around matrix boundary
     // var shadowFilter = $("#shadowScript").html();
    // $("#"+_matrixID).append(shadowFilter);
     // console.log($("#"+_matrixID+" .drawnMatrix")[0]);
    $("#"+_matrixID+" .drawnMatrix").attr("style","filter:url(#dropshadow)");
   


    var circle = d3.selectAll('#' +_matrixID + ' .stateCircle');
    circle.style("fill", _stateColors.active)
    .style("opacity",1);
    _state = "active";

    if(_complementMatrix)
    {
      $("#complement").attr("checked", "true");
    }
    // console.log("in focus",_complementMatrix);
    // if(!_complementMatrix)
    // {

    //     chart.updateMatrixByComplement();
    //     _complementMatrix = true;
    // }
    // $("#complement").attr("checked", "true");      
    
    return this;
  }

  chart.getState = function()
  {
    return _state;
  }

  chart.setState = function(state)
  {
    _state = state;
    return chart;
  }

  chart.updateData = function(data)
  {
      _originalDataset = jQuery.extend(true, {}, data); // Deep copy the original dataset backup

      _matrix = jQuery.extend(true, [], data.dissimilarityMatrix);
      // _labelsData = data.labelsData;)
_rowLabels   = data.rowLabels;
_columnLabels = data.columnLabels;

var min = 10000, max = -1;

for( var i = 0 ; i < _matrixRowSize ; ++i )
{
  for( var j = 0 ; j < _matrixColumnSize ; ++j )
  {
    if( _matrix[i][j] > max )
      max = _matrix[i][j];

    if( _matrix[i][j] < min )
      min = _matrix[i][j];
  }
}

if(min != max)
  _colorScale.domain([min,max]);
else
  _colorScale.domain([0,1]);
chart.renderUpdatedMatrix()

return this;
}

function addCells(data,rowIndex) 
{
 var min = 10000, max = -1;

 for( var i = 0 ; i < _matrixRowSize ; ++i )
 {
  for( var j = 0 ; j < _matrixColumnSize ; ++j )
  {
    if( _matrix[i][j] > max )
      max = _matrix[i][j];

    if( _matrix[i][j] < min )
      min = _matrix[i][j];
  }
}
if(min != max)
  _colorScale.domain([min,max]);
else
  _colorScale.domain([0,1]);
// _colorScale.domain([min,max]);

if( 'circle' == AugmentedNodeTrix.glyphType )
{
  var cell = d3.select(this).selectAll(".cell")
  .data( data )            
  .enter()
  .append("circle")
            .attr("class", "cell") // Move the circles a little bit to bring them to the center of the rectangles
            .attr("cx", function(d,i) { return _axisPositioningScale.rangeBand()*i + _axisPositioningScale.rangeBand()/2 ; }) 
            .attr("cy", function(d) { return _axisPositioningScale.rangeBand()/2; })          
            //.attr('r',_axisPositioningScale.rangeBand()/2)
            .attr('r',function(d,i) { return 3 * (1-data[i]) })

            .on('mouseover', function(d,colIndex)
            {
              d3.selectAll("#" + _matrixID + " .row text").classed('active', function(d,i){ return(i==rowIndex) })
              d3.selectAll("#" + _matrixID + " .column text").classed('active', function(d,i){ return(i==colIndex) })

              d3.selectAll("#" + _matrixID + " .row text").classed('deactive', function(d,i){ return(i!=rowIndex) })
              d3.selectAll("#" + _matrixID + " .column text").classed('deactive', function(d,i){ return(i!=colIndex) })


              if(_matrixColumnSize == _matrixRowSize)
              {
                AugmentedNodeTrix._currentHighlightedPair.src = _rowLabels[rowIndex].id;
                AugmentedNodeTrix._currentHighlightedPair.dst = _rowLabels[colIndex].id;
              }
              else
              {
                AugmentedNodeTrix._currentHighlightedPair.dst = _rowLabels[colIndex].id;  
              }
            })
            .on('mouseout', function(d)
            {
              d3.selectAll("text").classed('active', false)
              d3.selectAll("text").classed('deactive', false)

              AugmentedNodeTrix._currentHighlightedPair.src = -1;
              AugmentedNodeTrix._currentHighlightedPair.dst = -1;
            })            
            .style("fill", function(d,i) { return _colorScale(data[i]) })
            .append('title')
            .text(function(data){ return data})    
          }

          else if( 'rect' == AugmentedNodeTrix.glyphType )
          {


            var cell = d3.select(this).selectAll(".cell")
            .data( data )            
            .enter()
            .append("rect")
            .attr("class", "cell")
            .attr("x", function(d,i) { return _axisRowPositioningScale.rangeBand()*i; })
            .attr("y", function(d)   { 
              return 0;
              // return _axisColumnPositioningScale.rangeBand()*i;
            })
            .attr("width" , _axisRowPositioningScale.rangeBand())
            .attr("height", _axisColumnPositioningScale.rangeBand())   
            .on('mouseover', function(d,colIndex)
            {
              d3.selectAll("#" + _matrixID + " .row text").classed('active', function(d,i){ return(i==rowIndex) })
              d3.selectAll("#" + _matrixID + " .column text").classed('active', function(d,i){ return(i==colIndex) })

              d3.selectAll("#" + _matrixID + " .row text").classed('deactive', function(d,i){ return(i!=rowIndex) })
              d3.selectAll("#" + _matrixID + " .column text").classed('deactive', function(d,i){ return(i!=colIndex) })

              if(_matrixColumnSize == _matrixRowSize)
              {
                AugmentedNodeTrix._currentHighlightedPair.src = _rowLabels[rowIndex].id;
                AugmentedNodeTrix._currentHighlightedPair.dst = _rowLabels[colIndex].id;
              }
              else
              {
                //   AugmentedNodeTrix._currentHighlightedPair.src = _rowLabels[rowIndex].id;
                // AugmentedNodeTrix._currentHighlightedPair.dst = _columnLabels[colIndex].id;  

                AugmentedNodeTrix._currentHighlightedPair.src = _rowLabels[rowIndex].id;
                AugmentedNodeTrix._currentHighlightedPair.dst = _columnLabels[colIndex].id;
              }
            })
            .on('mouseout', function(d)
            {
              d3.selectAll("text").classed('active', false)
              d3.selectAll("text").classed('deactive', false)

              AugmentedNodeTrix._currentHighlightedPair.src = -1;
              AugmentedNodeTrix._currentHighlightedPair.dst = -1;
            })            
            .style("fill", function(d,i) { return _colorScale(data[i]) })
            .append('title')
            .text(function(data){ return data})               
          }       
        }

        chart.updateColorScale = function( color1, color2)
        {     

      // Height map encoding taken from - http://bl.ocks.org/mbostock/3289530
      if( 'HM' == color1 && 'HM' == color2 )
      {
        _colorScale.range(["#d7191c", "#ffffbf", "#2c7bb6"])
        .domain([0,.5,1])
        .interpolate(d3.interpolateHcl);
      }

      else
      {

        if( true == AugmentedNodeTrix._LABColorSpace )
        {
              // Updated to the HCL color space - https://gist.github.com/mbostock/3014589
              _colorScale.domain([0,1]).range([d3.lab(color1).brighter(),d3.lab(color2).brighter()]);  
              // console.log('Lab COlor Space')      
            }

            else
            {
              _colorScale.domain([0,1]).range([color1,color2]);           
            }          
          }

          chart.renderUpdatedMatrix();

          console.log("in color scale, column labels", _columnLabels);
        }

// Updating Alpha beta on slider change
chart.updateAlpha = function(value)
{
  _alpha = value;
  return chart;
}

chart.updateBeta = function(value)
{
  _beta = value;
  return chart;
}

chart.getAlpha = function()
{
  return _alpha;
}
chart.getBeta = function()
{
  return _beta;
}

chart.updateCombinedMatrix = function (alpha)
{
  // console.log("Alpha value:",alpha)

  // _beta =0;
  _alpha = alpha;
  for (var i = 0; i < _matrixRowSize; i++)   
    for (var j = 0; j < _matrixColumnSize; j++)   
    {
      _matrix[i][j] = 1- ( (( 1-  _dissMatrix[i][j]) * (1 - _alpha))+( (_alpha) * (1 - _adjacencyMatrix[i][j]) ) );
      // console.log(_matrix[i][j]);
    }

    _matrix = normalize_Matrix(_matrix, _matrixRowSize, _matrixColumnSize);

    _matrixCopy = jQuery.extend(true,[], _matrix);

    chart.renderUpdatedMatrix();
  // chart.printMatrix();
    // for (var i = 0; i < _matrixRowSize; i++)   

    //     for (var j = 0; j < _matrixColumnSize; j++)   
    //     {
    //             console.log(_matrix[i][j] + ",")
    //           }

    return chart;
  } 

  chart.restoreOriginalMatrix = function()
  {
    // console.log("restore pressed");
    _matrix = jQuery.extend(true,[], _matrixCopy);
    chart.renderUpdatedMatrix();
    return chart;

  }

  chart.updateMatrixByComplement = function()
  {
    // console.log("in complement, original");
    // chart.printMatrix();
    for(var i=0; i<_matrixRowSize; i++)
    {
      for(var j=0; j< _matrixColumnSize; j++)
      {
        // _matrix[i][j] = 1 - _matrixCopy[i][j];
        _matrix[i][j] = 1 - _matrix[i][j];
      }
    }
    // console.log("after");
    // chart.printMatrix();
    chart.renderUpdatedMatrix();
    return chart;
  }

  chart.applyLaplacian = function()
  {
    laplacianMatrix = new Array(_matrixRowSize);

    for(var j=0; j < _matrixRowSize; j++)
    {
      laplacianMatrix[j] = new Array(_matrixColumnSize);
    }

    for (var i = 0; i < _matrixRowSize; i++)   
    {
      for (var j = 0; j < _matrixColumnSize; j++)   
      {
            // adjMatrix[i+initialPos][j+initialPos] = i == j ? 0 : (adjMatrix[i+initialPos][j+initialPos]-min) / (max-min) ;                        

            // matrix[i][j] = adjMatrix[i+initialPos][j+initialPos] > 0 ? 1 : 0;
            laplacianMatrix[i][j] =  _matrix[i][j];  
            // normLaplacianMatrix[i+initialPos][j+initialPos] =  matrix[i][j];           
          }
        }  

        var degreeList = []
        for (var i = 0; i < _matrixRowSize; i++)   
        {
          var degree = 0;
          for (var j = 0; j < _matrixColumnSize; j++)   
          {
            if( laplacianMatrix[i][j] > 0 )
              ++ degree;
          }

          degreeList[i] = degree;
        } 

   // var min = 10000, max = -10000;
   for (var i = 0; i < _matrixRowSize; i++)   
   {
    for (var j = 0; j < _matrixColumnSize; j++)   
    {
      laplacianMatrix[i][j] = i == j ? degreeList[i] : -laplacianMatrix[i][j];

            // if ( laplacianMatrix[i][j] > max )
            //   max = laplacianMatrix[i][j];

            // if ( laplacianMatrix[i][j] < min )
            //   min = laplacianMatrix[i][j];
          }
        }

        laplacianMatrix = normalize_Matrix(laplacianMatrix, _matrixRowSize, _matrixColumnSize);
        _matrix = laplacianMatrix;

    // console.log(laplacianMatrix);
    // _matrixCopy = jQuery.extend(true,[], _matrix);
    chart.renderUpdatedMatrix();

    return chart;
  }

// Added to draw Edges by checking whether it is square or not
chart.isSquareMAtrix = function()
{
  if(_matrixRowSize == _matrixColumnSize)
    return true;
  return false;
}

chart.topLeft = function()
{
  var w = $(window);  
  var offset = $('#'+ _matrixID).offset();

  return cellPosition = { xPos : offset.left , yPos : offset.top };
}

chart.width = function()
{    	
  return d3.select('#'+ _matrixID).attr('width'); 
}

chart.height = function()
{
  return d3.select('#'+ _matrixID).attr('height');
}

chart.hasID = function(authorID)
{      
    // console.log(_rowLabels);
    // console.log(_columnLabels);

      // console.log("authorid= ",authorID);
      // console.log("rowlabels=",_rowLabels);
      
      // for( var i = 0; i < _rowLabels.length ; ++i )
      // {
      //   // console.log("authorid= ",authorID,_rowLabels[i]);

      //   if( _rowLabels[i].id == authorID )
      //     return true;
      // }

      // This code is not required

       for( var i = 0; i < _columnLabels.length ; ++i )
      {
        if( _columnLabels[i].id == authorID )
          return true;
      }

      return false;
    }

    chart.connectingPosition = function(authorID,connectionType)
    {
      var i = 0;

      for(  ; i < _columnLabels.length ; ++i )
      {
       if( _columnLabels[i].id == authorID )
        break;
    }

    var currentAuthorPosition = i;

      // Calculates the position of an element on the screen using JQuery APIs
      var w = $(window);  
      var offset = $('svg' + '#'+ _matrixID + ' .drawnMatrix').offset();
      var offSetChart = $('#'+AugmentedNodeTrix._parentID).offset();

      // if(!offset)
      //   return;
      var drawnMatrixTopLeftX = offset.left  - offSetChart.left
      var drawnMatrixTopLeftY = offset.top  - offSetChart.top

      var offset = $('#'+ _matrixID).offset();
      var parentHolderLeftTopX = offset.left - offSetChart.left
      var parentHolderLeftTopY = offset.top - offSetChart.top

      var padding = _axisRowPositioningScale.rangeBand()/2;      

      if( 'left' == connectionType )
      {

       return { 
        xPos : parentHolderLeftTopX + padding , 
        yPos : drawnMatrixTopLeftY + ( currentAuthorPosition * _axisPositioningScale.rangeBand()) + padding
      };
    }

    else if( 'right' == connectionType )
    {

    	return { 
        xPos : drawnMatrixTopLeftX + (_axisRowPositioningScale.rangeBand() * _matrixColumnSize) + padding, 
        yPos : drawnMatrixTopLeftY + ( currentAuthorPosition * _axisColumnPositioningScale.rangeBand()) + padding
      };
    }

    else if( 'bottom' == connectionType )
    {
    	
    	return { 
        xPos : drawnMatrixTopLeftX + (currentAuthorPosition * _axisRowPositioningScale.rangeBand()) + padding, 
        yPos : drawnMatrixTopLeftY + ( _axisColumnPositioningScale.rangeBand() * _matrixRowSize) + padding
      };	
    }

    else if( 'top' == connectionType )
    {

    	return { 
        xPos : drawnMatrixTopLeftX + (currentAuthorPosition * _axisRowPositioningScale.rangeBand()) + padding, 
        yPos : parentHolderLeftTopY  + padding
      };		
    }

    else
      console.log('Error in connection type');
  }

/***
* @ToDO
* In a good designn this seriation code should have been made as a webservice.
**/

function approx_dissimilarity(a,b)
{
  return math.norm((math.subtract(a,b)),2);
}

function calculate_D(matrix, index)
{
  var D_matrix =[];

  for(var i=0; i<index; i++)
  {
    temp_row = [];
    for(var j=0; j<index; j++)
    {
      if(i==j)
        temp_distance = 0;
      else
        temp_distance = approx_dissimilarity(matrix[i] , matrix[j]);

      temp_row.push(temp_distance);
    }
    D_matrix.push(temp_row);

  }
  return D_matrix;
}



chart.rectVAT = function()
{

  if(_matrix.length == _matrix[0].length)
    return chart;

    // var D = _matrix;
    var D = window.dataMatrix;
    // var D_transposed = transpose(matrix);
    var D_transposed = math.transpose(matrix);
    console.log("original matrix:", D);
    // console.log("transposed matrix: ",D_transposed);
    var D_row, D_column, D_row_union_column=[];

    D_row = calculate_D(D, window.row);
    D_column = calculate_D(math.transpose(D), window.column);

    // console.log("Drow: ",D_row,"Dcolumn: ", D_column);

    for(var i=0; i<window.row; i++)
    {
        // temp_row = D_row[i];
        // temp_row.concat(D[i]);
        // console.log(temp_row);
        // D_row_union_column.push(temp_row);

        D_row_union_column.push(math.concat(D_row[i], D[i]));
      }
      for(var i=0; i<window.column; i++)
      {
        // temp_row=[];
        // temp_row.push(D_transposed[i]);
        // temp_row.concat(D_column[i]);
        // D_row_union_column.push(temp_row);
        D_row_union_column.push(math.concat(D_transposed[i], D_column[i]));
      }

      console.log("D_row_union_column", D_row_union_column);

      var VAT_matrix = [], permutation;
      received = VAT1(D_row_union_column, (window.row + window.column));
      VAT_matrix = received["matrix"];
      permutation = received["permutation"];

      console.log("VAT_matrix:", VAT_matrix, "permutation",permutation);

      var rc=0, cc=0;
      var RP = new Array(window.row);
      var CP = new Array(window.column);

      for(var t=0; t< (window.row + window.column); t++)
      {

        if(permutation[t] < window.row)
        {
            // console.log(permutation[t]);
            // RP.splice(rc,0,permutation[t]);
            // RP.push(permutation[t]);
            RP[rc] = permutation[t];
            rc = rc+1;
          }
          else
          {
            // CP.splice(cc,0,permutation[t]);
            CP[cc] = permutation[t];
            cc = cc+1;
          }
        }


    // console.log("RP: CP: ");
    // console.log(RP);
    // console.log(CP);
    rectVAT_matrix = new Array(window.row);
    for(var i=0;i<window.row;i++){
      rectVAT_matrix[i] = new Array(window.column);
    }
    // new_labels=new Array(window.row);
    // for(var i=0; i<window.row;i++){
    //   new_labels[i]={};
    // }
    // console.log(_labelsData);
    for(var i=0; i<window.row; i++)
    {

        // new_labels[i]["name"] = _labelsData[RP[i]]["name"];
        // new_labels[i]["id"] = _labelsData[RP[i]]["id"];
        for(var j=0; j<window.column; j++)
        {
          rectVAT_matrix[i][j] = VAT_matrix[RP[i]][CP[j]];
        }
      }
    // _labelsData = new_labels;

    // console.log(rectVAT_matrix);  

    // initialPos = 0;
    // dissMatrix = rectVAT_matrix;
    //       // for( var k = 0; k < clusteringOrder.length ; ++k )
    //       // {        
    //             // var matrixSize =  clusteringOrder[k] - initialPos,
    //             var  max = -1000, min = 100000;

    //             for (var i = 0; i < window.row; i++)   
    //             {
    //                 for (var j = 0; j < window.column; j++)   
    //                 {
    //                     dissMatrix[i+initialPos][j+initialPos] > max ? max = dissMatrix[i+initialPos][j+initialPos] : {};

    //                     dissMatrix[i+initialPos][j+initialPos] < min ? min = dissMatrix[i+initialPos][j+initialPos] : {};
    //                 }
    //             }

    //             if( min == max && 0 == min ){}
    //             else 
    //             {
    //                 // Normalize betwen 0 and 1
    //                 for (var i = 0; i < window.row; i++)   
    //                 {
    //                     for (var j = 0; j < window.column; j++)   
    //                     {

    //                        if( min == max  )
    //                           dissMatrix[i+initialPos][j+initialPos] = 1;
    //                        else
    //                           dissMatrix[i+initialPos][j+initialPos] = i == j ? 0 : (dissMatrix[i+initialPos][j+initialPos]-min) / (max-min) ;
    //                     }
    //                 }                  
    //             }

    //       //       initialPos = clusteringOrder[k];
    //       // }


    // rectVAT_matrix = dissMatrix;
    rectVAT_matrix = normalize_Matrix(rectVAT_matrix, rectVAT_matrix.length, rectVAT_matrix[0].length);
    // console.log(rectVAT_matrix);  
    _matrix = rectVAT_matrix;
    chart.renderUpdatedMatrix();
    return chart;

  }

  function normalize_Matrix(matrix, rowSize, colSize)
  {

    var  max = -1000.0, min = 100000.0;

    for (var i = 0; i < rowSize; i++)   
    {
      for (var j = 0; j < colSize; j++)   
      {                                      
        matrix[i][j] < min ? min = matrix[i][j] : {};
      }
    }
    for (var i = 0; i < rowSize; i++)   
    {
      for (var j = 0; j < colSize; j++)   
      {
        matrix[i][j] > max ? max = matrix[i][j] : {};
      }
    }  

    // check the case of min == max with one of the v alues of matrix

                // console.log("min = ",min);
                if( min == max && 0 == min )
                {
                  console.log("min== max");
                }
                else if(min == max && 0 != min)
                {
                  console.log("min == max non zero");
                }
                else 
                {
                    // Normalize betwen 0 and 1
                    for (var i = 0; i < rowSize; i++)   
                    {
                      for (var j = 0; j < colSize; j++)   
                      {

                       if( min == max  )
                       {
                         if(0 == min)
                          matrix[i][j] = 0;
                        else
                          matrix[i][j] = 1;
                        // console.log("here too");
                       }
                        
                      else
                        matrix[i][j] = i == j ? 0 : (matrix[i][j]-min)/(max - min);     //Why the hell should i do this ??? 
                            //matrix[i][j] = (matrix[i][j]-min) / (max-min) ;
                          }
                        }        
                    // for(var z = 0; z<_matrixRowSize;z++)
                    // {
                    //   console.log(_matrix[z]);
                    // }

                    
                    // for (var i = 0; i < rowSize; i++)   
                    // {
                    //   for (var j = 0; j < colSize; j++)   
                    //   {

                    //    if( min == max  )
                    //    {
                    //     matrix[i][j] = 1;
                    //     console.log("here")
                    //   }

                    //   else
                    //     matrix[i][j] = (matrix[i][j] / max) ;
                    // }
                  // }
                }
                return matrix;
              }

              function VAT1(matrix,matrixSize)
              {


                if( matrixSize < 2)
                  return chart;

                var vertices = [] , verticesChosen = [], maxDistance = -1, maxDistanceIndex = -1;

    // Find Max
    for( var i = 0 ; i < matrixSize ; ++i)
    {
      for( var j = 0 ; j < matrixSize ; ++j)
      {
        if( i != j && matrix[i][j] > maxDistanceIndex )
        {
          maxDistance = matrix[i][j];
          maxDistanceIndex = j ;  
        }
      }
    }

    for(var i = 0 ; i < matrixSize ; ++ i )
    {
      vertices.push(i)
    }

    verticesChosen.push(maxDistanceIndex);
    vertices.splice(vertices.indexOf(maxDistanceIndex), 1);

    while( 0 != vertices.length )
    {
      var minimumDistance         = 10000.0;
      var minimumDistanceVertex   = 0;

        // Apply VAT
        for(var i = 0 ; i < verticesChosen.length ; ++i)
        {
          for(var j = 0 ; j < vertices.length ; ++j)
          {
            if( verticesChosen[i] != vertices[j] && matrix[verticesChosen[i]][vertices[j]] <= minimumDistance )
            {
              minimumDistance     = matrix[verticesChosen[i]][vertices[j]];
              minimumDistanceVertex   = vertices[j] ;
            }
          }
        }

        verticesChosen.push(minimumDistanceVertex );
        vertices.splice(vertices.indexOf(minimumDistanceVertex),1);
      }

    // console.log(verticesChosen);

    var Matrix2 = new Array(matrixSize);

    for (var i = 0; i < matrixSize; i++)   
      Matrix2[i] = new Array(matrixSize);

    // Exchange Columns
    for( var i = 0 ; i < matrixSize ; ++i)
    {
      for( var j = 0 ; j < matrixSize ; ++j)
      {
       Matrix2[i][j] = matrix[verticesChosen[i]][verticesChosen[j]];
     }
   }

   var tempAuthorArray = new Array(_labelsData.length);

    // // Exchange the author data accordingly
    // for( var i = 0 ; i < verticesChosen.length ; ++i)
    // {
    //          tempAuthorArray[i] = _labelsData[verticesChosen[i]];
    // }

    // _labelsData = tempAuthorArray;

    // Exchange Columns back to original matrix
    for( var i = 0 ; i < matrixSize ; ++i)
    {
      for( var j = 0 ; j < matrixSize; ++j)
      {
        matrix[i][j] =  Matrix2[i][j];
      }
    }

    // chart.renderUpdatedMatrix();
    // console.log(matrix);
    toReturn = {"matrix": matrix, "permutation": verticesChosen};
    return toReturn;    
  }



  chart.applyVAT = function ()  
  {

    if( _matrixSize < 2 )
      return chart;
    if(_matrix.length != _matrix[0].length)
      return chart;
    
    // console.log(_matrixRowSize, _matrixColumnSize);

    var vertices = [] , verticesChosen = [], maxDistance = -1, maxDistanceIndex = -1;

    // Find Max
    for( var i = 0 ; i < _matrixRowSize ; ++i)
    {
      for( var j = 0 ; j < _matrixColumnSize ; ++j)
      {
        if( i != j && _matrix[i][j] > maxDistanceIndex )
        {
          maxDistance = _matrix[i][j];
          maxDistanceIndex = j ;  
        }
      }
    }

    for(var i = 0 ; i < _matrixRowSize ; ++ i )
    {
      vertices.push(i)
    }

    verticesChosen.push(maxDistanceIndex);
    vertices.splice(vertices.indexOf(maxDistanceIndex), 1);

    while( 0 != vertices.length )
    {
      var minimumDistance 		    = 10000.0;
      var minimumDistanceVertex  	= 0;

        // Apply VAT
        for(var i = 0 ; i < verticesChosen.length ; ++i)
        {
          for(var j = 0 ; j < vertices.length ; ++j)
          {
            console.log(verticesChosen[i]);
            console.log(vertices[j]);

            if( verticesChosen[i] != vertices[j] && _matrix[verticesChosen[i]][vertices[j]] <= minimumDistance )
            {
              minimumDistance 		= _matrix[verticesChosen[i]][vertices[j]];
              minimumDistanceVertex 	= vertices[j] ;
            }
          }
        }

        verticesChosen.push(minimumDistanceVertex );
        vertices.splice(vertices.indexOf(minimumDistanceVertex),1);
      }

    // console.log(verticesChosen);

    var Matrix2 = new Array(_matrixSize);

    for (var i = 0; i < _matrixSize; i++)   
      Matrix2[i] = new Array(_matrixSize);

    // Exchange Columns
    for( var i = 0 ; i < _matrix.length ; ++i)
    {
      for( var j = 0 ; j < _matrix[0].length ; ++j)
      {
       Matrix2[i][j] = _matrix[verticesChosen[i]][verticesChosen[j]];
     }
   }

   var tempAuthorArray = new Array(_labelsData.length);

    // Exchange the author data accordingly
    for( var i = 0 ; i < verticesChosen.length ; ++i)
    {
     tempAuthorArray[i] = _labelsData[verticesChosen[i]];
   }

   _labelsData = tempAuthorArray;

    // Exchange Columns back to original matrix
    for( var i = 0 ; i < _matrix.length ; ++i)
    {
      for( var j = 0 ; j < _matrix[0].length; ++j)
      {
        _matrix[i][j] =  Matrix2[i][j];
      }
    }

    chart.renderUpdatedMatrix();
    return chart;    
  }

  chart.applyCommunityDetectionLeuven = function ()
  {
    if( _matrixSize < 2)
      return chart;

    var verticesChosen = [];

    if( _community_assignment_result )
    {
      var max = -1;
      for( var i = 0 ; i < _labelsData.length; ++i )
      {
        if( _community_assignment_result[_labelsData[i].id] > max )
          max = _community_assignment_result[_labelsData[i].id];
      }
    }

    for( var i = 0 ; i <= max; ++i)
    {
      for( var j = 0 ; j < _labelsData.length; ++j )
      {
        if( i == _community_assignment_result[_labelsData[j].id] )  
          verticesChosen.push(j)              
      }        
    }

    if( 0 == verticesChosen.length)
      return;
    // 

    var Matrix2 = new Array(_matrixSize);

    for (var i = 0; i < _matrixSize; i++)   
      Matrix2[i] = new Array(_matrixSize);

    // Exchange Columns
    for( var i = 0 ; i < _matrixSize ; ++i)
      for( var j = 0 ; j < _matrixSize ; ++j)
       Matrix2[i][j] = _matrix[verticesChosen[i]][verticesChosen[j]];

     var tempAuthorArray = new Array(_labelsData.length);

    // Exchange the author data accordingly
    for( var i = 0 ; i < verticesChosen.length ; ++i)
     tempAuthorArray[i] = _labelsData[verticesChosen[i]];

   _labelsData = tempAuthorArray;

    // Exchange Columns back to original matrix
    for( var i = 0 ; i < _matrixSize ; ++i)
      for( var j = 0 ; j < _matrixSize ; ++j)
        _matrix[i][j] =  Matrix2[i][j];

      chart.renderUpdatedMatrix();
      return chart;    
    }

    chart.revertOriginalMatrixState = function()
    {
      // Store a deep copy of the matrix
      _matrix = _originalDataset.matrixData.map(function(arr) { return arr.slice(); });
      
      _labelsData = _originalDataset.labelsData;
      chart.renderUpdatedMatrix();
      return chart;
    }

    chart.printMatrix = function ()
    {
      console.log("_matrix");
      for( var i = 0 ; i < _matrix.length ; ++i )
      {            
        console.log( _matrix[i] );
        console.log( '\n' );
      }
      console.log("Adjacency");
      for( var i = 0 ; i < _adjacencyMatrix.length ; ++i )
      {            
        console.log( _adjacencyMatrix[i] );
        console.log( '\n' );
      }
      console.log("Dissimilarity");
      for( var i = 0 ; i < _dissMatrix.length ; ++i )
      {            
        console.log( _dissMatrix[i] );
        console.log( '\n' );
      }
      return chart;
    }

    chart.testingMatrixShapeChang = function()
    {
      _matrix = [
      [2,9,4,2],
      [2,9,4,2]
      ];
    // console.log(_matrix);
    
    _matrixRowSize = 2;
    _matrixColumnSize = 4;

    _columnLabels = [{name:'c1', id:1000}, {name:'c2', id: 1001}];
    // _columnLabels = ['a','b','c','d'];
    console.log(_rowLabels, _columnLabels);

    _width  = _matrixColumnSize * _cellWidthScale;
    _height = _matrixRowSize * _cellWidthScale;
    _axisColumnPositioningScale = d3.scale.ordinal().domain(d3.range(_matrixColumnSize)).rangeBands([0, _width]);
    _axisRowPositioningScale = d3.scale.ordinal().domain(d3.range(_matrixRowSize)).rangeBands([0, _height]);
    this.renderUpdatedMatrixWithNewMatrixShape();
  }

  chart.degreeMatrix = function(matrix, rowSize, colSize)
  {
    degreeMatrix = new Array(rowSize);

    for(var j=0; j < colSize; j++)
    {
      degreeMatrix[j] = new Array(colSize);
    }

    for (var i = 0; i < rowSize; i++)   
    {
      for (var j = 0; j < colSize; j++)   
      {
            // adjMatrix[i+initialPos][j+initialPos] = i == j ? 0 : (adjMatrix[i+initialPos][j+initialPos]-min) / (max-min) ;                        

            // matrix[i][j] = adjMatrix[i+initialPos][j+initialPos] > 0 ? 1 : 0;
            degreeMatrix[i][j] =  0;
            // normLaplacianMatrix[i+initialPos][j+initialPos] =  matrix[i][j];           
          }
        }  

        var degreeList = new Array(rowSize);
        for (var i = 0; i < rowSize; i++)   
        {
          var degree = 0;
          for (var j = 0; j < colSize; j++)   
          {
            if( matrix[i][j] > 0 )
              ++ degree;
          }

          degreeList[i] = degree;
        } 

   // var min = 10000, max = -10000;
   for (var i = 0; i < rowSize; i++)   
   {
    for (var j = 0; j < colSize; j++)   
    {
      degreeMatrix[i][j] = i == j ? degreeList[i] : {};

            // if ( laplacianMatrix[i][j] > max )
            //   max = laplacianMatrix[i][j];

            // if ( laplacianMatrix[i][j] < min )
            //   min = laplacianMatrix[i][j];
          }
        }
        return degreeMatrix;
  }


chart.normalizedGraphLaplacianMatrix = function(degreeMatrix, adjacencyMatrix)
{
  var degreeMatixForm = math.matrix(degreeMatrix);
  var adjacencyMatrixForm = math.matrix(adjacencyMatrix);

  var negativeAdjacency = math.multiply(-1, adjacencyMatrixForm);
  var dInverse = math.inv(degreeMatrixForm);
  var dInverseSquareRoot = math.sqrt(dInverse);
  var normLaplaceMatrix =   math.multiply(math.multiply(dInverseSquareRoot,math.add(degreeMatrixForm, negativeAdjacency)), dInverseSquareRoot);
  return normLaplacianMatrix;
}


  chart.applyClustering = function(dimensions, clusters)
  {
      // Actual logic of clustering will go here

      // Meanwhile we are writing a stub to simulate the clustering
      _rowLabels=[];
      for(var i=0; i<clusters; i++)
      {
        temp = {name: 'cluster'+i, id:1000+i};
        _rowLabels.push(temp);
      }
      // console.log("column labels", _columnLabels);

      // _columnLabels=[];
      // for(var i=0; i<clusters; i++)
      // {
      //   temp = {name: 'cluster'+i, id:1000+i};
      //   _columnLabels.push(temp);
      // }

      // console.log("column labels after", _columnLabels);


     var tempMatrix = new Array(clusters);
     for(var j=0;j<clusters;j++)
     {
      tempMatrix[j] = new Array(_matrixColumnSize);
      for(var k=0; k<_matrixColumnSize; k++)
      {
        tempMatrix[j][k] = Math.random();
            // tempMatrix[j][_matrixColumnSize - k] =  tempMatrix[j][k];
          }
        }
        _matrix = tempMatrix;
        

        _matrixRowSize = clusters;
        _width  = _matrixColumnSize * _cellWidthScale;
        _height = _matrixRowSize * _cellWidthScale;
        _axisColumnPositioningScale = d3.scale.ordinal().domain(d3.range(_matrixColumnSize)).rangeBands([0, _width]);
        _axisRowPositioningScale = d3.scale.ordinal().domain(d3.range(_matrixRowSize)).rangeBands([0, _height]);
        this.renderUpdatedMatrixWithNewMatrixShape();
        _state = "freezed";

        // console.log("rowlabels:",_rowLabels, "_columnLabels:",_columnLabels);

        return chart;

      }

      chart.renderUpdatedMatrixWithNewMatrixShape = function ()
      {
        // Community Detection
        // detectCommunities();        

        // d3.selectAll( '#' + _matrixID ).selectAll(".row")
        //     .data( _matrix )              
        //     .each(updateRowCells)    

        // d3.selectAll( '#' + _matrixID ).selectAll(".row text")
        //         .data(_matrix)                                
        //         .text(function(d, i) { return _rowLabels[i].name; })
        //         .style('fill',function(d,i)
        //         { 
        //             if( _community_assignment_result && true == AugmentedNodeTrix._communityDetection )
        //             {
        //                 var color = d3.scale.category10().domain(d3.range(0,10));
        //                 return color(_community_assignment_result[ _labelsData[i].id ]);
        //             }

        //             return '#505050';
        //         })                  

        // d3.selectAll( '#' + _matrixID ).selectAll(".column text")
        //         .data(_matrix)                                
        //         .text(function(d, i) { return _columnLabels[i].name; })
        //         .style('fill',function(d,i)
        //         { 
        //             if( _community_assignment_result && true == AugmentedNodeTrix._communityDetection )
        //             {
        //                 var color = d3.scale.category10().domain(d3.range(0,10));                        
        //                 return color(_community_assignment_result[ _labelsData[i].id ]);
        //             }

        //             return '#505050';
        //         })

        // return chart;                 
        // console.log(_matrix);
        // d3.selectAll('#'+_matrixID)
        //   .append('image')
        //     // .attr("class", "stateCircle")
        // .attr("x", -0)
        // .attr("y",-0)
        // .attr("width",10)
        // .attr("height",10)
        //  .attr("xlink:href","http://www.clker.com/cliparts/1/4/5/a/1331068897296558865Sitting%20Racoon.svg");

        svg = d3.selectAll('#'+_matrixID)
        .attr("width", _width + _margin.left + _margin.right)
        .attr("height", _height + _margin.top + _margin.bottom)
        .attr("margin-left", -_margin.left + "px")
        .selectAll('g')
        .data([_matrix])
        .enter()          
        .append("g")
        .attr('class','parentGroup')
        .attr("transform", "translate(" + _margin.left + "," + _margin.top + ")");

        svg.append("rect")
        .attr("class", "drawnMatrix")
        .attr("width", _width)
        .attr("height", _height)
        .style("fill", 'lightgrey' );  

        svg.append("circle")
        .attr("class", "stateCircle")
        .attr("cx", -5)
        .attr("cy",-5)
        .attr("r",3)
        .style("fill", _stateColors.active)
        .style("opacity",1);  

        svg.append("svg:image")
        .attr("class", "lock")
        .attr("x", -17)
        .attr("y",-17)
        .attr("width",10)
        .attr("height",10)
        .attr("xlink:href","images/lock.svg")
        .attr("opacity",1);

        // svg.append("circle")
        // .attr("class", "stateCircle")
        // .attr("cx", 5)
        // .attr("cy", 5)
        // .attr("r",3)
        // .style("fill", red)
        // .style("opacity",0);

        // console.log(svg);
        // svg.append("rect")
        //     // .attr("class", "stateCircle")
        // .attr("x", 2)
        // .attr("y",2)
        // .attr("width",100)
        // .attr("height",100);
        // .attr("xlink:href","http://www.clker.com/cliparts/1/4/5/a/1331068897296558865Sitting%20Racoon.svg");
        

        var row = svg.selectAll(".row")
        .data(_matrix)
        .enter().append("g")
        .attr("class", "row")
        .attr("transform", function(d, i) { return "translate(0," + _axisRowPositioningScale(i) + ")"; })
        .each(addCells);

        row.append("line")
        .attr("x2", _width)        

        row.append("text")
        .attr("x", -6)
        .attr("y", _axisRowPositioningScale.rangeBand() / 2)
        .attr("dy", ".3em")
        .attr("text-anchor", "end")
        .text(function(d, i) { 
          // console.log(i);
                return _rowLabels[i].name;
                // return _columnLabels[i].name;
               // return _labelsData[i].name; 
             })
        .attr('class','authorLabel')
        .style('fill',function(d,i)
        { 
          if( _community_assignment_result && true == AugmentedNodeTrix._communityDetection )
          {
            var color = d3.scale.category10().domain(d3.range(0,10));
            return color(_community_assignment_result[ _columnLabels[i].id ]);
          }

          return '#505050';
        })

        var column = svg.selectAll(".column")
        .data(function(d,i){
          // console.log("matrix: ",d);
                        // return d["dissimilarityMatrix"][0];
                        return d[0];

                      })
        .enter().append("g")
        .attr("class", "column")
        .attr("transform", function(d, i) { 
                         // console.log(data);
                         return "translate(" + _axisColumnPositioningScale(i) + ")rotate(-90)"; })

        column.append("line")
        .attr("x1", -_height)

        column.append("text")
        .attr("x", 6)
        .attr("y", _axisColumnPositioningScale.rangeBand() / 2)
        .attr("dy", ".3em")
        .attr("text-anchor", "start")
        .text(function(d, i) { 
          // console.log("rowlabel",i);
                // return "a";
                return _columnLabels[i].name ; 
                // return _rowLabels[i].name ; 
              })
        .attr('class','authorLabel')
        .style('fill',function(d,i)
        { 
          if( _community_assignment_result && true == AugmentedNodeTrix._communityDetection )
          {
            var color = d3.scale.category10().domain(d3.range(0,10));
            return color(_community_assignment_result[ _rowLabels[i].id ]);
          }

          return '#505050';
        })


      }

      chart.updateValueFiltering = function(beta)
      {
        _beta = beta;
        tempMatrix =  jQuery.extend(true, [], _matrixCopy);
    // console.log("hii",tempMatrix);

    for(var i=0; i<_matrixRowSize; i++)
    {
      for(var j=0; j<_matrixColumnSize; j++)
      {
       if(tempMatrix[i][j] >= ( 1-_beta))
        tempMatrix[i][j] = 1;
    }
  }
  _matrix = tempMatrix;
    // _matrix = normalize_Matrix(_matrix, _matrixRowSize, _matrixColumnSize);

    chart.renderUpdatedMatrix();
    // chart.printMatrix();
  }
  chart.renderUpdatedMatrix = function ()
  {
        // Community Detection
        // detectCommunities();  

        // console.log(_matrix)
        // chart.printMatrix();
        // console.log("in renderUpdatedMatrix, _rowLabels:",_rowLabels,"_columnLabels",_columnLabels);


        d3.selectAll( '#' + _matrixID ).selectAll(".row")
        .data( _matrix )              
        .each(updateRowCells)    

        d3.selectAll( '#' + _matrixID ).selectAll(".row text")
        .data(_matrix)                                
        .text(function(d, i) { return _rowLabels[i].name; })
        .style('fill',function(d,i)
        { 
          if( _community_assignment_result && true == AugmentedNodeTrix._communityDetection )
          {
            var color = d3.scale.category10().domain(d3.range(0,10));
            return color(_community_assignment_result[ _labelsData[i].id ]);
          }

          return '#505050';
        })                  


        d3.selectAll( '#' + _matrixID ).selectAll(".column text")
        .data(_matrix)  
        // .data(function(d,i){
        //   // console.log("matrix: ",d);
        //                 // return d["dissimilarityMatrix"][0];
        //                 return d[0];

        //               })                              
        .text(function(d, i) { return _columnLabels[i].name; })
        .style('fill',function(d,i)
        { 
          if( _community_assignment_result && true == AugmentedNodeTrix._communityDetection )
          {
            var color = d3.scale.category10().domain(d3.range(0,10));                        
            return color(_community_assignment_result[ _labelsData[i].id ]);
          }

          return '#505050';
        })

        return chart;                 
      }

      function updateRowCells(data)
      {
    // console.log(data);
    if('circle' == AugmentedNodeTrix.glyphType)
    {
      var cell = d3.select(this).selectAll(".cell")
      .data( data )         
      .transition()
      .delay(function(d, i) { return _axisPositioningScale(i); })
      .duration( 1500 )
      .attr("cx", function(d,i) { return _axisPositioningScale.rangeBand()*i + _axisPositioningScale.rangeBand()/2 ; })
      .attr("cy", function(d) { return _axisPositioningScale.rangeBand()/2; })          
                    //.attr('r',_axisPositioningScale.rangeBand()/2)
                    .attr('r',function(d,i) { return 3 * (1-data[i]) })
                    .style("fill", function(d,i) {  
                      return _colorScale(data[i]);
                      // return data[i] <= AugmentedNodeTrix._beta ? _colorScale(data[i]) : AugmentedNodeTrix._colorScaleEnd
                    })                                  
                  }

                  else if('rect' == AugmentedNodeTrix.glyphType)
                  {

                    var cell = d3.select(this).selectAll(".cell")
                    .data( data )         
                    .transition()
                    .delay(function(d, i) { return _axisColumnPositioningScale(i); })
                    .duration( 1500 )
                    .attr("x", function(d,i) { return _axisRowPositioningScale.rangeBand()*i; })
                    .attr("y", function(d) { return 0; })          
                    .attr("width" , _axisRowPositioningScale.rangeBand())
                    .attr("height", _axisColumnPositioningScale.rangeBand())            
                    .style("fill", function(d,i) {  
                      // console.log("d",d,"i",i,"_colorScale(data[i])",_colorScale(data[i]));
                      // if(d == 1)
                      //   return AugmentedNodeTrix._colorScaleEnd;
                      // else
                      return _colorScale(data[i]);
                      // return data[i] <= AugmentedNodeTrix._beta ? _colorScale(data[i]) : AugmentedNodeTrix._colorScaleEnd
                    })
                  }

                  d3.select(this).selectAll(".cell title")
                  .data( data )                    
                  .text(function(data){ return data}) 

                  return chart;   
                }    

                function detectCommunities()
                {
      /*
         Community Detection - https://github.com/upphiminn/jLouvain
         http://arxiv.org/pdf/0803.0476.pdf
         */
      // console.log(_labelsData);
      // if( _matrix.length > 1 )
      //   {
      //         var node_data = [];
      //         for( var i = 0 ; i < window.column; ++i)
      //         {
      //           console.log(i);
      //             node_data[i] = _labelsData[i].id;
      //         }

      //         var original_node_data = d3.entries(node_data);

      //         var edge_data = [];

      //         for( var i = 0 ; i < _matrixSize ; ++i)
      //         {
      //             for( var j = i ; j < _matrixSize ; ++j)
      //             {
      //                 if( 1 ==_matrix[i][j] || i==j ){}                

      //                 else
      //                 {
      //                   edge_data.push({source: node_data[i], target:node_data[j], weight: 1-_matrix[i][j]})
      //                 }
      //             }
      //         }              

      //         if( edge_data.length > 0 )
      //         {
      //             var community = jLouvain().nodes(node_data).edges(edge_data);
      //             _community_assignment_result = community();   
      //         }              
      //   } 
    }

    return chart;
  }



