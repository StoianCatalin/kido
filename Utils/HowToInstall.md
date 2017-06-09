# Cum sa instalezi KiMo

Asigurati-va ca:
* Ati primit toate fisierele sursa
* Aveti suficient spatiu pe disk
* Aveti instalat un server de MySQL
* Aveti conexiune la internet


# Pasul 1

  - Cu ajutorul unui utilitar create in MySQL o noua baza de date cu denumirea  ``` kido ```
  - Nu inserati orice altceva in baza de date


# Pasul 2

* Accesati sursele proiectului
* Accesati folderul ```config```
* Accesati ```database.js```
* Continutul fisierului va fi urmatorul:
```var express = require('express');
var Sequelize = require('sequelize');

var sequelize = new Sequelize('kido', 'root', '', {
    host: '127.0.0.1',
    dialect: 'mysql'
});

module.exports = sequelize;
```
* Modificati din ```'root'``` in numele userului dumneavoastra de MySQL (intre ```''```) 
* Modificati din ```''``` in parola userului dumneavoastra de MySQL (intre ```''```) 
* Modificati din ```'127.0.0.1'``` in adresa hostului dumneavoastra


# Pasul 3
 
* Accesati folderul in care este aplicatia si deschideti un command promt / terminal
* In terminal executati comanda urmatoare:
```
npm install
```
* Asteptati ca exectia sa se finalizeze
* Accesati folderul ```public```
* Deschideti un command promt / terminal
* In terminal executati comanda urmatoare:
```
npm install
```

# Pasul 4

* In folderul public deschideti un command promt / terminal
* Executati comanda
```
npm install -g @angular/cli
```
* Asteptati finalizarea comenzii
* Executati comanda
```
ng build
```

# Pasul 5

* In folderul principal al proiectului deschideti un command prompt / terminal 
* Executati comanda 
```
npm start
```

# Pasul 6

BUCURATI-VA DE KIMO!
