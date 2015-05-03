/**
 * Created by maxdekoninck on 27/04/15.
 */
var wardata;
//autocompletion selected items
var selected = [];

// state of the visualisation, attributes are
// 'metric', 'startdate', 'enddate', 'selection' and 'highlight'
var vis_state;

// ------------- //
// DRAW ELEMENTS //
// ------------- //

// draw graph with the given data, selection, highlight and metric
function draw_ranking(data, state) {
        //.attr("transform", "translate(" + margin/2 + "," + margin/2 + ")");
    var height= $("#ranking").height();
    var width= $("#ranking").width();
    var topmargin = 50;
    var leftmargin = 120;

    
    var svg = d3.select("#ranking")
        .append("svg")
        .attr("height",height-topmargin/2)
        .attr("width",width-leftmargin/2)
        .append("g")
        .attr("transform", "translate(" + leftmargin + "," + topmargin + ")");

    var names = new Array()
    data.forEach(function(d) {names.push(d.name)});


    var y = d3.scale.ordinal()
		.domain(names)
        .rangePoints([0, height]);

    var x = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.nb_victims; })])
		.range([0,width]);


    var xAxis = d3.svg.axis()
    .scale(x)
    .orient("top")
    .tickSize(6, 3, 1)
    .tickFormat(d3.format(".s"));

    var yAxis = d3.svg.axis()
    .scale(y)
    .tickSize(6, 3, 1)
    .orient("left");



        //.attr("transform", "translate(" + margin/2 + "," + margin/2 + ")");

  svg.append("g")
      .attr("class", "x axis")
      //.attr("transform", "translate(0," + height + ")")
      .call(xAxis);


    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);
  /*
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Frequency");
    */
var dots=  svg.append("g")
        .attr("class","dots");

  dots.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return 1; })
      .attr("width", function(d) { return x(d.nb_victims); })
      .attr("y", function(d) {return y(d.name);})
      .attr("height", 4);

/*
  d3.select("input").on("change", change);

  var sortTimeout = setTimeout(function() {
    d3.select("input").property("checked", true).each(change);
  }, 2000);

  function change() {
    clearTimeout(sortTimeout);

    // Copy-on-write since tweens are evaluated after a delay.
    var x0 = x.domain(data.sort(this.checked
        ? function(a, b) { return b.frequency - a.frequency; }
        : function(a, b) { return d3.ascending(a.letter, b.letter); })
        .map(function(d) { return d.letter; }))
        .copy();

    svg.selectAll(".bar")
        .sort(function(a, b) { return x0(a.letter) - x0(b.letter); });

    var transition = svg.transition().duration(750),
        delay = function(d, i) { return i * 50; };

    transition.selectAll(".bar")
        .delay(delay)
        .attr("x", function(d) { return x0(d.letter); });

    transition.select(".x.axis")
        .call(xAxis)
      .selectAll("g")
        .delay(delay);
  }

    */
}

// draw the infocard with the given selection and highlight
function draw_infocart(data, state) {
    
    // TODO:
    // if highlight is null:
    //      if selection is null: show empty infocard
    //      else: show selection
    // else: show highlight

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

// draw map with the given selection and highlight
function draw_map(data, state) {
    // http://jvectormap.com/documentation/javascript-api/jvm-map/
    // http://jvectormap.com/maps/world/world/
    
    // create map
    var div = $("#worldmap"),
        map = div.vectorMap({
            onRegionOver : map_region_hover,
            onRegionClick : map_region_click
        });
    
    
    
    // TODO color selection and highlight (if not null)
    
    // TODO link triggers to change-methods
    
    
}

//draw graph with options, the data, the view settings, width percentage and height percentage
function draw_graph(data, state) {
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
        //.attr("fill","green")
        .attr("width",width-margin/2)
        .attr("transform", "translate(" + margin/2 + "," + margin/2 + ")");

    /*
    var rect = chart.append("rect")
        .attr("width", width-margin/2)
        .attr("height", height-margin/2)
        .attr("fill", "pink");
    */

    x = d3.time.scale()
        .domain( [state.startdate, state.enddate] )
        .range(  [0, 13 ]);

    if (x.range()[1] < width) {
        last = x.invert(width);
        x = x.copy( ).domain([state.startdate, state.enddate])
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

function draw_all(data, state) {
    draw_ranking(data, state);
    draw_infocart(data, state);
    draw_map(data, state);
    draw_graph(data, state); 
}

// -------------- //
// INITIALISATION //
// -------------- //
function initVisualization(data) {
    wardata = data;

    // TODO remove opts mechanism once ranking is ok
//    var start = '1820',
//        end = '2010',
//        margin = 100,
//        steps = 24,
//        w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
//        h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
//        opts = {
//            range: d3.time.month.range(first, last),
//            width: w - (2*margin),
//            margin: margin,
//            height: h - (2*margin),
//            startTime: first,
//            endTime: last
//        };
//    opts.tick_step =  steps;
//    opts.ticks = d3.time.years;
    
    // create initial state
    vis_state = new Object();
    vis_state.metric = null // TODO select initial metric
    vis_state.startdate = d3.time.day.round(d3.time.year.offset(new Date('1820'), -1));
    vis_state.enddate = d3.time.day.round(d3.time.year.offset(new Date('2010'), 1));
    vis_state.selection = null; // TODO select initial selection 
    vis_state.highlight = null;
    
    // draw elements
    draw_all(wardata, vis_state);
}

// ------------- //
// INTERACTIVITY //
// ------------- //

function change_metric(metric) {
    vis_state.metric = metric;
    
    //TODO update metric dropdown
    draw_ranking(wardata, vis_state);
    draw_graph(wardata, vis_state);
}

function change_dates(begindate, enddate) {
    state.begindate = begindate;
    state.enddate = enddate;
    
    //TODO update graph
    // aangezien er geen andere elementen worden aangepast zullen we dit waarschijnlijk niet met dit mechanisme doen
}

function change_selection(selection) {
    vis_state.selection = selection;
    
    draw_all(wardata, vis_state);
}

function change_highlight(highlight) {
    vis_state.highlight = highlight;
    
    draw_all(wardata, vis_state);
}


function mouseover(id) {
    // TODO waarvoor is deze mouseover? gebruik highlight changed
    draw_infocart(wardata[id]);
}

function map_region_hover(event, code) {
    // console.log('hoverd over ' + code + ' on the map');
    // TODO change highlight
}

function map_region_click(event, code) {
    console.log('clicked on ' + code + ' on the map');
    // TODO change selection
}
