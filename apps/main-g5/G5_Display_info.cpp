

bool last_uni_char = false;
unsigned char last_char;
int widthheigthWindow = 0;

#define display_mosi 11
#define display_clk 5

#define display_cmddata 27
#define display_cs 26

#define display_reset 40

#define display_enable 3

void spiWrite1(uint8_t d) {
  for (uint8_t bit = 0x80; bit; bit >>= 1) {
    digitalWrite(display_mosi, d & bit);
    digitalWrite(display_clk , HIGH);
    digitalWrite(display_clk , LOW);
  }
}

void spiCommand(uint8_t d) {
  digitalWrite(display_cs , LOW);
  digitalWrite(display_cmddata , LOW);
  spiWrite1(d);
  digitalWrite(display_cs , HIGH);
}

void spiWrite(uint8_t d) {
  digitalWrite(display_cs , LOW);
  digitalWrite(display_cmddata , HIGH);
  spiWrite1(d);
  digitalWrite(display_cs , HIGH);
}


void setAddrWindowDisplay(int x, int y, int w, int h)
{
  widthheigthWindow = w * h;
  spiCommand(0x2A);
  spiWrite((x) >> 8);
  spiWrite(x);
  spiWrite((x + w - 1) >> 8);
  spiWrite(x + w - 1);
  spiCommand(0x2B);
  spiWrite((y) >> 8);
  spiWrite(y);
  spiWrite(((y + h - 1) & 0xFF) >> 8);
  spiWrite((y + h - 1) & 0xFF);
  spiCommand(0x2C);
}

void displayColor(short color) {
  int v2 = 0;
  do
  {
    spiWrite(color >> 8);
    spiWrite(color);
    v2++;
  }
  while ( v2 < widthheigthWindow );
}

void init_display() {

  pinMode(display_mosi, OUTPUT);
  pinMode(display_cmddata, OUTPUT);
  pinMode(display_clk, OUTPUT);
  pinMode(display_cs, OUTPUT);
  pinMode(display_reset, OUTPUT);
  pinMode(display_enable, OUTPUT);

  digitalWrite(display_enable, HIGH);

  delay(10);
  digitalWrite(display_cs, HIGH);
  digitalWrite(display_reset, HIGH);
  delay(20);
  digitalWrite(display_reset, LOW);
  delay(100);
  digitalWrite(display_reset, HIGH);
  delay(100);

  spiCommand(0xFE);
  spiWrite(1);
  spiCommand(0x6C);
  spiWrite(0xA);
  spiCommand(4);
  spiWrite(0xA0);
  spiCommand(254);
  spiWrite(5);

  spiCommand(5);
  spiWrite(1);
  spiCommand(254);
  spiWrite(0);

  spiCommand(53);
  spiWrite(0);

  spiCommand(54);
  spiWrite(192);
  
  spiCommand(0x3A);
  spiWrite(0x72);
  delay(10);
  spiCommand(83);
  spiWrite(32);
  spiCommand(196);
  spiWrite(128);
  spiCommand(17);
  delay(120);
  spiCommand(0x29);


  spiCommand(0x51);
  spiWrite(0xff);//Brigthness 0x90 0xC0 0xFF

  pinMode(34, OUTPUT);

  digitalWrite(34, LOW);

}


void displayRect(uint32_t x, uint32_t y, uint32_t w, uint32_t h, uint16_t color) {
  setAddrWindowDisplay(x, y, w, h);
  displayColor(color);
}


