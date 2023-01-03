/**
 * Collection to specjalny typ danych, który służy do przechowywania i zarządzania kolekcją obiektów w JavaScript. 
 * Jest to podobne do tablicy (Array), ale ma dodatkowe funkcje i możliwości, 
 * takie jak możliwość przechowywania obiektów z kluczami lub z indeksami jako kluczami. 
 * Możesz używać Collection do przechowywania różnych obiektów i danych w jednym miejscu, 
 * a następnie uzyskać dostęp do nich poprzez ich klucze lub indeksy. Jest to często używane w bibliotekach i frameworkach JavaScript, 
 * takich jak Discord.js, do przechowywania komend, użytkowników, serwerów itp.
 */

// Tworzenie nowej Collection wygląda tak:

const collection1 = new Collection();

// Możesz również przekazać tablicę obiektów jako argument do konstruktora Collection, aby automatycznie utworzyć kolekcję z tych obiektów:

const array = [{ key: "value1" }, { key: "value2" }];
const collection2 = new Collection(array);


// Możesz używać różnych metod, takich jak set(), get(), has(), delete() itp., aby zarządzać elementami w kolekcji.

collection.set("key", "value"); // dodaje element do kolekcji
console.log(collection.get("key")); // wyświetla wartość elementu o kluczu "key"
console.log(collection.has("key")); // sprawdza, czy kolekcja zawiera element o kluczu "key"
collection.delete("key"); // usuwa element o kluczu "key" z kolekcji