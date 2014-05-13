/*
 * OpenZWave and other functionality to report back to client side.
 */

var OpenZWave = require('./lib/openzwave.js');

var zwave = new OpenZWave('/dev/ttyUSB0', {
		logging: true,           // enable logging to OZW_Log.txt
	    consoleoutput: false,     // copy logging to the console
	    saveconfig: true,        // write an XML network layout
	    driverattempts: 3,        // try this many times before giving up
	    pollinterval: 500,        // interval between polls in milliseconds
	    suppressrefresh: true,    // do not send updates if nothing changed
});
var app = require('http').createServer(httpserver);
var b = require('bonescript');
var fs = require('fs');

var nodemailer = require("nodemailer");
//var transport = nodemailer.createTransport("Sendmail");
var transport = nodemailer.createTransport("SMTP", {
    host: "smtp.gmail.com", // hostname
    secureConnection: true, // use SSL
    port: 465, // port for secure SMTP
    auth: {
        user: "busytowns@gmail.com",
        pass: "busytowns1"
    }
});

var mailOptionsOpen = {
    from: "busytowns@gmail.com",
    to: "robbieconstantin@gmail.com",
    subject: "Garage Door Open!",
    text: "Plaintext body"
}
var mailOptionsClosed = {
    from: "busytowns@gmail.com",
    to: "robbieconstantin@gmail.com",
    subject: "Garage Door Closed:)",
    text: "Plaintext body"
}
var sendMail = false;
var myTimer1 = null;

b.pinMode("P9_14", b.OUTPUT);

var nodes = [];

zwave.on('driver ready', function(homeid) {
	console.log('scanning homeid=0x%s...', homeid.toString(16));
});

zwave.on('driver failed', function() {
	console.log('failed to start driver');
	zwave.disconnect();
	process.exit();
});

zwave.on('node added', function(nodeid) {
	nodes[nodeid] = {
		manufacturer: '',
		manufacturerid: '',
		product: '',
		producttype: '',
		productid: '',
		type: '',
		name: '',
		loc: '',
		classes: {},
		ready: false,
	};
});

zwave.on('value added', function(nodeid, comclass, value) {
	if (!nodes[nodeid]['classes'][comclass])
		nodes[nodeid]['classes'][comclass] = {};
	nodes[nodeid]['classes'][comclass][value.index] = value;
});

zwave.on('value changed', function(nodeid, comclass, value) {
	//console.log("Received Value Changed for NodeId = " + nodeid + " comClass = " + " Value:label = " + value[0]['label']);
	if (nodes[nodeid]['ready']) {
		console.log('node%d: changed: %d:%s->%s', nodeid, comclass,
			    nodes[nodeid]['classes'][comclass][value.index]['value'],
			    value['value']);
	}
	else {
		console.log('node%d: changed from: %s -> %s', nodeid,
			    "0",
			    value['value']);
	}
	if (!nodes[nodeid]['classes'][comclass])
		nodes[nodeid]['classes'][comclass] = {};

	nodes[nodeid]['classes'][comclass][value.index] = value;
	
});

zwave.on('value removed', function(nodeid, comclass, index) {
	if (nodes[nodeid]['classes'][comclass] &&
	    nodes[nodeid]['classes'][comclass][index])
		delete nodes[nodeid]['classes'][comclass][index];
});

zwave.on('node ready', function(nodeid, nodeinfo) {
	nodes[nodeid]['manufacturer'] = nodeinfo.manufacturer;
	nodes[nodeid]['manufacturerid'] = nodeinfo.manufacturerid;
	nodes[nodeid]['product'] = nodeinfo.product;
	nodes[nodeid]['producttype'] = nodeinfo.producttype;
	nodes[nodeid]['productid'] = nodeinfo.productid;
	nodes[nodeid]['type'] = nodeinfo.type;
	nodes[nodeid]['name'] = nodeinfo.name;
	nodes[nodeid]['loc'] = nodeinfo.loc;
	nodes[nodeid]['ready'] = true;
	console.log('node%d: %s, %s', nodeid,
		    nodeinfo.manufacturer ? nodeinfo.manufacturer
					  : 'id=' + nodeinfo.manufacturerid,
		    nodeinfo.product ? nodeinfo.product
				     : 'product=' + nodeinfo.productid +
				       ', type=' + nodeinfo.producttype);
	console.log('node%d: name="%s", type="%s", location="%s"', nodeid,
		    nodeinfo.name,
		    nodeinfo.type,
		    nodeinfo.loc);
	for (comclass in nodes[nodeid]['classes']) {
		switch (comclass) {
		case 0x25: // COMMAND_CLASS_SWITCH_BINARY
		case 0x26: // COMMAND_CLASS_SWITCH_MULTILEVEL
			zwave.enablePoll(nodeid, comclass);
			break;
		}
		var values = nodes[nodeid]['classes'][comclass];
		console.log('node%d: class %d', nodeid, comclass);
		for (idx in values)
			console.log('node%d:   %s=%s', nodeid, values[idx]['label'], values[idx]['value']);
	}
});

