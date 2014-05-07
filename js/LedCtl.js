// Take actions based on device orientation (works on mobile devices only)
var server = 'http://10.0.1.101:8080';
//var server = 'http://192.168.7.2:8080';


function initLeds() {
    ledRed(0);
    ledGreen(0);
    ledYellow(0);
}
function httpGET(url) {
    // This function lets us, in some ways, simulate a browser and go
    // visit a particular URL programmatically, and returns the results.
    //
    // You can read more about it at:
    // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send();

    return xhr.responseText;
}
function httpPOST(url, data) {
    var oReq = new XMLHttpRequest();
    oReq.open("POST", url, true);

    //var blob = new Blob(data, {type: 'text/plain'});
    var params = data;


    oReq.send(params);
}
function ledRed(value) {
    var fraction = value/100.0;
    httpPOST(server, "P9_14="+fraction);
    //httpGET('http://192.168.7.2:8080/setLed/1');
}
function ledYellow(value) {
    var fraction = value/100.0;
    httpPOST(server, "P9_16="+fraction);
    //httpGET('http://192.168.7.2:8080/setLed/1');
}
function ledGreen(value) {
    var fraction = value/100.0;
    httpPOST(server, "P8_13="+fraction);
    //httpGET('http://192.168.7.2:8080/setLed/1');
}

function ledOff() {
    httpPOST(server, 0);
    //httpGET('http://192.168.7.2:8080/setLed/0');
}
var myTimer = null;
function potTimer() // grab the potentiometer reading
{
    var potReading = parseFloat(httpGET(server+'/readPot'));

    // set the innerHTML to the reading
    document.getElementById('me').innerHTML = potReading;

    // and rotate the div proportional to the reading
    document.getElementById('me').style.webkitTransform = 'rotate(' + 360 * potReading + 'deg)';
}
function readPotentiometer(value) {
    if (value == "on") {
        if (myTimer) {
            cancelReadPot();
        }
        myTimer = window.setInterval(function() {
            potTimer()}, 1000); // every 16ms
    }
    else {
        cancelReadPot();
    }
}
function cancelReadPot() {
    window.clearInterval(myTimer);
    document.getElementById('me').innerHTML = null;
    myTimer = null;
}
initLeds();    
