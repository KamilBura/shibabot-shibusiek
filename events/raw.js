// Ten plik jest odpowiedzialny za aktualizowanie stanu głosowego na Lavalinku.

// Exportujemy fukncje z dwoma argumentami: "client" "data"
module.exports = (client, data) => {
    // Uzywamy metody "updateVocieState" z obiektu "manager" na obiekcie "client" i przypisujemy dane do niej (data).
    client.manager.updateVoiceState(data);
};

// EXPLAINING
// W skrócie, ta funkcja umożliwia aktualizowanie stanu głosowego na Lavalinku za pomocą danych przekazanych przez Discord.
// Klient jest potrzebny do dostępu do obiektu managera, a dane są potrzebne do aktualizacji stanu głosowego.