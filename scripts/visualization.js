/**
 * Created by maxdekoninck on 27/04/15.
 */
var wardata;
//autocompletion selected items
var selected = new Array();

function initVisualization(data) {
    wardata = data;
    console.log(wardata);

    var start = '1820';
    var end ='2010';
    var margin = 100;
    var steps = 24
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    draw_canvas(w,h);


    var first = d3.time.day.round(d3.time.year.offset(new Date(start), -1)),
        last  =  d3.time.day.round(d3.time.year.offset(new Date(end), 1));

    var opts = {range: d3.time.month.range(first, last),
        width: w - (2*margin), margin: margin, height: h - (2*margin), startTime: first, endTime: last };
    opts.tick_step =  steps;
    opts.ticks = d3.time.years;
    // draw_graph('test', json, opts);
    //draw_upperGraph(json, opts);
    //draw_map(opts);
    //draw_map(wardata,opts,1,1);
    //draw_infocart(null);
    draw_graph(wardata, opts);
    //draw_right_graph(json,opts);
    //draw_ranking(wardata,opts,1,1);


}

function draw_canvas(width,height) {

    // width of the canvas
    var canvasWidth = width;

    // height of the canvas
    var canvasHeight = height;

    // create main canvas element (svg), add it to html
    var canvas = d3.select("body")
        .append("svg")
        .attr("id","vis")
        .attr("width", canvasWidth)
        .attr("height", canvasHeight);

    // create titleBar canvas element (svg), add it to main canvas element
    var titleBarHeight = 40;
    var titleBarWidth = canvasWidth;
    var titleBarCanvas = canvas.append("g")
        .attr("id", "titleBarCanvas")
        .append("svg")
        .attr("class","canvas")
        .attr("width", titleBarWidth)
        .attr("height", titleBarHeight);

    // create graph canvas element (svg), add it to main canvas element
    var graphHeight = (canvasHeight - titleBarHeight) * 0.65;
    var graphWidth = canvasWidth * 0.8;
    var graphCanvas = canvas.append("g")
        .attr("id", "graphCanvas")
        .attr("transform", "translate(" + 0 + "," + titleBarHeight + ")")
        .append("svg")
        .attr("class","canvas")
        .attr("width", graphWidth)
        .attr("height", graphHeight);

    // create ranking canvas element (svg), add it to main canvas element
    var rankingHeight = canvasHeight - titleBarHeight;
    var rankingWidth = canvasWidth - graphWidth;
    var rankingCanvas = canvas.append("g")
        .attr("id", "rankingCanvas")
        .attr("transform", "translate(" + graphWidth + "," + titleBarHeight + ")")
        .append("svg")
        .attr("class","canvas")
        .attr("width", rankingWidth)
        .attr("height", rankingHeight);

    // create map canvas element (svg), add it to main canvas element
    var mapHeight = canvasHeight - titleBarHeight - graphHeight;
    var mapWidth = graphWidth * 0.5;
    var mapCanvas = canvas.append("g")
        .attr("id", "mapCanvas")
        .attr("transform", "translate(" + 0 + "," + (titleBarHeight+graphHeight) + ")")
        .append("svg")
        .attr("class","canvas")
        .attr("width", mapWidth)
        .attr("height", mapHeight);
    console.log(mapCanvas);


    // create infocard canvas element (svg), add it to main canvas element
    var infoCardHeight = mapHeight;
    var infoCardWidth = mapWidth;
    var infocardCanvas = canvas.append("g")
        .attr("id","infoCardCanvas")
        .attr("transform", "translate(" + mapWidth + "," + (titleBarHeight+graphHeight) + ")")
        .append("svg")
        .attr("class","canvas")
        .attr("width", infoCardWidth)
        .attr("height", infoCardHeight);
}

//draw graph with options, the data, the view settings, width percentage and height percentage
function draw_ranking(data, our,wp,hp) {
    var margin = our.margin,
        height = our.height*hp,
        width = our.width*wp;

    chart = d3.select("#rankingCanvas .canvas")
        .append('g');
        //.attr("transform", "translate(" + margin/2 + "," + margin/2 + ")");

    var borderPath = chart.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", height*0.2)
        .attr("width", width*0.2)
        .style("stroke", "black")
        .style("fill", "none")
        .style("stroke-width", "5");


}

