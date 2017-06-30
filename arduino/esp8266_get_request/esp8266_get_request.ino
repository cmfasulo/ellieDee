#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "Bill Wi the Sci Fi Guy";
const char* password = "nyetyson2020";
const char* host = "elliedee.herokuapp.com";
const char* url = "http://elliedee.herokuapp.com/elliedee";
 
void setup () {
  
  Serial.begin(115200);
  WiFi.begin(ssid, password);
 
  while (WiFi.status() != WL_CONNECTED) {
 
    delay(2000);
    Serial.println("Connecting..");
 
  }
 delay(3000);
 Serial.println("Connected");
}

void loop() {
  
  DynamicJsonBuffer jsonBuffer;
 
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
 
    http.begin(url);
    http.addHeader("Host", host);
    int httpCode = http.GET();
 
    if (httpCode > 0) {
//      String payload = http.getString(); //Get the request response payload
//      Serial.println(payload); //Print the response payload
      JsonObject& leds = jsonBuffer.parseObject(http.getString());

      for (int i = 0; i < 144; i++) {
        Serial.write(leds[i]);
      }
//      Serial.write(root); //Print the response payload
    }
 
    http.end();   //Close connection
 
  }
 
  delay(5000);    //Send a request every 30 seconds
}
