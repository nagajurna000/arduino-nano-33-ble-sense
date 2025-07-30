const int M1_PIN = 2;      // Moteur 1
const int M2_DIR1 = 3;     // Moteur 2 sens 1
const int M2_DIR2 = 4;     // Moteur 2 sens 2

// Timers en millisecondes
unsigned long previousMillisM1 = 0;
unsigned long previousMillisM2 = 0;

const unsigned long intervalM1On = 5UL * 60UL * 1000UL;   // 5 min
const unsigned long intervalM1Off = 30UL * 1000UL;        // 30 sec

const unsigned long intervalM2On = 3UL * 60UL * 1000UL;   // 3 min
const unsigned long intervalM2Off = 30UL * 1000UL;        // 30 sec

bool m1State = true;
bool m2Running = true;
bool m2Direction = true; // true = sens A, false = sens B

void setup() {
    pinMode(M1_PIN, OUTPUT);
    pinMode(M2_DIR1, OUTPUT);
    pinMode(M2_DIR2, OUTPUT);

    // Démarre M1
    digitalWrite(M1_PIN, HIGH);

    // Démarre M2 dans le premier sens
    setMotor2Direction(m2Direction);

    previousMillisM1 = millis();
    previousMillisM2 = millis();
}

void loop() {
    unsigned long currentMillis = millis();

    // M1 : arrêt 30 s toutes les 5 min
    if (m1State && currentMillis - previousMillisM1 >= intervalM1On) {
        digitalWrite(M1_PIN, LOW);   // Arrêt M1
        m1State = false;
        previousMillisM1 = currentMillis;
    } else if (!m1State && currentMillis - previousMillisM1 >= intervalM1Off) {
        digitalWrite(M1_PIN, HIGH);  // Redémarrage M1
        m1State = true;
        previousMillisM1 = currentMillis;
    }

    // M2 : alternance sens toutes les 3 min + 30 s arrêt
    if (m2Running && currentMillis - previousMillisM2 >= intervalM2On) {
        stopMotor2();                // Arrêt M2
        m2Running = false;
        previousMillisM2 = currentMillis;
    } else if (!m2Running && currentMillis - previousMillisM2 >= intervalM2Off) {
        m2Direction = !m2Direction; // Inversion sens
        setMotor2Direction(m2Direction);
        m2Running = true;
        previousMillisM2 = currentMillis;
    }
}

// ----------- Fonctions de contrôle de M2 -----------
void stopMotor2() {
    digitalWrite(M2_DIR1, LOW);
    digitalWrite(M2_DIR2, LOW);
}

void setMotor2Direction(bool direction) {
    if (direction) {
        digitalWrite(M2_DIR1, HIGH);
        digitalWrite(M2_DIR2, LOW);
    } else {
        digitalWrite(M2_DIR1, LOW);
        digitalWrite(M2_DIR2, HIGH);
    }
}