function draw_infocart(data) {

    d3.select("#infoCardCanvas .canvas g").remove();

    var chart = d3.select("#infoCardCanvas .canvas")
        .append("g");
        //.attr("transform", "translate(" + margin/2 + "," + margin/2 + ")");



    if(data != null) {

        chart = chart.append("a").attr("xlink:href", data.source);

        var borderPath = chart
            .append("rect")
            .attr("id","rectResize")
            .attr("x", 0)
            .attr("y", 0)
            .attr("height", 200)
            .attr("width", 200)
            .style("stroke", "black")
            .style("fill", "orange")
            .style("stroke-width", "5");

        var text = chart.append("text")
            .text(data.description);

        d3plus.textwrap()
            .container(text)
            .padding(10)
            .size([7, 10])
            .resize(true)
            .draw();


    }
}

function draw_map(data, our) {
    var margin = our.margin,
        height = our.height,
        width = our.width;

    var chart = d3.select("#mapCanvas .canvas")
        .append('g')
        .attr("transform", "translate(" + margin/2 + "," + margin/2 + ")");

    var borderPath = chart.append("rect")
        .attr("x", -margin/2)
        .attr("y", -margin/2)
        .attr("height", height)
        .attr("width", width)
        .style("stroke", "black")
        .style("fill", "none")
        .style("stroke-width", "5");

    var map = new Datamap({
        element: document.getElementById('mapCanvas'),
        projection : 'mercator',
        height : mapHeight,
        width : mapHeight
    });


}

function mouseover(id) {
    draw_infocart(wardata[id]);
}

