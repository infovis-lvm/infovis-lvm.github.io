var wardata;
var wardatalen;
var selected;
var map;

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
    row.sterfkans_per_dag = parseFloat(row.sterfkans_per_dag);
    row.name = String(row.name);
    row.nb_victims = parseInt(row.nb_victims);
}

function logrow(d) {
    console.log(d.name);
}

function draw_upperGraph(data,our) {
    /*
	var margin = {top: 10, right: 30, bottom: 30, left: 30},
		width = 960 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;
    */

    var names = new Array()
    data.forEach(function(d) {names.push(d.name)});

	var chart = d3.select("#upperGraph").append("svg")
        .attr( 'class', 'chart' )
        .attr( 'width', our.width + our.margin )
        .attr( 'height', our.height )
        .append('g')
        .attr("transform", "translate(" + 50 + "," + -50 + ")");

    /*
   var svg = d3.select("#upperGraph").append("svg")
       .attr("width", width + margin.left + margin.right)
       .attr("height", height + margin.top + margin.bottom)
       .append("g")
       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    */

    var x = d3.scale.ordinal()
		.domain(names)
        .rangePoints([0, our.width]);

	var y = d3.scale.linear()
		.domain([0, d3.max(data, function(d) { return d.nb_victims; })])
		.range([our.height, 0]);

	var xAxis = d3.svg.axis()
		.scale(x)
        .tickSize(1, 1, 1)
        //.ticks(data.length)
        //.tickFormat(function(d,i){
        //   return  data[i].name; )}
		.orient("bottom");

    var dots = chart.append('g')
        .attr('class', 'dots');

	var bar = dots.selectAll(".bar")
		.data(data)
		.enter().append("g")
		.attr("class", "bar")
		.attr("transform", function(d) { return "translate(" + x(d.name) + "," + y(d.nb_victims) + ")"; });

	bar.append("rect")
		.attr("x", 1)
		.attr("width", 5)
		.attr("height", function(d) { return our.height - y(d.nb_victims); });

    /*
	bar.append("text")
		.attr("dy", ".75em")
		.attr("y", 6)
		.attr("x", x(data[0].dx) / 2)
		.attr("text-anchor", "middle")
		.text(function(d) { return d.y; });
    */
	
    //chart.select(".x.axis").call(xAxis);

    var yAxis = d3.svg.axis()
        .scale(y)
        // .domain( [d3.min( data, function( d ) { return Math.log(1/d.sterfkans_per_dag); } ), d3.max( data, function( d ) { return Math.log(1/d.sterfkans_per_dag); } )] ).rangeRound( [0,h - margin] ))
        .tickSize(6, 3, 1)
        .ticks(5,",.0e")
        .orient('left');

	chart.append("g")
		.attr("class", "xAxis")
		.attr("transform", "translate(0," + our.height + ")")
		.call(xAxis);



    chart.append("g")
        .attr("class", "y axis")
        //.attr("transform", "translate(0," + our.height + ")")
        .call(yAxis);

}

function updateUpperGraph(names) {

    //console.log("update");

    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) /2;
    var h = 500; //Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    var x = d3.scale.ordinal()
        .domain(names)
        .rangePoints([0, w/2]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .tickSize(1, 1, 1);



    var y = d3.scale.linear()
        .domain([0, d3.max(wardata, function(d) {
                if(names.indexOf(d.name) != -1) {
                    return d.nb_victims;
                }
            })])
        .range([h, 0]);

    var dots = d3.select("#upperGraph .chart .dots");

    //dots.append("ja")

    dots.selectAll(".bar").remove();

    var bars = dots.selectAll(".bar")
        .data(names)
        .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(" + x(d) + "," + y(findNbVictims(d)) + ")"; });


    bars.append("rect")
        .attr("x", 1)
        .attr("width", 5)
        .attr("height", function(d) { return h - y(findNbVictims(d)); });

    var ax = d3.select("#upperGraph svg g");
    ax.selectAll(".xAxis").remove();

    ax.append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(0," +h+ ")")
        .call(xAxis);



}

