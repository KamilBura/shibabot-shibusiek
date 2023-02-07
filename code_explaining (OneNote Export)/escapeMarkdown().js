const { escapeMarkdown, escapeUnderline } = require('discord.js');

/**
 * `escapeMarkdown` jest funkcją z biblioteki discord.js używaną do escapowania (usuwania) specjalnych znaków z tekstu, 
 * takich jak znaki nowej linii, znaki specjalne itp. Służy to do zabezpieczenia tekstu przed atakami typu "injection" i zapewnia, 
 * że tekst jest bezpieczny do użycia w komunikacji z Discordem. 
 * W tym konkretnym kodzie, escapeMarkdown jest uzyty do usuniecia specjalnych znaków z nazwy utworu, który jest obecnie odtwarzany.
 */

// Na przykład, jeśli chcesz przesłać wiadomość zawierającą nazwę użytkownika, która zawiera znaki specjalne, 
// takie jak @ lub #, możesz użyć escapeMarkdown aby uniknąć problemów związanych z interpretacją tych znaków jako specjalnych poleceń.

const username = '@testusername#1234';
const escapedUsername = escapeMarkdown(username)

console.log(escapedUsername); // '@testusername#1234'
