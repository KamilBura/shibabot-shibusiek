/**
 * arrow function - skrócony zapis funkcji w JavaScript. W tym konkretnym przypadku arrow function służy 
 * do filtrowania tablicy obiektów "client.slashCommands" w poszukiwaniu obiektu, 
 * którego właściwość "name" jest równa nazwie komendy, która została użyta przez użytkownika (interaction.commandName).
 */

// Przykładowo, jeśli tablica "client.slashCommands" zawiera następujące obiekty:

[
    { name: 'help', run: function(client, interaction, options) { ... } 
},
    { name: 'play', run: function(client, interaction, options) { ... } 
},
    { name: 'stop', run: function(client, interaction, options) { ... } 
}
  ]
  
// a użytkownik wpisał komendę "/play", to w wyniku wywołania arrow function otrzymamy obiekt:

{ name: 'play', run: function(client, interaction, options) { ... } }


/**Arrow function składa się z trzech elementów:
 * 
 * parametrów (w tym przypadku jest to jeden parametr "x") - opcjonalny zestaw nazwanych parametrów, 
 * które są przekazywane do funkcji w momencie jej wywołania
 * strzałki (=>) - symbol oznaczający, że to co znajduje się po niej, jest ciałem funkcji
 * ciała funkcji - fragment kodu, który jest wykonywany podczas wywołania funkcji. 
 * W tym przypadku jest to operator porównania (==) sprawdzający, 
 * czy właściwość "name" obiektu "x" jest równa nazwie komendy użytej przez użytkownika. 
 * Jeśli warunek jest spełniony, to arrow function zwraca true, w przeciwnym razie false.
*/

// Użycie arrow function jest opcjonalne i można zastąpić je zwykłą funkcją, np.:

let command = client.slashCommands.find(function(x) {
//...
});
