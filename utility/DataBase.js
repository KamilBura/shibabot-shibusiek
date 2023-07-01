/**
 * 
 */

// Color Module
const colors = require('colors');

// Node.Js Modules
const { writeFileSync, readdirSync, unlinkSync } = require("fs");
const Type = require('js-yaml/lib/type');
const { join } = require("path");

// Skrocanie opcji przez dopisywanie ich do zmiennej
const DataBName = "Database.json";
const DataBListName = "DataBaseList.json";
const DataBDir = join(__dirname, "/Database/..");

// Sciezki Plikow zapisanne w zmiennej
const DataBPath = join(DataBDirm, DataBName);
const DataBListPath = join(DataBDir, DataBListName);

// Ustawiamy zmienne zeby byly na samym poczatku na false
let CheckDataB = false;
let CheckDataBList = false;

//? Sprawdzamy czy Database.json i DataBaseList.json istnieja
try {
    const exist = readdirSync(DataBDir);
    CheckDataB = exist.includes(DataBName);
    CheckDataBList = exist.includes(DataBListName);
} catch (error) {
    console.warn(`${"[Database]".yellow} Databases haven't been found!`);
}

// Do zmiennej, ustawiamy Tablice pusta [] i importujemy jako Modul
const DataBList = CheckDataBList ? require(DataBListPath) || [] : [];

// Do zmiennej, ustawiamy Tablice dwuelementowa jak i pakujemy wszystko w Mape
const DataBMap = new Map([
    // "main" jest jako identyfikator dla bazy danych glownej
    ["main", {
        path: DataBPath,
        data: CheckDataB ? require(DataBPath) || {} : {}
    }],
]);

// Iterujemy po wszystkich elementach "DataBList" i importujemy dane z odpowiadajacych sciezek do pliku "DataBaseList.json"
for (const a of DataBList) {
    try {
        DataBMap.set(a.name, {path: a.path, data: require(a.path) || {} });
    } catch (error) {
        console.error(`${"[Database]".yellow} Can't load database "${a.name}" in "${a.path}"`);
    }
}

// Sprawdza czy path jest "string" i czy jest ".json"
const CheckDataBPath = (path) => {
    if (typeof path !== "string")
    throw TypeError("'path' isn't a string!");
    if (!path.endsWith(".json"))
    throw TypeError("'path' is not a .json file!");
}

const WritetoFile = (path, data) => {
    // Sprawdza path
    CheckDataBPath(path);
    try {
        // Zapisujemy z kolumny "data" do .json
        writeFileSync(path, JSON.stringify(data));
        // Przebiegnie pomysle, ustawia wartosc na true
        return true;
    } catch (error) {
        console.error(`${"[Database]".yellow} Can't write to "${path}"`);
        return false;
    }
}

const Delete = (path) => {
    // Sprawdza path
    CheckDataBPath(path)
    try {
        // synchronicznie usuwa path
        unlinkSync(path)
        // Przebiegnie pomysle, ustawia wartosc na true
        return true;
    } catch (error) {
        console.error(`${"[Database]".yellow} Can't delete "${path}"`);
        return false;
    }
}

// Zapisuje Kolejki Write & Delete
const wQ = [];
const dQ = [];

// Funckja "Run", Iteracja
const run = async () => {
    while (true) {
        await new promise((resolve) => setTimeout(resolve, 100));

        // Odczytuje elementy z wQ
        while (wQ.length) {
            // Usuwa Pierwszy element z tablicy i zwraca go jako winik
            const _read = wQ.shift();
            if (!_read) continue;
            WritetoFile(_read.path, _read.data);
        }

        // Odczytuje elementy z dQ
        while (dQ.length) {
            // To samo co w wQ
            const _read = dQ.shift();
            if (!_read) continue;
            Delete(_read);
        }
    }
}

// Wykonuje funkcje
run();
















