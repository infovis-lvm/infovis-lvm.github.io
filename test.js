$( function() {

    var csv_text = 'startdate,enddate,intentsity,warname,\n\
1939-09-01,1945-09-02,2,WW2\n\
1914-07-28,1918-11-11,20,Mega lange oorlog\n\
';
    var json = [ ];
    var width = $('#vis').width( ) - 10;

    json = d3.csv.parse(csv_text);
    json.forEach(fix_row);

    //var url = './sugars.csv';
    var start = '1860';
    var first = d3.time.day.round(d3.time.year.offset(new Date(start), -1)),
        last  =  d3.time.day.round(d3.time.year.offset(new Date(start), 1));

    console.log('first', first, 'last', last);
    var opts = { range: d3.time.month.range(first, last),
        width: width, margin: 0, height: 400 };
    opts.xScale = d3.time.scale()
        .domain( [first, last] )
        .range(  [0, (10) ] )
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
        margin = our.margin || 100,
        w = 8,
        h = 200,
        x, y,
        width = our.width || $('#vis').width( ),
        xAxis, yAxis,
        zoom = 40,
        selector = '#' + name;
    ;
    var scaleExtent = [ 0, 200 ];

    var color = d3.scale.category10();


    var zScale = d3.scale.linear( ).domain(scaleExtent).rangeRound( [0, 1000] );
    var zSwitching = d3.scale.linear( ).domain([0,1000]).rangeRound([0,8]);

    console.log($('#vis'), $('#vis').width( ), name);
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

    console.log(my);


    x = our.xScale.copy( );

    if (x.range()[1] < width) {
        last = x.invert(width);
        x = x.copy( ).domain( [first, last] )
            .range( [0, width ] );
    }
    y = d3.scale.linear()
        .domain( [0, d3.max( data, function( d ) { return d.intentsity; } )] )
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
        .attr("stroke", function(d,i) {
            return color(i);
        })
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
        .attr("stroke", function(d,i) {
            return color(i);
        })
        .attr("stroke-width", "4")
    ;

    // Axis
    xAxis = d3.svg.axis()
        .scale(x)
        .tickSize(12, 1, 1)
    ;
    console.log(xAxis);


    yAxis = d3.svg.axis()
        .scale(d3.scale.linear().domain( [0, d3.max( data, function( d ) { return d.intentsity || 0; } )] ).rangeRound( [h - margin, 0] ))
        .ticks(7)
        .tickSize(6, 3, 1)
        .orient('left');

    chart.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0, ' + (h - margin) + ')');

    chart.append('g')
        .attr('class', 'y axis');

    d3.select(selector + " svg").call(d3.behavior.zoom()
            .x(x)
            .scaleExtent( scaleExtent )
            .scale( 1 )
            .on("zoom",render)
    );





    function render() {
        dots.selectAll("line")
            .attr( 'x1', function( d, i ) { return x( d.startdate ) - 1; } )
            .attr( 'x2', function( d, i ) { return x( d.enddate ) - 1; } )
            .attr( 'y1', function( d ) { return (h - margin) - y( d.intentsity ) + 1 } )
            .attr( 'y2', function( d ) { return (h - margin) - y( d.intentsity ) + 1 } )
        ;
        xAxis.scale(x);
        chart.select(".x.axis").call(xAxis);
        chart.select(".y.axis").call(yAxis);

        names.selectAll("text")
            .text(function(d) {return d.warname;})
            .attr('x', function(d,i) {
                return  x( new Date(d.enddate - (d.enddate.getTime()-1 - d.startdate.getTime()-1)/2) );
            })
            .attr('y', function(d,i) {
                return ((h - margin) - y( d.intentsity ) + 1);
            })
            .attr('fill', function (d, i) {
                return color(i);
            })
            .attr('font-size', function(d,i) {
                return x( d.enddate  - 1 -d.startdate  +1)/100 + "px" ;
            });

    }

    render();

}



function update_data(rows)  {
    if (rows) {
        rows.forEach(fix_row);
        draw_graph('test', rows);
    }
}

function fix_row(row, i) {
    row.startdate = d3.time.format.iso.parse(row.startdate);
    row.enddate = d3.time.format.iso.parse(row.enddate);
    row.intentsity = parseInt(row.intentsity);
    row.warname = String(row.warname);

}