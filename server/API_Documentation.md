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
| Parametri | Richiesti: role=[ruolo]              |
| Corpo     |                                      |
| Successo  |  Codice: 200 Contenuto:              |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto: |
| Errore    | Altri errori                         |
| Esempio   | /users?role="Cuoco"                  |
| Note:     | Codice di esempio                    |

### Inserimento utente
| Titolo    | Inserisci un utente                                                                         |
|-----------|---------------------------------------------------------------------------------------------|
| URL       | /users                                                                                      |
| Metodo    | POST                                                                                        |
| Parametri |                                                                                             |
| Corpo     | {username, password, role}                                                             |
| Successo  |  Codice: 200 Contenuto:                                                                     |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto:                                                        |
| Errore    | Altri errori                                                                                |
| Esempio   |  /users Body: { username: "prova1",  password: "a",  role: "Simpaticone" } |
| Note:     | Codice di esempio                                                                           |                     |

### Rimozione utente
| Titolo    | Rimozione utente                     |
|-----------|--------------------------------------|
| URL       | /users                               |
| Metodo    | DELETE                               |
| Parametri | username=[username]                  |
| Corpo     |                                      |
| Successo  |  Codice: 200 Contenuto:              |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto: |
| Errore    | Altri errori                         |
| Esempio   |  /users?username=prova               |
| Note:     | Codice di esempio                    |

### Login personale
| Titolo    | Login                                                    |
|-----------|----------------------------------------------------------|
| URL       | /login                                                   |
| Metodo    | GET                                                      |
| Parametri |                                                          |
| Corpo     |  { username, password }                                  |
| Successo  |  Codice: 200 Contenuto:                                  |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto:                     |
| Errore    | Altri errori                                             |
| Esempio   |   /users?  Body: {  username: "prova1",  password: "a" } |
| Note:     | Codice di esempio                                        |

### Modifica totale dell'utente
| Titolo    | Modifica totale utente                                                   |
|-----------|----------------------------------------------------------|
| URL       | /users/:id                                                   |
| Metodo    | PUT                                                      |
| Parametri |                                                          |
| Corpo     |  { username, password, role }                            |
| Successo  |  Codice: 200 Contenuto:                                  |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto:                     |
| Errore    | Altri errori                                             |
| Esempio   |   /users/1  Body: {  username: "ciao1",  password: "pwd",|
|           |  , role: "waiter" }                                      |
| Note:     | Codice di esempio                                        |

## Gestione tavoli

### Lista tavoli
| Titolo    | Fornire lista tavoli                 |
|-----------|--------------------------------------|
| URL       | /tables                              |
| Metodo    | GET                                  |
| Parametri |                                      |
| Corpo     |                                      |
| Successo  |  Codice: 200 Contenuto:              |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto: |
| Errore    | Altri errori                         |
| Esempio   |   /tables                            |
| Note:     | Codice di esempio                    |

### Tavolo al dettaglio
| Titolo    | Fornire un tavolo specifico          |
|-----------|--------------------------------------|
| URL       | /tables/:number                      |
| Metodo    | GET                                  |
| Parametri |                                      |
| Corpo     |                                      |
| Successo  |  Codice: 200 Contenuto:              |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto: |
| Errore    | Altri errori                         |
| Esempio   |   /tables/1                          |
| Note:     | Codice di esempio                    |

### Modifica agli attributi di un tavolo
| Titolo    | Fornire un tavolo specifico          |
|-----------|--------------------------------------|
| URL       | /tables/:number                           |
| Metodo    | PUT                                  |
| Parametri |                                      |
| Corpo     | {parametri da cambiare}              |
| Successo  |  Codice: 200 Contenuto:              |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto: |
| Errore    | Altri errori                         |
| Esempio   |    /tables/1 Body: {number: 1,       |
|           |  max_people:2 }                      |  
| Note:     | Codice di esempio                    |

### Inserimento tavolo
| Titolo    | Fornire un tavolo specifico          |
|-----------|--------------------------------------|
| URL       | /tables                              |
| Metodo    | POST                                 |
| Parametri |                                      |
| Corpo     |{number, max_people}                  |
| Successo  |  Codice: 200 Contenuto:              |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto: |
| Errore    | Altri errori                         |
| Esempio   |    /tables/1 Body: {number:1, max_   |
|           | people: 5 }                          |
| Note:     | Codice di esempio                    |

