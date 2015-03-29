var wardata;
var wardatalen;
var selected;

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}

function mapEntries(json, realrowlength, skip){
    if (!skip) skip = 0;
    var dataframe = new Array();
    var row = new Array();
    for (var i=0; i < json.feed.entry.length; i++) {
        var entry = json.feed.entry[i];
        if (entry.gs$cell.col == '1') {
            if (row != null) {
                if ((!realrowlength || row.length === realrowlength) && (skip === 0)){
                    dataframe.push(row);
                } else {
                    if (skip > 0) skip--;
                }
            }
            var row = new Array();
        }
        row.push(entry.content.$t);
    }
    dataframe.push(row);
    return dataframe;
}

function sheetLoaded(data) {
    //console.log("laod data")
    var temp = mapEntries(data);
    wardatalen = temp[1].length;

    wardata = temp.map(function(d,i) {
        var obj = new Object;
        //first 2 rows of spreadsheet are irrelevant
        if ( i > 1) {
            for(var j = 0 ; j < wardatalen+1; j++) {
                obj[temp[1][j]] = temp[i][j];
            }
            return obj;
        }

    });
    wardata = wardata.filter(Boolean);
}

function fix_row(row, i) {
    row.id = i;
    row.beginning = d3.time.format.iso.parse(row.beginning);
    row.ending = d3.time.format.iso.parse(row.ending);
    row.sterfkans_per_dag = parseInt(row.sterfkans_per_dag);
    row.name = String(row.name);
}

function logrow(d) {
    console.log(d.name);
}

$( function() {

    selected = new Array();

    var json = wardata;

    var width = $('#vis').width( ) - 50;

    //console.log(wardata);

    json.forEach(fix_row);

    var start = '1820';
    var ed = "2010"
    var first = d3.time.day.round(d3.time.year.offset(new Date(start), -1)),
        last  =  d3.time.day.round(d3.time.year.offset(new Date(start), 1));

    var opts = { range: d3.time.month.range(first, last),
        width: width, margin: 100, height: 500 };
    opts.xScale = d3.time.scale()
        .domain( [first, last] )
        .range(  [0, 13 ] )
    ;
    opts.tick_step =  24;
    opts.ticks = d3.time.years;
    // draw_graph('test', json, opts);
    draw_graph('First_War_Test', json, opts);

} );

var my = { };


