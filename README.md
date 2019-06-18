**NOTE SU RELAZIONI**
Le relazioni sono le tre poste nella root directory. La documentazione tabellare delle API è unica per tutte e tre le relazioni e nominata API_Documentation.pdf.

**AVVIO SERVER E DBMS**
Dato che sia il client che il server sono hostati su delle piattaforme online (Heroku e MongoDB Atlas), non è necessario avviare ne' il server ne' il DBMS in locale.

**NOTE AVVIO CLIENT WEB**
Al fine di installare le dipendenze relative al client, aprire un terminale nella cartella Client ed eseguire:

```
$ sudo npm install
```

Verranno così installate le dipendenze. Successivamente, avviare l'applicazione utilizzando il comando:

```
$ ng serve --open
```

per compilare ed aprire l'applicazione nel browser predefinito.

**NOTE AVVIO CLIENT DESKTOP**
Al fine di avviare il client desktop, è sufficiente entrare nella cartella Desktop, aprire un terminale ed eseguire il comando:

```
$ sudo npm install
```

Verranno così installate le dipendenze, in particolare il pacchetto Electron.
Successivamente è sufficiente eseguire:

```
$ npm start
```

per l'avvio del client desktop.

**NOTE AVVIO APP**
Al fine di avviare l'applicazione mobile su emulatore (od eventualemente su un dispositivo android collegato) è necessario dirigersi nella cartella Mobile, aprire un terminale ed installare le dipendenze. I comandi sono, rispetto alla directory contenente il progetto:

```
$ cd ./mobile
$ sudo npm install
```

Se si vuole eseguire l'app su emulatore o dispositivo collegato, eseguire:

```
$ cordova run android
```

prestando attenzione ad aver impostato le relative variabili d'ambiente d'interesse in modo che puntino alla cartella dell'SDK e del JDK, per quanto riguarda cordova.
Invece, se si è intenzionati solo a generare l'apk per l'installazione manuale su dispositivo android, eseguire:	​

```
$ cordova build android
```

e si potrà trovare l'apk in 

```
./mobile/platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

