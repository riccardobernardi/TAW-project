# Introduzione

Questo documento descrive gli risorse che costuiscono l'API offerta dal backend della nostra applicazione web. 

1. Versione corrente
2. Protocollo per la comunicazione
3. Host URL
3. Schema
4. Autenticazione
5. Modelli per la documentazione 

## Versione corrente 
Attualmente l'API è alla versione 0.2.0

## Protocollo per la comunicazione 
Tutti i trasferimenti di dati sono conformi a HTTP/1.1 e tutti gli endpoint richiedono, al momento, http.

## Host URL 
L'accesso all'API avviene tramite l'URL localhost o 127.0.0.1

## Schema 
Tramite estensione dell'URL base (descritto sopra) è possibile accedere alle funzionalità offerte dalla API. Tutti i dati sono inviati e restituiti in formato JSON.
Il server controlla che tutti i campi richiesti siano presenti nelle richieste; per i campi non richiesti ma possibili (es: nelle PATCH non è obbligatorio modificare tutti i campi), il server controlla il loro formato solo se sono presenti.
Se nel  body vengono inseriti dei campi non richiesti e non utili, il server li ignora.
I codici di errore ritornati dal server dipendono dal tipo di errore, in alcuni casi il messaggio è "fisso"  (es: 401-"Unauthorized: user is not a desk"), in altri esso dipende da errori ritornati da componenti interne del server (es: DBMS), in questi casi il messaggio di errore ritornato conterrà una stringa **reason** che conterrà il messaggio di errore generato dal componente interno.

## Autenticazione 

## Gestione degli utenti
E' possibile ottenere informazioni riguardo il personale del ristorante ed effettuare operazioni di inserimento/modifica/cancellazione.

### Login personale
| Titolo    | Login                                                    |
|-----------|----------------------------------------------------------|
| URL       | /login                                                   |
| Metodo    | GET                                                      |
| Parametri |                                                          |
| Corpo     |  { username, password }                                  |
| Successo  |  Codice: 200 Contenuto: { error: false, errormessage: "", token: nuovo_token }                                 |
| Errore    | Codice: 500 INTERNAL SERVER ERROR Contenuto: {statusCode: 500, error: true, errormessage: response} |
| Errore    | Codice: 500 INTERNAL SERVER ERROR Contenuto: {statusCode: 500, error: true, errormessage:"Invalid user"} |
| Errore    | Codice: 500 INTERNAL SERVER ERROR Contenuto: {statusCode: 500, error: true, errormessage:"Invalid password"} |
| Esempio   |   /users?  Body: {  username: "prova1",  password: "a" } |
| Note:     | Codice di esempio                                        |


### Lista del personale
| Titolo    | Fornisci lista utenti                                        |
| --------- | ------------------------------------------------------------ |
| URL       | /users                                                       |
| Metodo    | GET                                                          |
| Parametri | Richiesti: role=[ruolo]                                      |
| Corpo     |                                                              |
| Successo  | Codice: 200 Contenuto: array di oggetti di tipo:  {username, role} |
| Errore    | Codice: 401 UNAUTHORIZED Contenuto: { statusCode:401, error: false, errormessage: "Unauthorized: user is not a desk"} |
| Errore    | Codice: 500 INTERNAL SERVER ERROR Contenuto: { statusCode:500, error: true, errormessage: "DB error: "+ reason } |
| Esempio   | /users?role="waiter"                                         |
| Note:     | Codice di esempio                                            |

### Inserimento utente
| Titolo    | Inserisci un utente                                          |
| --------- | ------------------------------------------------------------ |
| URL       | /users                                                       |
| Metodo    | POST                                                         |
| Parametri |                                                              |
| Corpo     | {username, password, role}                                   |
| Successo  | Codice: 200 Contenuto:{ error: false, errormessage: "", id: id_utente_inserito }       |
| Errore    | Codice: 401 UNAUTHORIZED Contenuto: { statusCode:401, error: true, errormessage: "Unauthorized: user is not a desk"} |
| Errore    | Codice: 400 BAD REQUEST Contenuto: { statusCode:400, error: true, errormessage: "Wrong format"}            |
| Errore    | Codice: 409 CONFLICT Contenuto: {statusCode:409, error:true, errormessage: "User already exists"}        |
| Errore    | Codice: 500 INTERNAL SERVER ERROR Contenuto: { statusCode:500, error: true, errormessage: "DB error: "+reason } |
| Esempio   | /users Body: { username: "prova1",  password: "a",  role: "waiter" } |
| Note:     | Codice di esempio                                            |

