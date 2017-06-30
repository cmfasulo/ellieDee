#include <SoftwareSerial.h>
#include <Adafruit_NeoPixel.h>

// Pin Definitions
#define sw_serial_rxPin 2
#define sw_serial_txPin 3
#define Strip_Pin 6
#define Status_Pin 9

// Global Variables
Adafruit_NeoPixel strip = Adafruit_NeoPixel(144, Strip_Pin, NEO_GRB + NEO_KHZ800);
SoftwareSerial swSerial(sw_serial_rxPin, sw_serial_txPin);// rx tx
String inputString = "";
boolean stringComplete = false;

void setup() {
  
  inputString.reserve(1445);
  swSerial.begin(115200);
  Serial.begin(115200);
  while (!Serial)
    ;

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

void loop() {

  if (stringComplete) {
    Serial.println(inputString);
    // clear the string:
    inputString = "";
    stringComplete = false;
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

void serialEvent() {
  while (swSerial.available()) {
    // get the new byte:
    char inChar = (char)swSerial.read();
    // add it to the inputString:
    inputString += inChar;
    // if the incoming character is a newline, set a flag
    // so the main loop can do something about it:
    if (inChar == '\n') {
      stringComplete = true;
    }
  }
}

