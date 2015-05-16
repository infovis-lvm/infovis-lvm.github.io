// --------------------- //
// CONSTANTS AND GLOBALS //
// --------------------- //

var wardata,
    map,
// state of the visualisation, attributes are
// 'metric', 'startdate', 'enddate', 'selection', 'selectionType', 'highlight' and 'highlightType'
    vis_state;

// ------------- //
// DRAW ELEMENTS //
// ------------- //

function draw_ranking(data, state) {
    var height = $("#ranking").height(),
        width = $("#ranking").width(),
        thisdata = data;

    d3.select("#ranking svg").remove();

    var svg = d3.select("#ranking")
        .append("svg")
        .attr("height", height)
        .attr("width", width)
        .append("g"),

        size = width / 10;

    svg.append("text").attr("class", "backtext").text("Casualties")
        .attr('x', width / 2)
        .attr('y', (height / 2) + size / 4)
        .attr("font-size", size)
        .attr("text-anchor", "middle")
        .attr("text-height", size / 4)
        .attr('width', width)
        .attr('height', height);

    var dots =  svg.append("g")
        .attr("class", "dots");

    $("#ranking").on('click','.barinstance',function() {
        var id = $(this).attr('id').slice(1);
        ranking_war_click(id);
    });
    
    $("#ranking").on('mouseenter','.rect',function() {
        var id = $(this).attr('id').slice(1);
        ranking_war_hover(id);
    });
}

function draw_infocart(data, state) {
    var stroke = {width: 1};
    
    // TODO SOFTWARE_ONTWERP:
    // if highlight is null:
    //      if selection is null: show empty infocard
    //      else: show selection
    // else: show highlight

    var height= $("#infocard").height(),
        width= $("#infocard").width();

    d3.select("#infocard #cardHolder").remove();

    var card = d3.select("#infocard")
        .append("svg")
        .attr("id","cardHolder")
        .attr("height",width)
        .attr("width",width);

    if(state.highlightType == 'W'
       && state.highlight != undefined
       && state.highlight != null
       && data != null) {
        
        var war = $.grep(data, function(e){ return e.id == state.highlight.id; })[0];

        card = card.append("a").attr("xlink:href", war.source);

        var borderPath = card
            .append("rect")
            .attr("id","rectangle")
            .attr("x", stroke.width/2)
            .attr("y", stroke.width/2)
            .attr("height", height-stroke.width)
            .attr("width", width-stroke.width);

        var text = card.append("text")
            .text(war.description);

        d3plus.textwrap()
            .container(text)
            .padding(10)
            .size([7, 20])
            .resize(true)
            .draw();
    }/*
    else if(state.selectionType == 'C') {
        // TODO SELECTION_COUNTRY what if selection is a country?
    }*/
    else {
        card = card.append("a").attr("xlink:href", "http://www.wikipedia.org/");

        var borderPath = card
            .append("rect")
            .attr("id","rectangle")
            .attr("x", stroke.width/2)
            .attr("y", stroke.width/2)
            .attr("height", $("#infocard").height()-stroke.width)
            .attr("width", $("#infocard").width()-stroke.width);

        var text = card.append("text")
            .attr('text-anchor','middle')
            .attr('fill','red')
            .text("Hover over a war in the graph. You can zoom in and slide.");

        d3plus.textwrap()
            .container(text)
            .padding(10)
            .size([6, 20])
            .resize(true)
            .draw();
    }
}

