Final-Project
=============

Final Project for DGMD E-15 using the BeagleBone Black

Topic: Home Automation and Security

I would like to build an application using the BeagleBone Black and javascript. I decided to explore a home automation and security project because we are currenly in the process of building a new home and I thought it would be good if this project could satisfy (as a minimum) the following requirements:

        1 - Garage Door Monitoring Capability: 

                - Detect and report if Garage Door is left open for more than 15-30 minutes (duration configurable). Reporting: email and/or text message to one or more registered email/text or a buzzer sound (not too alarming).

                - Capability to close door remotely - not sure if this can be done without a web hosting services or if it could initially be done using the localhost/home wifi.

    If time permits (and as a minimum allow for future expansion):         

        2 - outdoors surveillance camera(s)

        3 - monitor sprinkler system water usage - send email/text if sprinkler on for longer than expected (had problems in the past with small rocks in sprinkler head prevented shutdown)

        4 - basement flooding (if sump-pump stops working and water level exceeds danger zone).

        
Questions: 

        1 - will any of the remote notifications/control require web hosting 
        services and server side programing (php / database for persistent 
            storage). Could initial project rely on purely javascript and localhost/wifi with future extension to use web hosting for remote
             control/notification

        2 - besides the BeagleBone and sensors, and a wireless router, 

UPDATE: 5/8/2014

Note regarding my email on blocking issue: I have resolved the problems with the openzwave software and I am currently able to communicated between the sensor and the beaglebone via the z-stick.

1) WHAT WOULD I LIKE TO HAVE COMPLETED BY NEXT WEEK:
     By the end of next week, I would like to have the foundation for my home
      automation platform in place. This includes:

        - complete the code for monitoring the Z-Wave Window/Door Sensor
        - add the capability to notify web app client on a local host
        - add the capability to notify xively server about the state Door 
        Open/Door Close and have displayed
        - List the TO-DO additions that I would like to add past next week: add more devices, use this sensor platform for other applications

2) WHAT WOULD I LIKE TO HAVE ACHIEVED BY THE END OF TONIGHT'S CLASS:

    By the end of this evening, I would like to:
    
         - be able to have create a file to store data from the node.js zwave 
         monitoring engine and have it picked up and processed by the xively 
         python engine to send to my xively page.  
         - figure out if I could push the state change from the BBB instead 
         of/in addition to the (xively) client polling.