function highlight_country(country) {
	var countryOb = new Object();
	countryOb[country] = '#000000'
	map.updateChoropleth(countryOb);
}

function draw_map(our) {
	// options on http://datamaps.github.io/
	map = new Datamap({
			element: document.getElementById('upperGraph'),
			projecttion : 'mercator',
			height : our.height,
			width : our.width + our.margin
		});
	
	highlight_country("BRA");
	highlight_country("BEL");
}

function updateMap() {
	// TODO
	
}

function findNbVictims(name) {
    for (var d in wardata) {
        if(wardata[d].name == name) {
            return wardata[d].nb_victims;
        }
    }
}

function draw_right_graph(data,our) {


    var chart = d3.select("#mainGraph").append("svg")
        .attr( 'class', 'chart2' )
        .attr( 'width', our.width + our.margin )
        .attr( 'height', our.height )
        .append('g')
        .attr("transform", "translate(" + 50 + "," + 50+ ")");

    /*
     var svg = d3.select("#upperGraph").append("svg")
     .attr("width", width + margin.left + margin.right)
     .attr("height", height + margin.top + margin.bottom)
     .append("g")
     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
     */

    var y = d3.scale.log()
        .domain( [d3.min( data, function( d ) { return d.sterfkans_per_dag; } ), d3.max( data, function( d ) { return d.sterfkans_per_dag; } )] )
        .range( [0,our.height-our.margin] );


    var x = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.nb_victims; })])
        .range([0,our.width]);


    /*
    var yAxis = d3.svg.axis()
        .scale(y)
        .tickSize(1, 1, 1)
        //.ticks(data.length)
        //.tickFormat(function(d,i){
        //   return  data[i].name; })
        .orient("left");
    */
    var yAxis = d3.svg.axis()
        .scale(d3.scale.log()
            .domain( [d3.min( data, function( d ) { return d.sterfkans_per_dag ; } ), d3.max( data, function( d ) { return d.sterfkans_per_dag ; } )] )
            .rangeRound( [0,our.margin-our.height] ))
        // .domain( [d3.min( data, function( d ) { return Math.log(1/d.sterfkans_per_dag); } ), d3.max( data, function( d ) { return Math.log(1/d.sterfkans_per_dag); } )] ).rangeRound( [0,h - margin] ))
        .tickSize(6, 3, 1)
        .ticks(20,",.0e")
        .orient('left');

    var xAxis = d3.svg.axis()
        .scale(x)
        // .domain( [d3.min( data, function( d ) { return Math.log(1/d.sterfkans_per_dag); } ), d3.max( data, function( d ) { return Math.log(1/d.sterfkans_per_dag); } )] ).rangeRound( [0,h - margin] ))
        .tickSize(6, 3, 1)
        .ticks(5,",.0e")
        .orient('bottom');



    var dots = chart.append('g')
        .attr('class', 'dots');

    var bar = dots.selectAll(".bar")
        .data(data)
        .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(" + 1 + "," + y(d.sterfkans_per_dag) + ")"; });

    bar.append("rect")
        .attr("y", 1)
        .attr("height", 5)
        .attr("width", function(d) { return  x(d.nb_victims); });

    chart.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(0," + (our.height-our.margin) + ")")
        .call(yAxis);

    chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (our.height-our.margin) + ")")
        .call(xAxis);
}

