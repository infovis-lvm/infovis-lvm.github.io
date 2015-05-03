/**
 * Created by maxdekoninck on 27/04/15.
 */
var wardata;
//autocompletion selected items
var selected = [];


//draw graph with options, the data, the view settings, width percentage and height percentage
function draw_ranking(data) {
    var chart = $("#ranking")
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

    var height= $("#infocard").height();
    var width= $("#infocard").width();

    d3.select("#infocard #cardHolder").remove();

    var chart = d3.select("#infocard")
        .append("svg")
        .attr("id","cardHolder")
        .attr("height",width)
        .attr("width",width);
        //.attr("transform", "translate(" + margin/2 + "," + margin/2 + ")");



    if(data != null) {

        chart = chart.append("a").attr("xlink:href", data.source);

        var borderPath = chart
            .append("rect")
            .attr("id","rectangle")
            .attr("x", 2.5)
            .attr("y", 2.5)
            .attr("height", height-5)
            .attr("width", width-5)
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

    else {

        chart = chart.append("a").attr("xlink:href", "http://www.wikipedia.org/");

        var borderPath = chart
            .append("rect")
            .attr("id","rectangle")
            .attr("x", 2.5)
            .attr("y", 2.5)
            .attr("height", $("#infocard").height()-5)
            .attr("width", $("#infocard").width()-5)
            .style("stroke", "black")
            .style("fill", "orange")
            .style("stroke-width", "5");

        var text = chart.append("text")
            .text("Select a war");

        d3plus.textwrap()
            .container(text)
            .padding(10)
            .size([7, 10])
            .resize(true)
            .draw();

    }
}

function draw_map(data) {
    var divElem = $("#worldmap"),
        map = new Datamap({
            element: divElem[0],
            projection : 'mercator',
            height : divElem.height(),
            width : divElem.width()
        });
}

function mouseover(id) {
    draw_infocart(wardata[id]);
}

//draw graph with options, the data, the view settings, width percentage and height percentage
function draw_graph(data, our) {
    var divElem = $("#graph"),
        results,
        chart,
        dots,
        margin = 100,
        height = divElem.height(),
        x, y,
        width = divElem.width(),
        xAxis, yAxis,
        zoom = 40
    ;
    var scaleExtent = [ 1, 200 ];

    var zScale = d3.scale.linear( ).domain(scaleExtent).rangeRound( [0, 1000] );
    var zSwitching = d3.scale.linear( ).domain([0,1000]).rangeRound([0,8]);

    chart = d3.select("#graph").append("svg")
        .attr("width",width)
        .attr("height",height)
        .append('g')
        .attr("fill","green")
        .attr("width",width-margin/2)
        .attr("transform", "translate(" + margin/2 + "," + margin/2 + ")");

    /*
    var rect = chart.append("rect")
        .attr("width", width-margin/2)
        .attr("height", height-margin/2)
        .attr("fill", "pink");
    */

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
        .attr('width',width-margin)
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

    zoom(d3.select("#graph"));

    //test.call(zoom);

    //alldata.call(zoom);


    var autocompdata = new Array();

    //console.log(data);


    //TODO add data correct to the object name for the autocompletation and data for the    onselected func
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

        $("#search").autocomplete({
        source: autocompdata,
        select: function() { alert("test");}
        });

    /*
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
        */
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


function initVisualization(data) {
    wardata = data;

    var start = '1820',
        end = '2010',
        margin = 100,
        steps = 24,
        w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
        h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    var first = d3.time.day.round(d3.time.year.offset(new Date(start), -1)),
        last  =  d3.time.day.round(d3.time.year.offset(new Date(end), 1));

    var opts = {range: d3.time.month.range(first, last),
        width: w - (2*margin), margin: margin, height: h - (2*margin), startTime: first, endTime: last };
    opts.tick_step =  steps;
    opts.ticks = d3.time.years;
    // draw_graph('test', json, opts);
    //draw_upperGraph(json, opts);
    draw_map(wardata);
    //draw_map(wardata,opts,1,1);
    draw_infocart(null);
    draw_graph(wardata,opts);
    //draw_right_graph(json,opts);
    //draw_ranking(wardata,opts,1,1);


}

