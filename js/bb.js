var app = require('http').createServer(httpserver);
var b = require('bonescript');

b.pinMode("P9_14", b.OUTPUT);

// var state = b.LOW;

// function toggle() {
//     if(state == b.LOW) state = b.HIGH;
//     else state = b.LOW;
//     b.digitalWrite("GPIO_71", state);
// }

app.listen(8080);
    
//console.log('Server running on: http://' + getIPAddress() + ':8080');

function httpserver (req, res) {
    function setLEDBrightness(value) {
        console.log("Setting P9_14 to " + value);
        b.analogWrite("P9_14", value);
    }
    
    function readPotentiometer() {
        var value = null;
        b.analogRead("P9_40", function(reading) {
                value = reading['value'];
            });
        console.log("The reading from P9_40 is " + value);
        return value;
    }
    function extractBrightnessFromURL(url) {
        return parseFloat(digitRE.exec(url)[1]);
    }
    function returnSuccess(response, message) {
        // console.log("Returning a success message");
        res.setHeader('Access-Control-Allow-Origin','*');
        res.writeHead(200);
        res.end(message);
   }
    var url = req['url'];
   // console.log(url);
    var digitRE = /\/([0-9]\.[0-9])/;

    var timer = null;

    if (url == 'favicon.ico') { }

    else if (url == '/pot') {
        // if we go to 192.168.7.2:8080/pot
        timer = setInterval(function() {
            var value = readPotentiometer();
            console.log("Setting P9_14 to the reading from P9_40, " + value);
            setLEDBrightness(value);
        }, 1500);
        
        returnSuccess(res, "(/pot) Served from your BeagbleBone!"); // Return some text
    }

    else if (url.match(digitRE)) {
        // if we go to 192.168.7.2:8080/X.Y, where X & Y are digits
        clearInterval(timer);// turn off the timer we may have started in /pot
        var value = parseFloat(digitRE.exec(url)[1]);
        console.log("Setting P9_14 to " + value);
        b.analogWrite("P9_14", value);
        returnSuccess(res, "(X.Y) Served from your BeagbleBone!");
    }
    else if (url == '/readPot') {
        // if we go to 192.168.7.2:8080/readPot
     
        // return the potentiometer reading
        b.analogRead("P9_40", function(x) { returnSuccess(x['value'],"" + x['value']); });
        //value = readLEDBrightness();
        //console.log("Reading current P9_14: " + value);
    }
    else { //if (url == '/setLed') {
        // if we go to 192.168.7.2:8080/readPot
        // b.analogWrite("P9_14", value);
        //console.log("req: data ", req.data);
        //console.log(chunk.toString());
        if (req.method == 'POST') {
            console.log("[200] " + req.method + " to " + req.url);     
            req.on('data', function(chunk) {
                console.log("Received body data:");
                console.log(chunk.toString());
                var s = chunk.toString();
                var led = s.split("=");
                b.analogWrite(led[0], led[1]);
            });
            /*
            req.on('end', function() {
                // empty 200 OK response for now
                res.writeHead(200, "OK", {'Content-Type': 'text/html'});
                res.end();
            });
            */
            returnSuccess(res, "(X.Y) Served from your BeagbleBone!");

        }
    } 
}