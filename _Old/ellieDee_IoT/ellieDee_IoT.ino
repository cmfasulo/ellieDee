#include <SoftwareSerial.h>
#include <Adafruit_NeoPixel.h>
#include <ESP8266wifi.h>


// Pin Definitions
#define sw_serial_rxPin 2
#define sw_serial_txPin 3
#define esp8266_resetPin 5
#define Strip_Pin 6
#define Status_Pin 9


// Wifi Info
const char ssid[] = "Bill Wi the Sci Fi Guy";
const char pass[] = "nyetyson2020";

// Remote site information
const char http_site[] = "elliedee.herokuapp.com";
const char http_port[] = "80";
const char request[] = "GET /elliedee HTTP/1.1\r\nHost: elliedee.herokuapp.com\r\n\r\n";

// Global Variables
Adafruit_NeoPixel strip = Adafruit_NeoPixel(144, Strip_Pin, NEO_GRB + NEO_KHZ800);
SoftwareSerial swSerial(sw_serial_rxPin, sw_serial_txPin);// rx tx
ESP8266wifi wifi(swSerial, swSerial, esp8266_resetPin, Serial);

void setup(){
  
  swSerial.begin(9600);
  Serial.begin(9600);
  while (!Serial)
    ;

  wifi.setTransportToTCP();
  wifi.endSendWithNewline(true);
  wifi.begin();

  wifi.connectToAP(ssid, pass);
  
  if(wifi.isConnectedToAP()) {
    Serial.println("Connected to access point!");
  }
  wifi.connectToServer(http_site, http_port);

  if(wifi.isConnectedToServer()) {
    Serial.println("Connected to server!");
  }

//  strip.begin();
//  strip.show(); // Initialize all pixels to 'off'
//
//  theaterChase(strip.Color(127, 127, 127), 50); // White
//  theaterChase(strip.Color(127, 0, 0), 50); // Red
//  theaterChase(strip.Color(0, 0, 127), 50); // Blue
//  strip.show();
//
//  strip.setPixelColor(144, 255, 255, 255);
//  strip.show();

} // End setup()

void loop(){
  
  if (!wifi.isStarted()) {
    wifi.begin();
  }

  wifi.send(SERVER, request);

  //Listen for incoming messages and echo back, will wait until a message is received, or max 6000ms..
//  WifiMessage in = wifi.listenForIncomingMessage(1000);
  WifiMessage in = wifi.getIncomingMessage();
  if (in.hasData) {
    setLeds(in);
  }
  
  
//  if (led_readBack == 200){ //led=200 -->reset entire matrix
//    for (int i=0; i <= 143; i++){
//      strip.setPixelColor(i, 255, 255, 255);
//      strip.show();
//    }
//        
//    delay(1000);
//
//    for (int i=0; i <= 143; i++){
//      strip.setPixelColor(i, 0, 0, 0);
//      strip.show();
//    }
//  }
//    
//  else {
//    strip.setPixelColor(led_value, r_value, g_value, b_value, 255);
//    strip.show();
//  }

} // End loop()


//Theatre-style crawling lights
//void theaterChase(uint32_t c, uint8_t wait) {
//  for (int j=0; j<10; j++) {  //do 10 cycles of chasing
//    for (int q=0; q < 3; q++) {
//      for (int i=0; i < strip.numPixels(); i=i+3) {
//        strip.setPixelColor(i+q, c);    //turn every third pixel on
//      }
//      strip.show();
//
//      delay(wait);
//
//      for (int i=0; i < strip.numPixels(); i=i+3) {
//        strip.setPixelColor(i+q, 0);        //turn every third pixel off
//      }
//    }
//  }
//}

void setLeds(WifiMessage msg) {
  // return buffer
//  char espBuf[MSG_BUFFER_MAX];
  // scanf holders
//  int set;
//  char str[1439];
  Serial.print("message size: ");
  Serial.println(sizeof(msg.message));
  Serial.println("message: ");
  Serial.println(msg.message);


//  sscanf(msg.message,"[%s",str,&set);
//  Serial.println("str: ");
//  Serial.println(str);
//  swSerial.println("set: ");
//  swSerial.println(set);
  
}