function draw_graph(name, data, our) {
    var results,
        chart,
        dots,
        margin = our.margin,
        w = 8,
        h = our.height,
        x, y,
        width = our.width || $('#vis').width( ),
        xAxis, yAxis,
        zoom = 40,
        selector = '#' + name;
    ;
    var scaleExtent = [ 1, 200 ];

    var color = d3.scale.category10();

   // console.log(data);

    //data.forEach(logrow);


    var zScale = d3.scale.linear( ).domain(scaleExtent).rangeRound( [0, 1000] );
    var zSwitching = d3.scale.linear( ).domain([0,1000]).rangeRound([0,8]);

    $('#vis #test').remove( );
    $('#vis').append( $('#clone').clone(true).attr('id', name) );
    $(selector).find('.title').text(name.replace(/_/g," "));
    selector = selector + ' .view';

    $('#clone').remove();

    chart = d3.select(selector).append( 'svg' )
        .attr( 'class', 'chart' )
        .attr( 'width', width )
        .attr( 'height', h )
        .append('g');

    d3.select(selector + ' svg g')
        .attr('transform', 'translate(50, 50)');



    var first = our.range ? our.range[0] : d3.time.day.round(d3.time.day.offset(new Date( ), -1)),
        last  = our.range ? our.range[our.range.length - 1] : d3.time.day.round(d3.time.day.offset(new Date( ), 1))
        ;



    x = our.xScale.copy( );

    if (x.range()[1] < width) {
        last = x.invert(width);
        x = x.copy( ).domain([first, last])
            .range( [0, width ] );
    }
    y = d3.scale.linear()
        .domain( [0, d3.max( data, function( d ) { return d.sterfkans_per_dag; } )] )
        .rangeRound( [0, h - margin] );



    var safeties = {
        low: 70,
        high: 140,
        x: x.range()[0],
        y: (h - margin) - y(140) + .5,
        width: (width),
        height: y(140) -  y(70)  + .5

    };
    var bars = chart.append('g')
        .attr('class', 'safety');

    bars.append('rect')
        .attr('class', 'safe-sugar')
    ;

    //names
    var namechart = chart.append( 'g' )
        .attr( 'class', 'names' );

    var names = namechart.append("g");

    names.selectAll('text')
        .data(data)
        .enter().append('text')
        //.attr("stroke", function(d,i) {
        //    return color(i);
       // })
        .attr('dy','-6')
        .attr('text-anchor','middle');

    d3.select(selector + ' svg g')
        .attr('transform', 'translate(50, 50)');

    // Bars
    dots = chart.append('g')
        .attr('class', 'dots');

    dots.selectAll( 'line' )
        .data( data )
        .enter().append( 'line' )
        //.attr("stroke", function(d,i) {
        //    return color(i);
        //})
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
        .attr("transform", "translate("+ (width/2) +","+(h-(margin)+50)+")")  // centre below axis
        .text("Date");


    yAxis = d3.svg.axis()
        .scale(d3.scale.linear().domain( [0, d3.max( data, function( d ) { return d.sterfkans_per_dag || 0; } )] ).rangeRound( [h - margin, 0] ))
        .ticks(7)
        .tickSize(6, 3, 1)
        .orient('left');

    chart.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0, ' + (h - margin) + ')');

    chart.append('g')
        .attr('class', 'y axis');

    var zoom = d3.behavior.zoom()
        .x(x)
        .scaleExtent( scaleExtent )
        .scale( 1 )
        .on("zoom",render);

    var alldata = d3.select(selector + " svg");

    var test = d3.select(".chart").select("g");

    console.log(test);

    test.call(zoom);

    alldata.call(zoom);




    var mc = autocomplete(document.getElementById('autocompletion'))
            .keys(data)
            .dataField("name")
            .placeHolder("Search Wars - Start typing here")
            .width(960)
            .height(100)
            .onSelected(function select(d,i) {
                selected.push(d);
                test.call(zoom.event);
                //zoom(d3.select("#i21"));
                var x1 = parseInt(d3.select("#i"+ d.id).attr("x1"));
                var x2 = parseInt(d3.select("#i" + d.id).attr("x2"));
                test.transition().duration(4000).call(zoom.translate([(((width)/2)-((x1+1+x2+1)/2)),0]).event);
                //alldata.transition().duration(5500).call(zoom.center([((width/2)-((x1+x2)/2)-1)/2,h/2]).scale(2).event);
            })
            .render();

    test.transition().duration(4000).call(zoom.translate([100,0]).event);

    function render() {
        dots.selectAll("line")
            .attr( 'id', function(d,i) {return "i"+i;})
            .attr( 'x1', function( d, i ) { return x(d.beginning ) - 1; } )
            .attr( 'x2', function( d, i ) { return x( d.ending ) - 1; } )
            .attr( 'y1', function( d ) { return (h - margin) - y( d.sterfkans_per_dag ) + 1 } )
            .attr( 'y2', function( d ) { return (h - margin) - y( d.sterfkans_per_dag ) + 1 } )
        ;
        xAxis.scale(x);
        chart.select(".x.axis").call(xAxis);
        chart.select(".y.axis").call(yAxis);

        names.selectAll("text")
            .text(function(d) {return d.name;})
            .attr( 'class', function(d,i) {return "i"+i;})
            .attr('x', function(d,i) {
                return  x( new Date(d.ending.getTime() - (d.ending.getTime()-1 - d.beginning.getTime()-1)/2) );
            })
            .attr('y', function(d,i) {
                return ((h - margin) - y( d.sterfkans_per_dag ) + 1);
            })
            .attr({
                stroke: function (d, i) {
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
    /*
    //alldata.call(zoom.event)
    //var currentTrans = d3.event.translate;
    alldata.call(zoom.event);
    //alldata.transition().duration(5500).call(zoom.translate([x(0),x(0)]).event);
    //console.log(data[22]);
    var x1 = parseInt(d3.select("#i21").attr("x1"));
    var x2 = parseInt(d3.select("#i21").attr("x2"));
    console.log(x1);
    console.log(x2);
    alldata.transition().duration(4000).call(zoom.translate([6*((width/2)-((x1+x2)/2)-1),0]).event);
    //sleep(1);
    var x1 = parseInt(d3.select("#i21").attr("x1"));
    var x2 = parseInt(d3.select("#i21").attr("x2"));
    console.log(x1);
    console.log(x2);
    alldata.transition().duration(5500).call(zoom.center([((width/2)-((x1+x2)/2)-1)/2,h/2]).scale(2).event);
    //d3.select(selector + " svg").transition().duration(5500).call(zoom.translate([200,200]).event);
    */

}

d3.select("body").style("cursor", "all-scroll");


function update_data(rows)  {
    if (rows) {
        rows.forEach(fix_row);
        draw_graph('test', rows);
    }
}



//Setup and render the autocomplete