function draw_map(data, state) {
    // http://jvectormap.com/documentation/javascript-api/jvm-map/
    // http://jvectormap.com/maps/world/world/
    
    // create map
    map = new jvm.Map({
        container : $("#worldmap"),
        onRegionOver : map_country_hover,
        onRegionClick : map_country_click,
        backgroundColor : 'white', // TODO STYLE link css color
        regionStyle : {
            initial: {
                fill: "#555555",
                "fill-opacity": 1,
                stroke: 'none',
                "stroke-width": 0,
                "stroke-opacity": 1
            },
            hover: {
                "fill-opacity": 0.8,
                cursor: 'pointer'
            },
            selected: {
                fill: 'red' // TODO STYLE link css color
            }
        }
    });
}

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
        zoom = 40,
        scaleExtent = [ 1, 200 ];

    var zScale = d3.scale.linear( ).domain(scaleExtent).rangeRound( [0, 1000] );
    var zSwitching = d3.scale.linear( ).domain([0,1000]).rangeRound([0,8]);

    chart = d3.select("#graph").append("svg")
        .attr("width",width)
        .attr("height",height)
        .append('g')
        //.attr("fill","green")
        .attr("width",width-margin/2)
        .attr("transform", "translate(" + margin/2 + "," + margin/2 + ")");

    x = d3.time.scale()
        .domain( [state.startdate, state.enddate] )
        .range(  [0, 13 ]);

    if (x.range()[1] < width) {
        last = x.invert(width);
        x = x.copy( ).domain([state.startdate, state.enddate])
            .range( [0, width ] );
    }

    y = d3.scale.linear()
        .domain( [d3.min( data, function( d ) { return d.sterfkans_per_dag; } ), d3.max( data, function( d ) { return d.sterfkans_per_dag; } )] )
        .range( [0, height - margin] );

    // NAMES
    var namechart = chart.append( 'g' )
        .attr( 'class', 'names' );

    var names = namechart.append("g");

    names.selectAll('text')
        .data(data)
        .enter().append('text')
        .attr('dy','-6')
        .attr('text-anchor','middle');

    // BARS
    dots = chart.append('g')
        .attr('class', 'dots');

    dots.selectAll( 'line' )
        .data( data )
        .enter().append( 'line' )
        .attr("stroke-width", "4")
    ;

    // AXIS
    xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickSize(12, 1, 1)
    ;

    var xlabel = chart.append('g'),
        ylabel = chart.append('g');

    var ylabel = ylabel.append("text")
            .attr('class' ,'label')
        .attr("text-anchor", "left")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (-25) +","+(-30)+")");  // text is drawn off the screen top left, move down and out and rotate
        //.text("average daily chance of dying [consecutive head-throws]");

    ylabel.append('tspan')
        .text("average daily chance of dying")
        .attr('x', 0)
        .attr('dy', '0');
    ylabel.append('tspan')
        .text("[consecutive head-throws]")
        .attr('x', 10)
        .attr('dy', '20');

    yAxis = d3.svg.axis()
        .scale(d3.scale.linear()
            .domain( [d3.min( data, function( d ) { return d.sterfkans_per_dag ; } ), d3.max( data, function( d ) { return d.sterfkans_per_dag ; } )] ).rangeRound( [height - margin, 0] ))
        .tickSize(6, 3, 1)
        //.ticks(10,",.0e")
        .orient('left');

    chart.append('g')
        .attr('class', 'x_axis')
        .attr('width',width-margin)
        .attr('transform', 'translate(0, ' + (height - margin) + ')');

    chart.append('g')
        .attr('class', 'y_axis');

    var zoom = d3.behavior.zoom()
        .x(x)
        .scaleExtent( scaleExtent )
        .scale(20)
        .on("zoom",render);

    var cacheScale = zoom.scale();

    var alldata = d3.select("#graphCanvas");

    var test = d3.select("#graphCanvas .canvas g");

    zoom(d3.select("#graph"));

    //test.call(zoom); // TODO INIT_ANIMATIE

    //alldata.call(zoom); // TODO INIT_ANIMATIE

    test.transition().duration(4000).call(zoom.translate([100,0]).event);

    $("#graph").on('click','.clickable_text',function() {
        var id = $(this).attr('id').slice(1);
        graph_war_click(id);
    });
    
    $("#graph").on('mouseenter','.clickable_text',function() {
        var id = $(this).attr('id').slice(1);
        graph_war_hover(id);
    });

    function render() {
        cacheScale = zoom.scale();
        dots.selectAll("line")
            .attr( 'id', function(d) {return "i"+d.id;})
            .attr( 'class', function(d) {
                if(d == vis_state.selection) {
                    return "timeline selected"
                }
                else {
                    return "timeline";
                }
            })
            .attr( 'x1', function( d, i ) { return x(d.beginning ) - 1; } )
            .attr( 'x2', function( d, i ) { return x( d.ending ) - 1; } )
            .attr( 'y1', function( d ) { return (height - margin) - y( d.sterfkans_per_dag) + 1 } )
            .attr( 'y2', function( d ) { return (height - margin) - y( d.sterfkans_per_dag) + 1 } )
        ;
        xAxis.scale(x);
        chart.select(".x_axis").call(xAxis);
        chart.select(".y_axis").call(yAxis);
        
        var viewed = new Array();

        names.selectAll("text")
            .text(function(d) {return d.name;})
            .attr( 'id', function(d) {return "i"+d.id;})
            .attr("class", function(d) {
            if(d == vis_state.selection) {
                viewed.push(d)
                return "clickable_text selected"
            }
            else {
                return "clickable_text";
            }
            })
            .attr('x', function(d,i) {
                var val = x( new Date(d.ending.getTime() - (d.ending.getTime()-1 - d.beginning.getTime()-1)/2) );
                if (val >= 0 && val <= width-50) {
                    viewed.push(d);
                }
                return  x( new Date(d.ending.getTime() - (d.ending.getTime()-1 - d.beginning.getTime()-1)/2) );
            })
            .attr('y', function(d,i) {
                return ((height - margin) - y( d.sterfkans_per_dag ) + 1);
            })
            .attr('font-size', function(d,i) {
                return "12 px";
            });

        change_viewed(viewed);
    }

    render();

}

