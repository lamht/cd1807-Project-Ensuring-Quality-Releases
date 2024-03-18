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
    cell.colSpan = 7;
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

    var data = {"OkPercent": 0.0, "KoPercent": 100.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "authors POST"], "isController": false}, {"data": [0.0, 500, 1500, "activities DELETE "], "isController": false}, {"data": [0.0, 500, 1500, "users DELETE"], "isController": false}, {"data": [0.0, 500, 1500, "coverPhotos all GET"], "isController": false}, {"data": [0.0, 500, 1500, "coverPhotosCoverPhotosForBook  GET"], "isController": false}, {"data": [0.0, 500, 1500, "authors all GET"], "isController": false}, {"data": [0.0, 500, 1500, "authors DELETE"], "isController": false}, {"data": [0.0, 500, 1500, "users all GET"], "isController": false}, {"data": [0.0, 500, 1500, "books PUT"], "isController": false}, {"data": [0.0, 500, 1500, "books POST"], "isController": false}, {"data": [0.0, 500, 1500, "activities GET"], "isController": false}, {"data": [0.0, 500, 1500, "activities PUT "], "isController": false}, {"data": [0.0, 500, 1500, "authors PUT"], "isController": false}, {"data": [0.0, 500, 1500, "books GET"], "isController": false}, {"data": [0.0, 500, 1500, "books DELETE"], "isController": false}, {"data": [0.0, 500, 1500, "coverPhotos POST"], "isController": false}, {"data": [0.0, 500, 1500, "users PUT"], "isController": false}, {"data": [0.0, 500, 1500, "users POST"], "isController": false}, {"data": [0.0, 500, 1500, "authors GET"], "isController": false}, {"data": [0.0, 500, 1500, "users GET"], "isController": false}, {"data": [0.0, 500, 1500, "activities POST"], "isController": false}, {"data": [0.0, 500, 1500, "coverPhotos GET"], "isController": false}, {"data": [0.0, 500, 1500, "books all GET"], "isController": false}, {"data": [0.0, 500, 1500, "coverPhotos DELETE"], "isController": false}, {"data": [0.0, 500, 1500, "coverPhotos PUT"], "isController": false}, {"data": [0.0, 500, 1500, "activities all GET"], "isController": false}, {"data": [0.0, 500, 1500, "authorsAuthorsForBook GET "], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 20364, 20364, 100.0, 292.71272834413537, 4, 6361, 190.0, 308.0, 570.0, 2319.0, 170.1907165660989, 1368.0076055230081, 40.89105521179819], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["authors POST", 755, 755, 100.0, 235.06754966887397, 68, 4853, 191.0, 248.0, 315.5999999999988, 1960.0, 6.65426886771666, 53.487585009937334, 1.9702788155181075], "isController": false}, {"data": ["activities DELETE ", 764, 764, 100.0, 209.78403141361255, 7, 4833, 189.0, 239.0, 267.75, 741.6500000000013, 6.680599155306442, 53.69923012434309, 1.4359425006120967], "isController": false}, {"data": ["users DELETE", 734, 734, 100.0, 236.0258855585831, 41, 5165, 186.0, 275.5, 480.75, 2031.4999999999943, 6.669634987414926, 53.611099200597906, 1.4010105967914877], "isController": false}, {"data": ["coverPhotos all GET", 751, 751, 100.0, 327.74167776298304, 97, 5159, 190.0, 449.80000000000007, 1689.9999999999989, 2609.96, 6.71452966999562, 53.9719665173183, 1.2917601025284542], "isController": false}, {"data": ["coverPhotosCoverPhotosForBook  GET", 750, 750, 100.0, 321.4159999999999, 78, 6066, 190.0, 309.0, 620.8999999999999, 4971.590000000002, 6.755661244122575, 54.30258564489542, 1.293735517551208], "isController": false}, {"data": ["authors all GET", 757, 757, 100.0, 237.772787318362, 59, 4618, 191.0, 262.4000000000003, 472.20000000000005, 1923.7799999999997, 6.655881266815552, 53.500545612459774, 1.2544776215775406], "isController": false}, {"data": ["authors DELETE", 752, 752, 100.0, 224.27526595744695, 99, 4348, 188.0, 250.70000000000005, 289.70000000000005, 1921.9300000000005, 6.649512339620306, 53.4493516283347, 1.409772812933832], "isController": false}, {"data": ["users all GET", 748, 748, 100.0, 433.11363636363643, 68, 6342, 200.0, 511.1000000000005, 1900.0, 5097.58, 6.74475433043886, 54.21491493539283, 1.258054762806467], "isController": false}, {"data": ["books PUT", 751, 751, 100.0, 261.85619174434055, 120, 2380, 191.0, 262.80000000000007, 555.5999999999999, 2056.6800000000026, 6.7109895805408115, 53.943510974054114, 2.6031194708058547], "isController": false}, {"data": ["books POST", 751, 751, 100.0, 289.5073235685757, 120, 2380, 190.0, 426.4000000000012, 650.1999999999996, 2042.680000000003, 6.711289443347245, 53.94592129706169, 2.635351225636947], "isController": false}, {"data": ["activities GET", 779, 779, 100.0, 253.30166880616144, 9, 4853, 188.0, 279.0, 491.0, 2132.000000000004, 6.797556719022688, 54.63934507253491, 1.3150274732766143], "isController": false}, {"data": ["activities PUT ", 771, 771, 100.0, 235.98962386511013, 4, 4852, 190.0, 250.80000000000007, 294.79999999999995, 1880.919999999999, 6.733506838308501, 54.12450662706765, 2.1594276873984737], "isController": false}, {"data": ["authors PUT", 753, 753, 100.0, 244.85790172642785, 82, 2380, 189.0, 247.0, 431.29999999999995, 2324.6800000000003, 6.648713081100173, 53.442927119663594, 1.9368022521080748], "isController": false}, {"data": ["books GET", 751, 751, 100.0, 229.17177097203756, 69, 2380, 189.0, 249.0, 335.79999999999984, 1866.0000000000018, 6.7125491598140865, 53.95604700627905, 1.2658128407668932], "isController": false}, {"data": ["books DELETE", 751, 751, 100.0, 309.22769640479345, 89, 5116, 192.0, 439.00000000000034, 625.9999999999999, 3096.640000000027, 6.714049439005856, 53.96810637935273, 1.4103429104644405], "isController": false}, {"data": ["coverPhotos POST", 750, 750, 100.0, 254.04666666666665, 106, 2610, 190.0, 291.0, 545.5999999999995, 1920.0, 6.755235307363206, 54.299161928619675, 1.9216797314793965], "isController": false}, {"data": ["users PUT", 737, 737, 100.0, 270.151967435549, 103, 5282, 191.0, 317.4000000000001, 493.5000000000001, 2043.240000000001, 6.683049356631816, 53.718925053160625, 1.8874269324848794], "isController": false}, {"data": ["users POST", 739, 739, 100.0, 342.311231393775, 51, 5070, 195.0, 489.0, 1830.0, 2517.400000000005, 6.682279751516851, 53.712738901108594, 1.8930959571755388], "isController": false}, {"data": ["authors GET", 757, 757, 100.0, 261.7793923381771, 59, 4850, 186.0, 272.00000000000045, 562.5000000000001, 1961.0, 6.650910656393045, 53.460591418721826, 1.2671743349089344], "isController": false}, {"data": ["users GET", 744, 744, 100.0, 334.24999999999983, 109, 5158, 191.0, 458.5, 1126.5, 3727.1999999999107, 6.713650186339888, 53.964897152112904, 1.2660178139578953], "isController": false}, {"data": ["activities POST", 774, 774, 100.0, 276.5852713178296, 5, 5290, 190.0, 274.5, 450.0, 4612.0, 6.75716967130822, 54.3147105122441, 2.1598020974289582], "isController": false}, {"data": ["coverPhotos GET", 751, 751, 100.0, 343.76031957390154, 108, 6361, 188.0, 475.00000000000205, 1687.5999999999995, 4968.680000000004, 6.717472584482727, 53.995621916872395, 1.3061014620118427], "isController": false}, {"data": ["books all GET", 751, 751, 100.0, 220.74700399467366, 94, 2343, 188.0, 238.0, 280.4, 1500.0, 6.7150700119816165, 53.97630983263739, 1.2525179416879773], "isController": false}, {"data": ["coverPhotos DELETE", 750, 750, 100.0, 345.8999999999997, 98, 5158, 196.5, 546.0, 1740.4499999999998, 2204.98, 6.7575481813185325, 54.3177530082352, 1.4590760770405544], "isController": false}, {"data": ["coverPhotos PUT", 750, 750, 100.0, 270.0986666666664, 100, 4872, 190.0, 297.0, 553.4499999999999, 2383.4300000000003, 6.756695885622651, 54.31090218218755, 1.902960052161692], "isController": false}, {"data": ["activities all GET", 782, 782, 100.0, 665.7327365728889, 139, 4938, 271.0, 1164.1000000000006, 4724.999999999998, 4901.17, 6.542619055587162, 52.5901342251347, 1.2522981786084804], "isController": false}, {"data": ["authorsAuthorsForBook GET ", 761, 761, 100.0, 259.99474375821325, 41, 4348, 190.0, 267.4000000000002, 484.99999999999886, 1980.76, 6.668536076692546, 53.60226606177378, 1.2835620941700696], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/Internal Server Error", 20364, 100.0, 100.0], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 20364, 20364, "500/Internal Server Error", 20364, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["authors POST", 755, 755, "500/Internal Server Error", 755, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["activities DELETE ", 764, 764, "500/Internal Server Error", 764, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["users DELETE", 734, 734, "500/Internal Server Error", 734, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["coverPhotos all GET", 751, 751, "500/Internal Server Error", 751, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["coverPhotosCoverPhotosForBook  GET", 750, 750, "500/Internal Server Error", 750, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["authors all GET", 757, 757, "500/Internal Server Error", 757, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["authors DELETE", 752, 752, "500/Internal Server Error", 752, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["users all GET", 748, 748, "500/Internal Server Error", 748, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["books PUT", 751, 751, "500/Internal Server Error", 751, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["books POST", 751, 751, "500/Internal Server Error", 751, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["activities GET", 779, 779, "500/Internal Server Error", 779, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["activities PUT ", 771, 771, "500/Internal Server Error", 771, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["authors PUT", 753, 753, "500/Internal Server Error", 753, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["books GET", 751, 751, "500/Internal Server Error", 751, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["books DELETE", 751, 751, "500/Internal Server Error", 751, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["coverPhotos POST", 750, 750, "500/Internal Server Error", 750, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["users PUT", 737, 737, "500/Internal Server Error", 737, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["users POST", 739, 739, "500/Internal Server Error", 739, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["authors GET", 757, 757, "500/Internal Server Error", 757, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["users GET", 744, 744, "500/Internal Server Error", 744, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["activities POST", 774, 774, "500/Internal Server Error", 774, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["coverPhotos GET", 751, 751, "500/Internal Server Error", 751, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["books all GET", 751, 751, "500/Internal Server Error", 751, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["coverPhotos DELETE", 750, 750, "500/Internal Server Error", 750, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["coverPhotos PUT", 750, 750, "500/Internal Server Error", 750, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["activities all GET", 782, 782, "500/Internal Server Error", 782, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["authorsAuthorsForBook GET ", 761, 761, "500/Internal Server Error", 761, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
