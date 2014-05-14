# Final Project

![A screenshot from the app](https://raw.githubusercontent.com/rconstantin/Final-Project/master/README_media/beaglebone%20with%20zwave%20devices.png?token=5402981__eyJzY29wZSI6IlJhd0Jsb2I6cmNvbnN0YW50aW4vRmluYWwtUHJvamVjdC9tYXN0ZXIvUkVBRE1FX21lZGlhL2JlYWdsZWJvbmUgd2l0aCB6d2F2ZSBkZXZpY2VzLnBuZyIsImV4cGlyZXMiOjE0MDA2OTc0NzZ9--2423b5f57b54d6f67be9fe297bc3d64ff364f7aa)

For the `Final-Project`, I have committed to build a home automation platform based on the BeagleBone Black and Z-wave compatible device for monitoring and reporting garage door status, temp changes, etc.  The focus for this project was to integrate hardware components (BeagleBone Black, Aeon Z-stick & Aeon D/W Sensor) and Node.js and a Node.js plugin that the Open Z-Wave library: [Node-OpenZwave](https://github.com/jperkin/node-openzwave) and [Xively's API](https://xively.com/develop/FTDu-2xDjPP1Ix4z1znM). I extented the Node-Zwave plugin [openzwave.cc ext] (https://github.com/rconstantin/Final-Project/tree/master/my-node-openzwave/src/openzwave.cc) to support monitoring notifications from the new D/W Sensor. I used Node.js's HTTP Request to send state changes to Xively and to Local web host and 'nodemailer' to send email notifications about extended alarm states (door open for longer than expected).

---

## Supported Functions:

### (1) Added local Client Door Sensor Knob (On/Off) to periodically monitor the state of the door from a local client

![LocalHost polling door sensor state changes](https://raw.githubusercontent.com/rconstantin/Final-Project/master/README_media/client_monitor.png?token=5402981__eyJzY29wZSI6IlJhd0Jsb2I6cmNvbnN0YW50aW4vRmluYWwtUHJvamVjdC9tYXN0ZXIvUkVBRE1FX21lZGlhL2NsaWVudF9tb25pdG9yLnBuZyIsImV4cGlyZXMiOjE0MDA2OTczNzd9--5e45219c7b1b8e757cfb870afc93014ce5dd9000)

### (2) 

### (3) 


### (4) 

---

## Resources

+ ["What's in an HTTP request?"](http://rve.org.uk/dumprequest) and ["HTTP Request/Response Basics"](http://devhub.fm/http-requestresponse-basics/) are good places to start to understand how we might use HTTP to interact with APIs.  For a lot more detail about what's going on behind the scenes, you can check out ["How Does the Internet Work?"](http://www.stanford.edu/class/msande91si/www-spr04/readings/week1/InternetWhitepaper.htm)

--