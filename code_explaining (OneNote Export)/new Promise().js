// Ten kod tworzy funkcję, która zwraca nowe obiekty typu Promise. Obiekt Promise to obiekt JavaScript, który reprezentuje wynik operacji, 
// która może zostać zakończona pomyślnie lub niepomyślnie w przyszłości. Można go używać do asynchronicznego kodu, 
// takiego jak obsługa zapytań HTTP lub odczyt pliku z dysku.

// Przykład:

function getData() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('Dane zwrócone po 2 sekundach');
      }, 2000);
    });
  }
  
  getData().then(data => {
    console.log(data); // Dane zwrócone po 2 sekundach
  });

// W przypadku powyższego kodu, funkcja getData zwraca obiekt Promise, który jest rozwiązywany po upływie 2 sekund. 
// Można to zrobić za pomocą słowa kluczowego resolve. Można również odrzucić obiekt Promise za pomocą słowa kluczowego reject.