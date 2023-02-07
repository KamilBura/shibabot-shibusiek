//? Async funtion Explain

/**
 * *Jest to funkcja strzałkowa (arrow function) w JavaScript. Funkcje strzałkowe są krótszą i bardziej zwięzłą formą funkcji w JavaScript.
 * Funkcje strzałkowe są takie same jak funkcje zwykłe, ale nie mają własnego właściwości "this" i "arguments" i są domyślnie zamknięte 
 * (czyli zapamiętują swoje zmienne zewnętrzne). 
 * Funkcje strzałkowe są niezwykle przydatne w programowaniu funkcyjnym i w kodzie, który korzysta z asynchronicznych operacji.
 */

//*Poniżej kilka przykładów użycia funkcji strzałkowych:

// Przykład 1: Funkcja strzałkowa z jednym argumentem
let square = x => x * x;
console.log(square(5)); // 25

// Przykład 2: Funkcja strzałkowa z wieloma argumentami
let add = (a, b) => a + b;
console.log(add(2, 3)); // 5

// Przykład 3: Funkcja strzałkowa z ciałem bloku
let greet = name => {
  console.log("Hello, " + name + "!");
};
greet("John"); // Hello, John!

// Przykład 4: Funkcja strzałkowa z użyciem "async"
let fetchData = async () => {
  let response = await fetch("https://some-api.com/data");
  let data = await response.json();
  console.log(data);
};
fetchData();

/**
 * *async jest funkcją, która może być używana do oznaczania funkcji jako asynchronicznej. 
 * Funkcje asynchroniczne pozwalają na wykonywanie operacji, które trwają długo i nie blokują wątku, w którym zostały wywołane.
 */

//* Poniżej znajdują się kilka przykładów wykorzystania funkcji async:

//Pobieranie danych z sieci:
async function fetchData() {
    const response = await fetch("https://api.example.com/data");
    const data = await response.json();
    return data;
  }
  
//Zapisywanie danych do bazy danych:
async function saveData(data) {
    const response = await fetch("https://api.example.com/save", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
  }
  
//Wczytywanie obrazów:
async function loadImage(url) {
    const image = new Image();
    image.src = url;
    return new Promise((resolve, reject) => {
      image.onload = () => resolve(image);
      image.onerror = (error) => reject(error);
    });
  }
  
  async function displayImage() {
    const image = await loadImage("https://example.com/image.jpg");
    document.body.appendChild(image);
  }
  
//Wczytywanie plików:
async function loadFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
  
  async function readFile(file) {
    const content = await loadFile(file);
    console.log(content);
  }

/**
 * !Jak widać, funkcje async są szczególnie przydatne w przypadku operacji, które wymagają dużo czasu na wykonanie, 
 * !np. pobieranie danych z sieci czy odczytywanie plików, ponieważ pozwalają one na uzyskanie odpowiedzi bez blokowania innych operacji.
 */