### Rimozione utente
| Titolo    | Rimozione utente                     |
|-----------|--------------------------------------|
| URL       | /users/:username                     |
| Metodo    | DELETE                               |
| Parametri |                                      |
| Corpo     |                                      |
| Successo  |  Codice: 200 Contenuto: {error:false, errormessage:""}             |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto: { statusCode:401, error: true, errormessage: "Unauthorized: user is not a desk"}  |
| Errore    | Codice: 500 INTERNAL SERVER ERROR Contenuto: { statusCode:500, error: true, errormessage: "DB error: " + reason } |
| Esempio   |  /users?username=prova               |
| Note:     | Codice di esempio                    |


### Modifica totale dell'utente
| Titolo    | Modifica totale utente                                                   |
|-----------|----------------------------------------------------------|
| URL       | /users/:username                                         |
| Metodo    | PUT                                                      |
| Parametri |                                                          |
| Corpo     |  { username, password, role }                            |
| Successo  |  Codice: 200 Contenuto: {username, role}                              |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto: { statusCode:401, error: true, errormessage: "Unauthorized: user is not a desk"}  |
| Errore    | Codice: 400 BAD REQUEST Contenuto: { statusCode:400, error: true, errormessage: "Wrong format"}            |
| Errore    | Codice: 500 INTERNAL SERVER ERROR Contenuto: { statusCode:500, error: true, errormessage: "DB error: " + reason } |
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
| Successo  |  Codice: 200 Contenuto: array di oggetti di tipo:  {number, max_people, state, associated_ticket}      |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto: { statusCode:401, error: true, errormessage: "Unauthorized: user is not a desk or a waiter"}  |
| Errore    | Codice: 500 INTERNAL SERVER ERROR Contenuto: { statusCode:500, error: true, errormessage: "DB error: " + reason } |
| Esempio   |   /tables                            |
| Note:     | Codice di esempio                    |



### Inserimento tavolo
| Titolo    | Inserire un nuovo tavolo                                     |
| --------- | ------------------------------------------------------------ |
| URL       | /tables                                        |
| Metodo    | POST                                           |
| Parametri |                                                |
| Corpo     | {number, max_people}                           |
| Successo  | Codice: 200 Contenuto: { number,  max_people } |
| Errore    | Codice: 401 UNAUTHORIZED Contenuto: { statusCode:401, error: true, errormessage: "Unauthorized: user is not a desk"} |
| Errore    | Codice: 400 BAD REQUEST Contenuto: { statusCode:400, error: true, errormessage: "Wrong format"} |
| Errore    | Codice: 500 INTERNAL SERVER ERROR Contenuto: { statusCode:500, error: true, errormessage: "DB error: " + reason } |
| Esempio   | /tables/1 Body: {number:1, max_people:5}                     |
| Note:     | Codice di esempio                                            |

### Tavolo al dettaglio
| Titolo    | Fornire un tavolo specifico                                  |
| --------- | ------------------------------------------------------------ |
| URL       | /tables/:number                                              |
| Metodo    | GET                                                          |
| Parametri |                                                              |
| Corpo     |                                                              |
| Successo  | Codice: 200 Contenuto: array di oggetti di tipo:  {number, max_people, state, associated_ticket} |
| Errore    | Codice: 401 UNAUTHORIZED Contenuto: { statusCode:401, error: false, errormessage: "Unauthorized: user is not a desk or a waiter"} |
| Errore    | Codice: 500 INTERNAL SERVER ERROR Contenuto: { statusCode:500, error: true, errormessage: "DB error: "+ reason } |
| Esempio   | /tables/1                                                    |
| Note:     | Codice di esempio                                            |

### Modifica di un attributo di un tavolo
| Titolo    | Modificare i campi di un tavolo      |
|-----------|--------------------------------------|
| URL       | /tables/:number                      |
| Metodo    | PATCH                                |
| Parametri |                                      |
| Corpo     |{max_people?, status?}                |
| Successo  | Codice: 200 Contenuto: {number, max_people, state: state_table, associated_ticket} |
| Errore    | Codice: 401 UNAUTHORIZED Contenuto: { statusCode:401, error: true, errormessage: "Unauthorized: user is not a desk"} |
| Errore    | Codice: 400 BAD REQUEST Contenuto: { statusCode:400, error: true, errormessage: "Wrong format"} |
| Esempio   | /tables/1 Body: {number:1, max_people: 5 }   |
| Note:     | Codice di esempio                    |