### Modifica di un attributo di un tavolo
| Titolo    | Fornire un tavolo specifico          |
|-----------|--------------------------------------|
| URL       | /tables/:number                      |
| Metodo    | PATCH                                |
| Parametri |                                      |
| Corpo     |{max_people?, status?}                |
| Successo  |  Codice: 200 Contenuto:              |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto: |
| Errore    | Altri errori                         |
| Esempio   |    /tables/1 Body: {number:1, max_   |
|             people: 5 }                          |
| Note:     | Codice di esempio                    |

## Gestione del menu
### Fornire la lista dei prodotti servibili
| Titolo    | Fornire la lista dei prodotti        |
|-----------|--------------------------------------|
| URL       | /items                               |
| Metodo    | GET                                  |
| Parametri | type=[tipo]                          |
| Corpo     |                                      |
| Successo  |  Codice: 200 Contenuto:              |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto: |
| Errore    | Altri errori                         |
| Esempio   | /items?type=dish                     |
| Note:     | Codice di esempio                    |

### Fornire un prodotto specifico
| Titolo    | Fornire un prodotto specifico        |
|-----------|--------------------------------------|
| URL       | /items/:id                           |
| Metodo    | GET                                  |
| Parametri |                                      |
| Corpo     |                                      |
| Successo  |  Codice: 200 Contenuto:              |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto: |
| Errore    | Altri errori                         |
| Esempio   | /items/1                             |
| Note:     | Codice di esempio                    |

