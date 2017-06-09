Coding style
============


Indentare si spatii
-------------------

* Indentarea se face cu `2` spatii
* Apelurile lungi de functii se indenteaza cu numarul necesar de spatii astfel incat primul argument de dupa `linefeed` sa fie aliniat cu prima paranteza a apeului
* Inainte de `{` se lasa `un` spatiu
* fiecare operator se prefixeaza cu un spatiu si este urmat de un spatiu
  (ex: `1 + 2`)

Structuri de control
--------------------
* se incearca pe cat posibil folosirea unui range-based foor loop acolo
  unde este necesara iterarea peste un container
* if-urile respecta urmatorul sablon
  ```
  if (cond) {
    ...
  } else if () {
    ...
  } esle {
    ...
  }
  ```
* While-urile respecta urmatorul sablon:
  ```
  while (cond) {
     ....
  }

  ```
* switch-urile respecta urmatorul sablon:
  ```
  switch (cond) {
      ...
  }

  ```


Lungimea liniilor si ruperea liniilor lungi
-------------------------------------------
* Fiecare linie are lungimea de aproximativ `75`de caractere
* In cazuri speciale, pot aparea si linii a caror lungime sa atinga maximum `150`



Declararea metodelor
--------------------
* Numele unei metode trebuie sa contina un verb
* Numele fiecare metode este scris in stil `camelCase`
* Declararea metodelor respecta urmatorul
  ```
  numeMetoda() {
    ...
    }

  ```
* Numele argumentelor unei metode este scris in stil `camelCase`

  ```

Declararea variabilelor
-----------------------
* Fiecare variabila este declarata in stil `camelCase`
* Numele unei variabile trebuie sa contina un substantiv

Declararea Claselor
-------------------
* Fiecare clasa se declara intr-un fisier de tipul `NumeleClasei.extensieLimbaj`
* Fiecare clasa respecta stilul `CamelCase`
* Numele fiecarei clase incepe cu litera mare


Importuri
---------
* Liniile de import se declara la inceputul fisierului

Comentarii
----------
* Fiecare metoda este precedata de un comment (docstring) de forma
  ```
  /**
   * @brief Descriere scurta despre ce face metoda.
   *
   * @param param1 Descriere scurta despre parametru.
   *
   * @return tip Descriere scurta despre semantica valoarei returnate.
   */
  ```
* Se incearca evitarea comentariilor de tipul `//` intrucat prezenta lor
  inseamna ca aveam cod greu de citit. Aclolo unde este cazul, trebuie sa
  fie cat mai scurte si la subiect.






