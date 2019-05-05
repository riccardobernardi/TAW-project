#Introduzione

Questo documento descrive gli risorse che costuiscono l'API offerta dal backend della nostra applicazione web. 

1. [Versione corrente] (#Versione)
2. [Protocollo per la comunicazione] (#Protocollo)
3. [Host URL] (#Host)
3. [Schema] (#Schema)
4. [Autenticazione] (#Autenticazione)
5. [Modelli per la documentazione] (#Modelli)

##Versione corrente <a name="Versione"></a>
Attualmente l'API è alla versione 0.1.0

##Protocollo per la comunicazione <a name="Protocollo"></a>
Tutti i trasferimenti di dati sono conformi a HTTP/1.1 e tutti gli endpoint richiedono, al momento, http.

##Host URL <a name="Host"></a>
L'accesso all'API avviene tramite l'URL localhost o 127.0.0.1

##Schema <a name="Schema"></a>
Tramite estensione dell'URL base (descritto sopra) è possibile accedere alle funzionalità offerte dalla API. Tutti i dati sono inviati e restituiti in formato JSON.
Come sono trattati i campi omessi?
La rappresentazione delle risorse come lista contiene campi omessi? La rappresentazione delle risorse come singole include tutti i campi di quella risorsa?

##Autenticazione <a name="Autenticazione"></a>

##Gestione degli utenti
E' possibile ottenere informazioni riguardo il personale del ristorante ed effettuare operazioni di inserimento/modifica/cancellazione.

###Lista del personale
| Titolo    | Fornisci lista utenti                |
|-----------|--------------------------------------|
| URL       | /users                               |
| Metodo    | GET                                  |
| Parametri | Richiesti: Role=[ruolo]              |
| Successo  |  Codice: 200 Contenuto:              |
| Errore    |  Codice: 401 UNAUTHORIZED Contenuto: |
| Errore    | Altri errori                         |
| Esempio   | /users?Role="Cuoco"                  |
| Note:     | Codice di esempio                    |

##Modelli per la documentazione <a name="Modelli"></a>
Come modelli per la stesura della documentazione, abbiamo utilizzato le seguenti risorse:
	- https://developers.facebook.com/docs/graph-api/using-graph-api/v2.1 ;
	- https://developer.github.com/v3/ ;
	- https://gist.github.com/iros/3426278 ;