function draw_all(data, state) {
    draw_ranking(data, state);
    draw_infocart(null, state);
    draw_map(data, state);
    draw_graph(data, state); 
}

// -------------- //
// INITIALISATION //
// -------------- //

function init_visualization(data) {
    wardata = data;
    
    // create initial state
    vis_state = new Object();
    vis_state.startdate = d3.time.day.round(d3.time.year.offset(new Date('1820'), -1));
    vis_state.enddate = d3.time.day.round(d3.time.year.offset(new Date('2010'), 1));
    vis_state.selectionType = 'W';
    vis_state.selection = null;
    vis_state.highlightType = 'W';
    vis_state.highlight = null;
    vis_state.viewed = [];
    
    // draw elements
    draw_all(wardata, vis_state);
}

// --------------- //
// UPDATE ELEMENTS //
// --------------- //

function update_ranking(data, new_state, prev_state) {
    // Copy-on-write since tweens are evaluated after a delay.
    var height = $("#ranking").height(),
        width = $("#ranking").width();

    var svg = d3.select("#ranking svg g");

    var animation = false;

    var visible = new_state.viewed.sort(function(a, b) { return b.nb_victims - a.nb_victims; }).slice(0,10);

    if(new_state.selectionType == 'W'
       && new_state.selection != null
       && visible.indexOf(new_state.selection) == -1
       && d3.select(".barinstance#i" + new_state.selection.id).empty) {
        visible.push(new_state.selection);
        animation = new_state.selection != prev_state.selection;
    }

    var names = new Array()
    visible.forEach(function(d) {
        names.push(d.name)
    });

    var y = d3.scale.ordinal()
        .domain(names)
        .rangeRoundBands([0,height],1);

    var x = d3.scale.log()
        .domain([Math.pow(10,2), d3.max(visible, function(d) { return d.nb_victims; })])
        .range([1,width-10]);

    var dots = d3.select("#ranking .dots");

    dots.selectAll(".barinstance").remove();

    var bars = dots.selectAll(".dots")
        .data(visible)
        .enter().append("g")
        .attr("class","barinstance")
        .attr("id",function(d) { return "i"+d.id;})
        .attr("transform", function(d) { return "translate(1,"+y(d.name)+")"; });
    
    bars.append("rect")
        .attr("class", function(d) {
            if(new_state.selectionType == 'W' && d == new_state.selection) {
                return "bar selected"
            }
            else if(new_state.selectionType == 'C') {
                // if the selected country was involved, make the bar selected
                if(getWars(new_state.selection).indexOf(d) != -1) {
                    return "bar selected";
                }
            }
            else {
                return "bar";
            }
        })
        .attr("width", function(d) {
            if(d != new_state.selection || !animation) {
                return x(d.nb_victims);
            }
            else {
                return 0;
            }
        })
        .attr("height", 15);

    bars.append("text")
        .attr("class","warnameText")
        .attr("y", 10)
        .text(function(d) {return d.name;});

    bars.append("text")
        .attr("class","victimText")
        .attr("x", function(d) { return x(d.nb_victims) - 50; })
        .attr("y", 10)
        .text(function(d) {return String(d.nb_victims);});

    if(animation) {
        var sorted_names = visible.sort(function(a, b) { return b.nb_victims - a.nb_victims; }).map(function(d) {return d.name;});

        var y0 = y.domain(sorted_names)
            .copy();

        var transition = svg.transition().duration(750),
            delay = function(d, i) { return i * 100; };
        
        transition.select("rect.bar.selected")
            .delay(delay)
            .attr("width", function(d) { return x(d.nb_victims); });
    }
}

