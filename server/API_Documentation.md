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

###Inserimento utente
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

###Rimozione utente
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

###Login personale
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

##Gestione tavoli

###Lista tavoli
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

###Tavolo al dettaglio
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

###Modifica agli attributi di un tavolo
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

##Gestione del menu
###Fornire la lista dei prodotti servibili
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

###Fornire un prodotto specifico
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

###Fornire un prodotto specifico

## Modelli per la documentazione 
Come modelli per la stesura della documentazione, abbiamo utilizzato le seguenti risorse:
	- https://developers.facebook.com/docs/graph-api/using-graph-api/v2.1 ;
	- https://developer.github.com/v3/ ;
	- https://gist.github.com/iros/3426278 ;
