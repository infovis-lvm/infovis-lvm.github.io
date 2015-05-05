/**
 * Created by maxdekoninck on 27/04/15.
 */


// ID of the Google Spreadsheet
var spreadsheetID = "1zWCinNSlwG20xruZKnwv2SFrJ-IA_DWWUcJIHwlZOnU";

// Make sure it is public or set to Anyone with link can view
var url = "https://spreadsheets.google.com/feeds/cells/" + spreadsheetID + "/od6/public/values?alt=json";

// The file with all the date


//Get the data and clean it (parse and remove first two lines).
$.getJSON(url, function(data) {
    var temp = mapEntries(data);
    var wardatalen = temp[1].length;

    var wardata = temp.map(function(d,i) {
        var obj = new Object;
        //first 2 rows of spreadsheet are irrelevant
        if ( i > 1) {
            for(var j = 0 ; j < wardatalen+1; j++) {
                obj[temp[1][j]] = temp[i][j];
                fix_row(obj,i);
            }
            return obj;
        }

    });

    wardata  = wardata.filter(Boolean);

    initVisualization(wardata);

});

//parse the json feed in a data frame
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

//parse the values in the row to the correct type.
function fix_row(row, i) {
    row.id = i;
    row.beginning = d3.time.format.iso.parse(new Date(row.beginning));
    row.ending = d3.time.format.iso.parse(new Date(row.ending));
    row.sterfkans_per_dag = parseFloat(row.sterfkans_per_dag);
    row.name = String(row.name);
    row.nb_victims = parseInt(row.nb_victims);
}
