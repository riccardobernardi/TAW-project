# Introduzione

Questo documento descrive gli risorse che costuiscono l'API offerta dal backend della nostra applicazione web. 

1. Versione corrente
2. Protocollo per la comunicazione
3. Host URL
3. Schema
4. Autenticazione
5. Modelli per la documentazione 

## Versione corrente 
Attualmente l'API è alla versione 0.1.0

## Protocollo per la comunicazione 
Tutti i trasferimenti di dati sono conformi a HTTP/1.1 e tutti gli endpoint richiedono, al momento, http.

## Host URL 
L'accesso all'API avviene tramite l'URL localhost o 127.0.0.1

## Schema 
Tramite estensione dell'URL base (descritto sopra) è possibile accedere alle funzionalità offerte dalla API. Tutti i dati sono inviati e restituiti in formato JSON.
Come sono trattati i campi omessi?
La rappresentazione delle risorse come lista contiene campi omessi? La rappresentazione delle risorse come singole include tutti i campi di quella risorsa?

## Autenticazione 

## Gestione degli utenti
E' possibile ottenere informazioni riguardo il personale del ristorante ed effettuare operazioni di inserimento/modifica/cancellazione.

### Lista del personale
| Titolo    | Fornisci lista utenti                |
|-----------|--------------------------------------|
| URL       | /users                               |
| Metodo    | GET                                  |
| Parametri | Richiesti: Role=[ruolo]              |
| Corpo     |                                      |
| Successo  |  Codice: 200 Contenuto:              |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto: |
| Errore    | Altri errori                         |
| Esempio   | /users?Role="Cuoco"                  |
| Note:     | Codice di esempio                    |

### Inserimento utente
| Titolo    | Inserisci un utente                                                                         |
|-----------|---------------------------------------------------------------------------------------------|
| URL       | /users                                                                                      |
| Metodo    | POST                                                                                        |
| Parametri |                                                                                             |
| Corpo     | {ID, Username, Password, Ruolo}                                                             |
| Successo  |  Codice: 200 Contenuto:                                                                     |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto:                                                        |
| Errore    | Altri errori                                                                                |
| Esempio   |  /users Body: {   ID: "prova",  Nickname: "prova1",  Password: "a",  Ruolo: "Simpaticone" } |
| Note:     | Codice di esempio                                                                           |                     |

### Rimozione utente
| Titolo    | Rimozione utente                     |
|-----------|--------------------------------------|
| URL       | /users                               |
| Metodo    | DELETE                               |
| Parametri | Nick=[username]                      |
| Corpo     |                                      |
| Successo  |  Codice: 200 Contenuto:              |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto: |
| Errore    | Altri errori                         |
| Esempio   |  /users?Nick=prova                   |
| Note:     | Codice di esempio                    |

### Login personale
| Titolo    | Login                                                    |
|-----------|----------------------------------------------------------|
| URL       | /login                                                   |
| Metodo    | POST/GET(?)                                              |
| Parametri |                                                          |
| Corpo     |  { Username, Password }                                  |
| Successo  |  Codice: 200 Contenuto:                                  |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto:                     |
| Errore    | Altri errori                                             |
| Esempio   |   /users?  Body: {  Username: "prova1",  Password: "a" } |
| Note:     | Codice di esempio                                        |

## Gestione tavoli

### Lista tavoli
| Titolo    | Fornire lista tavoli                 |
|-----------|--------------------------------------|
| URL       | /tavoli                              |
| Metodo    | GET                                  |
| Parametri |                                      |
| Corpo     |                                      |
| Successo  |  Codice: 200 Contenuto:              |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto: |
| Errore    | Altri errori                         |
| Esempio   |   /tavoli                            |
| Note:     | Codice di esempio                    |

### Tavolo al dettaglio
| Titolo    | Fornire un tavolo specifico          |
|-----------|--------------------------------------|
| URL       | /tavoli/:n                           |
| Metodo    | GET                                  |
| Parametri |                                      |
| Corpo     |                                      |
| Successo  |  Codice: 200 Contenuto:              |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto: |
| Errore    | Altri errori                         |
| Esempio   |   /tavoli/1                          |
| Note:     | Codice di esempio                    |

### Modifica agli attributi di un tavolo
| Titolo    | Fornire un tavolo specifico          |
|-----------|--------------------------------------|
| URL       | /tavoli/:n                           |
| Metodo    | PUT                                  |
| Parametri |                                      |
| Corpo     | {parametri da cambiare}              |
| Successo  |  Codice: 200 Contenuto:              |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto: |
| Errore    | Altri errori                         |
| Esempio   |    /tavoli/1 Body: ?                 |
| Note:     | Codice di esempio                    |

