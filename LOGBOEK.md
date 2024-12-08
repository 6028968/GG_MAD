### API
- Open weather API
- Flask API (eigen server)

### Componenten

- Adminonly = Functionaliteiten achter de admin rol zetten
- AuthContext = Verantwoordelijk voor de inlogsysteem
- Background = Voor de achtergrond van de applicaite
- ClearCache = Om de Localstorage te legen
- MenuDownUnder = Het uitklapbare menu
- ProtectedRoute = Zorgt ervoor dat alle views alleen besckibaar zijn als je ingelogd bent
- WeatherForecast = De functionaliteit om de weergegevenvs te tonen
- PlantAsyncStorage = Slaat alvast wat standaar planten op in de localstorage en zorgt voor de logica om planten teoe te kunenn voegen
- 

### Bijhouden

    - ssh/scp verzoek met JavaScript naar de Raspberry PI.
    - Eigen API met Flask die (de json van de ssh) waarvan de data opgehaald wrodt voor de sensoren, pompen en meldingen
    - Wordt CORS gebruikt zodat React Native erbij kan, anders mag het niet en mag die alleen zijn eigen host gebruiken.
    - Maakt gebruik van salt en pepper (data opslaan)
