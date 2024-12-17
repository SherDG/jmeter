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

    var data = {"OkPercent": 92.2316093138265, "KoPercent": 7.768390686173501};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.026339365705070776, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "Add Comment-0"], "isController": false}, {"data": [0.0, 500, 1500, "RemovePost-1"], "isController": false}, {"data": [0.0, 500, 1500, "RemoveUser"], "isController": false}, {"data": [0.5, 500, 1500, "Add Comment-1"], "isController": false}, {"data": [0.0, 500, 1500, "LOG IN"], "isController": false}, {"data": [0.0, 500, 1500, "PostTitle"], "isController": false}, {"data": [0.0, 500, 1500, "RemovePost-0"], "isController": false}, {"data": [0.0049504950495049506, 500, 1500, "CheckPublishedPost"], "isController": false}, {"data": [0.0, 500, 1500, "RemoveUser TRANSACTION"], "isController": true}, {"data": [0.0, 500, 1500, "Get PostsID-0"], "isController": false}, {"data": [0.0, 500, 1500, "Get PostsID"], "isController": false}, {"data": [0.0, 500, 1500, "Log In TRANSACTION"], "isController": true}, {"data": [0.0, 500, 1500, "GetNewPostPage"], "isController": false}, {"data": [0.0, 500, 1500, "RemovePost TRANSACTION"], "isController": true}, {"data": [0.0, 500, 1500, "Get PostsID-1"], "isController": false}, {"data": [0.014285714285714285, 500, 1500, "PostBody-0"], "isController": false}, {"data": [0.455, 500, 1500, "Add Comment"], "isController": false}, {"data": [0.0, 500, 1500, "PostBody-1"], "isController": false}, {"data": [0.0, 500, 1500, "AddPost TRANSACTION"], "isController": true}, {"data": [0.0, 500, 1500, "POST new user-0"], "isController": false}, {"data": [0.0, 500, 1500, "POST new user-1"], "isController": false}, {"data": [0.0, 500, 1500, "GetNewPostPage-0"], "isController": false}, {"data": [0.0, 500, 1500, "GetNewPostPage-1"], "isController": false}, {"data": [0.0, 500, 1500, "RemoveUser Confirm"], "isController": false}, {"data": [0.0, 500, 1500, "RemovePost"], "isController": false}, {"data": [0.0, 500, 1500, "AddUser"], "isController": true}, {"data": [0.0, 500, 1500, "RemoveUser-0"], "isController": false}, {"data": [0.0, 500, 1500, "RemoveUser-1"], "isController": false}, {"data": [0.0, 500, 1500, "RemoveUser Confirm-1"], "isController": false}, {"data": [0.0, 500, 1500, "PostBody"], "isController": false}, {"data": [0.0, 500, 1500, "RemoveUser Confirm-0"], "isController": false}, {"data": [0.0, 500, 1500, "LOG IN-2"], "isController": false}, {"data": [9.98003992015968E-4, 500, 1500, "LOG IN-0"], "isController": false}, {"data": [0.0, 500, 1500, "LOG IN-1"], "isController": false}, {"data": [0.0, 500, 1500, "POST new user"], "isController": false}, {"data": [0.0, 500, 1500, "GET user-new PAGE-0"], "isController": false}, {"data": [0.0, 500, 1500, "GET LogIn Page"], "isController": false}, {"data": [0.0, 500, 1500, "GET user-new PAGE-1"], "isController": false}, {"data": [0.0, 500, 1500, "Get Users Page"], "isController": false}, {"data": [0.0, 500, 1500, "GET user-new PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "Get Users Page-0"], "isController": false}, {"data": [0.0, 500, 1500, "Get Users Page-1"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4853, 377, 7.768390686173501, 92924.45950958176, 504, 372655, 178978.2, 218589.80000000005, 257674.6800000001, 1.5417141205192841, 20.532348834660453, 1.5709756750360173], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Add Comment-0", 100, 0, 0.0, 602.7600000000001, 504, 1268, 703.2, 846.2999999999996, 1265.879999999999, 0.7369902790982187, 0.2945514078356806, 0.69092838665458], "isController": false}, {"data": ["RemovePost-1", 1, 0, 0.0, 101826.0, 101826, 101826, 101826.0, 101826.0, 101826.0, 0.009820674483923555, 1.1140519427749298, 0.00938910187476676], "isController": false}, {"data": ["RemoveUser", 100, 0, 0.0, 123032.26000000004, 84087, 148479, 143203.5, 145380.5, 148478.88, 0.2544082591097237, 3.24405809635204, 0.3157295935955265], "isController": false}, {"data": ["Add Comment-1", 100, 0, 0.0, 765.8000000000003, 677, 1425, 845.1, 1033.0499999999997, 1424.2799999999997, 0.737609996090667, 52.66755790699475, 0.5797297627477447], "isController": false}, {"data": ["LOG IN", 501, 70, 13.972055888223553, 195538.01996007987, 3108, 242714, 234683.2, 235594.2, 236992.26, 0.1743748348920912, 2.800451541307345, 0.29580949927796285], "isController": false}, {"data": ["PostTitle", 101, 0, 0.0, 96325.63366336629, 1512, 119252, 108600.6, 108920.8, 119080.04000000004, 0.19066928695350124, 0.12324443554811758, 0.29645512345836333], "isController": false}, {"data": ["RemovePost-0", 1, 0, 0.0, 89901.0, 89901, 89901, 89901.0, 89901.0, 89901.0, 0.011123346792582952, 0.0052140688090232595, 0.012817919155515512], "isController": false}, {"data": ["CheckPublishedPost", 101, 21, 20.792079207920793, 75781.17821782177, 1281, 254214, 125402.4, 127201.7, 254097.56000000003, 0.38823307822704334, 18.832164690105436, 0.2949774087267877], "isController": false}, {"data": ["RemoveUser TRANSACTION", 100, 69, 69.0, 380440.03000000014, 350585, 409125, 397607.5, 401754.1, 409102.66, 0.1758081019405698, 10.921005285560705, 0.748181938200815], "isController": true}, {"data": ["Get PostsID-0", 74, 0, 0.0, 80428.18918918917, 77627, 84356, 82247.5, 82779.25, 84356.0, 0.5607504963399663, 0.26175657934619523, 0.2694230900383432], "isController": false}, {"data": ["Get PostsID", 100, 0, 0.0, 135797.32999999996, 108414, 149754, 146228.7, 147367.05, 149740.50999999998, 0.3064035273174065, 10.35528123343506, 0.30873746043564454], "isController": false}, {"data": ["Log In TRANSACTION", 401, 0, 0.0, 258207.39650872812, 4832, 300717, 297007.4, 298708.2, 300146.02, 0.1474608419756664, 3.1111535682857694, 0.28802094863287986], "isController": true}, {"data": ["GetNewPostPage", 101, 0, 0.0, 136777.2871287129, 2505, 173343, 153479.8, 155147.5, 173294.94, 0.16110945393465972, 7.608209523642413, 0.2488563447016524], "isController": false}, {"data": ["RemovePost TRANSACTION", 26, 25, 96.15384615384616, 198954.26923076922, 191078, 300390, 203622.30000000002, 270723.2999999999, 300390.0, 0.06569770967676727, 8.017260000423244, 0.13862305575840425], "isController": true}, {"data": ["Get PostsID-1", 74, 0, 0.0, 62904.25675675676, 60799, 67575, 64373.0, 64678.0, 67575.0, 0.6814498305584206, 3.338767833380912, 0.379988137938338], "isController": false}, {"data": ["PostBody-0", 35, 0, 0.0, 84058.20000000001, 858, 92309, 88817.6, 90186.59999999999, 92309.0, 0.07916170021237953, 0.03942402865766636, 0.17927342069580873], "isController": false}, {"data": ["Add Comment", 100, 0, 0.0, 1368.7499999999993, 1213, 2381, 1475.6000000000001, 1994.6499999999994, 2378.749999999999, 0.7347106709377846, 52.75417774855262, 1.26624227176213], "isController": false}, {"data": ["PostBody-1", 35, 26, 74.28571428571429, 232722.8571428571, 2397, 286644, 282506.6, 283762.39999999997, 286644.0, 0.062450262826391836, 1.5764352603774494, 0.06830497496636607], "isController": false}, {"data": ["AddPost TRANSACTION", 101, 96, 95.04950495049505, 550452.7821782182, 8554, 665308, 633434.2, 650940.2999999999, 665223.06, 0.13793367165777154, 14.840999702025714, 0.8842964179240027], "isController": true}, {"data": ["POST new user-0", 98, 0, 0.0, 80916.14285714288, 67998, 120130, 109495.0, 113333.9, 120130.0, 0.3680073901892234, 0.17045718581369065, 0.5313062689871161], "isController": false}, {"data": ["POST new user-1", 98, 0, 0.0, 57099.10204081632, 41827, 104936, 87659.4, 88643.9, 104936.0, 0.527199173695989, 11.42006229053247, 0.5495055322290842], "isController": false}, {"data": ["GetNewPostPage-0", 66, 0, 0.0, 83045.6818181818, 79891, 102569, 86029.3, 87097.25, 102569.0, 0.5691814136396565, 0.26791547009210387, 0.543056876099555], "isController": false}, {"data": ["GetNewPostPage-1", 66, 0, 0.0, 68402.42424242424, 67186, 75013, 69295.5, 70167.95, 75013.0, 0.6807773239262286, 3.338069280696869, 0.5850430127491026], "isController": false}, {"data": ["RemoveUser Confirm", 100, 69, 69.0, 122273.14999999997, 93601, 180588, 174286.2, 176410.35, 180559.68999999997, 0.3680137195514649, 9.212813766197204, 0.7450193368208767], "isController": false}, {"data": ["RemovePost", 26, 25, 96.15384615384616, 84610.42307692308, 76460, 191730, 91217.90000000001, 159741.39999999988, 191730.0, 0.09056267285279386, 0.6629572707458184, 0.10768944034880562], "isController": false}, {"data": ["AddUser", 100, 74, 74.0, 272741.97, 178849, 296885, 289171.8, 292536.1, 296882.19, 0.22658370681881007, 7.804456720954234, 0.9718184036384812], "isController": true}, {"data": ["RemoveUser-0", 69, 0, 0.0, 77839.53623188408, 75479, 82273, 80248.0, 80705.5, 82273.0, 0.5374585222227415, 0.3390607474178623, 0.3238397541127261], "isController": false}, {"data": ["RemoveUser-1", 69, 0, 0.0, 61309.66666666666, 58631, 67865, 64162.0, 65293.5, 67865.0, 0.685183162368549, 3.461379393488774, 0.4951518946803968], "isController": false}, {"data": ["RemoveUser Confirm-1", 100, 0, 0.0, 59283.689999999995, 39800, 95721, 90350.1, 91717.0, 95719.44, 0.45871980476885105, 11.259716617239608, 0.40478439022376356], "isController": false}, {"data": ["PostBody", 101, 92, 91.08910891089108, 241568.6831683168, 3256, 372655, 358312.2, 364708.0, 372577.24, 0.15623622298157497, 1.7525938500163198, 0.39868002386469636], "isController": false}, {"data": ["RemoveUser Confirm-0", 100, 0, 0.0, 62987.1, 52575, 85287, 84455.3, 84886.35, 85284.91, 0.35371560557880255, 0.17258834489393837, 0.4039473666757453], "isController": false}, {"data": ["LOG IN-2", 351, 0, 0.0, 68070.62962962959, 38022, 97311, 81566.4, 82053.2, 85996.28000000012, 0.13136075142840783, 0.6556411788214658, 0.0804890871166914], "isController": false}, {"data": ["LOG IN-0", 501, 0, 0.0, 67575.94211576851, 1062, 79617, 69714.2, 70581.8, 75061.86, 0.18786159137891534, 0.20950933826316898, 0.10333918178308774], "isController": false}, {"data": ["LOG IN-1", 501, 0, 0.0, 80269.1177644711, 2046, 96269, 88009.0, 88844.5, 95304.16, 0.18657987909176937, 2.135952725951585, 0.1337849713910852], "isController": false}, {"data": ["POST new user", 100, 74, 74.0, 137139.95, 92767, 209093, 198699.1, 204637.44999999998, 209092.12, 0.3238016908924298, 7.213792570815429, 0.7987340264578361], "isController": false}, {"data": ["GET user-new PAGE-0", 72, 0, 0.0, 86870.77777777777, 79951, 92165, 88072.5, 89985.75, 92165.0, 0.5408328826392645, 0.25457172796106003, 0.5867825513791239], "isController": false}, {"data": ["GET LogIn Page", 501, 0, 0.0, 58520.98203592814, 1724, 82483, 69092.4, 70437.09999999999, 71676.72, 0.18735345482014443, 0.9341159632809666, 0.072245663478043], "isController": false}, {"data": ["GET user-new PAGE-1", 72, 0, 0.0, 67320.3888888889, 65576, 82507, 67533.4, 74376.44999999995, 82507.0, 0.7172815031032387, 3.517129065217824, 0.7102768009244961], "isController": false}, {"data": ["Get Users Page", 100, 0, 0.0, 135134.62000000005, 95394, 154301, 152636.9, 153135.75, 154292.44, 0.27644240737106035, 6.726845335138042, 0.2737346755879239], "isController": false}, {"data": ["GET user-new PAGE", 100, 0, 0.0, 135602.02000000002, 85004, 164112, 155013.3, 159147.8, 164096.81, 0.2580858290233, 3.1397703729727358, 0.47030093452878685], "isController": false}, {"data": ["Get Users Page-0", 69, 0, 0.0, 80343.04347826086, 77313, 84765, 83171.0, 83642.0, 84765.0, 0.5413760366566499, 0.25324132964700713, 0.2564134548617922], "isController": false}, {"data": ["Get Users Page-1", 69, 0, 0.0, 70548.81159420291, 66932, 72133, 71528.0, 71960.0, 72133.0, 0.5538342991989469, 2.7143179460372755, 0.30504154760567], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Test failed: text expected to contain \\\/User deleted\\\/", 69, 18.30238726790451, 1.4218009478672986], "isController": false}, {"data": ["500\/Internal Server Error", 164, 43.50132625994695, 3.379352977539666], "isController": false}, {"data": ["Test failed: text expected to contain \\\/New user created\\\/", 74, 19.628647214854112, 1.5248300020605812], "isController": false}, {"data": ["Test failed: text expected to contain \\\/Welcome\\\/", 70, 18.56763925729443, 1.442406758705955], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 4853, 377, "500\/Internal Server Error", 164, "Test failed: text expected to contain \\\/New user created\\\/", 74, "Test failed: text expected to contain \\\/Welcome\\\/", 70, "Test failed: text expected to contain \\\/User deleted\\\/", 69, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["LOG IN", 501, 70, "Test failed: text expected to contain \\\/Welcome\\\/", 70, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["CheckPublishedPost", 101, 21, "500\/Internal Server Error", 21, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["PostBody-1", 35, 26, "500\/Internal Server Error", 26, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["RemoveUser Confirm", 100, 69, "Test failed: text expected to contain \\\/User deleted\\\/", 69, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["RemovePost", 26, 25, "500\/Internal Server Error", 25, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["PostBody", 101, 92, "500\/Internal Server Error", 92, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["POST new user", 100, 74, "Test failed: text expected to contain \\\/New user created\\\/", 74, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
