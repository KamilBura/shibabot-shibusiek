// Słowo kluczowe super jest używane w klasach dziedziczących (klasa dziedzicząca rozszerza inną klasę) 
// w celu wywołania konstruktora klasy bazowej (klasy, która jest rozszerzana).

class Animal {
    constructor(name) {
      this.name = name;
    }
  }
  
  class Dog extends Animal {
    constructor(name, breed) {
      super(name); // Wywołanie konstruktora klasy bazowej
      this.breed = breed;
    }
  }
  
  const fido = new Dog('Fido', 'Labrador');
  console.log(fido.name); // Fido
  console.log(fido.breed); // Labrador

// W powyższym przykładzie klasa Dog rozszerza klasę Animal i ma własny konstruktor, 
// który przyjmuje dodatkowy argument breed. W konstruktorze Dog wywoływana jest metoda super z argumentem name, 
// co spowoduje wywołanie konstruktora klasy Animal z tą sam