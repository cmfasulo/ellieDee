#include <SoftwareSerial.h>
#include <Adafruit_NeoPixel.h>
#include <ESP8266wifi.h>


// Pin Definitions
#define ESP8266_rxPin 2
#define ESP8266_txPin 3
#define Status_Pin 5
#define Strip_Pin 6

// Wifi Info
const char WIFI_SSID[] = "Bill Wi the Sci Fi Guy";
const char WIFI_PSK[] = "nyetyson2016";

// Remote site information
const char http_site[] = "elliedee.herokuapp.com";
const int http_port = 80;

// Global Variables
Adafruit_NeoPixel strip = Adafruit_NeoPixel(144, Strip_Pin, NEO_GRB + NEO_KHZ800);

SoftwareSerial ESP8266(ESP8266_rxPin, ESP8266_txPin);// rx tx

void setup(){
  
  // Pin Modes
  pinMode(ESP8266_rxPin, INPUT);
  pinMode(ESP8266_txPin, OUTPUT);
  pinMode(Status_Pin, OUTPUT);

  // Set up serial console to read web page
  Serial.begin(9600);
  Serial.print("Thing GET Example"); 
  
  // Connect to WiFi
  connectWiFi();

  // Attempt to connect to website
  if ( !getEllieDee() ) {
    Serial.println("GET request failed");
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

   // If there are incoming bytes, print them
  if ( client.available() ) {
    char c = client.read();
    Serial.print(c);
  }
  
  // If the server has disconnected, stop the client and WiFi
  if ( !client.connected() ) {
    Serial.println();
    
    // Close socket and wait for disconnect from WiFi
    client.stop();
    if ( WiFi.status() != WL_DISCONNECTED ) {
      WiFi.disconnect();
    }

    // Turn off LED
    digitalWrite(Status_Pin, LOW);
    
    // Do nothing
    Serial.println("Finished Thing GET test");
    while(true){
      delay(1000);
    }
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


// Attempt to connect to WiFi
void connectWiFi() {

  byte led_status = 0;
  
  // Set WiFi mode to station (client)
  WiFi.mode(WIFI_STA);
  
  // Initiate connection with SSID and PSK
  WiFi.begin(WIFI_SSID, WIFI_PSK);
  
  // Blink LED while we wait for WiFi connection
  while ( WiFi.status() != WL_CONNECTED ) {
    digitalWrite(Status_Pin, led_status);
    led_status ^= 0x01;
    delay(100);
  }
  
  // Turn LED on when we are connected
  digitalWrite(Status_Pin, HIGH);
}
 
// Perform an HTTP GET request to a remote page
bool getEllieDee() {
  
  // Attempt to make a connection to the remote server
  if ( !client.connect(http_site, http_port) ) {
    return false;
  }
  
  // Make an HTTP GET request
  client.println("GET /elliedee HTTP/1.1");
  client.print("Host: ");
  client.println(http_site);
  client.println("Connection: close");
  client.println();
  
  return true;
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
