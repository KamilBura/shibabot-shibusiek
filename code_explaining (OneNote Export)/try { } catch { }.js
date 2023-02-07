// Blok try i catch to instrukcje JavaScript, które są używane do obsługi błędów podczas wykonywania kodu.

try {
    // Ten kod może zgłosić błąd
    const result = riskyFunction();
    console.log(result);
  } catch (error) {
    // Ten kod zostanie wykonany, jeśli wystąpi błąd
    console.error(error);
  }

// W powyższym przykładzie, blok try zawiera kod, który może zgłosić błąd podczas wykonywania. 
// Jeśli wystąpi błąd, zostanie on obsłużony przez blok catch. W bloku catch można użyć obiektu błędu, 
// który jest przekazywany do niego jako argument, aby uzyskać więcej informacji o tym, co poszło nie tak. 
// Można również użyć tego obiektu, aby zapobiec dalszemu rozprzestrzenianiu się błędu i zapewnić obsługę błędów w aplikacji.

// Blok try i catch jest często używany do obsługi błędów podczas wykonywania asynchronicznego kodu, 
// takiego jak odczyt pliku z dysku lub wysyłanie żądania