function update_right_graph(names) {

    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) /2;
    var h = 500; //Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    var margin = 100;

    /*
     var svg = d3.select("#upperGraph").append("svg")
     .attr("width", width + margin.left + margin.right)
     .attr("height", height + margin.top + margin.bottom)
     .append("g")
     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
     */

    var y = d3.scale.log()
        .domain( [d3.min( wardata, function( d ) { return d.sterfkans_per_dag; } ), d3.max( wardata, function( d ) { return d.sterfkans_per_dag; } )] )
        .range( [0, h - margin] );


    var x = d3.scale.linear()
        .domain([0, d3.max(wardata, function(d) { return d.nb_victims; })])
        .range([0,w]);


    /*
     var yAxis = d3.svg.axis()
     .scale(y)
     .tickSize(1, 1, 1)
     //.ticks(data.length)
     //.tickFormat(function(d,i){
     //   return  data[i].name; })
     .orient("left");
     */
    var yAxis = d3.svg.axis()
        .scale(d3.scale.log()
            .domain( [d3.min( wardata, function( d ) { return d.sterfkans_per_dag ; } ), d3.max( wardata, function( d ) { return d.sterfkans_per_dag ; } )] )
            .rangeRound( [0,margin-h] ))
        // .domain( [d3.min( data, function( d ) { return Math.log(1/d.sterfkans_per_dag); } ), d3.max( data, function( d ) { return Math.log(1/d.sterfkans_per_dag); } )] ).rangeRound( [0,h - margin] ))
        .tickSize(6, 3, 1)
        .ticks(20,",.0e")
        .orient('left');

    var xAxis = d3.svg.axis()
        .scale(x)
        // .domain( [d3.min( data, function( d ) { return Math.log(1/d.sterfkans_per_dag); } ), d3.max( data, function( d ) { return Math.log(1/d.sterfkans_per_dag); } )] ).rangeRound( [0,h - margin] ))
        .tickSize(6, 3, 1)
        .ticks(5,",.0e")
        .orient('bottom');

    var dots = d3.select("#mainGraph .chart2 .dots");

    //dots.append("ja")

    dots.selectAll(".bar").remove();


    var selecteddata = new Array();

    for(el in wardata) {
        if(names.indexOf(wardata[el].name) != -1) {
            selecteddata.push(wardata[el]);
        }
    }
    console.log(selecteddata);

    var bar = dots.selectAll(".bar")
        .data(selecteddata)
        .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(" + 1 + "," + (y(d.sterfkans_per_dag)-5) + ")"; });

    bar.append("rect")
        .attr("y", 0)
        .attr("height", 5)
        .attr("width", function(d) { return w - x(d.nb_victims); });

    /*
    chart.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(0," + (our.height-our.margin) + ")")
        .call(yAxis);

    chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (our.height-our.margin) + ")")
        .call(xAxis);
        */


}