//draw graph with options, the data, the view settings, width percentage and height percentage
function draw_graph(data, our) {
    var results,
        chart,
        dots,
        margin = our.margin,
        height = our.height-100,
        x, y,
        width = our.width, //|| $('#vis').width( )
        xAxis, yAxis,
        zoom = 40
    ;
    var scaleExtent = [ 1, 200 ];

    var zScale = d3.scale.linear( ).domain(scaleExtent).rangeRound( [0, 1000] );
    var zSwitching = d3.scale.linear( ).domain([0,1000]).rangeRound([0,8]);

    chart = d3.select("#graphCanvas .canvas")
        .append('g')
        .attr("fill","green")
        .attr("transform", "translate(" + margin/2 + "," + margin/2 + ")");

    var rect = chart.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "pink");

    var first = our.startTime,
        last  =  our.endTime;

    x = d3.time.scale()
        .domain( [first, last] )
        .range(  [0, 13 ]);

    if (x.range()[1] < width) {
        last = x.invert(width);
        x = x.copy( ).domain([first, last])
            .range( [0, width ] );
    }



    y = d3.scale.log()
        .domain( [d3.min( data, function( d ) { return d.sterfkans_per_dag; } ), d3.max( data, function( d ) { return d.sterfkans_per_dag; } )] )
        .range( [0, height - margin] );

    //names
    var namechart = chart.append( 'g' )
        .attr( 'class', 'names' );

    var names = namechart.append("g");

    names.selectAll('text')
        .data(data)
        .enter().append('text')
        .attr('dy','-6')
        .attr('text-anchor','middle');

    //d3.select(selector + ' svg g')
    //    .attr('transform', 'translate(50, 50)');

    // Bars
    dots = chart.append('g')
        .attr('class', 'dots');

    dots.selectAll( 'line' )
        .data( data )
        .enter().append( 'line' )
        .attr("stroke-width", "4")
    ;

    // Axis
    xAxis = d3.svg.axis()
        .scale(x)
        .tickSize(12, 1, 1)
    ;

    var xlabel = chart.append('g');


    var ylabel = chart.append('g');


    ylabel.append("text")
        .attr('class' ,'label')
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (30) +","+(-20)+")")  // text is drawn off the screen top left, move down and out and rotate
        .text("sterfkans per dag");

    xlabel.append("text")
        .attr('class' ,'label')
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (width/2) +","+(height-(margin)+50)+")")  // centre below axis
        .text("Date");



    yAxis = d3.svg.axis()
        .scale(d3.scale.log()
            .domain( [d3.min( data, function( d ) { return d.sterfkans_per_dag ; } ), d3.max( data, function( d ) { return d.sterfkans_per_dag ; } )] ).rangeRound( [height - margin, 0] ))
        .tickSize(6, 3, 1)
        .ticks(20,",.0e")
        .orient('left');

    chart.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0, ' + (height - margin) + ')');

    chart.append('g')
        .attr('class', 'y axis');

    var zoom = d3.behavior.zoom()
        .x(x)
        .scaleExtent( scaleExtent )
        .scale(20)
        .on("zoom",render);

    var cacheScale = zoom.scale();

    var alldata = d3.select("#graphCanvas");

    var test = d3.select("#graphCanvas .canvas g");

    zoom(rect);

    //test.call(zoom);

    //alldata.call(zoom);


    var autocompdata = new Array();

    //console.log(data);


    //TODO add data correct to the object name for the autocompletation and data for the onselected func
    for (var el in data) {
        var ob = new Object();
        ob.data = data[el];
        ob.name = data[el].name;
        autocompdata.push(ob);
        for (var i = 1 ; i < 50 ; i++) {
            var pr = "involved country "+i
            if(data[el].hasOwnProperty(pr) && data[el][pr] != 1) {
                //console.log(data[el][pr]);
                var landname = String(data[el][pr]);
                var ob = new Object();
                ob.data = data[el];
                ob.name = landname;
                autocompdata.push(ob);
            }
        }
    }


    var mc = autocomplete(document.getElementById('autocompletion'))
        .keys(autocompdata)
        .dataField("name")
        .placeHolder("Search Wars - Start typing here")
        .width(960)
        .height(100)
        .onSelected(function select(d,i) {
            console.log(d)
            selected.push(d);
            test.call(zoom.event);
            //test.transition().duration(4000).call(zoom.scale(1).event);
            //zoom(d3.select("#i21"));

            //console.log(d3.event.scale);
            //zoom.scale(1).translate([0,0]).event;
            var x1 = parseInt(d3.select("#i"+ d.data.id).attr("x1"));
            var x2 = parseInt(d3.select("#i" + d.data.id).attr("x2"));
            test.transition().duration(4000).call(zoom.scale(1).translate([(((width)/2)-((x1+1+x2+1)/2))*4,0]).scale(2).event);
            //alldata.transition().duration(5500).call(zoom.center([((width/2)-((x1+x2)/2)-1)/2,h/2]).scale(2).event);
        })
        .render();

    test.transition().duration(4000).call(zoom.translate([100,0]).event);

    function render() {
        cacheScale = zoom.scale();
        dots.selectAll("line")
            .attr( 'id', function(d,i) {return "i"+i;})
            .attr( 'x1', function( d, i ) { return x(d.beginning ) - 1; } )
            .attr( 'x2', function( d, i ) { return x( d.ending ) - 1; } )
            .attr( 'y1', function( d ) { return (height - margin) - y( d.sterfkans_per_dag) + 1 } )
            .attr( 'y2', function( d ) { return (height - margin) - y( d.sterfkans_per_dag) + 1 } )
        ;
        xAxis.scale(x);
        chart.select(".x.axis").call(xAxis);
        chart.select(".y.axis").call(yAxis);


        var viewednames = new Array();

        names.selectAll("text")
            .text(function(d) {return d.name;}) //TODO add name d.name;})
            .attr( 'class', function(d,i) {return "i"+i;})
            .attr('onmouseover',function(d,i) {return "mouseover("+i+")";})
            .attr('x', function(d,i) {
                var val = x( new Date(d.ending.getTime() - (d.ending.getTime()-1 - d.beginning.getTime()-1)/2) );
                if (val >= 0 && val <= width-50) { // TODO check the correct values start x - width - end x
                    viewednames.push(d.name);
                    //TODO draw upper graph with these names.
                }
                return  x( new Date(d.ending.getTime() - (d.ending.getTime()-1 - d.beginning.getTime()-1)/2) );
            })
            .attr('y', function(d,i) {
                return ((height - margin) - y( d.sterfkans_per_dag ) + 1);
            })
            .attr({
                fill: function (d, i) {
                    if (selected.indexOf(d) != -1) {
                        return "red";
                    }
                    else {
                        return "gray";
                    }
                }

            })
            .attr('font-size', function(d,i) {
                return x( d.ending  - 1 - d.beginning  +1)/130 + "px" ;
                //return 10*(x(d.ending - d.beginning)/x( d.ending  - 1 - d.beginning  +1)) + "px" ;
            });

    }


    render();

}