bool drawChar(uint32_t x, uint32_t y, unsigned char c, uint16_t color, uint16_t bg, uint32_t size) {
  if (c < 32)return false;
  if (c >= 127) {
    if (!last_uni_char) {
      last_char = c;
      last_uni_char = true;
      return false;
    } else {
      last_uni_char = false;
      if (last_char == 0xC3) {
        switch (c) {
          case 0x84://Ä
            c = 0x8E;
            break;
          case 0xA4://ä
            c = 0x84;
            break;
          case 0x96://Ö
            c = 0x99;
            break;
          case 0xB6://ö
            c = 0x94;
            break;
          case 0x9C://Ü
            c = 0x9A;
            break;
          case 0xBC://ü
            c = 0x81;
            break;
          case 0x9F://ß
            c = 0x98;
            break;
          default:
            return false;
        }
      } else if (last_char == 0xF0 && c == 0x9F)
        c = 0x02;
      else
        return false;
    }
  }
  for (int8_t i = 0; i < 5; i++) {
    uint8_t line = font57[c * 5 + i];
    for (int8_t j = 0; j < 8; j++, line >>= 1) {
      if (line & 1) {
        displayRect(x + i * size, y + j * size, size, size, color);
      } else if (bg != color) {
        displayRect(x + i * size, y + j * size, size, size, bg);
      }
    }
  }
  if (bg != color) {
    displayRect(x + 5 * size, y, size, 8 * size, bg);
  }
  return true;
}

size_t my_strlen(const char *str)
{
  size_t i;

  for (i = 0; str[i]; i++);
  return i;
}

void displayPrintln(uint32_t x, uint32_t y, char text[], uint16_t color, uint16_t bg, uint32_t size ) {
  int tempPosition = 0;
  for (unsigned int f = 0; f < my_strlen(text); f++)
  {
    if (x + (tempPosition * 6 * size) >= 390 - (6 * size)) {
      x = -(tempPosition * 6 * size);
      y += (8 * size);
    }
    if (drawChar(x + (tempPosition * 6 * size), y, text[f], color, bg, size)) {
      tempPosition++;
    }
  }
}

void setup() {
  // initialize digital pin LED_BUILTIN as an output.
  Serial.begin(115200);
  Serial.println("Hello");
  pinMode(39, OUTPUT);
  digitalWrite(39, LOW);
  init_display();

  displayRect(0, 0, 454, 454, 0x0000);
  displayRect(195 - 22, 45, 100, 100, 0x2721);
  displayPrintln(100, 150, (char *)"G5 Demo", 0x1A1E, 0x0000, 2);
  displayPrintln(100, 120 + (7 * 7) + 5, (char *)"Twitter: @ATC1441", 0xFBA8, 0x0000, 2);
  displayPrintln(100, 150 + (7 * 7) + 5, (char *)"ATCnetz.de", 0xFBA8, 0x0000, 2);
  displayPrintln(100, 200 + (7 * 7) + 5, (char *)"Software SPI demo", 0xFBA8, 0x0000, 2);
  displayPrintln(100, 220 + (7 * 7) + 5, (char *)"454x454 Pixel", 0xFBA8, 0x0000, 2);
  displayPrintln(50, 240 + (7 * 7) + 5, (char *)"Display Pinout:", 0x1A1E, 0x0000, 2);
  displayPrintln(60, 260 + (7 * 7) + 5, (char *)"CLK 5, MOSI 11, EN 3", 0x1A1E, 0x0000, 2);
  displayPrintln(70, 280 + (7 * 7) + 5, (char *)"CS 26, DC27, ENoutput 34", 0x1A1E, 0x0000, 2);
  displayPrintln(80, 300 + (7 * 7) + 5, (char *)"RESET 40", 0x1A1E, 0x0000, 2);
  displayPrintln(90, 320 + (7 * 7) + 5, (char *)"Vibration 40", 0x1A1E, 0x0000, 2);
}

// the loop function runs over and over again forever
void loop() {
  char time_string[14];
  sprintf(time_string, "%i", millis());
  displayPrintln(150, 170 + (7 * 7) + 5, time_string, 0xFBA8, 0x0000, 2);
  byte data_raw[8];
  delay(10);

  displayRect(((data_raw[2] & 0xf) << 8) + data_raw[3], ((data_raw[4] & 0xf) << 8) + data_raw[5], 2, 2, 0xffff);

}
