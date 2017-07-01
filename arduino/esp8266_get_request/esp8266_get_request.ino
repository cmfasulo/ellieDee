#include <Adafruit_NeoPixel.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>

#define Strip_Pin 2
Adafruit_NeoPixel strip = Adafruit_NeoPixel(144, Strip_Pin, NEO_GRB + NEO_KHZ800);
const char* ssid = "Bill Wi the Sci Fi Guy";
const char* password = "nyetyson2020";
const char* host = "elliedee.herokuapp.com";
const char* url = "http://elliedee.herokuapp.com/elliedee";
 
void setup () {

  pinMode(Strip_Pin, OUTPUT);
//  Serial.begin(115200);
  WiFi.begin(ssid, password);
 
  while (WiFi.status() != WL_CONNECTED) {
 
    delay(2000);
    Serial.println("Connecting..");
 
  }
  
  delay(3000);
  Serial.println("Connected");

  strip.begin();
  strip.show(); // Initialize all pixels to 'off'
  
  theaterChase(strip.Color(127, 127, 127), 50); // White
  theaterChase(strip.Color(127, 0, 0), 50); // Red
  theaterChase(strip.Color(0, 0, 127), 50); // Blue
  strip.show();
  
  strip.setPixelColor(144, 255, 255, 255);
  strip.show();
}

void loop() {
  
  DynamicJsonBuffer jsonBuffer;
 
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
 
    http.begin(url);
    http.addHeader("Host", host);
    int httpCode = http.GET();
 
    if (httpCode > 0) {
      JsonObject& obj = jsonBuffer.parseObject(http.getString());
      int arraySize =  obj["leds"].size();

      if (!obj.success()) {
        Serial.println("Error: parse failed");
      }

      for (int i = 0; i< arraySize; i++) {
        strip.setPixelColor(obj["leds"][i][0].as<int>(), obj["leds"][i][1].as<int>(), obj["leds"][i][2].as<int>(), obj["leds"][i][3].as<int>(), 255);
      }
      strip.show();  
    }
 
    http.end();   //Close connection
 
  }
 
//  delay(1000);    //Send a request every 5 seconds
}

//Theatre-style crawling lights
void theaterChase(uint32_t c, uint8_t wait) {
  for (int j=0; j<10; j++) {  //do 10 cycles of chasing
    for (int q=0; q < 3; q++) {
      for (int i=0; i < strip.numPixels(); i=i+3) {
        strip.setPixelColor(i+q, c);    //turn every third pixel on
      }
      strip.show();

      delay(wait);

      for (int i=0; i < strip.numPixels(); i=i+3) {
        strip.setPixelColor(i+q, 0);        //turn every third pixel off
      }
    }
  }
}
