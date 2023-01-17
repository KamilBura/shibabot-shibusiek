// Exportujemy modul do obiektu client
module.exports = async (client) => {
    // Tworzymy nowa obietnice, ktora przyjmuje jedna funkcje jako argument
    return new Promise((onConnection, noConnection) => {
        // Tworzymy petla ktora sprawdza wszystkie node znajdujace sie w obiekcie "manager", Petla trwa tak dlugo jak "a" jest mniejsze niz zmienna wezlow w obiekcie Manager.
        for (let a = 0; a < client.manager.nodes.size; a++) {
            // Tworzymy zmienna "node", ktora przypisuje aktualnie przetwarzane wezly z tablicy znajdujacej sie w obiekcie "manager"
            const node = client.manager.nodes.array()[a];
            // Opcja wykonywana jezeli "node" jest podlaczony
            if (node.connected) {
                onConnection(node); // rozwiazuje petle i zwraca polaczony wezel jako wartosc.
            }
        }
        noConnection(undefined);
    });
};