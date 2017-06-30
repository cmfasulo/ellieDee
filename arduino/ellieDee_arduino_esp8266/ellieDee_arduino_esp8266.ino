#include <SoftwareSerial.h>

#define ESP8266_rxPin 2
#define ESP8266_txPin 3

//SSID + KEY
const char SSID_ESP[] = "Bill Wi the Sci Fi Guy";
const char SSID_KEY[] = "nyetyson2020";

// URLs
//const char URL_elliedee[] = "GET https://elliedee.herokuapp.com/elliedee HTTP/1.1\r\n\r\n";
const char URL_elliedee[] = "GET https://elliedee.herokuapp.com/elliedee HTTP/1.1\r\nHost: elliedee.herokuapp.com\r\n\r\n";

//MODES
const char CWMODE = '1';//CWMODE 1=STATION, 2=APMODE, 3=BOTH
const char CIPMUX = '1';//CWMODE 0=Single Connection, 1=Multiple Connections

SoftwareSerial ESP8266(ESP8266_rxPin, ESP8266_txPin);// rx tx

//DEFINE ALL FUNCTIONS HERE
boolean setup_ESP();
boolean read_until_ESP(const char keyword1[], int key_size, int timeout_val, byte mode);
void timeout_start();
boolean timeout_check(int timeout_ms);
void serial_dump_ESP();
boolean connect_ESP();
void get_elliedee();

//DEFINE ALL GLOBAL VAARIABLES HERE
unsigned long timeout_start_val;
char scratch_data_from_ESP[20];//first byte is the length of bytes
char payload[150];
byte payload_size=0, counter=0;
char ip_address[16];
char leds[500];

//DEFINE KEYWORDS HERE
const char keyword_OK[] = "OK";
const char keyword_Ready[] = "Ready";
const char keyword_no_change[] = "no change";
const char keyword_blank[] = "#&";
const char keyword_ip[] = "192.";
const char keyword_rn[] = "\r\n";
const char keyword_quote[] = "\"";
const char keyword_carrot[] = ">";
const char keyword_sendok[] = "SEND OK";
const char keyword_linkdisc[] = "Unlink";


//keywords for youtube
const char keyword_html_start_b[] = "[";
const char keyword_html_end_b[] = "]";

void setup(){//        SETUP     START
  //Pin Modes for ESP TX/RX
  pinMode(ESP8266_rxPin, INPUT);
  pinMode(ESP8266_txPin, OUTPUT);
  
  ESP8266.begin(9600);//default baudrate for ESP
  ESP8266.listen();//not needed unless using other software serial instances
  Serial.begin(115200); //for status and debug
  delay(5000);//delay before kicking things off
  
  setup_ESP();//go setup the ESP 
}//                    SETUP     END

void loop(){//         LOOP     START

  get_elliedee(); // get youtube views and subs
  delay(5000);//thingspeak needs ~12 secs before next connection

}//                    LOOP     END