function draw_graph(name, data, our) {
    var results,
        chart,
        dots,
        margin = our.margin,
        w = 8,
        h = our.height,
        x, y,
        width = our.width, //|| $('#vis').width( )
        xAxis, yAxis,
        zoom = 40,
        selector = '#' + name;
    ;
    var scaleExtent = [ 1, 200 ];

    var color = d3.scale.category10();

    //console.log(data);

    //data.forEach(logrow);


   //console.log(findNbVictims("Anglo-Persian"));

    var zScale = d3.scale.linear( ).domain(scaleExtent).rangeRound( [0, 1000] );
    var zSwitching = d3.scale.linear( ).domain([0,1000]).rangeRound([0,8]);

    /*
    $('#vis #test').remove( );
    $('#vis').append( $('#clone').clone(true).attr('id', name) );
    $(selector).find('.title').text(name.replace(/_/g," "));
    selector = selector + ' .view';
     $('#clone').remove();
    */
	chart = d3.select("#mainGraph").append( 'svg' )
        .attr( 'class', 'chart' )
        .attr( 'width', width + margin )
        .attr( 'height', h )
        .append('g')
        .attr("transform", "translate(" + 50 + "," + 50 + ")");

    //d3.select(selector + ' svg g')
     //   .attr('transform', 'translate(50, 50)');



    var first = our.range ? our.range[0] : d3.time.day.round(d3.time.day.offset(new Date( ), -1)),
        last  = our.range ? our.range[our.range.length - 1] : d3.time.day.round(d3.time.day.offset(new Date( ), 1))
        ;



    x = our.xScale.copy( );

    if (x.range()[1] < width) {
        last = x.invert(width);
        x = x.copy( ).domain([first, last])
            .range( [0, width ] );
    }



    y = d3.scale.log()
        .domain( [d3.min( data, function( d ) { return d.sterfkans_per_dag; } ), d3.max( data, function( d ) { return d.sterfkans_per_dag; } )] )
        .range( [0, h - margin] );


    var safeties = {
        low: 70,
        high: 140,
        x: x.range()[0],
        y: (h - margin) - y(140) + .5,
        width: (width),
        height: y(140) -  y(70)  + .5

    };

    //names
    var namechart = chart.append( 'g' )
        .attr( 'class', 'names' );

    var names = namechart.append("g");

    names.selectAll('text')
        .data(data)
        .enter().append('text')
        //.attr("stroke", function(d,i) {
        //    return color(i); })
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
        //    return color(i); })
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
        .scale(d3.scale.log()
            .domain( [d3.min( data, function( d ) { return d.sterfkans_per_dag ; } ), d3.max( data, function( d ) { return d.sterfkans_per_dag ; } )] ).rangeRound( [h - margin, 0] ))
           // .domain( [d3.min( data, function( d ) { return Math.log(1/d.sterfkans_per_dag); } ), d3.max( data, function( d ) { return Math.log(1/d.sterfkans_per_dag); } )] ).rangeRound( [0,h - margin] ))
        .tickSize(6, 3, 1)
        .ticks(20,",.0e")
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

    var cacheScale = zoom.scale();

    //console.log(cacheScale);

    var alldata = d3.select("#mainGraph" + " svg");

    var test = d3.select(".chart").select("g");


    test.call(zoom);

    alldata.call(zoom);


    var autocompdata = new Array();

    console.log(data);


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

    //console.log(autocompdata);

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
        //console.log(cacheScale);
        dots.selectAll("line")
            .attr( 'id', function(d,i) {return "i"+i;})
            .attr( 'x1', function( d, i ) { return x(d.beginning ) - 1; } )
            .attr( 'x2', function( d, i ) { return x( d.ending ) - 1; } )
            .attr( 'y1', function( d ) { return (h - margin) - y( d.sterfkans_per_dag) + 1 } )
            .attr( 'y2', function( d ) { return (h - margin) - y( d.sterfkans_per_dag) + 1 } )
        ;
        xAxis.scale(x);
        chart.select(".x.axis").call(xAxis);
        chart.select(".y.axis").call(yAxis);

        //console.log(xAxis);

        var viewednames = new Array();

        names.selectAll("text")
            .text(function(d) {return d.name;}) //TODO add name d.name;})
            .attr( 'class', function(d,i) {return "i"+i;})
            .attr('x', function(d,i) {
                var val = x( new Date(d.ending.getTime() - (d.ending.getTime()-1 - d.beginning.getTime()-1)/2) );

                console.log(our.width+50);
                if (val >= 0 && val <= our.width-50) { // TODO check the correct values start x - width - end x
                    //console.log(d.name);
                    //console.log(val2);
                    //console.log(val);
                    viewednames.push(d.name);
                    //TODO draw upper graph with these names.
                }
                return  x( new Date(d.ending.getTime() - (d.ending.getTime()-1 - d.beginning.getTime()-1)/2) );
            })
            .attr('y', function(d,i) {
                return ((h - margin) - y( d.sterfkans_per_dag ) + 1);
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

        console.log(viewednames)
        updateUpperGraph(viewednames);
        update_right_graph(viewednames);

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

$( function() {

    selected = new Array();

    var json = wardata;

    //var width = $('#vis').width( ) - 50;

    //console.log(wardata);

    json.forEach(fix_row);

    wardata = json;

    var start = '1820';
    var ed = "2010"
    var first = d3.time.day.round(d3.time.year.offset(new Date(start), -1)),
        last  =  d3.time.day.round(d3.time.year.offset(new Date(start), 1));

    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)/2;
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    var opts = { range: d3.time.month.range(first, last),
        width: w - (2*100), margin: 100, height: 500 };
    opts.xScale = d3.time.scale()
        .domain( [first, last] )
        .range(  [0, 13 ] )
    ;
    opts.tick_step =  24;
    opts.ticks = d3.time.years;
    // draw_graph('test', json, opts);
    draw_upperGraph(json, opts);
	draw_map(opts);
    draw_graph('First_War_Test', json, opts);
    draw_right_graph(json,opts);
} );

//Setup and render the autocomplete