## Gestione del menu
### Fornire la lista dei prodotti servibili
| Titolo    | Fornire la lista dei prodotti        |
|-----------|--------------------------------------|
| URL       | /menu                                |
| Metodo    | GET                                  |
| Parametri | Type=[tipo]                          |
| Corpo     |                                      |
| Successo  |  Codice: 200 Contenuto:              |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto: |
| Errore    | Altri errori                         |
| Esempio   | /menu?Type=bibite                    |
| Note:     | Codice di esempio                    |

### Fornire un prodotto specifico
| Titolo    | Fornire un prodotto specifico        |
|-----------|--------------------------------------|
| URL       | /menu/:id                            |
| Metodo    | GET                                  |
| Parametri |                                      |
| Corpo     |                                      |
| Successo  |  Codice: 200 Contenuto:              |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto: |
| Errore    | Altri errori                         |
| Esempio   | /menu/1                              |
| Note:     | Codice di esempio                    |

###Inserire un prodotto
| Titolo    | Inserire un prodotto specifico                                                                                                                                    |
|-----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| URL       | /menu/:id                                                                                                                                                         |
| Metodo    | POST                                                                                                                                                              |
| Parametri |                                                                                                                                                                   |
| Corpo     | {Nome, Tipo, Ingr, Descr, Prezzo}                                                                                                                                 |
| Successo  |  Codice: 200 Contenuto:                                                                                                                                           |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto:                                                                                                                              |
| Errore    | Altri errori                                                                                                                                                      |
| Esempio   |  /menu/1  Body: {   Nome: Spaghetti al pomodoro,   Tipo: piatto,  Ingredienti: [{Spaghetti}, {Pomodoro}],   Descrizione: "Spaghetti al pomodoro,  Prezzo: 6.00  } |
| Note:     | Codice di esempio                                                                                                                                                 |

### Modificare un prodotto specifico
| Titolo    | Modificare un prodotto specifico     |
|-----------|--------------------------------------|
| URL       | /menu/:id                            |
| Metodo    | PUT                                  |
| Parametri |                                      |
| Corpo     | {parametri del piatto}               |
| Successo  |  Codice: 200 Contenuto:              |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto: |
| Errore    | Altri errori                         |
| Esempio   |  /menu/1 Body: { ? }                 |
| Note:     | Codice di esempio                    |

### Eliminare un prodotto
| Titolo    | Eliminare un prodotto specifico      |
|-----------|--------------------------------------|
| URL       | /menu/:id                            |
| Metodo    | DELETE                               |
| Parametri |                                      |
| Corpo     |                                      |
| Successo  |  Codice: 200 Contenuto:              |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto: |
| Errore    | Altri errori                         |
| Esempio   | /menu/1                              |
| Note:     | Codice di esempio                    |

##Gestione degli ordini

###Inserimento di un ordine 
| Titolo    | Inserimento di un ordine                                                 |
|-----------|--------------------------------------------------------------------------|
| URL       | /ordini                                                                  |
| Metodo    | POST                                                                     |
| Parametri |                                                                          |
| Corpo     | {id_cam, id_tav, ora_inizio}                                             |
| Successo  |  Codice: 200 Contenuto:                                                  |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto:                                     |
| Errore    | Altri errori                                                             |
| Esempio   |  /ordini  Body: {  id_cam: 1,  id_tav: 1,  ora_inizio: timestamp(now) }  |
| Note:     | Codice di esempio                                                        |

###Recupero info di un ordine	
| Titolo    | Recupero info di un ordine                             |
|-----------|--------------------------------------------------------|
| URL       | /ordini                                                |
| Metodo    | GET                                                    |
| Parametri | Date=[data]&Cam=[id_cam]&Tav=[id_tavolo]&Stato=[stato] |
| Corpo     |                                                        |
| Successo  |  Codice: 200 Contenuto:                                |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto:                   |
| Errore    | Altri errori                                           |
| Esempio   |  /ordini?Cam=1&Tav=1                                   |
| Note:     | Codice di esempio                                      |

###Recupero info di un ordine specifico
| Titolo    | Recupero info di un ordine specifico |
|-----------|--------------------------------------|
| URL       | /ordini/:id                          |
| Metodo    | GET                                  |
| Parametri |                                      |
| Corpo     |                                      |
| Successo  |  Codice: 200 Contenuto:              |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto: |
| Errore    | Altri errori                         |
| Esempio   |  /ordini/1                           |
| Note:     | Codice di esempio                    |

###Recupero comande relative ad un ordine
| Titolo    | Recupero comande di un ordine specifico |
|-----------|-----------------------------------------|
| URL       | /ordini/:id/comande                     |
| Metodo    | GET                                     |
| Parametri |                                         |
| Corpo     |                                         |
| Successo  |  Codice: 200 Contenuto:                 |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto:    |
| Errore    | Altri errori                            |
| Esempio   |  /ordini/1/comande                      |
| Note:     | Codice di esempio                       |

###Inserimento di una comanda per un ordine
| Titolo    | Inserimento comanda/e relative ad un ordine specifico                                                               |
|-----------|---------------------------------------------------------------------------------------------------------------------|
| URL       | /ordini/:id/comande                                                                                                 |
| Metodo    | POST                                                                                                                |
| Parametri |                                                                                                                     |
| Corpo     | {id_piatto, prezzo, aggiunte, stato}                                                                                |
| Successo  |  Codice: 200 Contenuto:                                                                                             |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto:                                                                                |
| Errore    | Altri errori                                                                                                        |
| Esempio   |  /ordini/1/comande   Body: {  id_piatto: 1,   prezzo: 7.00,  aggiunte: {doppio pomodoro},  stato: "da completare" } |
| Note:     | Codice di esempio                                                                                                   |

###Modifica di una comanda
| Titolo    | Modifica comanda                                      |
|-----------|-------------------------------------------------------|
| URL       | /ordini/:id/comande/:id                               |
| Metodo    | PUT                                                   |
| Parametri |                                                       |
| Corpo     | {Campi da decidere}                                   |
| Successo  |  Codice: 200 Contenuto:                               |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto:                  |
| Errore    | Altri errori                                          |
| Esempio   |  /ordini/1/comande   Body: {  ? }                     |
| Note:     | Codice di esempio                                     |

###Cancellazione di una comanda
| Titolo    | Cancellazione comanda                |
|-----------|--------------------------------------|
| URL       | /ordini/:id/comande/:id              |
| Metodo    | DELETE                               |
| Parametri |                                      |
| Corpo     |                                      |
| Successo  |  Codice: 200 Contenuto:              |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto: |
| Errore    | Altri errori                         |
| Esempio   |  /ordini/1/comande                   |
| Note:     | Codice di esempio                    |

##Report
###Fornire un Report
| Titolo    | Fornire un report                    |
|-----------|--------------------------------------|
| URL       | /report                              |
| Metodo    | GET                                  |
| Parametri | Date=[data]                          |
| Corpo     |                                      |
| Successo  |  Codice: 200 Contenuto:              |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto: |
| Errore    | Altri errori                         |
| Esempio   |  /report?Date=[timestamp(now)]       |
| Note:     | Codice di esempio                    |

###Inserire un report
| Titolo    | Inserire un report                   |
|-----------|--------------------------------------|
| URL       | /report                              |
| Metodo    | POST                                 |
| Parametri |                                      |
| Corpo     | {Parametri del report}               |
| Successo  |  Codice: 200 Contenuto:              |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto: |
| Errore    | Altri errori                         |
| Esempio   |   /report  Body: {da decidere}       |
| Note:     | Codice di esempio                    |

###Cancellare un report
| Titolo    | Cancellare un report                 |
|-----------|--------------------------------------|
| URL       | /report/:id                          |
| Metodo    | DELETE                               |
| Parametri |                                      |
| Corpo     |                                      |
| Successo  |  Codice: 200 Contenuto:              |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto: |
| Errore    | Altri errori                         |
| Esempio   |   /report/1                          |
| Note:     | Codice di esempio                    |

###Modifica di un report
| Titolo    | Modifica di un report                |
|-----------|--------------------------------------|
| URL       | /report/:id                          |
| Metodo    | PUT                                  |
| Parametri |                                      |
| Corpo     | {campi da cambiare}                  |
| Successo  |  Codice: 200 Contenuto:              |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto: |
| Errore    | Altri errori                         |
| Esempio   |   /report/1   Body: {da decidere}    |
| Note:     | Codice di esempio                    |

## Modelli per la documentazione 
Come modelli per la stesura della documentazione, abbiamo utilizzato le seguenti risorse:
	- https://developers.facebook.com/docs/graph-api/using-graph-api/v2.1 ;
	- https://developer.github.com/v3/ ;
	- https://gist.github.com/iros/3426278 ;