### Inserire un prodotto
| Titolo    | Inserire un prodotto specifico                                                                                                                                    |
|-----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| URL       | /items                                                                                                                                                            |
| Metodo    | POST                                                                                                                                                              |
| Parametri |                                                                                                                                                                   |
| Corpo     | {name, type, ingredients, description, price}                                                                                                                     |
| Successo  |  Codice: 200 Contenuto:                                                                                                                                           |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto:                                                                                                                              |
| Errore    | Altri errori                                                                                                                                                      |
| Esempio   |  /items/1  Body: { name: Spaghetti al pomodoro,   type: piatto,  ingredients: [{Spaghetti}, {Pomodoro}],   description: "Spaghetti al pomodoro,  price: 6.00  }     |
| Note:     | Codice di esempio                                                                                                                                                 |

### Modificare un prodotto specifico
| Titolo    | Modificare un prodotto specifico     |
|-----------|--------------------------------------|
| URL       | /items/:id                           |
| Metodo    | PUT                                  |
| Parametri |                                      |
| Corpo     | {name, type, ingredients, description, price}               |
| Successo  |  Codice: 200 Contenuto:              |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto: |
| Errore    | Altri errori                         |
| Esempio   |  /items/1 Body: {name: Spaghetti al pomodoro,   type: piatto,  ingredients: [{Spaghetti}, {Pomodoro}],   description: "Spaghetti al pomodoro,  price: 6.00   }                                                  |
| Note:     | Codice di esempio                    |

### Eliminare un prodotto
| Titolo    | Eliminare un prodotto specifico      |
|-----------|--------------------------------------|
| URL       | /items/:id                           |
| Metodo    | DELETE                               |
| Parametri |                                      |
| Corpo     |                                      |
| Successo  |  Codice: 200 Contenuto:              |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto: |
| Errore    | Altri errori                         |
| Esempio   | /items/1                             |
| Note:     | Codice di esempio                    |

## Gestione dei ticket e degli ordini

### Inserimento di un ordine 
| Titolo    | Inserimento di un ordine                                                 |
|-----------|--------------------------------------------------------------------------|
| URL       | /tickets                                                                 |
| Metodo    | POST                                                                     |
| Parametri |                                                                          |
| Corpo     | {id_wait, id_tab, start_hour}                                            |
| Successo  |  Codice: 200 Contenuto:                                                  |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto:                                     |
| Errore    | Altri errori                                                             |
| Esempio   |  /tickets  Body: {id_wai: 1, tab_number: 1, start_hour: timestamp(now) } |
| Note:     | Codice di esempio                                                        |

### Recupero info di un ordine	
| Titolo    | Recupero info di un ordine                             |
|-----------|--------------------------------------------------------|
| URL       | /tickets                                               |
| Metodo    | GET                                                    |
| Parametri | date=[data]&wait=[id_cam]&tab=[id_tavolo]&state=[stato]|
| Corpo     |                                                        |
| Successo  |  Codice: 200 Contenuto:                                |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto:                   |
| Errore    | Altri errori                                           |
| Esempio   |  /tickets?wai=1&tab=1                                  |
| Note:     | Codice di esempio                                      |

### Recupero info di un ordine specifico
| Titolo    | Recupero info di un ordine specifico |
|-----------|--------------------------------------|
| URL       | /tickets/:id                         |
| Metodo    | GET                                  |
| Parametri |                                      |
| Corpo     |                                      |
| Successo  |  Codice: 200 Contenuto:              |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto: |
| Errore    | Altri errori                         |
| Esempio   |  /tickets/1                          |
| Note:     | Codice di esempio                    |

### Recupero info di un ordine specifico
| Titolo    | Recupero info di un ordine specifico |
|-----------|--------------------------------------|
| URL       | /tickets/:id                         |
| Metodo    | PATCH                                |
| Parametri |                                      |
| Corpo     |  {end, state}                        |
| Successo  |  Codice: 200 Contenuto:              |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto: |
| Errore    | Altri errori                         |
| Esempio   |  /tickets/1 Body: {end:              | 
|							timestamp(now),  state: "complete"}  |									
| Note:     | Codice di esempio                    |

### Recupero comande relative ad un ordine
| Titolo    | Recupero comande di un ordine specifico |
|-----------|-----------------------------------------|
| URL       | /tickets/:id/orders                     |
| Metodo    | GET                                     |
| Parametri |                                         |
| Corpo     |                                         |
| Successo  |  Codice: 200 Contenuto:                 |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto:    |
| Errore    | Altri errori                            |
| Esempio   | /tickets/1/orders                       |
| Note:     | Codice di esempio                       |

### Inserimento di una comanda per un ordine
| Titolo    | Inserimento comanda/e relative ad un ordine specifico                                                               |
|-----------|---------------------------------------------------------------------------------------------------------------------|
| URL       | /tickets/:id/orders                                                                                                 |
| Metodo    | POST                                                                                                                |
| Parametri |                                                                                                                     |
| Corpo     | {dish_name, price, added, state, username.waiter}                                                                   |
| Successo  |  Codice: 200 Contenuto:                                                                                             |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto:                                                                                |
| Errore    | Altri errori                                                                                                        |
| Esempio   |  /tickets/1/orders   Body: {  dish_name: "Spaghetti",   price: 7.00,  added: {doppio pomodoro},  state: "da completare" } |
| Note:     | Codice di esempio                                                                                                   |

### Modifica di una comanda
| Titolo    | Modifica comanda                                      |
|-----------|-------------------------------------------------------|
| URL       | /tickets/:id/orders/:id                               |
| Metodo    | PATCH                                                 |
| Parametri |                                                       |
| Corpo     | {stato }                                              |
| Successo  |  Codice: 200 Contenuto:                               |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto:                  |
| Errore    | Altri errori                                          |
| Esempio   |  /tickets/1/orders   Body: {  state: "pronto" }       |
| Note:     | Codice di esempio                                     |

### Cancellazione di una comanda
| Titolo    | Cancellazione comanda                |
|-----------|--------------------------------------|
| URL       | /tickets/:id/orders/:id              |
| Metodo    | DELETE                               |
| Parametri |                                      |
| Corpo     |                                      |
| Successo  |  Codice: 200 Contenuto:              |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto: |
| Errore    | Altri errori                         |
| Esempio   |  /tickets/1/orders                   |
| Note:     | Codice di esempio                    |

### Dare tutte gli ordini pendenti
| Titolo    | Lista totale ordini                 |
|-----------|-------------------------------------|
| URL       | /tickets/orders                     |
| Metodo    | GET                                 |
| Parametri | state=[stato]                       |
| Corpo     |                                     |
| Successo  | Codice: 200 Contenuto:              |
| Errore    | Codice: 401 UNAUTHORIZED Contenuto: |
| Errore    | Altri errori                        |
| Esempio   | /tickets/orders?state="open"        |


## Report
### Fornire un Report
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

### Inserire un report
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

### Cancellare un report
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

### Modifica di un report
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
