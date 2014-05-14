# Final Project

![A screenshot from the app](https://raw.githubusercontent.com/rconstantin/Final-Project/master/README_media/beaglebone%20with%20zwave%20devices.png?token=5402981__eyJzY29wZSI6IlJhd0Jsb2I6cmNvbnN0YW50aW4vRmluYWwtUHJvamVjdC9tYXN0ZXIvUkVBRE1FX21lZGlhL2JlYWdsZWJvbmUgd2l0aCB6d2F2ZSBkZXZpY2VzLnBuZyIsImV4cGlyZXMiOjE0MDA2OTc0NzZ9--2423b5f57b54d6f67be9fe297bc3d64ff364f7aa)

For the `Final-Project`, I am building home automation platform based on the ["BeagleBone Black"](http://beagleboard.org/Products/BeagleBone%20Black). 
I wanted to have capability to monitor Door/Window sensors, monitor and control thermostats and lights. 

The idea was to build a platform on the beaglebone black that I could easily expand and most importantly make it easy to use in my home and remotely. 
I decided to just focus on monitoring a garage door state (open or closed). With the guidance of Bakhtiar, I started researching the x10 home automation protocol 
and products but then soon discovered the newer Z-wave protocol which is more reliable and secure with more companies supporting and ["Z-Wave"](http://www.z-wave.com/) 
HA components. So I decided to just focus on z-wave.
 
Next I found a ["Ninja Blocks Shield"](http://ninjablocks.com/collections/ninja-blocks/products/ninja-shield-for-beaglebone-black), 
a cape that provides wireless capability and a z-wave API. 
The timeframe for delivery of this cape fell outside the window of this project (it will have to do for a future project). 
So instead, I turned to a Node.js z-wave library (see reference above). It took some time and effort to get all the necessary components installed and 
building on the BeagleBone and then some tougher times to get it to work with the Aeon Sensor (More details to follow in ![section 2]). 

Next, I turned my attention to my second requirement: to able to remotely monitor and control my HA components. 
I looked into a web hosting solution but that required some monetary investment and building a server side support. Again, Bakhtiar recommended looking into some of the free cloud based services such as ["sensorCloud"](www.sensorcloud.com) and ["Xively"](https://xively.com). 
I found Xively a better fit for Home Automation remote support and it provide free subscription for developer.

and the ["Z-wave protocol"](http://en.wikipedia.org/wiki/Z-Wave) compatible device for monitoring and reporting garage door status, temp changes, etc.  The focus for this project is to integrate hardware components (BeagleBone Black, ![Aeon Z-stick] (http://aeotec.com/z-wave-usb-stick) & ![Aeon D/W Sensor] (http://aeotec.com/z-wave-door-window-sensor)) and Node.js and the Open Z-Wave library: 
+ ["Node-OpenZwave"](https://github.com/jperkin/node-openzwave) 
+ ["Xively's API"](https://xively.com/develop/FTDu-2xDjPP1Ix4z1znM). 
In the Node-openZwave library I extended ["openzwave.cc"](https://github.com/rconstantin/Final-Project/tree/master/my-node-openzwave/src/openzwave.cc) to support monitoring notifications from the new D/W Sensor. 
I used Node.js's HTTP Request to send state changes to Xively and to Local web host and Node.js 'nodemailer' to send email notifications about extended alarm states (door open for longer than expected).

---

## Supported Functions:

### (1) LocalHost: using MAMP 'http://final-project/' or 'file:///Users/robbie/Sites/Final-Project/index.html'
Added local Client Door Sensor Knob (On/Off) to periodically monitor the state of the door from a local client using the HTTP GET method: Door Sensor 'On/Off' will turn polling on or off. When Polling is 'Off', the circle's background color is 'White' and when Polling is 'On' the circle is either 'Red' is Door Sensor is separated from magnet (i.e the Door is Open) or 'Green' if the door is closed.

![LocalHost polling door sensor state changes](https://raw.githubusercontent.com/rconstantin/Final-Project/master/README_media/client_monitor.png?token=5402981__eyJzY29wZSI6IlJhd0Jsb2I6cmNvbnN0YW50aW4vRmluYWwtUHJvamVjdC9tYXN0ZXIvUkVBRE1FX21lZGlhL2NsaWVudF9tb25pdG9yLnBuZyIsImV4cGlyZXMiOjE0MDA2OTczNzd9--5e45219c7b1b8e757cfb870afc93014ce5dd9000)

### (2) setup and installation

### (3) 


### (4) 

---

## Resources

+ ["What's in an HTTP request?"](http://rve.org.uk/dumprequest) and ["HTTP Request/Response Basics"](http://devhub.fm/http-requestresponse-basics/) are good places to start to understand how we might use HTTP to interact with APIs.
+ ["What's Z-wave?"](http://en.wikipedia.org/wiki/Z-Wave)
--