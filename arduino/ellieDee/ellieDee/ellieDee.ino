#include <SoftwareSerial.h>

// Pin Definitions
int rxPin = 2;
int redPin = 11;
int greenPin = 10;
int bluePin = 9;
int connectStatus = 0;
SoftwareSerial swSerial(rxPin, 3);// rx tx

void setup() {

  swSerial.begin(115200);
  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);
  setColor(255, 0, 0);  // red  

} // End setup()

void loop() {

  while (swSerial.available() > 0) {
    connectStatus = swSerial.parseInt();

    if (connectStatus == 1) {
      setColor(0, 255, 0);  // green
    } else {
      setColor(255, 0, 0);  // red
    }
  }


} // End loop()

void setColor(int red, int green, int blue) {
  analogWrite(redPin, red);
  analogWrite(greenPin, green);
  analogWrite(bluePin, blue);  
}

