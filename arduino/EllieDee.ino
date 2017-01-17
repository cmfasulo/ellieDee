#include <SoftwareSerial.h>
#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
  #include <avr/power.h>
#endif

#define PIN 6
//int btStatusPin = 2;
int redPin = 11;
int greenPin = 10;
int bluePin = 9;
//char btConnection;

Adafruit_NeoPixel strip = Adafruit_NeoPixel(144, PIN, NEO_GRB + NEO_KHZ800);
//SoftwareSerial bluetooth(RX_PIN, TX_PIN); // RX, TX

void setup() {
  //pinMode(btStatusPin, INPUT);
  // pinMode(redPin, OUTPUT);
  // pinMode(greenPin, OUTPUT);
  // pinMode(bluePin, OUTPUT);

  //setColor(255, 0, 0);  // red
  //btConnection = 'N';
  Serial.begin(9600);
  strip.begin();
  strip.show(); // Initialize all pixels to 'off'

  theaterChase(strip.Color(127, 127, 127), 50); // White
  theaterChase(strip.Color(127, 0, 0), 50); // Red
  theaterChase(strip.Color(0, 0, 127), 50); // Blue
  strip.show();

  strip.setPixelColor(144, 255, 255, 255);
  strip.show(); //turn off all pixels
}

void loop() {

  if (Serial.available()>1){
          // parse incoming data for led number and rgb values, serial print for debugging
          int ledNum = Serial.parseInt();
            Serial.println(ledNum);
          int r = Serial.parseInt();
            Serial.println(r);
          int g = Serial.parseInt();
            Serial.println(g);
          int b = Serial.parseInt();
            Serial.println(b);
          int bright = Serial.parseInt();
            Serial.println(bright);
            Serial.println("End1");

          // if led number is 4095 or 5000, the app's "Reset All" button has been pressed (some strange quirk of using MIT app inventor bluetooth communication). Reset function cycles through all pixels, turning them all white then off one at a time to get a blank/reset matrix
          if (ledNum == 4095){
              for (int i=0; i <= 143; i++){
              strip.setPixelColor(i, 255, 255, 255);
              strip.show();
              }

              delay(1000);

              for (int i=0; i <= 143; i++){
              strip.setPixelColor(i, 0, 0, 0);
              strip.show();
              }
          }
          if (ledNum == 5000){
              for (int i=0; i <= 143; i++){
              strip.setPixelColor(i, 255, 255, 255);
              strip.show();
              }

              delay(1000);

              for (int i=0; i <= 143; i++){
              strip.setPixelColor(i, 0, 0, 0);
              strip.show();
              }
          }
          else { // else, set the given pixel to the requested color
          strip.setPixelColor(ledNum, r, g, b, bright);
          strip.show();
          }
  }
}

//LED Bluetooth Connection Indicator Light - not used
// void setColor(int red, int green, int blue) {
//   analogWrite(redPin, red);
//   analogWrite(greenPin, green);
//   analogWrite(bluePin, blue);
// }

//Theatre-style crawling lights animation shown at start-up
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
