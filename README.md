# Mobiele applicatie GoodGarden 🌱

Een React Native applicatie voor het monitoren en beheren van sensoren en pompen in een verticale tuin. De applicatie communiceert met een Flask API voor het ophalen en verwerken van data.

## Installatiehandleiding ⚙️

1. Vereisten
- **Node.js** 
- **Expo CLI**
- **Python 3** (voor de Flask API)

### **Installeren van de Flask API**

1. Clone de repository:
```bash
clone https://github.com/6028968/GG_MAD_API
```

2. Ga naar de Flask folder:
```bash
cd GG_MAD_API/
```

3. Maak een virtuele omgeving aan:
```bash
python3 -m venv venv
```

4. Activeer de virtuele omgeving:
```bash
source venv/bin/activate
```

5. Installeer de benodigde Python packages:
```bash
pip install -r requirements.txt
```

6. Start de Flask server:
```bash
python server.py
```

7. De Flask API draait standaard op:
```bash
http://127.0.0.1:3000/fetch-data
```

### **Installeren van de React Native applicatie**

1. Clone de repository:

```bash
git clone https://github.com/6028968/GG_MAD
cd GG_MAD
```

2. Installeer de benodigde dependencies:

```bash
npm install
```

3. Start de applicatie:

```bash
npm run web
```

De Applicatie hoort te openen in de webbrowser.

## Admin inloggegevens 🔑

Voor het testen van admin-functionaliteiten:

    - Gebruikersnaam: admin
    - Wachtwoord: admin

Voor het testen van een normale gebruiker:

    - Gebruikersnaam: test
    - Wachtwoord: test

P.S.: Je kan ook zelf een normale gebruiker aanmaken!

## Implementaties 📋

### **Kernfunctionaliteiten**

- Live Data: Integratie van sensorwaarden (momenteel hardcoded via Flask).
- Pomp Aansturen: Handmatige bediening van de pomp via de app.
- Gebruikersrollen: Admin en normale gebruiker.
- Plantenbeheer: Planten toevoegen en bekijken via externe API.
- Historische Data: Opslaan en bekijken van logboeken.

### **Structuur van het project**

- constants: Styling en kleuren.
- components: Herbruikbare UI-componenten.
- assets/types: TypeScript interfaces en types.
- assets/api: Logica voor de Flask API en weer-API.

## Dependencies 📦

### **Frontend** (React Native)
- React Native: Framework voor mobiele applicaties.
- Expo: Toolchain voor ontwikkelen en testen.
- AsyncStorage: Lokale opslag voor gebruikersdata.
- CORS: Voor communicatie tussen de API en app.
- Fetch API: Voor het ophalen van data van de Flask API.

### **Backend** (Flask API)
- Flask: Backend framework voor Python.
- Flask-CORS: Om API-verzoeken vanuit de app toe te staan.
- JSON: Voor data-uitwisseling.

## Toekomstige Uitbreidingen 🌟

- Live data van sensoren integreren via SSH.
- Notificaties voor afwijkende sensorwaarden.
- Exporteren van historische data.