
function MatrixVisualization()
{
    var _margin = {
        top: 185,
        right: 20,
        bottom: 20,
        left: 185
    };
    var _width = 100;
    var _height = _width;
    //var _colorScale = d3.scale.pow().exponent(.5).domain([0,1]).range([AugmentedNodeTrix._colorScaleStart,AugmentedNodeTrix._colorScaleEnd]);
    var _colorScale = d3.scale.linear().domain([0, 1]).range([
        AugmentedNodeTrix._colorScaleStart, AugmentedNodeTrix._colorScaleEnd
    ]);
    var _matrix, _matrixCopy, _adjacencyMatrix, _dissMatrix, _eigenMatrix, _unnormalizedAdjacencyMatrix, _matrixSize, _matrixBeforeClustering,
        _matrixRowSize, _matrixColumnSize, _labelsData,_rectMatrixAfterClustering,
        _axisPositioningScale, _axisRowPositioningScale,
        _axisColumnPositioningScale, _matrixID, _originalDataset,
        _rowLabels, _columnLabels, _rowLabelsCopy, _columnLabelsCopy;

//These copies are for calculating the path end points correctly after zooming in/out But matrix zooming is performed automatically
    var _axisPositioningScaleCopy, _axisRowPositioningScaleCopy, _axisColumnPositioningScaleCopy; 

    var _community_assignment_result, _alpha = 0.0,
        _beta, _cellWidthScale = 12,
        _history;
        var _cellWidthScaleOriginal = _cellWidthScale;  
    var _state = "none"; //Other states will be "active" and "freezed"
    var _stateColors = {
        active: "green",
        freezed: "red",
        none: "white"
    };
    var _complementMatrix = false;
    var _clusterdrift = {'nodes':[], 'links':[]}

    var _clusteringDone = false;
    var _clusterVector;
    var _showLayer3Edges;

    // Assumes a parent SVG Id given along with data. Draws the matrix visualization inside it.	
    function chart(data, parentID)
    {

        // console.log("inside chart initializing function");
        _originalDataset = jQuery.extend(true,
        {}, data); // Deep copy the original dataset backup
        _matrixID = parentID;
        // _matrix = jQuery.extend(true, {}, data.matrixData);  //data.matrixData;
        // _matrix = jQuery.extend(true, [], data.dissimilarityMatrix);
         _matrix = jQuery.extend(true, [], data.adjacencyMatrix);
         _unnormalizedAdjacencyMatrix = jQuery.extend(true, [], data.weightMatrix);

        // console.log("while initializing object: ",_matrix);
        // _matrix = jQuery.extend(true, [], data.adjacencyMatrix);
        _matrixCopy = jQuery.extend(true, [], data.adjacencyMatrix);
        _dissMatrix = jQuery.extend(true, [], data.dissimilarityMatrix);
        _eigenMatrix = jQuery.extend(true, [], data.eigenMatrix);
        _adjacencyMatrix = jQuery.extend(true, [], data.adjacencyMatrix);
        // console.log("Unnormalized Adjacency Matrix initialization", _unnormalizedAdjacencyMatrix);
        _dissMatrix = normalize_Matrix(_dissMatrix, _matrixRowSize,
            _matrixColumnSize);
        _adjacencyMatrix = normalize_Matrix(_adjacencyMatrix,
            _matrixRowSize, _matrixColumnSize);
        // _labelsData = data.labelsData;
        _labelsData = data.rowLabels;
         _rowLabels = data.rowLabels;
        _columnLabels = data.columnLabels;
        
         _rowLabelsCopy = jQuery.extend(true, [], _rowLabels);
        _columnLabelsCopy = jQuery.extend(true, [], _columnLabels);

        _history = [];
        // _rowLabels = jQuery.extend(true, {}, data.rowLabels);
        // _columnLabels = jQuery.extend(true, {}, data.columnLabels);
       
        // console.log(_rowLabels);
        // console.log(_columnLabels);
        _matrixSize = _matrix.length;
        _matrixRowSize = data.rowSize;
        _matrixColumnSize = data.columnSize;
        _width = _matrixColumnSize * _cellWidthScale;
        _height = _matrixRowSize * _cellWidthScale;
        _axisPositioningScale = d3.scale.ordinal().domain(d3.range(
            _matrixSize)).rangeBands([0, _width]);
        _axisColumnPositioningScale = d3.scale.ordinal().domain(d3.range(
            _matrixColumnSize)).rangeBands([0, _width]);
        _axisRowPositioningScale = d3.scale.ordinal().domain(d3.range(
            _matrixRowSize)).rangeBands([0, _height]);

         _axisPositioningScaleCopy = d3.scale.ordinal().domain(d3.range(
            _matrixSize)).rangeBands([0, _width]);
        _axisColumnPositioningScaleCopy = d3.scale.ordinal().domain(d3.range(
            _matrixColumnSize)).rangeBands([0, _width]);
        _axisRowPositioningScaleCopy = d3.scale.ordinal().domain(d3.range(
            _matrixRowSize)).rangeBands([0, _height]);
        var _clusterVector = new Array(_matrixSize);

        _showLayer3Edges = false;
        // if(_matrixSize >window.row){
        //   _axisRowPositioningScale = _axisPositioningScale;
        //   _axisColumnPositioningScale = _axisPositioningScale;
        // }
        // else{
        //     _axisRowPositioningScale = d3.scale.ordinal().domain(d3.range(_matrixRowSize)).rangeBands([0, _height]);  
        //      _axisColumnPositioningScale = d3.scale.ordinal().domain(d3.range(_matrixColumnSize)).rangeBands([0, _width]);      
        // }
        // detectCommunities();


        svg = d3.selectAll('#' + _matrixID).attr("width", _width +
                _margin.left + _margin.right).attr("height", _height +
                _margin.top + _margin.bottom).attr("margin-left", -
                _margin.left + "px").selectAll('g').data([data]).enter()
            .append("g").attr('class', 'parentGroup').attr("transform",
                "translate(" + _margin.left + "," + _margin.top + ")");
        svg.append("rect").attr("class", "drawnMatrix").attr("width",
            _width).attr("height", _height).style("fill",
            'lightgrey');

        // svg.append("text").attr("id","title").attr("x",10).attr("y",_height+10).attr("dy",
        //     ".3em").attr("text-anchor", "end");

        // Experimenting for different states of focus node
        // svg = d3.selectAll('#'+_matrixID > "stateCircle")
        svg.append("circle").attr("class", "stateCircle").attr("cx", -5)
            .attr("cy", -5).attr("r", 3).style("fill", _stateColors.none)
            .style("opacity", 0);
        svg.append("svg:image").attr("class", "lock").attr("x", -17).attr(
            "y", -17).attr("width", 10).attr("height", 10).attr(
            "xlink:href", "static/images/lock.svg").attr("opacity", 0);
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
        var row = svg.selectAll(".row").data(_matrix)
                .attr("id", function(d,i){return "Row"+i;}).enter().append(
            "g").attr("class", "row").attr("transform", function(d,
            i)
        {
            return "translate(0," + _axisRowPositioningScale(i) +
                ")";
        }).each(addCells);
        row.append("line").attr("x2", _width)
        row.append("text").attr("x", -6).attr("y",
            _axisRowPositioningScale.rangeBand() / 2).attr("dy",
            ".3em").attr("text-anchor", "end").text(function(d, i)
        {
            return _rowLabels[i].name;
            // return _columnLabels[i].name;
            // return _labelsData[i].name; 
        }).attr('class', 'authorLabel').style('fill', function(d, i)
        {
            if (_community_assignment_result && true ==
                AugmentedNodeTrix._communityDetection)
            {
                var color = d3.scale.category10().domain(d3.range(
                    0, 10));
                return color(_community_assignment_result[
                    _columnLabels[i].id]);
            }
            return '#505050';
        }).style('font-family', 'Fira Sans')
        .style('font-size', 11)
        
        var column = svg.selectAll(".column").data(function(d, i)
        {
            // console.log("matrix: ",d["matrixData"][0]);
            return d["dissimilarityMatrix"][0];
        })
        .attr("id", function(d,i){return "Column"+i;})
        .enter().append("g").attr("class", "column").attr(
            "transform", function(d, i)
            {
                // console.log(data);
                return "translate(" + _axisColumnPositioningScale(i) +
                    ")rotate(-90)";
            })
        column.append("line").attr("x1", -_height)
        column.append("text").attr("x", 6).attr("y",
            _axisColumnPositioningScale.rangeBand() / 2).attr("dy",
            ".3em").attr("text-anchor", "start").text(function(d, i)
        {
            // console.log(i);
            // return "a";
            return _columnLabels[i].name;
            // return _rowLabels[i].name ; 
        }).attr('class', 'authorLabel').style('fill', function(d, i)
        {
            if (_community_assignment_result && true ==
                AugmentedNodeTrix._communityDetection)
            {
                var color = d3.scale.category10().domain(d3.range(
                    0, 10));
                return color(_community_assignment_result[
                    _rowLabels[i].id]);
            }
            return '#505050';
        }).style('font-family', 'Fira Sans')
        .style('font-size', 11)
        return this;
    }

    chart.modifySize = function()
    {
        //  _originalDataset = jQuery.extend(true,
        // {}, data); // Deep copy the original dataset backup
        // _matrixID = parentID;
        // _matrix = jQuery.extend(true, {}, data.matrixData);  //data.matrixData;
        // _matrix = jQuery.extend(true, [], data.dissimilarityMatrix);
         // _matrix = jQuery.extend(true, [], data.adjacencyMatrix);
         // _unnormalizedAdjacencyMatrix = jQuery.extend(true, [], data.weightMatrix);

        // console.log("while initializing object: ",_matrix);
        // _matrix = jQuery.extend(true, [], data.adjacencyMatrix);
        // _matrixCopy = jQuery.extend(true, [], data.adjacencyMatrix);
        // _dissMatrix = jQuery.extend(true, [], data.dissimilarityMatrix);
        // _eigenMatrix = jQuery.extend(true, [], data.eigenMatrix);
        // _adjacencyMatrix = jQuery.extend(true, [], data.adjacencyMatrix);
        // console.log("Unnormalized Adjacency Matrix initialization", _unnormalizedAdjacencyMatrix);
        // _dissMatrix = normalize_Matrix(_dissMatrix, _matrixRowSize,
            // _matrixColumnSize);
        // _adjacencyMatrix = normalize_Matrix(_adjacencyMatrix,
            // _matrixRowSize, _matrixColumnSize);
        // _labelsData = data.labelsData;
        console.log(_rowLabels);
        console.log(_matrix);
        _matrix = [[1]];
        console.log(_matrix);
        _matrixCopy = jQuery.extend(true, [], _matrix);
        _labelsData = [{"id":1, "name":"Shivam"}];
         _rowLabels = [{"id":1, "name":"Shivam"}];
        _columnLabels = [{"id":1, "name":"Shivam"}];
         _rowLabelsCopy = jQuery.extend(true, [], _rowLabels);
        _columnLabelsCopy = jQuery.extend(true, [], _columnLabels);
        console.log(_rowLabels);
        _history = [];

        // _rowLabels = jQuery.extend(true, {}, data.rowLabels);
        // _columnLabels = jQuery.extend(true, {}, data.columnLabels);
       
        // console.log(_rowLabels);
        // console.log(_columnLabels);
        _matrixSize = 1;
        _matrixRowSize = 1;
        _matrixColumnSize = 1;
        _width = _matrixColumnSize * _cellWidthScale * AugmentedNodeTrix.globalScaleFactor;
        _height = _matrixRowSize * _cellWidthScale* AugmentedNodeTrix.globalScaleFactor;
        _axisPositioningScale = d3.scale.ordinal().domain(d3.range(
            _matrixSize)).rangeBands([0, _width]);
        _axisColumnPositioningScale = d3.scale.ordinal().domain(d3.range(
            _matrixColumnSize)).rangeBands([0, _width]);
        _axisRowPositioningScale = d3.scale.ordinal().domain(d3.range(
            _matrixRowSize)).rangeBands([0, _height]);

         _axisPositioningScaleCopy = d3.scale.ordinal().domain(d3.range(
            _matrixSize)).rangeBands([0, _width]);
        _axisColumnPositioningScaleCopy = d3.scale.ordinal().domain(d3.range(
            _matrixColumnSize)).rangeBands([0, _width]);
        _axisRowPositioningScaleCopy = d3.scale.ordinal().domain(d3.range(
            _matrixRowSize)).rangeBands([0, _height]);
        var _clusterVector = new Array(_matrixSize);

        // _showLayer3Edges = false;
        chart.renderUpdatedMatrixWithNewMatrixShape();
        return chart;
    }

     function highlightDehighlightPath(src, dest, highlight)
    {
        if(highlight)
        {
            var path =  d3.selectAll(".bezierCurves.n"+src+',.bezierCurves.n'+dest);
            // console.log(src, dest, path);
            path.classed('bezierCurvesHighlighted', true);
            path.classed('bezierCurvesDeHighlighted', false);
        }
       else
       {
            var path =  d3.selectAll(".bezierCurves.n"+src+',.bezierCurves.n'+dest);
            // console.log(src, dest, path);
            path.classed('bezierCurvesHighlighted', false);
            path.classed('bezierCurvesDeHighlighted', true);
       } 
    }

    chart.removeMultilayerPaths = function(index)
        {
            _showLayer3Edges =false;
             // d3.selectAll('#' + AugmentedNodeTrix._parentID +
             //    ' .layer3.mat'+index).attr("opacity",0);
             d3.selectAll(' .layer3.mat'+index).attr("opacity",0).classed("bezierCurvesVisible", false).classed("bezierCurvesInvisible", true);
        }
    chart.rerenderMultilayerPaths = function(index)
        {
            _showLayer3Edges = true;
            // d3.selectAll('#' + AugmentedNodeTrix._parentID +
            //    ' .mat'+index + '.layer3').attr("opacity",1);
            d3.selectAll(' .mat'+index + '.layer3').attr("opacity",1).classed("bezierCurvesInvisible", false).classed("bezierCurvesVisible", true);
            

            // console.log(' .mat'+index + '.layer3' , d3.selectAll(' .mat'+index + '.layer3'));
        }

    chart.getShowLayer3Edges = function()
    {
        return _showLayer3Edges;
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

        _history.push("Back from clustering");
        this.actionHistoryRefresh();

        // console.log(_originalDataset);
        // _rowLabels = jQuery.extend(true, [], _originalDataset.rowLabels);
        _rowLabels = jQuery.extend(true, [], _rowLabelsBeforeClustering);
        _matrix = jQuery.extend(true, [], _matrixBeforeClustering)
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
        _width = _matrixColumnSize * _cellWidthScale;
        _height = _matrixRowSize * _cellWidthScale;
        _axisColumnPositioningScale = d3.scale.ordinal().domain(d3.range(
            _matrixColumnSize)).rangeBands([0, _width]);
        _axisRowPositioningScale = d3.scale.ordinal().domain(d3.range(
            _matrixRowSize)).rangeBands([0, _height]);
        this.renderUpdatedMatrixWithNewMatrixShape();
        return chart;
    }



    chart.deFocusNode = function(state)
    {
        _state = state;
        // console.log("state on defocus:", _state);
        $("#" + _matrixID + " .drawnMatrix").attr("style",
            "filter:url()");
        var circle = d3.selectAll('#' + _matrixID + ' .stateCircle');
        var lock = d3.selectAll('#' + _matrixID + ' .lock');
        if (_state == "freezed")
        {
            circle.style("fill", _stateColors.freezed).style("opacity",
                0);
            lock.style("opacity", 1);
        }
        else
        {
            circle.style("fill", _stateColors.none).style("opacity", 0);
            lock.style("opacity", 0);
        }
        
        
        return this;
    }
    chart.focusNode = function()
    {
        // alert(_history);
        // historyString="";
        // for x in 
        this.actionHistoryRefresh();

        // console.log(_matrixID);
        // console.log("focussing on node with state:",_state);
        // Trying to focus a node by shadowing around matrix boundary
        // var shadowFilter = $("#shadowScript").html();
        // $("#"+_matrixID).append(shadowFilter);
        // console.log($("#"+_matrixID+" .drawnMatrix")[0]);
        $("#" + _matrixID + " .drawnMatrix").attr("style",
            "filter:url(#dropshadow)");
        var circle = d3.selectAll('#' + _matrixID + ' .stateCircle');
        circle.style("fill", _stateColors.active).style("opacity", 1);
        _state = "active";
        if (_complementMatrix)
        {
            $("#complement").attr("checked", "true");
        }
        // console.log(_showLayer3Edges);
        if (_showLayer3Edges)
        {
            $("#layer3edge_focus").attr("checked", "true");
        }
        // else
        // {
        //     $("#layer3edge_focus").attr("checked", "false");
        // }
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
        _originalDataset = jQuery.extend(true,
        {}, data); // Deep copy the original dataset backup
        _matrix = jQuery.extend(true, [], data.dissimilarityMatrix);
        // _labelsData = data.labelsData;)
        _rowLabels = data.rowLabels;
        _columnLabels = data.columnLabels;
        var min = 10000,
            max = -1;
        for (var i = 0; i < _matrixRowSize; ++i)
        {
            for (var j = 0; j < _matrixColumnSize; ++j)
            {
                if (_matrix[i][j] > max) max = _matrix[i][j];
                if (_matrix[i][j] < min) min = _matrix[i][j];
            }
        }
        if (min != max) _colorScale.domain([min, max]);
        else _colorScale.domain([0, 1]);
        chart.renderUpdatedMatrix()
        return this;
    }

    function addCells(data, rowIndex)
    {
        // console.log("inside add cell");

        var min = 10000,
            max = -1;
        for (var i = 0; i < _matrixRowSize; ++i)
        {
            for (var j = 0; j < _matrixColumnSize; ++j)
            {
                if (_matrix[i][j] > max) max = _matrix[i][j];
                if (_matrix[i][j] < min) min = _matrix[i][j];
            }
        }
        if (min != max) _colorScale.domain([min, max]);
        else _colorScale.domain([0, 1]);
        // _colorScale.domain([min,max]);
        if ('circle' == AugmentedNodeTrix.glyphType)
        {
            var cell = d3.select(this).selectAll(".cell").data(data).enter()
                .append("circle").attr("class", "cell") // Move the circles a little bit to bring them to the center of the rectangles
                .attr("cx", function(d, i)
                {
                    return _axisPositioningScale.rangeBand() * i +
                        _axisPositioningScale.rangeBand() / 2;
                }).attr("cy", function(d)
                {
                    return _axisPositioningScale.rangeBand() / 2;
                })
                //.attr('r',_axisPositioningScale.rangeBand()/2)
                .attr('r', function(d, i)
                {
                    return 3 * (1 - data[i])
                }).on('mouseover', function(d, colIndex)
                {
                    d3.selectAll("#" + _matrixID + " .row text").classed(
                        'active', function(d, i)
                        {
                            return (i == rowIndex)
                        })
                    d3.selectAll("#" + _matrixID + " .column text")
                        .classed('active', function(d, i)
                        {
                            return (i == colIndex)
                        })
                    d3.selectAll("#" + _matrixID + " .row text").classed(
                        'deactive', function(d, i)
                        {
                            return (i != rowIndex)
                        })
                    d3.selectAll("#" + _matrixID + " .column text")
                        .classed('deactive', function(d, i)
                        {
                            return (i != colIndex)
                        })
                    if (_matrixColumnSize == _matrixRowSize)
                    {
                        AugmentedNodeTrix._currentHighlightedPair.src =
                            _rowLabels[rowIndex].id;
                        AugmentedNodeTrix._currentHighlightedPair.dst =
                            _rowLabels[colIndex].id;
                    }
                    else
                    {
                        AugmentedNodeTrix._currentHighlightedPair.dst =
                            _rowLabels[colIndex].id;
                    }
                }).on('mouseout', function(d)
                {
                    d3.selectAll("text").classed('active', false)
                    d3.selectAll("text").classed('deactive', false)
                    AugmentedNodeTrix._currentHighlightedPair.src = -
                        1;
                    AugmentedNodeTrix._currentHighlightedPair.dst = -
                        1;
                }).style("fill", function(d, i)
                {
                    return _colorScale(data[i])
                }).append('title').text(function(data)
                {
                    return data
                })
        }
        else if ('rect' == AugmentedNodeTrix.glyphType)
        {
            var cell = d3.select(this).selectAll(".cell").data(data).enter()
                .append("rect").attr("class", "cell").attr("x",
                    function(d, i)
                    {
                        return _axisRowPositioningScale.rangeBand() * i;
                    }).attr("y", function(d)
                {
                    return 0;
                    // return _axisColumnPositioningScale.rangeBand()*i;
                }).attr("width", _axisRowPositioningScale.rangeBand()).attr(
                    "height", _axisColumnPositioningScale.rangeBand())
                .on('mouseover', function(d, colIndex)
                    {
                        d3.selectAll("#" + _matrixID + " .row text").classed(
                            'active', function(d, i)
                            {
                                return (i == rowIndex)
                            })
                        d3.selectAll("#" + _matrixID + " .column text")
                            .classed('active', function(d, i)
                            {
                                return (i == colIndex)
                            })
                        d3.selectAll("#" + _matrixID + " .row text").classed(
                            'deactive', function(d, i)
                            {
                                return (i != rowIndex)
                            })
                        d3.selectAll("#" + _matrixID + " .column text")
                            .classed('deactive', function(d, i)
                            {
                                return (i != colIndex)
                            })
                        if (_matrixColumnSize == _matrixRowSize)
                        {
                            AugmentedNodeTrix._currentHighlightedPair.src =
                                _rowLabels[rowIndex].id;
                            AugmentedNodeTrix._currentHighlightedPair.dst =
                                _rowLabels[colIndex].id;
                        }
                        else
                        {
                            //   AugmentedNodeTrix._currentHighlightedPair.src = _rowLabels[rowIndex].id;
                            // AugmentedNodeTrix._currentHighlightedPair.dst = _columnLabels[colIndex].id;  
                            AugmentedNodeTrix._currentHighlightedPair.src =
                                _rowLabels[rowIndex].id;
                            AugmentedNodeTrix._currentHighlightedPair.dst =
                                _columnLabels[colIndex].id;
                        }
                        // console.log(AugmentedNodeTrix._currentHighlightedPair.src, AugmentedNodeTrix._currentHighlightedPair.dst);
                        highlightDehighlightPath(AugmentedNodeTrix._currentHighlightedPair.src,  AugmentedNodeTrix._currentHighlightedPair.dst, true);

                    }).on('mouseout', function(d)
                {
                    d3.selectAll("text").classed('active', false)
                    d3.selectAll("text").classed('deactive', false)

                    highlightDehighlightPath(AugmentedNodeTrix._currentHighlightedPair.src,  AugmentedNodeTrix._currentHighlightedPair.dst, false);

                    AugmentedNodeTrix._currentHighlightedPair.src = -
                        1;
                    AugmentedNodeTrix._currentHighlightedPair.dst = -
                        1;
                }).style("fill", function(d, i)
                {
                    return _colorScale(data[i])
                }).append('title').text(function(data)
                {
                    return 1-data               //Done to avoid confusion. black is 1
                })
        }
    }
    chart.updateColorScale = function(color1, color2)
        {
            // Height map encoding taken from - http://bl.ocks.org/mbostock/3289530
            if ('HM' == color1 && 'HM' == color2)
            {
                _colorScale.range(["#d7191c", "#ffffbf", "#2c7bb6"]).domain(
                    [0, .5, 1]).interpolate(d3.interpolateHcl);
            }
            else
            {
                if (true == AugmentedNodeTrix._LABColorSpace)
                {
                    // Updated to the HCL color space - https://gist.github.com/mbostock/3014589
                    _colorScale.domain([0, 1]).range([d3.lab(color1).brighter(),
                        d3.lab(color2).brighter()
                    ]);
                    // console.log('Lab COlor Space')      
                }
                else
                {
                    _colorScale.domain([0, 1]).range([color1, color2]);
                }
            }
            chart.renderUpdatedMatrix();
            // console.log("in color scale, column labels", _columnLabels);
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
    chart.updateCombinedMatrix = function(alpha)
    {
        // console.log("Alpha value:",alpha)
        // _beta =0;
        _alpha = alpha;
        for (var i = 0; i < _matrixRowSize; i++)
            for (var j = 0; j < _matrixColumnSize; j++)
            {
                _matrix[i][j] = 1 - (((1 - _dissMatrix[i][j]) * (1 -
                    _alpha)) + ((_alpha) * (1 -
                    _adjacencyMatrix[i][j])));
                // console.log(_matrix[i][j]);
            }
        _matrix = normalize_Matrix(_matrix, _matrixRowSize,
            _matrixColumnSize);
        _matrixCopy = jQuery.extend(true, [], _matrix);
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
        _history.push("Restore Original");
        this.actionHistoryRefresh();
        // console.log("restore pressed");
        console.log("In self starting Matrix: ",_matrix);
        _matrix = jQuery.extend(true, [], _matrixCopy);
        _rowLabels = jQuery.extend(true, [], _rowLabelsCopy);
        _columnLabels = jQuery.extend(true, [], _columnLabelsCopy);

        if(_rowLabels.length ==0 )
        {
            console.log("this is 0 length row labels: ", _matrixID);
        }
        console.log("original Matrix: ",_matrix);
        chart.renderUpdatedMatrix();
        return chart;
    }
    chart.updateMatrixByComplement = function()
    {
        // console.log("in complement, original");
        // chart.printMatrix();
        // for (var i = 0; i < _matrixRowSize; i++)
        // {
        //     for (var j = 0; j < _matrixColumnSize; j++)
        //     {
        //         // _matrix[i][j] = 1 - _matrixCopy[i][j];
        //         _matrix[i][j] = 1 - _matrix[i][j];
        //     }
        // }
        // // console.log("after");
        // // chart.printMatrix();
        // chart.renderUpdatedMatrix();



         _alpha = 1- _alpha;
        for (var i = 0; i < _matrixRowSize; i++)
            for (var j = 0; j < _matrixColumnSize; j++)
            {
                _matrix[i][j] = 1 - (((1 - _dissMatrix[i][j]) * (1 -
                    _alpha)) + ((_alpha) * (1 -
                    _adjacencyMatrix[i][j])));
                // console.log(_matrix[i][j]);
            }
        _matrix = normalize_Matrix(_matrix, _matrixRowSize,
            _matrixColumnSize);
        _matrixCopy = jQuery.extend(true, [], _matrix);
        chart.renderUpdatedMatrix();


        return chart;
    }
    // chart.applyLaplacian = function()
    //     {
    //         laplacianMatrix = new Array(_matrixRowSize);
    //         for (var j = 0; j < _matrixRowSize; j++)
    //         {
    //             laplacianMatrix[j] = new Array(_matrixColumnSize);
    //         }
    //         for (var i = 0; i < _matrixRowSize; i++)
    //         {
    //             for (var j = 0; j < _matrixColumnSize; j++)
    //             {
    //                 // adjMatrix[i+initialPos][j+initialPos] = i == j ? 0 : (adjMatrix[i+initialPos][j+initialPos]-min) / (max-min) ;                        
    //                 // matrix[i][j] = adjMatrix[i+initialPos][j+initialPos] > 0 ? 1 : 0;
    //                 laplacianMatrix[i][j] = _matrix[i][j];
    //                 // normLaplacianMatrix[i+initialPos][j+initialPos] =  matrix[i][j];           
    //             }
    //         }
    //         var degreeList = []
    //         for (var i = 0; i < _matrixRowSize; i++)
    //         {
    //             var degree = 0;
    //             for (var j = 0; j < _matrixColumnSize; j++)
    //             {
    //                 if (laplacianMatrix[i][j] > 0)
    //                 ++degree;
    //             }
    //             degreeList[i] = degree;
    //         }
    //         // var min = 10000, max = -10000;
    //         for (var i = 0; i < _matrixRowSize; i++)
    //         {
    //             for (var j = 0; j < _matrixColumnSize; j++)
    //             {
    //                 laplacianMatrix[i][j] = i == j ? degreeList[i] : -
    //                     laplacianMatrix[i][j];
    //                 // if ( laplacianMatrix[i][j] > max )
    //                 //   max = laplacianMatrix[i][j];
    //                 // if ( laplacianMatrix[i][j] < min )
    //                 //   min = laplacianMatrix[i][j];
    //             }
    //         }
    //         laplacianMatrix = normalize_Matrix(laplacianMatrix,
    //             _matrixRowSize, _matrixColumnSize);
    //         _matrix = laplacianMatrix;
    //         // console.log(laplacianMatrix);
    //         // _matrixCopy = jQuery.extend(true,[], _matrix);
    //         chart.renderUpdatedMatrix();
    //         return chart;
    //     }

    chart.applyLaplacian = function()
        {
            _history.push("Laplacian");
            this.actionHistoryRefresh();
            tempMatrix = jQuery.extend(true,[], _matrix);
            matrix = {};

            for(var i=0; i<_matrixRowSize;i++)
            {   
                temp={};
                for(var j=0; j<_matrixColumnSize; j++)
                {
                    // _temp={}
                    temp[j]= 1 - _matrix[i][j]     // Subtraction from 1 is done in order to send real matix valued impoirtance. we use 0 for important and black in visualization
                    // temp.push(_temp);
                }
                
                matrix[i] = temp;
                // jsonData.push(_temp);
            }
            jsonData = {};
            jsonData["matrix"] = matrix;
            // jsonData["clustering"] = type;
            // jsonData["numberOfClusters"] = clusters;
            // console.log(jsonData);

            var tempMatrix2 = new Array(_matrixRowSize)
            for (var j = 0; j < _matrixRowSize; j++)
            {
                tempMatrix2[j] = new Array(_matrixColumnSize);
            }


             $.ajax({
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(jsonData),
                    dataType: 'json',
                    async: false,

                    //data: JSON.stringify(data),
                    url: '/applyLaplacian',
                    success: function (fetchdataResult) {
                    console.log(fetchdataResult["matrix"]);
                        // draw_Scatterplot(fetchdataResult)
                        // console.log(fetchdataResult);
                        recdMatrix = fetchdataResult["matrix"];
                        for (var i=0; i< _matrixRowSize; i++)
                        {
                            for(var j=0; j< _matrixColumnSize; j++)
                            {
                                tempMatrix2[i][j] = 1- recdMatrix[i][j];
                            }
                        }


                    }
                });

             _matrix = normalize_Matrix(tempMatrix2, _matrixRowSize, _matrixColumnSize);

            // laplacianMatrix = new Array(_matrixRowSize);
            // for (var j = 0; j < _matrixRowSize; j++)
            // {
            //     laplacianMatrix[j] = new Array(_matrixColumnSize);
            // }
            // for (var i = 0; i < _matrixRowSize; i++)
            // {
            //     for (var j = 0; j < _matrixColumnSize; j++)
            //     {
            //         // adjMatrix[i+initialPos][j+initialPos] = i == j ? 0 : (adjMatrix[i+initialPos][j+initialPos]-min) / (max-min) ;                        
            //         // matrix[i][j] = adjMatrix[i+initialPos][j+initialPos] > 0 ? 1 : 0;
            //         laplacianMatrix[i][j] = _matrix[i][j];
            //         // normLaplacianMatrix[i+initialPos][j+initialPos] =  matrix[i][j];           
            //     }
            // }
            // var degreeList = []
            // for (var i = 0; i < _matrixRowSize; i++)
            // {
            //     var degree = 0;
            //     for (var j = 0; j < _matrixColumnSize; j++)
            //     {
            //         if (laplacianMatrix[i][j] > 0)
            //         ++degree;
            //     }
            //     degreeList[i] = degree;
            // }
            // // var min = 10000, max = -10000;
            // for (var i = 0; i < _matrixRowSize; i++)
            // {
            //     for (var j = 0; j < _matrixColumnSize; j++)
            //     {
            //         laplacianMatrix[i][j] = i == j ? degreeList[i] : -
            //             laplacianMatrix[i][j];
            //         // if ( laplacianMatrix[i][j] > max )
            //         //   max = laplacianMatrix[i][j];
            //         // if ( laplacianMatrix[i][j] < min )
            //         //   min = laplacianMatrix[i][j];
            //     }
            // }
            // laplacianMatrix = normalize_Matrix(laplacianMatrix,
            //     _matrixRowSize, _matrixColumnSize);
            // _matrix = laplacianMatrix;
            // // console.log(laplacianMatrix);
            // // _matrixCopy = jQuery.extend(true,[], _matrix);
            chart.renderUpdatedMatrix();
            return chart;
        }




        // Added to draw Edges by checking whether it is square or not
    chart.isSquareMAtrix = function()
    {
        if (_matrixRowSize == _matrixColumnSize) return true;
        return false;
    }
    chart.topLeft = function()
    {
        var w = $(window);
        var offset = $('#' + _matrixID).offset();
        return cellPosition = {
            xPos: offset.left,
            yPos: offset.top
        };
    }
    chart.width = function()
    {
        return d3.select('#' + _matrixID).attr('width') * AugmentedNodeTrix.globalScaleFactor;
    }
    chart.height = function()
    {
        return d3.select('#' + _matrixID).attr('height')* AugmentedNodeTrix.globalScaleFactor;
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
        for (var i = 0; i < _columnLabels.length; ++i)
        {
            if (_columnLabels[i].id == authorID) return true;
        }
        return false;
    }
    chart.reCalculateSize = function()
    {
        // console.log("inside reCalculateSize");
        var node = $('svg' + '#' + _matrixID + ' rect');
        // _width = node.attr("width");
        // _height = node.attr("height");
        _cellWidthScale = _cellWidthScaleOriginal * AugmentedNodeTrix.globalScaleFactor;
        _width = node.attr("width")*AugmentedNodeTrix.globalScaleFactor;
        _height = node.attr("height")* AugmentedNodeTrix.globalScaleFactor;

        // console.log(_width, ", ", _height);

         _axisPositioningScaleCopy = d3.scale.ordinal().domain(d3.range(
            _matrixSize)).rangeBands([0, _width]);
        _axisColumnPositioningScaleCopy = d3.scale.ordinal().domain(d3.range(
            _matrixColumnSize)).rangeBands([0, _width]);
        _axisRowPositioningScaleCopy = d3.scale.ordinal().domain(d3.range(
            _matrixRowSize)).rangeBands([0, _height]);
        chart.renderUpdatedMatrix();
        // console.log(_width+", "+_height);
    }
   chart.connectingPosition = function(authorID, connectionType)
        {
            var i = 0;
            for (; i < _columnLabels.length; ++i)
            {
                if (_columnLabels[i].id == authorID) break;
            }
            var currentAuthorPosition = i;
            // Calculates the position of an element on the screen using JQuery APIs
            var w = $(window);
            var offset = $('svg' + '#' + _matrixID + ' .drawnMatrix').offset();
            var offSetChart = $('#' + AugmentedNodeTrix._parentID).offset();
            // if(!offset)
            //   return;
            var drawnMatrixTopLeftX = offset.left - offSetChart.left
            var drawnMatrixTopLeftY = offset.top - offSetChart.top

            var offset = $('#' + _matrixID).offset();
            var parentHolderLeftTopX = offset.left - offSetChart.left
            var parentHolderLeftTopY = offset.top - offSetChart.top
            // console.log(offset.left+", "+drawnMatrixTopLeftX);
            var padding = _axisRowPositioningScaleCopy.rangeBand() / 2;
            var xposition, yposition;
            // var padding = 0;

            var rowOffset = $('svg' + '#'+ _matrixID + " #Row"+currentAuthorPosition).offset();
            rowOffset.left = rowOffset.left - offSetChart.left;
            rowOffset.top = rowOffset.top - offSetChart.top;

            var columnOffset =   $('svg' + '#'+ _matrixID + " #Column"+currentAuthorPosition).offset();
            columnOffset.left = columnOffset.left - offSetChart.left;
            columnOffset.top = columnOffset.top - offSetChart.top;

            // console.log(rowOffset, columnOffset);

            if ('left' == connectionType)
            {
                // xposition = parentHolderLeftTopX + padding;
                // yposition = drawnMatrixTopLeftY + (currentAuthorPosition * _axisPositioningScaleCopy.rangeBand()) + padding;
                xposition = rowOffset["left"];
                yposition = rowOffset["top"] + padding;

                // return {
                //     xPos: parentHolderLeftTopX + padding,
                //     yPos: drawnMatrixTopLeftY + (currentAuthorPosition *
                //         _axisPositioningScaleCopy.rangeBand()) + padding
                // };
            }
            else if ('right' == connectionType)
            {
                // xposition = drawnMatrixTopLeftX + (_axisRowPositioningScaleCopy.rangeBand() *
                //         _matrixColumnSize) + padding;
                // yposition = drawnMatrixTopLeftY + (currentAuthorPosition *
                //             _axisColumnPositioningScaleCopy.rangeBand()) +
                //         padding;

                //Right links were moving a bit left and right. To avoid this jittering this has been done
                var rowOffset = $('svg' + '#'+ _matrixID + " #Row"+currentAuthorPosition + " .cell").last().offset();
                rowOffset.left = rowOffset.left - offSetChart.left;
                rowOffset.top = rowOffset.top - offSetChart.top;
                
                xposition = rowOffset.left +  _axisRowPositioningScaleCopy.rangeBand();
                yposition = rowOffset["top"]+ padding;
                // console.log("right: ",xposition);

                // xposition = drawnMatrixTopLeftX + (_axisRowPositioningScaleCopy.rangeBand() *
                //         _matrixColumnSize) ;
                // yposition = rowOffset["top"]+ padding;
                // return {
                //     xPos: drawnMatrixTopLeftX + (_axisRowPositioningScaleCopy.rangeBand() *
                //         _matrixColumnSize) + padding,
                //     yPos: drawnMatrixTopLeftY + (currentAuthorPosition *
                //             _axisColumnPositioningScaleCopy.rangeBand()) +
                //         padding
                // };
            }
            else if ('bottom' == connectionType)
            {
                // xposition = drawnMatrixTopLeftX + (currentAuthorPosition *
                //         _axisRowPositioningScaleCopy.rangeBand()) + padding;
                // yposition = drawnMatrixTopLeftY + (
                //         _axisColumnPositioningScaleCopy.rangeBand() *
                //         _matrixRowSize) + padding;

               

                xposition = columnOffset["left"] + padding;
                yposition = drawnMatrixTopLeftY + (
                        _axisColumnPositioningScaleCopy.rangeBand() *
                        _matrixRowSize);
                // console.log("bottom:",_axisColumnPositioningScaleCopy.rangeBand() *
                //         _matrixRowSize);
                
                // var wid , hei;
                // wid = _axisRowPositioningScaleCopy.rangeBand() *_matrixColumnSize;
                // hei = _axisColumnPositioningScaleCopy.rangeBand() * _matrixRowSize;

                // console.log(wid,", ",hei);
                // return {
                //     xPos: drawnMatrixTopLeftX + (currentAuthorPosition *
                //         _axisRowPositioningScaleCopy.rangeBand()) + padding,
                //     yPos: drawnMatrixTopLeftY + (
                //         _axisColumnPositioningScaleCopy.rangeBand() *
                //         _matrixRowSize) + padding
                // };
            }
            else if ('top' == connectionType)
            {
                //  xposition = drawnMatrixTopLeftX + (currentAuthorPosition *
                //         _axisRowPositioningScaleCopy.rangeBand()) + padding;
                // yposition = parentHolderLeftTopY + padding;
                 xposition = columnOffset["left"]+ padding;
                yposition = columnOffset["top"];
                // return {
                //     xPos: drawnMatrixTopLeftX + (currentAuthorPosition *
                //         _axisRowPositioningScaleCopy.rangeBand()) + padding,
                //     yPos: parentHolderLeftTopY + padding
                // };
            }
            else console.log('Error in connection type');
            // console.log("drawnMatrixTopLeftX: ", drawnMatrixTopLeftX, ", drawnMatrixTopLeftY:  ",drawnMatrixTopLeftY,", xpos:",xposition,", ypos: ",yposition, ", xdifference: ", xposition - drawnMatrixTopLeftX, ", ydifference: ",yposition - drawnMatrixTopLeftY);
            return {
                        xPos: xposition,
                        yPos: yposition
                    };
        }
        /***
         * @ToDO
         * In a good designn this seriation code should have been made as a webservice.
         **/

    function approx_dissimilarity(a, b)
    {
        return math.norm((math.subtract(a, b)), 2);
    }

    function calculate_D(matrix, index)
    {
        var D_matrix = [];
        for (var i = 0; i < index; i++)
        {
            temp_row = [];
            for (var j = 0; j < index; j++)
            {
                if (i == j) temp_distance = 0;
                else temp_distance = approx_dissimilarity(matrix[i],
                    matrix[j]);
                temp_row.push(temp_distance);
            }
            D_matrix.push(temp_row);
        }
        return D_matrix;
    }
    chart.rectVAT = function()
    {
        if (_matrix.length == _matrix[0].length) return chart;
        // var D = _matrix;
        var D = window.dataMatrix;
        // var D_transposed = transpose(matrix);
        var D_transposed = math.transpose(matrix);
        console.log("original matrix:", D);
        // console.log("transposed matrix: ",D_transposed);
        var D_row, D_column, D_row_union_column = [];
        D_row = calculate_D(D, window.row);
        D_column = calculate_D(math.transpose(D), window.column);
        // console.log("Drow: ",D_row,"Dcolumn: ", D_column);
        for (var i = 0; i < window.row; i++)
        {
            // temp_row = D_row[i];
            // temp_row.concat(D[i]);
            // console.log(temp_row);
            // D_row_union_column.push(temp_row);
            D_row_union_column.push(math.concat(D_row[i], D[i]));
        }
        for (var i = 0; i < window.column; i++)
        {
            // temp_row=[];
            // temp_row.push(D_transposed[i]);
            // temp_row.concat(D_column[i]);
            // D_row_union_column.push(temp_row);
            D_row_union_column.push(math.concat(D_transposed[i],
                D_column[i]));
        }
        console.log("D_row_union_column", D_row_union_column);
        var VAT_matrix = [],
            permutation;
        received = VAT1(D_row_union_column, (window.row + window.column));
        VAT_matrix = received["matrix"];
        permutation = received["permutation"];
        console.log("VAT_matrix:", VAT_matrix, "permutation",
            permutation);
        var rc = 0,
            cc = 0;
        var RP = new Array(window.row);
        var CP = new Array(window.column);
        for (var t = 0; t < (window.row + window.column); t++)
        {
            if (permutation[t] < window.row)
            {
                // console.log(permutation[t]);
                // RP.splice(rc,0,permutation[t]);
                // RP.push(permutation[t]);
                RP[rc] = permutation[t];
                rc = rc + 1;
            }
            else
            {
                // CP.splice(cc,0,permutation[t]);
                CP[cc] = permutation[t];
                cc = cc + 1;
            }
        }
        // console.log("RP: CP: ");
        // console.log(RP);
        // console.log(CP);
        rectVAT_matrix = new Array(window.row);
        for (var i = 0; i < window.row; i++)
        {
            rectVAT_matrix[i] = new Array(window.column);
        }
        // new_labels=new Array(window.row);
        // for(var i=0; i<window.row;i++){
        //   new_labels[i]={};
        // }
        // console.log(_labelsData);
        for (var i = 0; i < window.row; i++)
        {
            // new_labels[i]["name"] = _labelsData[RP[i]]["name"];
            // new_labels[i]["id"] = _labelsData[RP[i]]["id"];
            for (var j = 0; j < window.column; j++)
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
        rectVAT_matrix = normalize_Matrix(rectVAT_matrix,
            rectVAT_matrix.length, rectVAT_matrix[0].length);
        // console.log(rectVAT_matrix);  
        _matrix = rectVAT_matrix;
        chart.renderUpdatedMatrix();
        return chart;
    }

    function normalize_Matrix_Standard(inputMatrix, rowSize, colSize)
    {
        var max = -1000, min = 100000;
        for (var i= 0; i< rowSize; i++)
        {
            for (var j= 0; j< colSize; j++)
            {
                inputMatrix[i][j] > max ? max = inputMatrix[i][j] :  {};
                inputMatrix[i][j] < min ? min = inputMatrix[i][j] :  {};
            }
        }
        min =0;
        if (min == max && 0 == min)
        {}
        else
        {
            // Normalize betwen 0 and 1
            for (var i= 0; i< rowSize; i++)
            {
                for (var j= 0; j< colSize; j++)
                {
                    if (min == max) 
                        inputMatrix[i][j] = 1;
                    else
                    // inputMatrix[i+initialPos][j+initialPos] = i== j? 0 : (inputMatrix[i+initialPos][j+initialPos]-min) / (max-min) ;
                        inputMatrix[i][j] = i==j? 1: (( inputMatrix[i][j] - min) / (max - min));
                }
            }
        }
        return inputMatrix;
    }

    function normalize_Matrix(matrix, rowSize, colSize)
    {
        var max = -1000.0,
            min = 100000.0;
        for (var i = 0; i < rowSize; i++)
        {
            for (var j = 0; j < colSize; j++)
            {
                matrix[i][j] < min ? min = matrix[i][j] :
                {};
            }
        }
        for (var i = 0; i < rowSize; i++)
        {
            for (var j = 0; j < colSize; j++)
            {
                matrix[i][j] > max ? max = matrix[i][j] :
                {};
            }
        }
        // check the case of min == max with one of the v alues of matrix
        // console.log("min = ",min);
        // min=0;
        if (min == max && 0 == min)
        {
            console.log("min== max");
        }
        else if (min == max && 0 != min)
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
                    if (min == max)
                    {
                        if (0 == min) matrix[i][j] = 0;
                        else matrix[i][j] = 1;
                        // console.log("here too");
                    }
                    else matrix[i][j] = i == j ? 0 : (matrix[i][j] -
                        min) / (max - min); //Why the hell should i do this ??? 
                    //matrix[i][j] = (matrix[i][j]-min) / (max-min) ;
                }
            }

        }
        return matrix;
    }

    function VAT1(matrix, matrixSize)
    {
        if (matrixSize < 2) return chart;
        var vertices = [],
            verticesChosen = [],
            maxDistance = -1,
            maxDistanceIndex = -1;
        // Find Max
        for (var i = 0; i < matrixSize; ++i)
        {
            for (var j = 0; j < matrixSize; ++j)
            {
                if (i != j && matrix[i][j] > maxDistanceIndex)
                {
                    maxDistance = matrix[i][j];
                    maxDistanceIndex = j;
                }
            }
        }
        for (var i = 0; i < matrixSize; ++i)
        {
            vertices.push(i)
        }
        verticesChosen.push(maxDistanceIndex);
        vertices.splice(vertices.indexOf(maxDistanceIndex), 1);
        while (0 != vertices.length)
        {
            var minimumDistance = 10000.0;
            var minimumDistanceVertex = 0;
            // Apply VAT
            for (var i = 0; i < verticesChosen.length; ++i)
            {
                for (var j = 0; j < vertices.length; ++j)
                {
                    if (verticesChosen[i] != vertices[j] && matrix[
                            verticesChosen[i]][vertices[j]] <=
                        minimumDistance)
                    {
                        minimumDistance = matrix[verticesChosen[i]][
                            vertices[j]
                        ];
                        minimumDistanceVertex = vertices[j];
                    }
                }
            }
            verticesChosen.push(minimumDistanceVertex);
            vertices.splice(vertices.indexOf(minimumDistanceVertex), 1);
        }
        // console.log(verticesChosen);
        var Matrix2 = new Array(matrixSize);
        for (var i = 0; i < matrixSize; i++) Matrix2[i] = new Array(
            matrixSize);
        // Exchange Columns
        for (var i = 0; i < matrixSize; ++i)
        {
            for (var j = 0; j < matrixSize; ++j)
            {
                Matrix2[i][j] = matrix[verticesChosen[i]][
                    verticesChosen[j]
                ];
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
        for (var i = 0; i < matrixSize; ++i)
        {
            for (var j = 0; j < matrixSize; ++j)
            {
                matrix[i][j] = Matrix2[i][j];
            }
        }
        // chart.renderUpdatedMatrix();
        // console.log(matrix);
        toReturn = {
            "matrix": matrix,
            "permutation": verticesChosen
        };
        return toReturn;
    }
    chart.applyVAT = function()
    {
        _history.push("VAT");
        this.actionHistoryRefresh();

        if (_matrixSize < 2) return chart;
        if (_matrix.length != _matrix[0].length) return chart;
        // console.log(_matrixRowSize, _matrixColumnSize);
        var vertices = [],
            verticesChosen = [],
            maxDistance = -1,
            maxDistanceIndex = -1;
        // Find Max
        for (var i = 0; i < _matrixRowSize; ++i)
        {
            for (var j = 0; j < _matrixColumnSize; ++j)
            {
                if (i != j && _matrix[i][j] > maxDistanceIndex)
                {
                    maxDistance = _matrix[i][j];
                    maxDistanceIndex = j;
                }
            }
        }
        for (var i = 0; i < _matrixRowSize; ++i)
        {
            vertices.push(i)
        }
        verticesChosen.push(maxDistanceIndex);
        vertices.splice(vertices.indexOf(maxDistanceIndex), 1);
        while (0 != vertices.length)
        {
            var minimumDistance = 10000.0;
            var minimumDistanceVertex = 0;
            // Apply VAT
            for (var i = 0; i < verticesChosen.length; ++i)
            {
                for (var j = 0; j < vertices.length; ++j)
                {
                    // console.log(verticesChosen[i]);
                    // console.log(vertices[j]);
                    if (verticesChosen[i] != vertices[j] && _matrix[
                            verticesChosen[i]][vertices[j]] <=
                        minimumDistance)
                    {
                        minimumDistance = _matrix[verticesChosen[i]][
                            vertices[j]
                        ];
                        minimumDistanceVertex = vertices[j];
                    }
                }
            }
            verticesChosen.push(minimumDistanceVertex);
            vertices.splice(vertices.indexOf(minimumDistanceVertex), 1);
        }
        // console.log(verticesChosen);
        var Matrix2 = new Array(_matrixSize);
        for (var i = 0; i < _matrixSize; i++) Matrix2[i] = new Array(
            _matrixSize);
        // Exchange Columns
        for (var i = 0; i < _matrix.length; ++i)
        {
            for (var j = 0; j < _matrix[0].length; ++j)
            {
                Matrix2[i][j] = _matrix[verticesChosen[i]][
                    verticesChosen[j]
                ];
            }
        }

         _rowLabelsCopy = jQuery.extend(true, [], _rowLabels);
        _columnLabelsCopy = jQuery.extend(true, [], _columnLabels);

        // _rowLabelsCopy = _rowLabels;
        // _columnLabelsCopy = _columnLabels;

        _labelsData = _rowLabels;


        var tempAuthorArray = new Array(_labelsData.length);
        // Exchange the author data accordingly
        for (var i = 0; i < verticesChosen.length; ++i)
        {
            // tempAuthorArray[i] = _labelsData[verticesChosen[i]];
            tempAuthorArray[i] = _columnLabels[verticesChosen[i]];
            
        }

        _rowLabels = jQuery.extend(true, [], tempAuthorArray);
        _columnLabels = jQuery.extend(true, [], tempAuthorArray);

        if(_rowLabels.length ==0 )
        {
            console.log("this is 0 length row labels: ", this);
        }
        // _labelsData = tempAuthorArray;
        // _rowLabels = _labelsData;
        // _columnLabels = _labelsData;
        // Exchange Columns back to original matrix
        for (var i = 0; i < _matrix.length; ++i)
        {
            for (var j = 0; j < _matrix[0].length; ++j)
            {
                _matrix[i][j] = Matrix2[i][j];
            }
        }
        chart.renderUpdatedMatrix();
        return chart;
    }
    

    chart.applyLeaf = function()
    {
         _history.push("Leaf");
            this.actionHistoryRefresh();



            // var test = ['b', 'c', 'd', 'a'];
            // var len = _clusterVector.length;
            // var indices = new Array(len);
            // for (var i = 0; i < len; ++i) indices[i] = i;
            // indices.sort(function (a, b) { return _clusterVector[a] < _clusterVector[b] ? -1 : _clusterVector[a] > _clusterVector[b] ? 1 : 0; });
            // console.log(_clusterVector);
            // console.log(indices);
            var MatrixCopy = new Array(_matrixSize);
            for (var i = 0; i < _matrixSize; i++) 
                MatrixCopy[i] = new Array(_matrixSize);
            // Exchange data
            for (var i = 0; i < _matrixSize; ++i)
            {
                for (var j = 0; j < _matrixSize; ++j)
                {
                    MatrixCopy[i][j] = 1 -_matrix[i][j];
                }
            }
            // var leafOrder = reorder.optimal_leaf_order()
            // .distance(science.stats.distance.manhattan);

            var perm = reorder.optimal_leaf_order()(MatrixCopy);
            // .distance(science.stats.distance.manhattan)(MatrixCopy);
             // .distance(science.stats.distance.chebyshevs)(MatrixCopy);
            
            var permuted_mat = reorder.stablepermute(MatrixCopy, perm);


            // var graph = reorder.mat2graph(MatrixCopy, true);
            // var perms = reorder.barycenter_order(graph);
            // var improved = reorder.adjacent_exchange(graph,
            //                      perms[0],
            //                      perms[1]);

            // var perm = improved[0];
            // var permuted_mat = reorder.stablepermute(MatrixCopy, perm);

            console.log("permutation: ", perm);
            console.log("permuted matrix: ",permuted_mat);  

            var PermutedMatrix = new Array(_matrixSize);
              for (var i = 0; i < _matrixSize; i++) 
                PermutedMatrix[i] = new Array(_matrixSize);

            var PermutedRowLabels = new Array(_matrixSize);
            var PermutedColumnLabels = new Array(_matrixSize);

            var Matrix2 = new Array(_matrixSize);
            var verticesChosen = perm;

            for (var i = 0; i < _matrixSize; i++) Matrix2[i] = new Array(
                _matrixSize);
            // Exchange Columns
            for (var i = 0; i < _matrix.length; ++i)
            {
                for (var j = 0; j < _matrix[0].length; ++j)
                {
                    Matrix2[i][j] = _matrix[verticesChosen[i]][
                        verticesChosen[j]
                    ];
                }
            }

             _rowLabelsCopy = jQuery.extend(true, [], _rowLabels);
            _columnLabelsCopy = jQuery.extend(true, [], _columnLabels);

            // _rowLabelsCopy = _rowLabels;
            // _columnLabelsCopy = _columnLabels;

            _labelsData = _rowLabels;


            var tempAuthorArray = new Array(_labelsData.length);
            // Exchange the author data accordingly
            for (var i = 0; i < verticesChosen.length; ++i)
            {
                // tempAuthorArray[i] = _labelsData[verticesChosen[i]];
                tempAuthorArray[i] = _columnLabels[verticesChosen[i]];
                
            }

            _rowLabels = jQuery.extend(true, [], tempAuthorArray);
            _columnLabels = jQuery.extend(true, [], tempAuthorArray);

            if(_rowLabels.length ==0 )
            {
                console.log("this is 0 length row labels: ", this);
            }
            // _labelsData = tempAuthorArray;
            // _rowLabels = _labelsData;
            // _columnLabels = _labelsData;
            // Exchange Columns back to original matrix
            for (var i = 0; i < _matrix.length; ++i)
            {
                for (var j = 0; j < _matrix[0].length; ++j)
                {
                    _matrix[i][j] = Matrix2[i][j];
                }
            }

            chart.renderUpdatedMatrix();
            return chart;
    }
    chart.applyCrossingReduction = function()
    {
         _history.push("Crossing Reduction");
            this.actionHistoryRefresh();
            var MatrixCopy = new Array(_matrixSize);
            for (var i = 0; i < _matrixSize; i++) 
                MatrixCopy[i] = new Array(_matrixSize);
            // Exchange data
            for (var i = 0; i < _matrixSize; ++i)
            {
                for (var j = 0; j < _matrixSize; ++j)
                {
                    MatrixCopy[i][j] = 1 -_matrix[i][j];
                }
            }
            // var leafOrder = reorder.optimal_leaf_order()
            // .distance(science.stats.distance.manhattan);

            // var perm = reorder.optimal_leaf_order()(MatrixCopy);
            // .distance(science.stats.distance.manhattan)(MatrixCopy);
             // .distance(science.stats.distance.chebyshevs)(MatrixCopy);
            
            // var permuted_mat = reorder.stablepermute(MatrixCopy, perm);


            var graph = reorder.mat2graph(MatrixCopy, true);
            
            var perms = reorder.barycenter_order(graph);
            var improved = reorder.adjacent_exchange(graph,
                                 perms[0],
                                 perms[1]);

            // var perms = reorder.reverse_cuthill_mckee_order(graph);
            // var improved = reorder.adjacent_exchange(graph,
            //                      perms[0],
            //                      perms[1]);
            var perm = improved[0];

            var permuted_mat = reorder.stablepermute(MatrixCopy, perm);
            
            console.log("permutation: ", perm);
            console.log("permuted matrix: ",permuted_mat);  

            var PermutedMatrix = new Array(_matrixSize);
              for (var i = 0; i < _matrixSize; i++) 
                PermutedMatrix[i] = new Array(_matrixSize);

            var PermutedRowLabels = new Array(_matrixSize);
            var PermutedColumnLabels = new Array(_matrixSize);

            var Matrix2 = new Array(_matrixSize);
            var verticesChosen = perm;

            for (var i = 0; i < _matrixSize; i++) Matrix2[i] = new Array(
                _matrixSize);
            // Exchange Columns
            for (var i = 0; i < _matrix.length; ++i)
            {
                for (var j = 0; j < _matrix[0].length; ++j)
                {
                    Matrix2[i][j] = _matrix[verticesChosen[i]][
                        verticesChosen[j]
                    ];
                }
            }

             _rowLabelsCopy = jQuery.extend(true, [], _rowLabels);
            _columnLabelsCopy = jQuery.extend(true, [], _columnLabels);

            // _rowLabelsCopy = _rowLabels;
            // _columnLabelsCopy = _columnLabels;

            _labelsData = _rowLabels;


            var tempAuthorArray = new Array(_labelsData.length);
            // Exchange the author data accordingly
            for (var i = 0; i < verticesChosen.length; ++i)
            {
                // tempAuthorArray[i] = _labelsData[verticesChosen[i]];
                tempAuthorArray[i] = _columnLabels[verticesChosen[i]];
                
            }

            _rowLabels = jQuery.extend(true, [], tempAuthorArray);
            _columnLabels = jQuery.extend(true, [], tempAuthorArray);

            if(_rowLabels.length ==0 )
            {
                console.log("this is 0 length row labels: ", this);
            }
            // _labelsData = tempAuthorArray;
            // _rowLabels = _labelsData;
            // _columnLabels = _labelsData;
            // Exchange Columns back to original matrix
            for (var i = 0; i < _matrix.length; ++i)
            {
                for (var j = 0; j < _matrix[0].length; ++j)
                {
                    _matrix[i][j] = Matrix2[i][j];
                }
            }

            chart.renderUpdatedMatrix();
            return chart;
    }
    chart.applyBandwidthReduction = function()
    {
         _history.push("Bandwidth Reduction");
            this.actionHistoryRefresh();



            // var test = ['b', 'c', 'd', 'a'];
            // var len = _clusterVector.length;
            // var indices = new Array(len);
            // for (var i = 0; i < len; ++i) indices[i] = i;
            // indices.sort(function (a, b) { return _clusterVector[a] < _clusterVector[b] ? -1 : _clusterVector[a] > _clusterVector[b] ? 1 : 0; });
            // console.log(_clusterVector);
            // console.log(indices);
            var MatrixCopy = new Array(_matrixSize);
            for (var i = 0; i < _matrixSize; i++) 
                MatrixCopy[i] = new Array(_matrixSize);
            // Exchange data
            for (var i = 0; i < _matrixSize; ++i)
            {
                for (var j = 0; j < _matrixSize; ++j)
                {
                    MatrixCopy[i][j] = 1 -_matrix[i][j];
                }
            }
            // var leafOrder = reorder.optimal_leaf_order()
            // .distance(science.stats.distance.manhattan);

            // var perm = reorder.optimal_leaf_order()(MatrixCopy);
            // .distance(science.stats.distance.manhattan)(MatrixCopy);
             // .distance(science.stats.distance.chebyshevs)(MatrixCopy);
            
            // var permuted_mat = reorder.stablepermute(MatrixCopy, perm);


            var graph = reorder.mat2graph(MatrixCopy, true);
            
            // var perms = reorder.barycenter_order(graph);
            // var improved = reorder.adjacent_exchange(graph,
            //                      perms[0],
            //                      perms[1]);

            var perms = reorder.reverse_cuthill_mckee_order(graph);

            var perm = perms;

            var permuted_mat = reorder.stablepermute(MatrixCopy, perm);
            
            console.log("permutation: ", perm);
            console.log("permuted matrix: ",permuted_mat);  

            var PermutedMatrix = new Array(_matrixSize);
              for (var i = 0; i < _matrixSize; i++) 
                PermutedMatrix[i] = new Array(_matrixSize);

            var PermutedRowLabels = new Array(_matrixSize);
            var PermutedColumnLabels = new Array(_matrixSize);

            var Matrix2 = new Array(_matrixSize);
            var verticesChosen = perm;

            for (var i = 0; i < _matrixSize; i++) Matrix2[i] = new Array(
                _matrixSize);
            // Exchange Columns
            for (var i = 0; i < _matrix.length; ++i)
            {
                for (var j = 0; j < _matrix[0].length; ++j)
                {
                    Matrix2[i][j] = _matrix[verticesChosen[i]][
                        verticesChosen[j]
                    ];
                }
            }

             _rowLabelsCopy = jQuery.extend(true, [], _rowLabels);
            _columnLabelsCopy = jQuery.extend(true, [], _columnLabels);

            // _rowLabelsCopy = _rowLabels;
            // _columnLabelsCopy = _columnLabels;

            _labelsData = _rowLabels;


            var tempAuthorArray = new Array(_labelsData.length);
            // Exchange the author data accordingly
            for (var i = 0; i < verticesChosen.length; ++i)
            {
                // tempAuthorArray[i] = _labelsData[verticesChosen[i]];
                tempAuthorArray[i] = _columnLabels[verticesChosen[i]];
                
            }

            _rowLabels = jQuery.extend(true, [], tempAuthorArray);
            _columnLabels = jQuery.extend(true, [], tempAuthorArray);

            if(_rowLabels.length ==0 )
            {
                console.log("this is 0 length row labels: ", this);
            }
            // _labelsData = tempAuthorArray;
            // _rowLabels = _labelsData;
            // _columnLabels = _labelsData;
            // Exchange Columns back to original matrix
            for (var i = 0; i < _matrix.length; ++i)
            {
                for (var j = 0; j < _matrix[0].length; ++j)
                {
                    _matrix[i][j] = Matrix2[i][j];
                }
            }

            chart.renderUpdatedMatrix();
            return chart;
    }

    chart.applyCLUSION = function()
    {
        _clusteringDone = true;
        if(_clusteringDone == true)
        {
            _history.push("CLUSION");
            this.actionHistoryRefresh();



            // var test = ['b', 'c', 'd', 'a'];
            var len = _clusterVector.length;
            var indices = new Array(len);
            for (var i = 0; i < len; ++i) indices[i] = i;
            indices.sort(function (a, b) { return _clusterVector[a] < _clusterVector[b] ? -1 : _clusterVector[a] > _clusterVector[b] ? 1 : 0; });
            console.log(_clusterVector);
            console.log(indices);

            var Matrix2 = new Array(_matrixSize);
            for (var i = 0; i < _matrixSize; i++) 
                Matrix2[i] = new Array(_matrixSize);
            // Exchange data
            for (var i = 0; i < indices.length; ++i)
            {
                for (var j = 0; j < indices.length; ++j)
                {
                    Matrix2[i][j] = _matrix[indices[i]][indices[j]];
                }
            }

             _rowLabelsCopy = jQuery.extend(true, [], _rowLabels);
            _columnLabelsCopy = jQuery.extend(true, [], _columnLabels);

            // _rowLabelsCopy = _rowLabels;
            // _columnLabelsCopy = _columnLabels;

            _labelsData = _rowLabels;


            var tempAuthorArray = new Array(_labelsData.length);
            // Exchange the author data accordingly
            for (var i = 0; i < indices.length; ++i)
            {
                // tempAuthorArray[i] = _labelsData[verticesChosen[i]];
                tempAuthorArray[i] = _columnLabels[indices[i]];
                
            }

            _rowLabels = jQuery.extend(true, [], tempAuthorArray);
            _columnLabels = jQuery.extend(true, [], tempAuthorArray);

            if(_rowLabels.length ==0 )
            {
                console.log("this is 0 length row labels: ", this);
            }
            // _labelsData = tempAuthorArray;
            // _rowLabels = _labelsData;
            // _columnLabels = _labelsData;
            // Exchange Columns back to original matrix
            for (var i = 0; i < _matrix.length; ++i)
            {
                for (var j = 0; j < _matrix[0].length; ++j)
                {
                    _matrix[i][j] = Matrix2[i][j];
                }
            }
        }
        else
        {
            alert("Clustering has not been performed yet.");
        }
            chart.renderUpdatedMatrix();
            return chart;

    }
    chart.applyCommunityDetectionLeuven = function()
    {
        if (_matrixSize < 2) return chart;
        var verticesChosen = [];
        if (_community_assignment_result)
        {
            var max = -1;
            for (var i = 0; i < _labelsData.length; ++i)
            {
                if (_community_assignment_result[_labelsData[i].id] >
                    max) max = _community_assignment_result[_labelsData[
                    i].id];
            }
        }
        for (var i = 0; i <= max; ++i)
        {
            for (var j = 0; j < _labelsData.length; ++j)
            {
                if (i == _community_assignment_result[_labelsData[j].id])
                    verticesChosen.push(j)
            }
        }
        if (0 == verticesChosen.length) return;
        // 
        var Matrix2 = new Array(_matrixSize);
        for (var i = 0; i < _matrixSize; i++) Matrix2[i] = new Array(
            _matrixSize);
        // Exchange Columns
        for (var i = 0; i < _matrixSize; ++i)
            for (var j = 0; j < _matrixSize; ++j) Matrix2[i][j] =
                _matrix[verticesChosen[i]][verticesChosen[j]];
        var tempAuthorArray = new Array(_labelsData.length);
        // Exchange the author data accordingly
        for (var i = 0; i < verticesChosen.length; ++i) tempAuthorArray[
            i] = _labelsData[verticesChosen[i]];
        _labelsData = tempAuthorArray;
        // Exchange Columns back to original matrix
        for (var i = 0; i < _matrixSize; ++i)
            for (var j = 0; j < _matrixSize; ++j) _matrix[i][j] =
                Matrix2[i][j];
        chart.renderUpdatedMatrix();
        return chart;
    }
    chart.revertOriginalMatrixState = function()
    {
        // Store a deep copy of the matrix
        _matrix = _originalDataset.matrixData.map(function(arr)
        {
            return arr.slice();
        });
        _labelsData = _originalDataset.labelsData;
        chart.renderUpdatedMatrix();
        return chart;
    }
    chart.printMatrix = function()
    {
        console.log("_matrix");
        for (var i = 0; i < _matrix.length; ++i)
        {
            console.log(_matrix[i]);
            console.log('\n');
        }
        console.log("Adjacency");
        for (var i = 0; i < _adjacencyMatrix.length; ++i)
        {
            console.log(_adjacencyMatrix[i]);
            console.log('\n');
        }
        console.log("Dissimilarity");
        for (var i = 0; i < _dissMatrix.length; ++i)
        {
            console.log(_dissMatrix[i]);
            console.log('\n');
        }
        return chart;
    }
    chart.testingMatrixShapeChang = function()
    {
        _matrix = [
            [2, 9, 4, 2],
            [2, 9, 4, 2]
        ];
        // console.log(_matrix);
        _matrixRowSize = 2;
        _matrixColumnSize = 4;
        _columnLabels = [
        {
            name: 'c1',
            id: 1000
        },
        {
            name: 'c2',
            id: 1001
        }];
        // _columnLabels = ['a','b','c','d'];
        console.log(_rowLabels, _columnLabels);
        _width = _matrixColumnSize * _cellWidthScale;
        _height = _matrixRowSize * _cellWidthScale;
        _axisColumnPositioningScale = d3.scale.ordinal().domain(d3.range(
            _matrixColumnSize)).rangeBands([0, _width]);
        _axisRowPositioningScale = d3.scale.ordinal().domain(d3.range(
            _matrixRowSize)).rangeBands([0, _height]);
        this.renderUpdatedMatrixWithNewMatrixShape();
    }
    chart.degreeMatrix = function(matrix, rowSize, colSize)
    {
        degreeMatrix = new Array(rowSize);
        for (var j = 0; j < colSize; j++)
        {
            degreeMatrix[j] = new Array(colSize);
        }
        for (var i = 0; i < rowSize; i++)
        {
            for (var j = 0; j < colSize; j++)
            {
                // adjMatrix[i+initialPos][j+initialPos] = i == j ? 0 : (adjMatrix[i+initialPos][j+initialPos]-min) / (max-min) ;                        
                // matrix[i][j] = adjMatrix[i+initialPos][j+initialPos] > 0 ? 1 : 0;
                degreeMatrix[i][j] = 0;
                // normLaplacianMatrix[i+initialPos][j+initialPos] =  matrix[i][j];           
            }
        }
        var degreeList = new Array(rowSize);
        for (var i = 0; i < rowSize; i++)
        {
            var degree = 0;
            for (var j = 0; j < colSize; j++)
            {
                if (matrix[i][j] > 0)
                ++degree;
            }
            degreeList[i] = degree;
        }
        // var min = 10000, max = -10000;
        for (var i = 0; i < rowSize; i++)
        {
            for (var j = 0; j < colSize; j++)
            {
                degreeMatrix[i][j] = i == j ? degreeList[i] :
                {};
                // if ( laplacianMatrix[i][j] > max )
                //   max = laplacianMatrix[i][j];
                // if ( laplacianMatrix[i][j] < min )
                //   min = laplacianMatrix[i][j];
            }
        }
        return degreeMatrix;
    }
    chart.normalizedGraphLaplacianMatrix = function(degreeMatrix,
        adjacencyMatrix)
    {
        var degreeMatixForm = math.matrix(degreeMatrix);
        var adjacencyMatrixForm = math.matrix(adjacencyMatrix);
        var negativeAdjacency = math.multiply(-1, adjacencyMatrixForm);
        var dInverse = math.inv(degreeMatrixForm);
        var dInverseSquareRoot = math.sqrt(dInverse);
        var normLaplaceMatrix = math.multiply(math.multiply(
            dInverseSquareRoot, math.add(degreeMatrixForm,
                negativeAdjacency)), dInverseSquareRoot);
        return normLaplacianMatrix;
    }


    chart.applyModularity = function()
    {
        _history.push("Modularity");
        this.actionHistoryRefresh();

        var degreeList = new Array(_matrixRowSize);
        var m=0;
        for(var i=0; i < _matrixRowSize; i++)
            degreeList[i] = 0;

        for(var i = 0 ; i<_matrixRowSize; i++)
        {
            for(var j=0; j<_matrixColumnSize; j++)
            {
                if(_matrix[i][j] > 0)
                {
                    degreeList[i] = degreeList[i] + 1;
                }
            }
        }

        for(var i=0; i < _matrixRowSize; i++)
            m = m + degreeList[i];

        m = m/2;

         for(var i = 0 ; i<_matrixRowSize; i++)
        {
            for(var j=0; j<_matrixColumnSize; j++)
            {
                _matrix[i][j] = _matrix[i][j] - ((degreeList[i] * degreeList[j])/(2*m));
            }
        }

        _matrix = normalize_Matrix(_matrix, _matrixRowSize, _matrixColumnSize);
        this.renderUpdatedMatrix();

        return chart;
    }

    chart.applyPower2 = function()
    {   
        _history.push("Power 2");
        this.actionHistoryRefresh();
        // var _matrix = jQuery.extend(true, [], _matrix);
      
        
         // console.log("Starting matrix:", tempMatrix4);

         // _matrix = normalize_Matrix(_matrix, _matrixRowSize, _matrixColumnSize);

         // console.log("After normalization", tempMatrix4);


          for(var i=0; i<_matrixRowSize; i++)
         {
            for(var j=0; j<_matrixColumnSize; j++)
            {
                _matrix[i][j] = 1- _matrix[i][j];
                if(i ==j)
                    _matrix[i][j] = 1;
            }
         }

         

         // console.log("MAtrix after processing black being more prominent", tempMatrix4);

         // Find min value other tha zero and divide by it to get the correct results

         var minValue=10000;
         for(var i=0; i<_matrixRowSize; i++)
         {
            for(var j=0; j<_matrixColumnSize; j++)
            {
                if(_matrix[i][j] < minValue && _matrix[i][j]!=0)
                {
                    minValue = _matrix[i][j];
                }
            }
         }

         // Now divide every element by minValue if it is not zero

         if(minValue != 0 && minValue != 10000)
         {
            for(var i=0; i<_matrixRowSize; i++)
            {
               for(var j=0; j<_matrixColumnSize; j++)
                {
                    _matrix[i][j] = _matrix[i][j] / minValue;
                }
            }
              
         }

         // console.log("Matrix after dividing by min non zero value", _matrix);

         currentMatrix = math.matrix(_matrix);
         // console.log(currentMatrix);

        

         _matrix = math.multiply(currentMatrix, currentMatrix);
         _matrix = math.add(_matrix, currentMatrix)["_data"];
         // console.log("Matrxi after multiplication", _matrix);

         _matrix = normalize_Matrix_Standard(_matrix, _matrixRowSize, _matrixColumnSize);

         // console.log("Matrix after normalization",_matrix);

         for(var i=0; i<_matrixRowSize; i++)
         {
            for(var j=0; j<_matrixColumnSize; j++)
            {
                _matrix[i][j] = 1 - _matrix[i][j];
                if(i==j)
                {
                    _matrix[i][j] = 0;
                }
            }
         }

         // _matrix = normalize_Matrix(_matrix, _matrixRowSize, _matrixColumnSize);

        // console.log("MAtrix after power 2", _matrix);
        this.renderUpdatedMatrix();
        return chart;

    }

    chart.linkPrediction = function(operation, index)
    {

        _history.push(operation);
        this.actionHistoryRefresh();

        idsToLoad = [];
        for(var i=0; i< _rowLabels.length; i++)
        {
            if (!isNaN(_rowLabels[i].id))
                idsToLoad.push(_rowLabels[i].id);
        }
        // console.log(_rowLabels);
        // console.log(idsToLoad);
        jsonData = {};
        jsonData["ids"] = idsToLoad;
        jsonData["operation"] = operation;

        var tempMatrix2 = new Array(_matrixRowSize)
        for (var j = 0; j < _matrixRowSize; j++)
        {
            tempMatrix2[j] = new Array(_matrixColumnSize);
        }

        $.ajax({
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(jsonData),
                dataType: 'json',
                async: false,

                //data: JSON.stringify(data),
                url: '/coauthorlink',
                success: function (fetchdataResult) {
                console.log(fetchdataResult["matrix"]);
                    // draw_Scatterplot(fetchdataResult)
                    // console.log(fetchdataResult);
                    recdMatrix = fetchdataResult["matrix"];
                    for (var i=0; i< _matrixRowSize; i++)
                    {
                        for(var j=0; j< _matrixColumnSize; j++)
                        {       
                                if(recdMatrix[i][j] == -1)
                                {
                                    tempMatrix2[i][j] = -1;
                                }
                                else if(recdMatrix[i][j] == -2)
                                {
                                    tempMatrix2[i][j] = -2;
                                }
                                else if((recdMatrix[i][j] == 0))
                                    tempMatrix2[i][j] = 1;
                                else
                                {
                                    tempMatrix2[i][j] = 1- recdMatrix[i][j];
                                }
                                
                        }
                    }


                }
            });
        // _matrix = normalize_Matrix(tempMatrix2, _matrixRowSize, _matrixColumnSize);
        _matrix = tempMatrix2;
        this.renderUpdatedMatrix();
        return chart;

    }


    chart.similarityMatrices = function(matrixType, index)
    {


        _history.push(matrixType);
        this.actionHistoryRefresh();

        idsToLoad = [];
        for(var i=0; i< _rowLabels.length; i++)
        {
            if (!isNaN(_rowLabels[i].id))
                idsToLoad.push(_rowLabels[i].id);
        }
        // console.log(_rowLabels);
        // console.log(idsToLoad);
        jsonData = {};
        jsonData["ids"] = idsToLoad;
        jsonData["matrixType"] = matrixType;

        var tempMatrix2 = new Array(_matrixRowSize)
        for (var j = 0; j < _matrixRowSize; j++)
        {
            tempMatrix2[j] = new Array(_matrixColumnSize);
        }

        $.blockUI({ message: '<h1>Loading alternate similarity matrix..<\/h1>' });
        $.ajax({
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(jsonData),
                dataType: 'json',
                async: true,

                //data: JSON.stringify(data),
                url: '/similarity',
                success: function (fetchdataResult) {
                // console.log(fetchdataResult["matrix"]);
                    // draw_Scatterplot(fetchdataResult)
                    // console.log(fetchdataResult);
                    recdMatrix = fetchdataResult["matrix"];
                    for (var i=0; i< _matrixRowSize; i++)
                    {
                        for(var j=0; j< _matrixColumnSize; j++)
                        {
                            tempMatrix2[i][j] = 1- recdMatrix[i][j];
                        }
                    }

                    _clusteringDone = false;
                    $.unblockUI();
                    _matrix = normalize_Matrix(tempMatrix2, _matrixRowSize, _matrixColumnSize);
                    chart.renderUpdatedMatrix();
                    return chart;
                }
            
            });
        

    }

    chart.applyClustering = function(dimensions, clusters, type)
    {

        _matrixBeforeClustering = jQuery.extend(true, [], _matrix);
        _rowLabelsBeforeClustering = jQuery.extend(true, [], _rowLabels);
        if(_clusterdrift['nodes'].length ==0)
        {
            for(var i=0; i<_columnLabels.length-1; i++)
            {
                temp = {"name": _columnLabels[i].name, "id": _columnLabels[i].id, "connects":[]};
                _clusterdrift['nodes'].push(temp);
            }
        }

        for(var i=1; i<=clusters;i++)
        {
            temp = {"name": type + "-c"+i, "id": type+i};
                _clusterdrift['nodes'].push(temp);
        }


        // Code to call web service to do actual clustering
        _history.push("Clustering "+type + " clusters: "+clusters);
        this.actionHistoryRefresh();

         tempMatrix = jQuery.extend(true,[],_matrix);
            matrix = {};
            unnormalizedAdjacencyMatrix = {};
            normalizedMatrix = {}
            for(var i=0; i<_matrixRowSize;i++)
            {   
                temp={};
                temp2 = {};
                temp3 = {};

                for(var j=0; j<_matrixColumnSize; j++)
                {
                    // _temp={}
                   // temp[j]= 1 - _matrix[i][j]     // Subtraction from 1 is done in order to send real matix valued impoirtance. we use 0 for important and black in visualization
                   temp[j] = _eigenMatrix[i][j];
                   temp2[j] = _unnormalizedAdjacencyMatrix[i][j];
                   //temp2[j] = _matrix[i][j];
                   temp3[j] = _matrix[i][j]
                    // temp.push(_temp);
                }
                normalizedMatrix[i] = temp3;
                matrix[i] = temp;
                unnormalizedAdjacencyMatrix[i] = temp2;
                // jsonData.push(_temp);
            }
            jsonData = {};
            jsonData["weightMatrix"] = unnormalizedAdjacencyMatrix;
            jsonData["normalizedWeightMatrix"] = normalizedMatrix;
            jsonData["matrix"] = matrix;
            jsonData["clustering"] = type;
            jsonData["numberOfClusters"] = clusters;
            jsonData["labels"] = _columnLabels;
            // console.log(jsonData);
            // console.log("Unnormalized Adjacency Matrix: ", _unnormalizedAdjacencyMatrix);

            var tempMatrix2 = new Array(clusters)
            for (var j = 0; j < clusters; j++)
            {
                tempMatrix2[j] = new Array(_matrixColumnSize);
            }

            $.ajax({
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(jsonData),
                    dataType: 'json',
                    async: false,

                    //data: JSON.stringify(data),
                    url: '/cluster',
                    success: function (fetchdataResult) {
                    // console.log(fetchdataResult["matrix"]);
                        // draw_Scatterplot(fetchdataResult)
                        // console.log(fetchdataResult);
                        if (type == "louvain")
                        {
                            clusters = fetchdataResult["numberofClusters"];
                            tempMatrix2 = new Array(clusters)
                            for (var j = 0; j < clusters; j++)
                            {
                                tempMatrix2[j] = new Array(_matrixColumnSize);
                            }
                        }

                        _rectMatrixAfterClustering = jQuery.extend(true,[],fetchdataResult);
                        recdMatrix = fetchdataResult["matrix"];
                        for (var i=0; i< clusters; i++)
                        {
                            for(var j=0; j< _matrixColumnSize; j++)
                            {
                                tempMatrix2[i][j] = 1- recdMatrix[i][j];
                            }
                        }

                        recdClusterVector  = fetchdataResult["clusterVector"];
                        _clusterVector = new Array(_matrixRowSize);
                        for (var i=0; i< _matrixRowSize; i++)
                        {
                                _clusterVector[i] = recdClusterVector[i];
                            
                        }
                        // console.log("Clustering vector: ",_clusterVector);
                        _clusteringDone = true;

                        // console.log("cluster drift before: ", _clusterdrift);
                        // Code to form cluster drift
                        for(var i=0; i< _matrixColumnSize; i++)
                        {
                             // console.log("i = ",i);
                            // temparray = [];
                            max=-1;
                            clusterindex=-1;

                            for(var j=0; j<clusters;j++)
                            {
                                // temparray.push(recdMatrix[i][j]);
                                // console.log("here: j = ",j);
                                // console.log("received matrix = ",recdMatrix[j][i]);
                                // console.log("max = ",max);
                                if(recdMatrix[j][i] > max)
                                {
                                    // console.log("in if");
                                    max = recdMatrix[j][i];
                                    clusterindex = j;
                                    // console.log("inside if. max = ", max, "clusterindex=", clusterindex);
                                }
                            }
                            // console.log("max = ",max, "clusterindex = ", clusterindex);
                           
                            // This means i th columnlabel belongs to clusterindex+1 th cluster
                            //Find which node is at i th columnlabel
                            //Find its id
                            //Find its location in nodes array of _clusterdrift

                            tempnode = _columnLabels[i];
                            temploc_in_clusdrift_nodes = -1;
                            for(var z = 0 ; z<_clusterdrift.nodes.length; z++)
                            {
                                if(_clusterdrift['nodes'][z]['id'] == tempnode['id'])
                                {
                                    temploc_in_clusdrift_nodes = z;
                                    if(_clusterdrift['nodes'][z]['connects'].length == 0)
                                    {
                                        console.log("found and level 1");
                                        source = z;
                                        // break; 
                                    }
                                    else
                                    {
                                        console.log("found and at level 2,3 ...");
                                        len = _clusterdrift['nodes'][z]['connects'].length;
                                        source = _clusterdrift['nodes'][z]['connects'][len -1];
                                    }
                                    console.log("defining target")
                                    target = _clusterdrift['nodes'].length - clusters + clusterindex;
                                    _clusterdrift['nodes'][z]['connects'].push(target);
                                    break;
                                }
                            }
                            console.log("now pushing link");
                            templink = {'source': source , 'target': target , 'value': 1};
                            console.log("now pushing link2");
                            _clusterdrift['links'].push(templink);
                            console.log("now pushing link3");

                        }

                        console.log("Printing clusterdrift");
                        console.log(_clusterdrift);
                        // var json_text = JSON.stringify(_clusterdrift, null, 2);

                        // var obj = {a: 123, b: "4 5 6"};
                        var obj = _clusterdrift;
                        var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));
                        var a = document.getElementById('json_download');
                        a.href = 'data:' + data;
                        a.download = 'data.json';
                        a.innerHTML = 'download JSON';

                        // var container = document.getElementById('container');
                        // container.appendChild(a);



                    }
                });




        // Actual logic of clustering will go here
        // Meanwhile we are writing a stub to simulate the clustering
        _rowLabels = [];
        for (var i = 0; i < clusters; i++)
        {
            temp = {
                name: 'cluster' + i,
                id: 1000 + i
            };
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
        // var tempMatrix = new Array(clusters);
        // for (var j = 0; j < clusters; j++)
        // {
        //     tempMatrix[j] = new Array(_matrixColumnSize);
        //     for (var k = 0; k < _matrixColumnSize; k++)
        //     {
        //         tempMatrix[j][k] = Math.random();
        //         // tempMatrix[j][k] = 
        //         // tempMatrix[j][_matrixColumnSize - k] =  tempMatrix[j][k];
        //     }
        // }

        
        // _matrix = tempMatrix;
        _matrix = tempMatrix2;
        // console.log("_matrix=", _matrix);

        _matrixRowSize = clusters;
        _width = _matrixColumnSize * _cellWidthScale;
        _height = _matrixRowSize * _cellWidthScale;
        _axisColumnPositioningScale = d3.scale.ordinal().domain(d3.range(
            _matrixColumnSize)).rangeBands([0, _width]);
        _axisRowPositioningScale = d3.scale.ordinal().domain(d3.range(
            _matrixRowSize)).rangeBands([0, _height]);
        this.renderUpdatedMatrixWithNewMatrixShape();
        _state = "freezed";
        // console.log("rowlabels:",_rowLabels, "_columnLabels:",_columnLabels);
        return chart;
    }
    chart.renderUpdatedMatrixWithNewMatrixShape = function()
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
            var selection = d3.select("#"+_matrixID).selectAll("*");
            selection.transition()
                                .duration(1000)
                                .style("opacity","0");
        
        setTimeout(function(){ 
             var selection = d3.select("#"+_matrixID).selectAll("*");
            selection.remove();

                svg = d3.selectAll('#' + _matrixID)
                .attr("opacity","0")
                .attr("width", _width +
                _margin.left + _margin.right).attr("height", _height +
                _margin.top + _margin.bottom).attr("margin-left", -
                _margin.left + "px").selectAll('g').data([_matrix]).enter()
            .append("g").attr('class', 'parentGroup').attr("transform",
                "translate(" + _margin.left + "," + _margin.top + ")");
        svg.append("rect").attr("class", "drawnMatrix").attr("width",
            _width).attr("height", _height).style("fill",
            'lightgrey');
        svg.append("circle").attr("class", "stateCircle").attr("cx", -5)
            .attr("cy", -5).attr("r", 3).style("fill", _stateColors.active)
            .style("opacity", 1);
        svg.append("svg:image").attr("class", "lock").attr("x", -17).attr(
            "y", -17).attr("width", 10).attr("height", 10).attr(
            "xlink:href", "static/images/lock.svg").attr("opacity", 1);
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
        var row = svg.selectAll(".row").data(_matrix).enter().append(
            "g").attr("class", "row").attr("transform", function(d,
            i)
        {
            return "translate(0," + _axisRowPositioningScale(i) +
                ")";
        })
            .attr("id", function(d,i){return "Row"+i;})
            .each(addCells);
        row.append("line").attr("x2", _width)
        row.append("text").attr("x", -6).attr("y",
            _axisRowPositioningScale.rangeBand() / 2).attr("dy",
            ".3em").attr("text-anchor", "end").text(function(d, i)
        {
            // console.log(i);
            return _rowLabels[i].name;
            // return _columnLabels[i].name;
            // return _labelsData[i].name; 
        }).attr('class', 'authorLabel').style('fill', function(d, i)
        {
            if (_community_assignment_result && true ==
                AugmentedNodeTrix._communityDetection)
            {
                var color = d3.scale.category10().domain(d3.range(
                    0, 10));
                return color(_community_assignment_result[
                    _columnLabels[i].id]);
            }
            return '#505050';
        }).style('font-family', 'Fira Sans')
        .style('font-size', 11)
        var column = svg.selectAll(".column").data(function(d, i)
        {
            // console.log("matrix: ",d);
            // return d["dissimilarityMatrix"][0];
            return d[0];
        }).enter().append("g").attr("class", "column").attr(
            "transform", function(d, i)
            {
                // console.log(data);
                return "translate(" + _axisColumnPositioningScale(i) +
                    ")rotate(-90)";
            })
         .attr("id", function(d,i){return "Column"+i;});
        column.append("line").attr("x1", -_height);
        column.append("text").attr("x", 6).attr("y",
            _axisColumnPositioningScale.rangeBand() / 2).attr("dy",
            ".3em").attr("text-anchor", "start").text(function(d, i)
        {
            // console.log("rowlabel",i);
            // return "a";
            return _columnLabels[i].name;
            // return _rowLabels[i].name ; 
        }).attr('class', 'authorLabel').style('fill', function(d, i)
        {
            if (_community_assignment_result && true ==
                AugmentedNodeTrix._communityDetection)
            {
                var color = d3.scale.category10().domain(d3.range(
                    0, 10));
                return color(_community_assignment_result[
                    _rowLabels[i].id]);
            }
            return '#505050';
        }).style('font-family', 'Fira Sans')
        .style('font-size', 11)


        var selection = d3.select("#"+_matrixID);
            selection.transition()
                                .duration(1000)
                                .style("opacity","1");
    }, 1000);  
        
    }
    chart.updateValueFiltering = function(beta)
    {
        _beta = beta;
        tempMatrix = jQuery.extend(true, [], _matrix);
        // console.log("hii",tempMatrix);
        for (var i = 0; i < _matrixRowSize; i++)
        {
            for (var j = 0; j < _matrixColumnSize; j++)
            {
                if (tempMatrix[i][j] >= ( _beta)) tempMatrix[i][j] =
                    1;
            }
        }
        _matrix = tempMatrix;
        // _matrix = normalize_Matrix(_matrix, _matrixRowSize, _matrixColumnSize);
        chart.renderUpdatedMatrix();
        // chart.printMatrix();
    }
    chart.renderUpdatedMatrix = function()
    {

        // Community Detection
        // detectCommunities();  
        // console.log(_matrix)
        // chart.printMatrix();
        // console.log("in renderUpdatedMatrix, _rowLabels:",_rowLabels,"_columnLabels",_columnLabels);
        d3.selectAll('#' + _matrixID).selectAll(".row").data(_matrix)
            .attr("id", function(d,i){return "Row"+i;})
            .each(updateRowCells)
       
        // d3.select('#' + _matrixID+" #title").text(function(d,i){
        //     console.log(_history+"  d=",d+"i="+i);
        //     console.log(d);
        //     console.log(_history[_history.length -1]);
        //     return _history[_history.length -1];
        // });

        d3.selectAll('#' + _matrixID).selectAll(".row text").data(
            _matrix).text(function(d, i)
        {   
            // console.log(d,i);
            return _rowLabels[i].name;
        }).style('fill', function(d, i)
        {
            if (_community_assignment_result && true ==
                AugmentedNodeTrix._communityDetection)
            {
                var color = d3.scale.category10().domain(d3.range(
                    0, 10));
                return color(_community_assignment_result[
                    _labelsData[i].id]);
            }
            return '#505050';
        })
        d3.selectAll('#' + _matrixID).selectAll(".column")
                .data(_matrix).attr("id", function(d,i){return "Column"+i;})

        d3.selectAll('#' + _matrixID).selectAll(".column text").data(
                _matrix)

            // .data(function(d,i){
            //   // console.log("matrix: ",d);
            //                 // return d["dissimilarityMatrix"][0];
            //                 return d[0];
            //               })                              
            .text(function(d, i)
            {
                return _columnLabels[i].name;
            }).style('fill', function(d, i)
            {
                if (_community_assignment_result && true ==
                    AugmentedNodeTrix._communityDetection)
                {
                    var color = d3.scale.category10().domain(d3.range(
                        0, 10));
                    return color(_community_assignment_result[
                        _labelsData[i].id]);
                }
                return '#505050';
            })
        return chart;
    }

    function updateRowCells(data)
    {

        
        // console.log(data);
        if ('circle' == AugmentedNodeTrix.glyphType)
        {
            var cell = d3.select(this).selectAll(".cell").data(data).transition()
                .delay(function(d, i)
                {
                    return _axisPositioningScale(i);
                }).duration(1500).attr("cx", function(d, i)
                {
                    return _axisPositioningScale.rangeBand() * i +
                        _axisPositioningScale.rangeBand() / 2;
                }).attr("cy", function(d)
                {
                    return _axisPositioningScale.rangeBand() / 2;
                })
                //.attr('r',_axisPositioningScale.rangeBand()/2)
                .attr('r', function(d, i)
                {
                    return 3 * (1 - data[i])
                }).style("fill", function(d, i)
                {
                    return _colorScale(data[i]);
                    // return data[i] <= AugmentedNodeTrix._beta ? _colorScale(data[i]) : AugmentedNodeTrix._colorScaleEnd
                })
        }
        else if ('rect' == AugmentedNodeTrix.glyphType)
        {
            var cell = d3.select(this).selectAll(".cell").data(data).transition()
                .delay(function(d, i)
                {
                    return _axisColumnPositioningScale(i);
                }).duration(1500).attr("x", function(d, i)
                {
                    return _axisRowPositioningScale.rangeBand() * i;
                }).attr("y", function(d)
                {
                    return 0;
                }).attr("width", _axisRowPositioningScale.rangeBand() ).attr(
                    "height", _axisColumnPositioningScale.rangeBand()).style(
                    "fill", function(d, i)
                    {
                        // console.log("d",d,"i",i,"_colorScale(data[i])",_colorScale(data[i]));
                        // if(d == 1)
                        //   return AugmentedNodeTrix._colorScaleEnd;
                        // else

                        // Adding for link prediction
                        if (data[i] == -1)
                            return "red";
                        else if (data[i] == -2)
                            return "green";
                        else if( data[i]>1)
                            return _colorScale(1);
                        else
                            return _colorScale(data[i]);

                        console.log(data[i]);

                    return _colorScale(data[i]);


                        // return data[i] <= AugmentedNodeTrix._beta ? _colorScale(data[i]) : AugmentedNodeTrix._colorScaleEnd
                    })
        }
        d3.select(this).selectAll(".cell title").data(data).text(
            function(data)
            {
                return 1-data
            })
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

   //Called when History has to be refreshed
    chart.actionHistoryRefresh= function()
    {
        $("#history").text(_history.join(" > "));
        return chart;
    }

    chart.drawClusteringGraph = function()
    {
            var nodes1=[];
            var links=[];
            d = _matrix;
            var numberOfClusters = d.length;
            var numberOFNodes = d[0].length;
            var nodeGroupBelonging = new Array(numberOFNodes);
            
            for (var i=0; i<numberOFNodes; i++)
                nodeGroupBelonging[i] = -1;


            // Logic to be changed to finding max when black white scale is changed 

            for (var i=0; i<numberOFNodes; i++)
            {
                min=10;
                index = -1;
                for(var j=0; j<numberOfClusters; j++)
                {
                    if(d[j][i] < min)
                    {
                        min = d[j][i];
                        index = j;
                    }
                }

                nodeGroupBelonging[i] = index;
            }

            console.log("Node group belonging: ",nodeGroupBelonging);




                // For group nodes1
              for(var i=0;i< (d.length + d[0].length);i++)
              {
                  temp = {"name": i<d.length?("cluster "+i): _columnLabels[i-d.length].name , "cluster": i<d.length?i:nodeGroupBelonging[i-numberOfClusters ], "cluster_centre":i<d.length?true:false, "radius":i<d.length?10:5, 'index':i };
                  nodes1.push(temp);
              }

              for (var i=0; i< d.length; i++)
              {
                  for(var j=0; j< d[0].length; j++)
                  {
                      temp = {"source": i, "target": (d.length+j), "value":1 - d[i][j]};
                      // temp = {"source": 0, "target": 1, "value": 5};
                      links.push(temp);
                  }
              }
              // str="";
              // for(var k=0; k<_columnLabels.length;k++)
              //   str+= ";" +_columnLabels[k]['name'];

            
              // for(var i=0; i<_rectMatrixAfterClustering['matrix'].length;i++)
              // {
              //   str +="\n";
              //   str+= _columnLabels[i]['name'];
              //   for(var j=0; j<j<_rectMatrixAfterClustering['matrix'][i].length; j++)
              //   {
              //       str += ";" + _rectMatrixAfterClustering['matrix'][i][j];
              //   }
              // }

              // console.log(str);

              membershipGraph = {};
              membershipGraph['nodes'] = nodes1;
              membershipGraph['links'] = links;
              // console.log(nodes1, links);
                var obj = membershipGraph;
                var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));
                // var data = "text/json;charset=utf-8," + encodeURIComponent(str);
                var a = document.getElementById('memGraph');
                a.href = 'data:' + data;
                a.download = 'data.json';
                a.innerHTML = 'Graph Data';


              var width = 960,
                    height = 500,
                    padding = 1.5, // separation between same-color circles
                    clusterPadding = 6, // separation between different-color circles
                    maxRadius = 12;

                var n = numberOFNodes //200, // total number of circles
                    m = numberOfClusters //10; // number of distinct clusters

                var color = d3.scale.category10()
                    .domain(d3.range(m));
                var clusters1 = new Array(m);

                for(var i=0;i<numberOfClusters;i++)    
                {
                    clusters1[i] = nodes1[i];
                }
                // nodes=nodes1;
                clusters = clusters1;

                // console.log(nodes);
                // console.log(clusters);

                var force = d3.layout.force()
                    .size([width, height])
                    .nodes(nodes1)
                    // .links(links)
                    .gravity(0.02)
            //         .linkDistance(function(links){
            // //     // console.log(link.value);
            //             return (1 - link.value)*10;
            //           })
                    // .charge(0)   
                    .on("tick", tick)
                    .start();

                    // force.linkDistance(function(link) {
                    //        return (1 - link.value)*30;
                    //     });

                var svg = d3.select("#chartArea1").append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .attr("id", "tempID")
                    .on("contextmenu", function(data, index)
                    {
                        //handle right click
                        //stop showing browser menu
                        d3.event.preventDefault();
                        // console.log(svg);
                        id = "tempID";
                        // id = svg[0][0].id
                        saveSvgAsPng(svg[0][0], "diagram.png");

                        $("#"+id).clone().appendTo("#collectedview");

                        var svgs = d3.selectAll("#collectedview svg")
                        .on("contextmenu", function(data, index)
                        {
                           d3.event.preventDefault(); 
                           this.remove();
                        });

                        newid = 'c'+globalCount;
                        globalCount +=1
                        $("#collectedview #"+id).attr('id',newid);
                        $("#collectedview #"+newid)
                          .draggable()
                          .bind('mousedown', function(event, ui){
                            // bring target to front
                            $(event.target.parentElement).append( event.target );
                          })
                          .bind('drag', function(event, ui){
                            // update coordinates manually, since top/left style props don't work on SVG
                            event.target.setAttribute('x', ui.position.left);
                            event.target.setAttribute('y', ui.position.top -1600);
                          });
                       
                    });

                var circle = svg.selectAll("circle")
                    .data(nodes1)
                    .enter().append("g")
                    .attr("class", "node");

                    circle.append("circle")
                    .attr("r", function(d) { return d.radius; })
                    .style("fill", function(d) { return color(d.cluster); })
                    .append('title')
                    .text(function(d) { return d.name; })
                    .style('font-family', 'Fira Sans')
                    .style('font-size', 11);

                    // .attr("x", function(d) { return d.cx; })
                    // .attr("y", function(d) { return d.cy; })
                    

                circle.append('text')
                       .attr("class","authorLabel")
                     .attr("dy", ".35em")
                     .text(function(d) { return d.name; })
                     .style('font-family', 'Fira Sans')
                    .style('font-size', 11)

                    
                    
                        // .attr("x", 5)
                        // .attr("y", 5)
                        // .text(function(d) { return d.name; });

                    
                    // .text( function (d) { return "( " + d.cx + ", " + d.cy +" )"; })
                    // .call(force.drag)
                    // .on('mouseover', function(d){
                    //     console.log("d = ",d.name.name);
                    // });

                    // .append("title")
                    // .text(function(d) { return d.name; });
                // circle = svg.selectAll("g")
                //             .call(force.drag);
                circle.call(force.drag);
                   

                var link = svg.selectAll(".link")
                .data(links)
              //   .linkDistance(function(d,i){
              //   return (1-d.value)*10;
              // })
                 .enter().append("line")
                 .attr("class", "link")
              // .attr("style", "stroke: #999, stroke-opacity: 0.6")
                 .style("stroke","#999")
                 .style("stroke-opacity",0.6)
              // .attr("stroke-opacity",0.6)
                 .style("stroke-width", function(d) { return (d.value)*5; });

                function tick(e) {

                link
                .attr("x1", function(d) { return nodes1[d.source].x; })
                .attr("y1", function(d) { return nodes1[d.source].y; })
                .attr("x2", function(d) { return nodes1[d.target].x; })
                .attr("y2", function(d) { return nodes1[d.target].y; });


                  circle.selectAll('circle')
                      .each(cluster(10 * e.alpha * e.alpha))
                      .each(collide(.5))
                      .attr("cx", function(d) {
                        // console.log(d);
                       return d.x; })
                      .attr("cy", function(d) { return d.y; });
                circle.selectAll('text')
                        .attr("x",function(d){
                            return d.x +5;
                        })
                        .attr("y",function(d){
                            return d.y;
                        })
                }

             


                // Move d to be adjacent to the cluster node.
                function cluster(alpha) {
                  return function(d) {
                    var cluster = clusters[d.cluster];
                    if (cluster === d) return;
                    var x = d.x - cluster.x,
                        y = d.y - cluster.y,
                        l = Math.sqrt(x * x + y * y),
                        r = d.radius + cluster.radius;
                    if (l != r) {
                      l = (l - r) / l * alpha;
                      d.x -= x *= l;
                      d.y -= y *= l;
                      cluster.x += x;
                      cluster.y += y;
                    }
                  };
                }

                // Resolves collisions between d and all other circles.
                function collide(alpha) {
                  var quadtree = d3.geom.quadtree(nodes);
                  return function(d) {
                    var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
                        nx1 = d.x - r,
                        nx2 = d.x + r,
                        ny1 = d.y - r,
                        ny2 = d.y + r;
                    quadtree.visit(function(quad, x1, y1, x2, y2) {
                      if (quad.point && (quad.point !== d)) {
                        var x = d.x - quad.point.x,
                            y = d.y - quad.point.y,
                            l = Math.sqrt(x * x + y * y),
                            r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
                        if (l < r) {
                          l = (l - r) / l * alpha;
                          d.x -= x *= l;
                          d.y -= y *= l;
                          quad.point.x += x;
                          quad.point.y += y;
                        }
                      }
                      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
                    });
                  };
}



        // var width = 1000,
        //     height = 500;

        // var color = d3.scale.category10();

        // var force = d3.layout.force()
                 
        //             // .charge(-120)
        //             // .linkDistance(30)
        //          // .charge(-300)  

        //          // .gravity(.75)
        //          // .linkDistance(85)
        //     // .charge(-10000)
        //     // .linkDistance(function(link){
        //     // //     // console.log(link.value);
        //     //     return (1/link.value)*10;
        //     // })
        //     // .linkStrength(function(link){
        //     // //     // console.log(link.value);
        //     //     return 0.1;
        //     // })
        //     // .friction(0.3)
        //     // .gravity(5)
        //     .size([width, height]);


        // var svg = d3.select("#chartArea1").append("svg")
        //     .attr("width", width)
        //     .attr("height", height);

        // // d3.json("miserables.json", function(error, graph) {
        //   // if (error) throw error;

        //   force
        //       .nodes(nodes1)
        //       .links(links)
        //       .start();

        //   var link = svg.selectAll(".link")
        //       .data(links)
        //       //   .linkDistance(function(d,i){
        //       //   return d.value*10;
        //       // })
        //     .enter().append("line")
        //       .attr("class", "link")
        //       // .attr("style", "stroke: #999, stroke-opacity: 0.6")
        //       .style("stroke","#999")
        //       .style("stroke-opacity",0.6)
        //       // .attr("stroke-opacity",0.6)
        //       .style("stroke-width", function(d) { return (d.value)*5; });

        //   var node = svg.selectAll(".node")
        //       .data(nodes1)
        //     .enter().append("circle")
        //       .attr("class", "node")
        //       .attr("r", 5)
        //       // .attr("style","stroke:#fff, stroke-width:1.5px")
        //       .style("stroke","#fff")
        //       .style("stroke-width","1.5px")
        //       .style("fill", function(d) { 
        //         if(d.cluster_centre){
        //             return "black";
        //         }
        //         return color(d.group); })
        //       .call(force.drag);

        //   node.append("title")
        //       .text(function(d) { return d.name; });

        //   force.on("tick", function(e) {

        //      // Push different nodes in different directions for clustering.
        //       var k = 6 * e.alpha;
        //       nodes1.forEach(function(o, i) {
        //         o.y += i & 1 ? k : -k;
        //         o.x += i & 2 ? k : -k;
        //       });


        //     link.attr("x1", function(d) { return d.source.x; })
        //         .attr("y1", function(d) { return d.source.y; })
        //         .attr("x2", function(d) { return d.target.x; })
        //         .attr("y2", function(d) { return d.target.y; });

        //     node.attr("cx", function(d) { return d.x; })
        //         .attr("cy", function(d) { return d.y; });
        //   });
          return this;
           
    }





    return chart;
}

