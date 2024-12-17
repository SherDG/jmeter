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

    var data = {"OkPercent": 94.53754773016547, "KoPercent": 5.462452269834535};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.34091277430229167, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3620689655172414, 500, 1500, "RemovePost-1"], "isController": false}, {"data": [0.48904109589041095, 500, 1500, "Add Comment-0"], "isController": false}, {"data": [0.2947761194029851, 500, 1500, "RemoveUser"], "isController": false}, {"data": [0.48904109589041095, 500, 1500, "Add Comment-1"], "isController": false}, {"data": [0.007162346521145975, 500, 1500, "LOG IN"], "isController": false}, {"data": [0.47115384615384615, 500, 1500, "PostTitle"], "isController": false}, {"data": [0.43103448275862066, 500, 1500, "RemovePost-0"], "isController": false}, {"data": [0.4762419006479482, 500, 1500, "CheckPublishedPost"], "isController": false}, {"data": [0.3888888888888889, 500, 1500, "Get PostsID-0"], "isController": false}, {"data": [0.0, 500, 1500, "RemoveUser TRANSACTION"], "isController": true}, {"data": [0.27941176470588236, 500, 1500, "Get PostsID"], "isController": false}, {"data": [0.0, 500, 1500, "Log In TRANSACTION"], "isController": true}, {"data": [0.34541577825159914, 500, 1500, "GetNewPostPage"], "isController": false}, {"data": [0.3888888888888889, 500, 1500, "Get PostsID-1"], "isController": false}, {"data": [0.0, 500, 1500, "RemovePost TRANSACTION"], "isController": true}, {"data": [0.47002141327623126, 500, 1500, "PostBody-0"], "isController": false}, {"data": [0.2538750587130108, 500, 1500, "Add Comment"], "isController": false}, {"data": [0.4743040685224839, 500, 1500, "PostBody-1"], "isController": false}, {"data": [0.4343832020997375, 500, 1500, "POST new user-0"], "isController": false}, {"data": [0.0, 500, 1500, "AddPost TRANSACTION"], "isController": true}, {"data": [0.4881889763779528, 500, 1500, "POST new user-1"], "isController": false}, {"data": [0.46396396396396394, 500, 1500, "GetNewPostPage-0"], "isController": false}, {"data": [0.47072072072072074, 500, 1500, "GetNewPostPage-1"], "isController": false}, {"data": [0.0018679950186799503, 500, 1500, "RemoveUser Confirm"], "isController": false}, {"data": [0.0, 500, 1500, "RemovePost"], "isController": false}, {"data": [0.0, 500, 1500, "AddUser"], "isController": true}, {"data": [0.4882198952879581, 500, 1500, "RemoveUser-0"], "isController": false}, {"data": [0.4908376963350785, 500, 1500, "RemoveUser-1"], "isController": false}, {"data": [0.4825653798256538, 500, 1500, "RemoveUser Confirm-1"], "isController": false}, {"data": [0.0835117773019272, 500, 1500, "PostBody"], "isController": false}, {"data": [0.4850560398505604, 500, 1500, "RemoveUser Confirm-0"], "isController": false}, {"data": [0.4841748304446119, 500, 1500, "LOG IN-2"], "isController": false}, {"data": [0.4827762619372442, 500, 1500, "LOG IN-0"], "isController": false}, {"data": [0.48448158253751705, 500, 1500, "LOG IN-1"], "isController": false}, {"data": [0.0, 500, 1500, "POST new user"], "isController": false}, {"data": [0.4740932642487047, 500, 1500, "GET user-new PAGE-0"], "isController": false}, {"data": [0.4851637107776262, 500, 1500, "GET LogIn Page"], "isController": false}, {"data": [0.4896373056994819, 500, 1500, "GET user-new PAGE-1"], "isController": false}, {"data": [0.28012422360248446, 500, 1500, "Get Users Page"], "isController": false}, {"data": [0.29259259259259257, 500, 1500, "GET user-new PAGE"], "isController": false}, {"data": [0.48825065274151436, 500, 1500, "Get Users Page-0"], "isController": false}, {"data": [0.4934725848563969, 500, 1500, "Get Users Page-1"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 28284, 1545, 5.462452269834535, 1195.6097086692184, 470, 9334, 1984.9000000000015, 2498.9500000000007, 2865.9900000000016, 42.67221870191002, 872.4899034617241, 49.27368219312935], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["RemovePost-1", 29, 0, 0.0, 1223.7586206896551, 501, 2342, 1987.0, 2218.5, 2342.0, 0.4193235876747784, 20.548070162596336, 0.39633534680952587], "isController": false}, {"data": ["Add Comment-0", 1095, 0, 0.0, 797.3433789954337, 504, 3184, 880.8, 948.4000000000001, 1918.4399999999896, 1.6991681059163637, 0.6792974890329949, 1.592970099296591], "isController": false}, {"data": ["RemoveUser", 804, 0, 0.0, 1336.5447761194023, 658, 6290, 1776.0, 1959.75, 3069.3000000000116, 1.2282797666879528, 21.122620756973237, 1.872754562986767], "isController": false}, {"data": ["Add Comment-1", 1095, 1, 0.091324200913242, 979.5013698630138, 662, 5533, 1086.0, 1145.2, 1950.199999999999, 1.6988174989062408, 118.16195655293639, 1.333837176875603], "isController": false}, {"data": ["LOG IN", 2932, 912, 31.10504774897681, 2308.438267394266, 1194, 9334, 2802.7000000000003, 3108.999999999998, 5638.420000000002, 4.434053287278864, 102.99967640399716, 8.373984374763705], "isController": false}, {"data": ["PostTitle", 468, 0, 0.0, 965.2841880341874, 576, 3225, 1127.2, 1653.5999999999995, 2489.01, 0.7135995608618086, 0.4089656070361221, 0.9513082420368083], "isController": false}, {"data": ["RemovePost-0", 29, 0, 0.0, 1130.1034482758619, 584, 3278, 1899.0, 3053.0, 3278.0, 0.4319461407846525, 0.20177656468765823, 0.49597587245673086], "isController": false}, {"data": ["CheckPublishedPost", 463, 4, 0.8639308855291576, 963.8531317494597, 566, 2583, 1092.8000000000002, 1269.6, 2459.88, 0.7076794685831584, 43.540330373969624, 0.430982456465485], "isController": false}, {"data": ["Get PostsID-0", 18, 0, 0.0, 1125.8888888888891, 616, 3204, 1794.6000000000022, 3204.0, 3204.0, 0.24373400495592476, 0.11362881426791784, 0.2315949090059715], "isController": false}, {"data": ["RemoveUser TRANSACTION", 799, 379, 47.4342928660826, 4628.704630788491, 2687, 15493, 5299.0, 5764.0, 9142.0, 1.2198510529803144, 112.40919044313875, 6.535903783293994], "isController": true}, {"data": ["Get PostsID", 34, 0, 0.0, 1862.9411764705883, 878, 4844, 3304.0, 3935.0, 4844.0, 0.4490523674304959, 24.744570511127254, 0.6484276976160602], "isController": false}, {"data": ["Log In TRANSACTION", 874, 0, 0.0, 3151.17276887872, 1786, 10319, 3628.0, 4327.25, 8230.25, 1.3260365919342383, 36.97098492496287, 2.0479339730688646], "isController": true}, {"data": ["GetNewPostPage", 469, 0, 0.0, 1475.3006396588494, 741, 7071, 1718.0, 2550.5, 6332.000000000004, 0.7144804934637984, 47.90672669721489, 0.731522183838573], "isController": false}, {"data": ["Get PostsID-1", 18, 0, 0.0, 950.3888888888889, 511, 1781, 1724.3000000000002, 1781.0, 1781.0, 0.24354932550367353, 1.1931168563194285, 0.20834883705197074], "isController": false}, {"data": ["RemovePost TRANSACTION", 32, 20, 62.5, 4112.25, 1664, 9253, 7184.299999999999, 8758.349999999999, 9253.0, 0.4377564979480164, 43.79232216142271, 1.5127233669630644], "isController": true}, {"data": ["PostBody-0", 467, 0, 0.0, 1083.15631691649, 582, 3242, 1402.6, 1547.6, 2686.32, 0.7114889467830644, 0.34336429671907615, 1.4111526749394396], "isController": false}, {"data": ["Add Comment", 2129, 1, 0.04697040864255519, 1278.9995302959128, 470, 6391, 1855.0, 1943.5, 2836.3999999999996, 3.2495779669761067, 117.41111477962701, 3.946267237625961], "isController": false}, {"data": ["PostBody-1", 467, 5, 1.0706638115631693, 985.1477516059962, 506, 3720, 1235.2, 1427.8, 2618.04, 0.7118945847230777, 47.62622528376698, 0.6075312744856676], "isController": false}, {"data": ["POST new user-0", 381, 0, 0.0, 1171.9002624671912, 605, 3686, 1601.4000000000003, 1922.6999999999998, 3117.26, 0.582821898194323, 0.26588530273467376, 0.8559210679790612], "isController": false}, {"data": ["AddPost TRANSACTION", 461, 9, 1.9522776572668112, 5465.956616052068, 3487, 14225, 5999.000000000001, 7413.699999999991, 13832.32, 0.7030772210605943, 138.41588086396524, 4.076653110792617], "isController": true}, {"data": ["POST new user-1", 381, 0, 0.0, 933.9527559055118, 529, 2473, 1177.4, 1230.1, 1921.96, 0.5831225062329827, 20.66487910825876, 0.6344392716555016], "isController": false}, {"data": ["GetNewPostPage-0", 222, 0, 0.0, 943.2972972972975, 546, 4010, 1056.4, 1852.7999999999997, 3940.4500000000007, 0.3389457869954746, 0.1592446413739824, 0.1805375959773853], "isController": false}, {"data": ["GetNewPostPage-1", 222, 0, 0.0, 839.0900900900899, 498, 3111, 914.7000000000002, 1891.2999999999986, 3090.2500000000005, 0.3389664881239579, 1.6617630484920571, 0.20066342526781406], "isController": false}, {"data": ["RemoveUser Confirm", 803, 381, 47.447073474470734, 1909.643835616439, 1116, 6547, 2170.0, 2528.7999999999965, 4295.280000000001, 1.2274102255652888, 46.6839590270634, 3.1003381110110775], "isController": false}, {"data": ["RemovePost", 32, 20, 62.5, 2251.5000000000005, 773, 5621, 3683.0, 5086.699999999998, 5621.0, 0.4551467136984938, 20.53566190066423, 0.9149465691538538], "isController": false}, {"data": ["AddUser", 401, 213, 53.11720698254364, 8016.486284289277, 5010, 19701, 9020.0, 9750.199999999997, 14369.860000000008, 0.6103695856336352, 88.90950804744139, 5.918113321544524], "isController": true}, {"data": ["RemoveUser-0", 382, 0, 0.0, 897.9319371727745, 606, 3851, 1010.4, 1089.55, 1749.5500000000034, 0.5850362431484138, 0.36854316020650857, 0.5945633027976065], "isController": false}, {"data": ["RemoveUser-1", 382, 0, 0.0, 791.8481675392662, 527, 2655, 879.7, 980.8499999999992, 2440.55, 0.5852020479007791, 2.9557933566546053, 0.5644430297380685], "isController": false}, {"data": ["RemoveUser Confirm-1", 803, 0, 0.0, 955.2004981320048, 522, 3866, 1157.2, 1283.6, 2635.440000000005, 1.2292308964047676, 46.168430524822654, 1.327016606480787], "isController": false}, {"data": ["PostBody", 467, 5, 1.0706638115631693, 2068.5053533190585, 1130, 6832, 2594.0, 3007.7999999999997, 4645.079999999996, 0.7104725479188632, 47.873963850620484, 2.0154544775554575], "isController": false}, {"data": ["RemoveUser Confirm-0", 803, 0, 0.0, 954.2353673723541, 593, 3877, 1050.2, 1142.1999999999996, 2405.3600000000006, 1.229308051125743, 0.5848135485668534, 1.7780319646883942], "isController": false}, {"data": ["LOG IN-2", 1327, 0, 0.0, 833.7573474001503, 505, 4653, 912.2, 1038.5999999999976, 2484.2000000000025, 2.0136265003565956, 9.885510676051958, 1.3531468485872749], "isController": false}, {"data": ["LOG IN-0", 2932, 0, 0.0, 972.4529331514343, 557, 3725, 1086.0, 1185.35, 2432.3600000000006, 4.446304653758432, 4.954383010779105, 3.309568926347085], "isController": false}, {"data": ["LOG IN-1", 2932, 0, 0.0, 958.2336289222371, 555, 4440, 1073.7000000000003, 1175.0, 2608.0, 4.439672990525568, 88.3186549097794, 3.729684464475802], "isController": false}, {"data": ["POST new user", 404, 216, 53.46534653465346, 2053.579207920791, 727, 5727, 2787.5, 3118.25, 4181.45, 0.6175302154171616, 21.92240176120305, 1.5423432725700414], "isController": false}, {"data": ["GET user-new PAGE-0", 193, 0, 0.0, 940.5492227979273, 609, 3175, 1040.6, 1634.799999999999, 2848.8200000000006, 0.2955711798190737, 0.13885707659428492, 0.32121560491398576], "isController": false}, {"data": ["GET LogIn Page", 2932, 0, 0.0, 813.8553888130972, 521, 3743, 903.7000000000003, 1016.0999999999995, 2146.4000000000015, 4.44901687652309, 21.875453738171863, 2.808582974088877], "isController": false}, {"data": ["GET user-new PAGE-1", 193, 0, 0.0, 797.4922279792745, 524, 3885, 903.0, 958.8999999999996, 2444.9200000000037, 0.2955191337155177, 1.4487543217759322, 0.2931655314827405], "isController": false}, {"data": ["Get Users Page", 805, 0, 0.0, 1382.0285714285694, 675, 5278, 1770.0, 1880.6999999999994, 2931.5799999999995, 1.2285387256772224, 45.2193819152995, 1.608269148225868], "isController": false}, {"data": ["GET user-new PAGE", 405, 0, 0.0, 1365.5111111111116, 635, 7061, 1783.8000000000002, 1963.5999999999995, 3549.2599999999998, 0.6162441970338113, 10.876424779407401, 0.9884945044902139], "isController": false}, {"data": ["Get Users Page-0", 383, 0, 0.0, 899.1436031331586, 598, 2639, 989.0, 1033.8, 2134.5599999999963, 0.5857066175672225, 0.2734582883794584, 0.5198289599043295], "isController": false}, {"data": ["Get Users Page-1", 383, 0, 0.0, 792.6005221932116, 526, 3046, 878.8000000000002, 914.3999999999999, 1774.4799999999968, 0.5858257696037493, 2.870686979658997, 0.4644414488748474], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Test failed: text expected to contain \\\/User deleted\\\/", 381, 24.660194174757283, 1.347051336444633], "isController": false}, {"data": ["Test failed: text expected to contain \\\/1 post moved to the Trash\\\/", 17, 1.1003236245954693, 0.060104652807240845], "isController": false}, {"data": ["500\/Internal Server Error", 13, 0.8414239482200647, 0.045962381558478295], "isController": false}, {"data": ["Test failed: text expected to contain \\\/New user created\\\/", 216, 13.980582524271844, 0.7636826474331778], "isController": false}, {"data": ["Test failed: text expected to contain \\\/Welcome\\\/", 912, 59.029126213592235, 3.224437844717862], "isController": false}, {"data": ["404\/Not Found", 6, 0.3883495145631068, 0.021213406873143825], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 28284, 1545, "Test failed: text expected to contain \\\/Welcome\\\/", 912, "Test failed: text expected to contain \\\/User deleted\\\/", 381, "Test failed: text expected to contain \\\/New user created\\\/", 216, "Test failed: text expected to contain \\\/1 post moved to the Trash\\\/", 17, "500\/Internal Server Error", 13], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Add Comment-1", 1095, 1, "404\/Not Found", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["LOG IN", 2932, 912, "Test failed: text expected to contain \\\/Welcome\\\/", 912, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["CheckPublishedPost", 463, 4, "404\/Not Found", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Add Comment", 2129, 1, "404\/Not Found", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["PostBody-1", 467, 5, "500\/Internal Server Error", 5, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["RemoveUser Confirm", 803, 381, "Test failed: text expected to contain \\\/User deleted\\\/", 381, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["RemovePost", 32, 20, "Test failed: text expected to contain \\\/1 post moved to the Trash\\\/", 17, "500\/Internal Server Error", 3, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["PostBody", 467, 5, "500\/Internal Server Error", 5, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["POST new user", 404, 216, "Test failed: text expected to contain \\\/New user created\\\/", 216, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