## Gestione del menu
### Fornire la lista dei prodotti servibili
| Titolo    | Fornire la lista dei prodotti        |
|-----------|--------------------------------------|
| URL       | /items                               |
| Metodo    | GET                                  |
| Parametri | type=[tipo]                          |
| Corpo     |                                      |
| Successo  |  Codice: 200 Contenuto: array di oggetti di tipo:  {name, type, price, required_time, ingredients}           |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto: { statusCode:401, error: true, errormessage: "Unauthorized: user is not a desk or a waiter"}  |
| Errore    | Codice: 500 INTERNAL SERVER ERROR Contenuto: { statusCode:500, error: true, errormessage: "DB error: " + reason } |
| Esempio   | /items?type=dish                     |
| Note:     | Codice di esempio                    |

### Inserire un prodotto
| Titolo    | Inserire un prodotto specifico                                                                                                                                    |
|-----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| URL       | /items                                                                                                                                                            |
| Metodo    | POST                                                                                                                                                              |
| Parametri |                                                                                                                                                                   |
| Corpo     | {name, type, ingredients, description, price}                                                                                                                     |
| Successo  |  Codice: 200 Contenuto:{ error: false, errormessage: "", id: id_nuovo_item } |
| Errore    | Codice: 401 UNAUTHORIZED Contenuto: { statusCode:401, error: true, errormessage: "Unauthorized: user is not a desk"} |
| Errore    | Codice: 400 BAD REQUEST Contenuto: { statusCode:400, error: true, errormessage: "Wrong format"}            |
| Errore    | Codice: 409 CONFLICT Contenuto: {statusCode:409, error:true, errormessage: "Item already exists"}        |
| Errore    | Codice: 500 INTERNAL SERVER ERROR Contenuto: { statusCode:500, error: true, errormessage: "DB error: "+reason } |
| Esempio   |  /items/1  Body: { name: Spaghetti al pomodoro,   type: piatto,  ingredients: [{Spaghetti}, {Pomodoro}],   description: "Spaghetti al pomodoro,  price: 6.00  }     |
| Note:     | Codice di esempio           |

### Fornire un prodotto specifico
| Titolo    | Fornire un prodotto specifico        |
|-----------|--------------------------------------|
| URL       | /items/:id                           |
| Metodo    | GET                                  |
| Parametri |                                      |
| Corpo     |                                      |
| Successo  |  Codice: 200 Contenuto: {_id, name, type, price, ingredients, required_time, description}          |
| Errore    | Codice: 401 UNAUTHORIZED Contenuto: { statusCode:401, error: true, errormessage: "Unauthorized: user is not a desk or a waiter"} |
| Errore    | Codice: 500 INTERNAL SERVER ERROR Contenuto: { statusCode:500, error: true, errormessage: "DB error: "+reason } |
| Esempio   | /items/1                             |
| Note:     | Codice di esempio                    |



### Modificare un prodotto specifico
| Titolo    | Modificare un prodotto specifico     |
|-----------|--------------------------------------|
| URL       | /items/:id                           |
| Metodo    | PUT                                  |
| Parametri |                                      |
| Corpo     | {name, type, ingredients, description, price}               |
| Successo  |  Codice: 200 Contenuto: {_id, name, type, price, ingredients, required_time, description}             |
| Errore    | Codice: 401 UNAUTHORIZED Contenuto: { statusCode:401, error: true, errormessage: "Unauthorized: user is not a desk"} |
| Errore    | Codice: 400 BAD REQUEST Contenuto: { statusCode:400, error: true, errormessage: "Wrong format"}            |
| Errore    | Codice: 500 INTERNAL SERVER ERROR Contenuto: { statusCode:500, error: true, errormessage: "DB error: "+reason } |
| Esempio   |  /items/1 Body: {name: Spaghetti al pomodoro,   type: piatto,  ingredients: [{Spaghetti}, {Pomodoro}],   description: "Spaghetti al pomodoro,  price: 6.00   }                                                  |
| Note:     | Codice di esempio                    |

### Eliminare un prodotto
| Titolo    | Eliminare un prodotto specifico      |
|-----------|--------------------------------------|
| URL       | /items/:id                           |
| Metodo    | DELETE                               |
| Parametri |                                      |
| Corpo     |                                      |
| Successo  |  Codice: 200 Contenuto: {error:false, errormessage:""}             |
| Errore    | Codice: 401 UNAUTHORIZED Contenuto: { statusCode:401, error: true, errormessage: "Unauthorized: user is not a desk"} |
| Errore    | Codice: 500 INTERNAL SERVER ERROR Contenuto: { statusCode:500, error: true, errormessage: "DB error: "+reason } |
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
|                           timestamp(now),  state: "complete"}  |
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
