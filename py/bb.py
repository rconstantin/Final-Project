import Adafruit_BBIO.ADC as ADC
import Adafruit_BBIO.PWM as PWM
import time
import datetime
import xively
from requests import HTTPError  

api = xively.XivelyAPIClient("xaVUEp2tZPNqrA87YtfrulZs10vrVep1pBZ6p1xuXFtS2XtR")  
feed = api.feeds.get(1171243222)  
ADC.setup()

while True:
    mV = ADC.read('P9_40') * 1800
    celsius = mV / 10
    fahrenheit = (celsius * 9/5) + 32
    fahrenheit = round(fahrenheit, 1)
    mV1 = ADC.read('P9_39') * 1800
    celsius1 = mV1 / 10
    outside_temp = (celsius1 * 9/5) + 32
    outside_temp = round(outside_temp, 1)
    now = datetime.datetime.utcnow()  
    feed.datastreams = [
        xively.Datastream(id='potentiometer', current_value=fahrenheit, at=now),
        xively.Datastream(id='dimmedLed', current_value=outside_temp, at=now) ]

    try:
        feed.update()  
        print "Values pushed to Xively: " + str(fahrenheit) +" "+str(outside_temp)
    except HTTPError as e: 
        print "Error connecting to Xively: " + str(e)
    time.sleep(20)