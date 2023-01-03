// Konstruktor to specjalna metoda w klasie, która jest wywoływana podczas tworzenia nowego obiektu z klasy lub podczas jej rozszerzania przez inną klasę. 
// Konstruktor służy do inicjalizacji nowo utworzonego obiektu poprzez ustawienie początkowych wartości właściwości lub wywołanie innych metod.

// Przykład:

class Person {
    constructor(name, age) {
      this.name = name;
      this.age = age;
    }
  }
  
  const john = new Person('John', 30);
  console.log(john.name); // John
  console.log(john.age); // 30

// W powyższym przykładzie klasa Person ma konstruktor, który przyjmuje dwa argumenty: name i age. 
// W konstruktorze te wartości są przypisywane do odpowiednich właściwości obiektu Person. 
// Następnie, kiedy tworzymy nowy obiekt john z klasy Person, podajemy dwie wartości jako argumenty do konstruktora, 
// co spowoduje, że obiekt john zostanie zainicjalizowany z tymi wartościami.