// Exportujemy Kod do innych Plikow, dokladniej do "ShibaBot.js"

// W tym `module.exports = ()` wywolujemy funkcje anonimowa
module.exports = () => {
    // Tworzymy nowa funkcje `Promise`, ktory reprezentuje wynik operacji, ktory moze zostac zakonczona "pomysle" lub "niepomyslne"
    return new Promise((confFound, confNFound) => {
        try { // `try` - uzywane wtedy kiedy moze wystopic blad
            const config = require("../config/config"); // Importujemy Plik Configuracyjny 
            confFound(config); // Przesylamy Pliki dalej za pomoca zmiennej "conffFound", ktora moze sie tez nazywac "resolve"
        } catch { // Jezeli w tym przypadku nie znajdzie pliku "config.js", da nam o tym znac
            confNFound("Conifg File wasn't found!"); // Kod wywoluje sie kiedy nie znajdzie pliku "config.js"
        }
    });
};
