# tag-gy

## Prerequisiti

- Download [Docker](https://www.docker.com) dal sito ufficiale;
- Download [Node.js](https://nodejs.org/en/download/) dal sito ufficiale;
- Download MongoDB, consultare il [manuale](https://docs.mongodb.org/manual/installation/) per la corretta installazione.

## Installazione e avvio
Se l'applicazione vuole essere fatta girare in locale la procedura da seguire è la seguente:
- per installre tutte le dipendenze che il progetto richiede entrare nelle cartelle front-end e server ed eseguire da terminale il seguente comando:
```bash
npm install
```
- entrare nella cartella */server* ed avviare il back-end tramite il comando:
```bash
node app.js
```
- entrare nella cartella */front-end* ed avviare il sito tramite il comando:
```bash
npm start
```
Se l'applicazione vuole essere aggiunta in un contenitore docker la procedura è molto più semplice ed automatica: è sufficiente entrare nella root directory del progetto (dove risiede il file **docker-compose.yml**) ed eseguire il comando:
```bash
docker-compose up
```
Prima di avviare questo comando è consigliato guardare come viene inizializzato il db in modo tale da modificare il file per l'aggiunta dei dati nella collezione *sentences* e inserire nella corretta cartella le immagini che si vogliono aggiungere alla collezione *images*. È possibile aggiungere immagini anche in seguito utilizzando il comando:
```bash
docker cp /(local_path)  (container_id):/(to_the_place_you_want_the_file_to_be)
```

**N.B.** In entrambi i casi se l'applicativo vuole essere raggiungibile da dispositivi diversi da quelli in cui è stato avviato è necessario modificare il file *environment.js* presente nella cartella */front-end/src/environment*. Basterà commentare la riga 2 e decommentare la riga 5 cambiando l'indirizzo ip presente con quello della macchina su cui girerà l'applicazione (la porta 3001 deve essere lasciata).

## Inizializzazione database
Il database prevede tre collezioni: *sentences*, *images* e *user*. Queste collezioni vanno inizializzate all'avvio del back-end tramite due chiamate API.
La prima va effettuata al seguente indirizzo [http://localhost:3001/init](http://localhost:3001/init) con metodo **GET** e va ad aggiungere dati alla collezione *sentences*. Questa chiamata prende in input un file di nome **POS_init.json** nella cartella */resources* del server avente la seguente struttura:
 ```json
  [
    {
      "text": "Some text to add",
      "spans": []
    },
    {
      "text": "Some other text to add",
      "spans": []
    }
  ]
  ```
La seconda aggiunge dati alla collezione *images* e va effettuata al seguente indirizzo [http://localhost:3001/img/init](http://localhost:3001/img/init) tramite **GET**. Questa chiamata prende in input tutte le immagini caricate nella cartella */resources/images* e ne va ad aggiungere i nomi all'interno della collezione. Una volta inserite le immagini verranno spostate nella cartella */resources/images/dataDB* appena creata dal server.
L'ultima collezione, quella *user*, va inizializzata tramite una chiamata **POST** all'indirizzo [http://localhost:3001/register](http://localhost:3001/register) passando come corpo delle chiamata un oggetto avente la seguente struttura:
 ```json
  {
    "username" : "test",
    "role" : "U",
    "password" : "123456"
  }
  ```
**N.B.** Il ruolo dell'utente al momento non viene gestito ma si è ipotizzato che in futuro potesse essere utile. I ruoli che ipoteticamente potrebbero essere assegnati sono:
- amministratore (A): avrebbe la possibilità di aggiungere dati alle tre collezioni;
- utente (U): avrebbe il compito di effettuare tag.

## License
[MIT](https://choosealicense.com/licenses/mit/)

