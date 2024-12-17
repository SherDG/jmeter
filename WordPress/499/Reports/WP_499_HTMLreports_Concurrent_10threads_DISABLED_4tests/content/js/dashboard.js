/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 6;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 97.52348420153714, "KoPercent": 2.4765157984628523};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Add Comment-0"], "isController": false}, {"data": [0.0, 500, 1500, "Add Comment-1"], "isController": false}, {"data": [0.0, 500, 1500, "LOG IN"], "isController": false}, {"data": [0.0, 500, 1500, "PostTitle"], "isController": false}, {"data": [0.0, 500, 1500, "CheckPublishedPost"], "isController": false}, {"data": [0.0, 500, 1500, "Log In TRANSACTION"], "isController": true}, {"data": [0.0, 500, 1500, "GetNewPostPage"], "isController": false}, {"data": [0.0, 500, 1500, "PostBody-0"], "isController": false}, {"data": [0.0, 500, 1500, "Add Comment"], "isController": false}, {"data": [0.0, 500, 1500, "PostBody-1"], "isController": false}, {"data": [0.0, 500, 1500, "POST new user-0"], "isController": false}, {"data": [0.0, 500, 1500, "AddPost TRANSACTION"], "isController": true}, {"data": [0.0, 500, 1500, "POST new user-1"], "isController": false}, {"data": [0.0, 500, 1500, "GetNewPostPage-0"], "isController": false}, {"data": [0.0, 500, 1500, "GetNewPostPage-1"], "isController": false}, {"data": [0.0, 500, 1500, "AddUser"], "isController": true}, {"data": [0.0, 500, 1500, "PostBody"], "isController": false}, {"data": [0.0, 500, 1500, "LOG IN-2"], "isController": false}, {"data": [0.0, 500, 1500, "LOG IN-0"], "isController": false}, {"data": [0.0, 500, 1500, "LOG IN-1"], "isController": false}, {"data": [0.0, 500, 1500, "POST new user"], "isController": false}, {"data": [0.0, 500, 1500, "GET user-new PAGE-0"], "isController": false}, {"data": [0.0, 500, 1500, "GET LogIn Page"], "isController": false}, {"data": [0.0, 500, 1500, "GET user-new PAGE-1"], "isController": false}, {"data": [0.0, 500, 1500, "GET user-new PAGE"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1171, 29, 2.4765157984628523, 37598.514944491944, 3330, 92278, 63437.8, 73896.19999999997, 88285.56, 1.5456827799586588, 32.97657256475764, 1.7667181605516937], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Add Comment-0", 16, 0, 0.0, 28497.5, 26907, 29575, 29459.5, 29575.0, 29575.0, 0.03422496497288741, 0.013636509481384828, 0.03205248184472561], "isController": false}, {"data": ["Add Comment-1", 16, 0, 0.0, 33309.6875, 31851, 35463, 34999.6, 35463.0, 35463.0, 0.034013966985193295, 2.3724617409304947, 0.026673062001084196], "isController": false}, {"data": ["LOG IN", 154, 14, 9.090909090909092, 65639.2987012987, 12557, 92278, 87863.5, 89520.5, 92010.15, 0.20670530534668774, 5.733525371146758, 0.35836426013258665], "isController": false}, {"data": ["PostTitle", 41, 0, 0.0, 33208.34146341463, 28046, 36062, 34508.0, 35122.3, 36062.0, 0.0632629160501104, 0.03804906376670488, 0.09293398312191689], "isController": false}, {"data": ["CheckPublishedPost", 31, 0, 0.0, 31642.451612903224, 29601, 33559, 33294.8, 33464.8, 33559.0, 0.06291810092875236, 3.8518943422419953, 0.043904323767414107], "isController": false}, {"data": ["Log In TRANSACTION", 73, 0, 0.0, 91064.32876712333, 17016, 119839, 116359.20000000001, 118372.3, 119839.0, 0.10120348971814135, 2.90163559092787, 0.19570945075965004], "isController": true}, {"data": ["GetNewPostPage", 42, 0, 0.0, 46561.42857142857, 18712, 62673, 61516.0, 62046.4, 62673.0, 0.06159748682253764, 4.624007955058767, 0.07250251064756558], "isController": false}, {"data": ["PostBody-0", 40, 0, 0.0, 33155.049999999996, 30684, 37158, 35615.9, 35758.55, 37158.0, 0.06504657334651612, 0.031495817606969095, 0.13685665635813993], "isController": false}, {"data": ["Add Comment", 51, 0, 0.0, 38595.784313725475, 26263, 64581, 62109.2, 64022.6, 64581.0, 0.10166856049279349, 2.2592481323385765, 0.10135318237545601], "isController": false}, {"data": ["PostBody-1", 40, 0, 0.0, 31261.350000000017, 12967, 41714, 40550.4, 40869.55, 41714.0, 0.06905755429218596, 5.130033823634776, 0.0647465150752641], "isController": false}, {"data": ["POST new user-0", 30, 0, 0.0, 37219.83333333332, 29251, 44809, 44443.3, 44656.1, 44809.0, 0.04619556430191573, 0.021067703641596335, 0.06782717864055693], "isController": false}, {"data": ["AddPost TRANSACTION", 31, 0, 0.0, 180439.19354838712, 152651, 188251, 186048.0, 187137.4, 188251.0, 0.04807423903131959, 9.019635297773387, 0.3083148273359428], "isController": true}, {"data": ["POST new user-1", 30, 0, 0.0, 30339.1, 10088, 38835, 38034.8, 38641.95, 38835.0, 0.049390358343513234, 1.3387841853307345, 0.05373130780729858], "isController": false}, {"data": ["GetNewPostPage-0", 17, 0, 0.0, 31372.0, 21830, 33939, 33855.0, 33939.0, 33939.0, 0.031221074592656804, 0.014695857376621659, 0.022886726383093605], "isController": false}, {"data": ["GetNewPostPage-1", 17, 0, 0.0, 28259.0, 26304, 29155, 29110.2, 29155.0, 29155.0, 0.03125419403706747, 0.15324932447276932, 0.02247831510478428], "isController": false}, {"data": ["AddUser", 23, 11, 47.82608695652174, 117277.8695652174, 90644, 123480, 123030.4, 123414.0, 123480.0, 0.03617620643716271, 1.6229065232384938, 0.15073060945504477], "isController": true}, {"data": ["PostBody", 40, 0, 0.0, 64417.95, 44758, 78034, 75266.9, 77254.29999999999, 78034.0, 0.0652392322647147, 4.877973711239741, 0.19842856528326874], "isController": false}, {"data": ["LOG IN-2", 48, 0, 0.0, 25919.041666666668, 3330, 30840, 28726.8, 29026.6, 30840.0, 0.07106384049721, 0.35281652695096155, 0.04634070262891795], "isController": false}, {"data": ["LOG IN-0", 154, 0, 0.0, 25929.571428571424, 4313, 30382, 29197.5, 29404.75, 30292.35, 0.22050495635004158, 0.2459147071794409, 0.15470975408685889], "isController": false}, {"data": ["LOG IN-1", 154, 0, 0.0, 31629.55844155845, 7246, 37225, 36034.5, 36482.25, 37104.549999999996, 0.2202151816918246, 5.521891212270275, 0.18252070371262777], "isController": false}, {"data": ["POST new user", 30, 15, 50.0, 67560.09999999999, 39339, 82601, 81812.5, 82402.45, 82601.0, 0.0462182673079708, 1.2738789566688338, 0.11814093230333356], "isController": false}, {"data": ["GET user-new PAGE-0", 16, 0, 0.0, 31720.4375, 22093, 32969, 32898.3, 32969.0, 32969.0, 0.02570351318831197, 0.012098723981217158, 0.027887307765834573], "isController": false}, {"data": ["GET LogIn Page", 157, 0, 0.0, 24862.45222929936, 4449, 29917, 28812.8, 29187.5, 29882.78, 0.22732406275881642, 1.1257736099386948, 0.12950294172902393], "isController": false}, {"data": ["GET user-new PAGE-1", 16, 0, 0.0, 28229.874999999996, 26491, 29856, 29438.100000000002, 29856.0, 29856.0, 0.025958434057465486, 0.1272825169946623, 0.025704933724873046], "isController": false}, {"data": ["GET user-new PAGE", 31, 0, 0.0, 47502.22580645162, 16264, 62709, 61093.0, 62081.4, 62709.0, 0.04480785380498176, 0.7492710480376329, 0.07339996213013647], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Test failed: text expected to contain \\\/New user created\\\/", 15, 51.724137931034484, 1.2809564474807857], "isController": false}, {"data": ["Test failed: text expected to contain \\\/Welcome\\\/", 14, 48.275862068965516, 1.1955593509820666], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1171, 29, "Test failed: text expected to contain \\\/New user created\\\/", 15, "Test failed: text expected to contain \\\/Welcome\\\/", 14, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["LOG IN", 154, 14, "Test failed: text expected to contain \\\/Welcome\\\/", 14, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["POST new user", 30, 15, "Test failed: text expected to contain \\\/New user created\\\/", 15, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