function update_infocard(data, new_state, prev_state) {
    draw_infocart(data, new_state);
}

function update_map(data, new_state, prev_state) {
    map.clearSelectedRegions();
    if(new_state.selection == null) return;
    
    var ids = new Array();
    
    if(new_state.selectionType == 'W') {
        var countries = getCountries(new_state.selection);
        var id;
        countries.forEach(function highlightCountry(currentValue, index, array) {
            id = getCountryId(currentValue);
            ids.push(id);
        });
    } else if(new_state.selectionType == 'C') {
        ids.push(new_state.selection);
    }
    map.setSelectedRegions(ids);
}

function update_graph(data, new_state, prev_state) {
    // clean up previous selection
    if(prev_state.selectionType == 'W'
       && prev_state.selection != null) {
        $("text.clickable_text#i"+String(prev_state.selection.id)).attr("class", "clickable_text");
        $("line.timeline#i"+String(prev_state.selection.id)).attr("class", ".dots line");
    } else if(prev_state.selectionType == 'C') {
        var wars = getWars(prev_state.selection);
        wars.forEach(function(war, array, index) {
            $("text.clickable_text#i"+String(war.id)).attr("class", "clickable_text");
            $("line.timeline#i"+String(prev_state.selection.id)).attr("class", ".dots line");
        });
    }
    // new selection
    if(new_state.selection == null) return;
    if(new_state.selectionType == 'W') {
        $("text.clickable_text#i"+String(new_state.selection.id)).attr("class", "clickable_text selected");
        $("line.timeline#i"+String(new_state.selection.id)).attr("class", "timeline selected");
    } else if(new_state.selectionType == 'C') {
        var wars = getWars(new_state.selection);
        wars.forEach(function(war, array, index) {
            $("text.clickable_text#i"+String(war.id)).attr("class", "clickable_text selected");
            $("line.timeline#i"+String(new_state.selection.id)).attr("class", "timeline selected");
        });
    }
}

function update_all(data, new_state, prev_state) {
    //selection on ranking
    update_ranking(wardata, new_state, prev_state);
    update_infocard(wardata, new_state, prev_state);
    update_map(wardata, new_state, prev_state);
    update_graph(wardata, new_state, prev_state);
}

// ------- //
// CHANGES //
// ------- //

function change_viewed(viewed) {
    prev_state = jQuery.extend(true, {}, vis_state);
    vis_state.viewed = viewed;
    update_ranking(vis_state, prev_state);
    // graph is updated on its own, outside of this mechanism
}

// id should start with a 'W' f a war should be selected, and with a 'C' if a country should be selected
function change_selection(id) {
        var prev_state = jQuery.extend(true, {}, vis_state);
    // if the selection is a war...
    if(id.charAt(0) == 'W') {
        id = id.substr(1, id.length - 1);
        vis_state.selection = $.grep(wardata, function(e){ return e.id == id; })[0];
        vis_state.selectionType = 'W';
    }
    // if the selection is a country
    else if (id.charAt(0) == 'C') {
        id = id.substr(1, id.length - 1);
        vis_state.selection = id;
        vis_state.selectionType = 'C';
    }
    update_all(wardata, vis_state, prev_state);
}

// id should start with a 'W' f a war should be highlighted, and with a 'C' if a country should be highlighted
function change_highlight(id) {
    var prev_state = jQuery.extend(true, {}, vis_state);
    // if the highlight is a war...
    if(id.charAt(0) == 'W') {
        id = id.substr(1, id.length - 1);
        vis_state.highlight = $.grep(wardata, function(e){ return e.id == id; })[0];
        vis_state.highlightType = 'W';
    }
    // if the highlight is a country
    else if (id.charAt(0) == 'C') {
        id = id.substr(1, id.length - 1);
        vis_state.highlight = id;
        vis_state.highlightType = 'C';
    }
    update_all(wardata, vis_state, prev_state);
}

// ------ //
// EVENTS //
// ------ //

function ranking_war_hover(id) {
    change_highlight('W' + id);
}

function ranking_war_click(id) {
    change_selection('W' + id);
}

function map_country_hover(event, code) {
    change_highlight('C' + code);
}

function map_country_click(event, code) {
    change_selection('C' + code);
}

function graph_war_hover(id) {
    change_highlight('W' + id);
}

function graph_war_click(id) {
    change_selection('W' + id);
}
