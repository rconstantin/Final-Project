Project: Home Automation using BeagleBone with Z-wave enabled sensors, thermostats, and light switches.
1. The person(s) who will use my project is myself and my wife. Long term goal: friends and collegues to use prototype for their HA needs.

2. I Will be happy my project exists if:
     it is easy to use and somewhat stable (hw and sw)
     web interface app that runs on macbook, ipad and/or iphone
     it is a building block for a more complete home automation platform:simple, convenient and energy saving.
     
     in addition to using wifi, I would like to ba able to control/manage over the 
     internet
     
3. The first 10 minutes of using/interacting with my project will look like: navigating through the app and try to push virtual switches, modify temp on thermostat and observe changes. Garage door sensor TBD (will probably simulate this on a sliding window since garage door will not be installed in time)
     
4. By the end of tonite, I'd like to be able to have the scope of project and components understood. I already have a recipe and working prototype using javascript and node.js and POST to communicate over wifi between the BBB and a client app running on the MAC. I also would like to use a static IP Address for my BBB for easier client interaction.

Status of my Project:

I know I want to use zwave sensors and zwave enabled light switches and thermostats. I know I need to add a Aeon zwave usb stick to BBB. The zwave usb stick will be paired with all the sensors and thermostats. For this, I have 2 options: 
        1 - use a cape (Ninja Shield/cape) from NinjaBlocks that incorporates libraries for controlling z-wave components (unfortunated NinjaBlock is a small Aussie company and only ships components/capes in batches once or twice a month). I was told to expect delivery in mid-may:)
        2 - Use openzwave ( https://code.google.com/p/open-zwave/ ) and python-openzwave ( https://code.google.com/p/python-openzwave/ ) and either build my own or hopefully re-use existing libs (research in progress).

I am also working on integrating xively (a free cloud service) to have access to (push and pull) the data through the web. I signed up for a free (developer) account and was able to add my beaglebone and a couple of channels to report readings through the web. I am using Python on the beaglebone to push the data to Xively (I could not find embedded javascript xively libs to use Node.js and javascript on BBB for xively interactions).