zwave.on('notification', function(nodeid, notif) {
	switch (notif) {
	case 0:
		console.log('node%d: message complete', nodeid);
		break;
	case 1:
		console.log('node%d: timeout', nodeid);
		break;
	case 2:
		console.log('node%d: nop', nodeid);
		break;
	case 3:
		console.log('node%d: node awake', nodeid);
		break;
	case 4:
		console.log('node%d: node sleep', nodeid);
		break;
	case 5:
		console.log('node%d: node dead', nodeid);
		break;
	case 6:
		console.log('node%d: node alive', nodeid);
		break;
	default:
		console.log('node%d: NOTIF: %d', nodeid, notif);
		break;
    }
});
zwave.on('node event', function(nodeid, comclass, value) {
	//console.log("Received Value Changed for NodeId = " + nodeid + " comClass = " + " Value:label = " + value[0]['label']);
	if (nodes[nodeid]['ready']) {
		console.log('node%d: changed: %d:%s->%s', nodeid, comclass,
			    nodes[nodeid]['classes'][comclass][value.index]['value'],
			    value['value']);
	}
	else {
		console.log('node%d: changed from: %s -> %s', nodeid,
			    "NA",
			    value['value']);
	}
	if (!nodes[nodeid]['classes'][comclass])
		nodes[nodeid]['classes'][comclass] = {};
	nodes[nodeid]['ready'] = true;
	nodes[nodeid]['classes'][comclass][value.index] = value;
	if (value['value'] == 0) {
        console.log("Setting P9_14 to " + 0 + " Door has beed closed:)");
        b.analogWrite("P9_14", 0);
        putXively("Door Closed");
        if (myTimer1) {
        	cancelSensorTimer();
        }
        else if (sendMail == true) {
        	transport.sendMail(mailOptionsClosed); 
        }
    }
    else {
        console.log("Setting P9_14 to " + 1 + " Door IS OPEN");
        b.analogWrite("P9_14", 1);
        putXively("Door Open");
        if (!myTimer1) {
        	myTimer1 = setTimeout(function() {
            	transport.sendMail(mailOptionsOpen); 
            	sendMail = true;
            	myTimer1 = null;
            }, 300000); // 5 minutes
    	}
    }
});
zwave.on('scan complete', function() {
	console.log('scan complete, hit ^C to finish.');
});

function cancelSensorTimer() {
    clearTimeout(myTimer1);
    myTimer1 = null;
}
zwave.connect();

process.on('SIGINT', function() {
	console.log('disconnecting...');
	zwave.disconnect();
	process.exit();
});

//var transport = nodemailer.createTransport("SMTP", {
//    service: "Gmail",
//    auth: {
//        user: "busytowns@gmail.com",
//        pass: "busytowns1"
//    }
//});


function putXively(a) {
	var data = JSON.stringify({
		title: 'My feed',
		version: '1.0.0',
		datastreams : [ 
		   { id:"door_sensor", current_value: a }]
	});

	var http = require('http');
	var options = {
		host: 'api.xively.com',
		port: '80',  	
		path: '/v2/feeds/1171243222',
		method: 'PUT',
		headers: {
			'X-ApiKey': 'xaVUEp2tZPNqrA87YtfrulZs10vrVep1pBZ6p1xuXFtS2XtR',
			'Content-Type': 'application/json',
			'Content-Length': data.length
		}
	};
	callback = function(response) { 			
		response.setEncoding('utf8');
		console.log('Status Code: ' + response.statusCode);
		console.log('Headers:');
		console.log(response.headers);

		var buffer = '';
		response.on('data', function(chunk) {
			buffer += chunk;
		});
		response.on('end', function() {
			console.log('complete');
			console.log(buffer);
		});
	}
	// var req = http.request(options, callback)
	var req = http.request(options, callback);

	req.write(data);
	req.end();
}
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
	function readTextFile(file)
   	{
   		var result = null;
        fs.readFile('3.txt', 'utf8', function(err, data){
        	if (err) {
        		return console.log(err);
        	}
        	console.log("data: " + data);
        	result = data;
        	console.log("result: " + result);
        
        	res.setHeader('Access-Control-Allow-Origin','*');
        	res.writeHead(200);
        	res.end("" + result);

        })

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
        
    }
    else if (url == '/readSensor') {
        // if we go to 192.168.7.2:8080/readPot
        console.log("Request to read sensor state");
        var sensorRead = readTextFile('3.txt');
        //readTextFile('3.txt');//, function(x) { returnSuccess(res,"" + x);});
        //console.log("updated sensor read: " + sensorRead);
        //returnSuccess(res,"" + sensorRead);
        
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
