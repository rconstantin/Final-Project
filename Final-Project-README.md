# Final Project

### How things came together

For the `Final-Project`, I am building home automation platform based on the 
["BeagleBone Black"](http://beagleboard.org/Products/BeagleBone%20Black). 
I wanted to have capability to monitor Door/Window sensors, monitor and control thermostats and lights. 

The idea was to build a platform on the beaglebone black that I could easily expand and 
most importantly make it easy to use in my home and remotely. 
I decided to just focus on monitoring a garage door state (open or closed). 
With the guidance of Bakhtiar, I started researching the x10 home automation protocol 
and products but then soon discovered the newer Z-wave protocol which is more reliable and 
secure with more companies supporting and ["Z-Wave"](http://www.z-wave.com/) HA components. 
So I decided to focus on z-wave.
 
I found a ["Ninja Blocks Shield"](http://ninjablocks.com/collections/ninja-blocks/products/ninja-shield-for-beaglebone-black), 
a cape that provides wireless capability and a z-wave API. 
The timeframe for delivery of this cape fell outside the window of this project (it will have to do for a future project). 
So instead, I turned to a Node.js z-wave library (see reference above). It took some time and effort to get all the necessary components installed and 
building on the BeagleBone and then some tougher times to get it to work with the Aeon Sensor. 

Next, I turned my attention to my second requirement: to able to remotely monitor and control my HA components. 
I looked into a web hosting solution but that required some monetary investment and building a server side support. 
Again, Bakhtiar recommended looking into some of the free cloud based services such as ["sensorCloud"](www.sensorcloud.com) 
and ["Xively"](https://xively.com). 
I found Xively to be a better fit for Home Automation remote support and it provide free subscription for developer.

I am also using Node.js file system and email capabilities to store Door Sensor state changes and having email 
sent out when certain conditions are reached.

#### Hardware Setup & Software components:

![Hardware Setup](https://raw.githubusercontent.com/rconstantin/Final-Project/master/README_media/beaglebone%20with%20zwave%20devices.png?token=5402981__eyJzY29wZSI6IlJhd0Jsb2I6cmNvbnN0YW50aW4vRmluYWwtUHJvamVjdC9tYXN0ZXIvUkVBRE1FX21lZGlhL2JlYWdsZWJvbmUgd2l0aCB6d2F2ZSBkZXZpY2VzLnBuZyIsImV4cGlyZXMiOjE0MDA3NjgwMDh9--a74c41137527712cb6f9823b477e9bbdd627afd6)

The ["Z-wave protocol"](http://en.wikipedia.org/wiki/Z-Wave) compatible device for monitoring and reporting garage door status, 
temp changes, etc.  The hardware components included here:

+ ["BeagleBone Black"](http://beagleboard.org/Products/BeagleBone%20Black), 
+ ["Aeon Z-stick"](http://aeotec.com/z-wave-usb-stick) 
+ ["Aeon D/W Sensor"](http://aeotec.com/z-wave-door-window-sensor) 

and Node.js and the Open Z-Wave library: 

+ ["Node-OpenZwave"](https://github.com/jperkin/node-openzwave) 
+ ["Xively's API"](https://xively.com/develop/FTDu-2xDjPP1Ix4z1znM). 

---

### Supported Functions:

#### (1) setup and installation

+ Internet connectivity for updating the TOD, installing packages and upgrading Angstrom. 
+ Wanted to use a static IP address but instead used the equivalent method of doing a DHCP reservation based on MAC. 
![dhcp reserve](https://raw.githubusercontent.com/rconstantin/Final-Project/master/README_media/DHCP_IP.png?token=5402981__eyJzY29wZSI6IlJhd0Jsb2I6cmNvbnN0YW50aW4vRmluYWwtUHJvamVjdC9tYXN0ZXIvUkVBRE1FX21lZGlhL0RIQ1BfSVAucG5nIiwiZXhwaXJlcyI6MTQwMDc2ODc0NX0%3D--5461822c22cebf35278c797c1259283c3d752b1e)
+ For the Node-OpenzWave, I needed install on the beaglebone using the following steps:
	+ opkg install python-misc
	+ opkg install systemd-dev (udev-dev is deprecated, you want systemd-dev instead to get the udev headers.)
	+ npm install openzwave

![A screenshot from the app](https://raw.githubusercontent.com/rconstantin/Final-Project/master/README_media/beaglebone%20with%20zwave%20devices.png?token=5402981__eyJzY29wZSI6IlJhd0Jsb2I6cmNvbnN0YW50aW4vRmluYWwtUHJvamVjdC9tYXN0ZXIvUkVBRE1FX21lZGlhL2JlYWdsZWJvbmUgd2l0aCB6d2F2ZSBkZXZpY2VzLnBuZyIsImV4cGlyZXMiOjE0MDA2OTc0NzZ9--2423b5f57b54d6f67be9fe297bc3d64ff364f7aa)

#### (2) Node-OpenZwave Extensions: 

+ In the Node-openZwave library I extended ["openzwave.cc"](https://github.com/rconstantin/Final-Project/tree/master/my-node-openzwave/src/openzwave.cc) 
to support monitoring notifications from the new D/W Sensor. 

+ I used Node.js's HTTP Request to send state changes to Xively and to Local web host and Node.js 'nodemailer' to send email 
notifying the user about extended alarm states (door open for longer than expected).

#### (3) User Interface:

LocalHost: using MAMP 'http://final-project/' or 'file:///Users/robbie/Sites/Final-Project/index.html'
Added local Client Door Sensor Knob (On/Off) to periodically monitor the state of the door from a local client using the HTTP GET method: Door Sensor 'On/Off' will turn polling on or off. When Polling is 'Off', the circle's background color is 'White' and when Polling is 'On' the circle is either 'Red' is Door Sensor is separated from magnet (i.e the Door is Open) or 'Green' if the door is closed.

![LocalHost polling door sensor state changes](https://raw.githubusercontent.com/rconstantin/Final-Project/master/README_media/client_monitor.png?token=5402981__eyJzY29wZSI6IlJhd0Jsb2I6cmNvbnN0YW50aW4vRmluYWwtUHJvamVjdC9tYXN0ZXIvUkVBRE1FX21lZGlhL2NsaWVudF9tb25pdG9yLnBuZyIsImV4cGlyZXMiOjE0MDA2OTczNzd9--5e45219c7b1b8e757cfb870afc93014ce5dd9000)

#### (4) Xively API

+ create a developer (free) account
+ register the beagle bone and a channel for the Door Sensor: the FeedID, FeedURL and Door Sensor handle are used to push Door status info from the Beagle Bone
![XivelyAPI](https://raw.githubusercontent.com/rconstantin/Final-Project/master/README_media/XivelyAPI.png?token=5402981__eyJzY29wZSI6IlJhd0Jsb2I6cmNvbnN0YW50aW4vRmluYWwtUHJvamVjdC9tYXN0ZXIvUkVBRE1FX21lZGlhL1hpdmVseUFQSS5wbmciLCJleHBpcmVzIjoxNDAwNzY3OTExfQ%3D%3D--6d4701dae9c3ed0d41bee4d4ac44fe7f198cb10f)

#### (5) Demo

+ Door Open: remove the magnet away from Door Sensor to simulate garage door opening
![Door Open](https://raw.githubusercontent.com/rconstantin/Final-Project/master/README_media/DoorOpen.png?token=5402981__eyJzY29wZSI6IlJhd0Jsb2I6cmNvbnN0YW50aW4vRmluYWwtUHJvamVjdC9tYXN0ZXIvUkVBRE1FX21lZGlhL0Rvb3JPcGVuLnBuZyIsImV4cGlyZXMiOjE0MDA3Njc4NTZ9--1347677b28ba5aad296305b3158a189680df1e65)
+ Door Closed: align the magnet against the door sensor to simulate the garage door closing
![Door Closed](https://raw.githubusercontent.com/rconstantin/Final-Project/master/README_media/DoorClosed.png?token=5402981__eyJzY29wZSI6IlJhd0Jsb2I6cmNvbnN0YW50aW4vRmluYWwtUHJvamVjdC9tYXN0ZXIvUkVBRE1FX21lZGlhL0Rvb3JDbG9zZWQucG5nIiwiZXhwaXJlcyI6MTQwMDc2ODA3MH0%3D--af79f927a006cc16c270f3e0c6364a234b04c88c)
+ Door Open for more than 5 minutes: Email is generated when door is left open for more than 5 minutes
![Door Open Long](https://raw.githubusercontent.com/rconstantin/Final-Project/master/README_media/email_door_open.png?token=5402981__eyJzY29wZSI6IlJhd0Jsb2I6cmNvbnN0YW50aW4vRmluYWwtUHJvamVjdC9tYXN0ZXIvUkVBRE1FX21lZGlhL2VtYWlsX2Rvb3Jfb3Blbi5wbmciLCJleHBpcmVzIjoxNDAwNzY4MDkzfQ%3D%3D--981c202b9c15b9fe4b524e7edb02d5331f05023c)
+ Door Closed: Email indicating door is closed - only sent after email door open notification
![Door Open Email Clear](https://raw.githubusercontent.com/rconstantin/Final-Project/master/README_media/email_door_closed.png?token=5402981__eyJzY29wZSI6IlJhd0Jsb2I6cmNvbnN0YW50aW4vRmluYWwtUHJvamVjdC9tYXN0ZXIvUkVBRE1FX21lZGlhL2VtYWlsX2Rvb3JfY2xvc2VkLnBuZyIsImV4cGlyZXMiOjE0MDA3NjgxMTR9--2d71dcaf214895b3942bb11ed1928e8f3c872689

---

## Resources

+ ["What's in an HTTP request?"](http://rve.org.uk/dumprequest) and ["HTTP Request/Response Basics"](http://devhub.fm/http-requestresponse-basics/) are good places to start to understand how we might use HTTP to interact with APIs.
+ ["What's Z-wave?"](http://en.wikipedia.org/wiki/Z-Wave)

---

#### Implementation notes on (2):

Changes to get open-zwave to install and compile cleanly:

If the correct version information is displayed then maybe there is an issue in semver. 

The problem you are having occurs in configure.js so you could modify it. Here are lines 104 through 108 of configure.js:

  if (semver.gte(version, '2.5.0') && semver.lt(version, '3.0.0')) {
    getNodeDir()
  } else {
    failPythonVersion(version)
  }
  
Replace all five lines with the following one:

   getNodeDir();
  
The full path for configure.js is: /usr/lib/node_modules/npm/node_modules/node-gyp/lib/configure.js