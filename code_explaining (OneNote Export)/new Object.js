// Słowo kluczowe new jest używane w JavaScript do tworzenia nowego obiektu za pomocą konstruktora.

// Tworzymy konstruktor dla obiektów typu Osoba
function Osoba(imie, nazwisko) {
    this.imie = imie;
    this.nazwisko = nazwisko;
    this.przedstawSie = function() {
      console.log(`Nazywam się ${this.imie} ${this.nazwisko}`);
    };
  }
  
  // Tworzymy nowy obiekt typu Osoba za pomocą konstruktora
  const jan = new Osoba("Jan", "Kowalski");
  
  jan.przedstawSie(); // Nazywam się Jan Kowalski

// W powyższym kodzie, słowo kluczowe new jest używane do tworzenia nowego obiektu jan typu Osoba. 
// Obiekt ten zostaje utworzony za pomocą konstruktora Osoba, który jest funkcją służącą do tworzenia nowych obiektów tego typu.