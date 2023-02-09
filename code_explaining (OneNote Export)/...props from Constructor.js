/**
 * *"..." na początku argumentów funkcji to operator spread, który umożliwia rozłożenie argumentów tablicy lub iterowalnego obiektu na pojedyncze wartości. 
 * W powyższym kodzie, operator spread jest używany, aby rozłożyć argumenty przekazane do konstruktora klasy, które są określone jako "props".
 * W ten sposób wszystkie argumenty, które zostaną przekazane do konstruktora, będą reprezentowane jako oddzielne wartości w tablicy "props". 
 * !Na przykład, jeśli ktoś wywoła konstruktor z argumentami 1, 2, 3, to tablica "props" będzie wyglądać następująco: [1, 2, 3].
 * Następnie operator spread jest używany ponownie, aby przekazać te argumenty do konstruktora nadrzędnej klasy, 
 * która jest dziedziczona przez klasę "Player". W ten sposób argumenty te zostaną użyte we właściwym kontekście w konstruktorze nadrzędnej klasy.
 * 
 * 
 *  */ 