/**
 * 
 */

// Color Module
const colors = require('colors');

// Node.Js Modules
const { writeFileSync, readdirSync, unlinkSync, write } = require("fs");
const { Type } = require('js-yaml');
const { join } = require("path");
const { check } = require('prettier');

// Skrocone opcje poprzez przypisanie do zmiennych
const DataBDir = join(__dirname, "..", "Database");
const DataBPath = join(DataBDir, "Database.json");
const DataBListPath = join(DataBDir, "DatabaseList.json");

// Sciezki Plikow zapisanne w zmiennej
const DataBList = [];
const DataBMap = new Map (
    [
        ["global", {
            path: DataBDir, data: {}
        }]
    ]
);
/**
 * Sprawdza poprawnosc sciezki do bazy danych
 * @param {string} path 
 */
const checkDataBPath = (path) => {
    if (typeof path !== "string") throw TypeError("'path' isn't string");
    if (!path.endsWith(".json")) throw TypeError("'path' doesn't point to json file");
};

/**
 * Zapisuje dane do pliku
 * @param {string} path - sciezka do pliku
 * @param {object} data - Dane do zapisania
 * @returns {boolean} - Informacja czy operacja zapisu sie powiodla
 */
const _write = (path, data) => {
    checkDataBPath(path);
    try {
        writeFileSync(path, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error(`${"[DB]".yellow} Can't wrtie to '${path}', data is lost`);
        return false;
    }
};

/**
 * Usuwa Plik
 * @param {string} path - Sciezka do pliku do usuniecia
 * @returns {boolean} - Informacja czy operacja usuniecia sie powiodla
 */
const _delete = (path) => {
    checkDataBPath(path);
    try {
        unlinkSync(path);
        return true;
    } catch (error) {
        console.error(`${"[DB]".yellow} Can't delete '${path}'`);
        return false;
    }
};

const writeQueue = [];
const dataQueue = [];

//! Glowna petla programu obslugujaca kolejke zapisu i usuwania
const run = async () => {
    while (true) {
        await new Promise((resolve, reject) => setTimeout(resolve, 100));

        while (writeQueue.length) {
            const w = writeQueue.shift();
            if (!w) continue;
            _write(w.path, w.data);
        }

        while (dataQueue.length) {
            const d = dataQueue.shift();
            if (!d?.length) continue;
            _delete(d);
        }
    }
};

run();

/**
 * Dodaje wpis do listy baz danych
 * @param {string} name - Nazwa bazy danych
 * @param {string} path - Sciezka do pliku bazy danych
 */
const addDataBList = (name, path) => {
    if (!name?.length) throw new TypeError("'name' is undefined");
    checkDataBPath(path);
    DataBList.push({ name, path });
    writeQueue.push({ path: DataBListPath, data: DataBList });
};

/**
 * Usuwa wpis z listy baz danych
 * @param {string} name - Nazwa bazy danych do usuniecia
 */
const removeDataBList = (name) => {
    if (!name?.length) throw new TypeError("'name' is undefined");

    DataBList.forEach((item, index) => {
        if (item.name === name) {
            DataBList.splice(index, 1);
        }
    });

    writeQueue.push({ path: DataBListPath, data: DataBList });
};

/**
 * Pobiera dane z bazy danych
 * @param {string} name - Nazwa bazy danych
 * @returns {object} - Pobrane dane
 */
const getDataB = (name) => {
    if (!name?.length) throw new TypeError("'name' is undefined");
    const d = DataBMap.get(name);
    if (!d) throw new TypeError(`No database was found with name ${name}`);
    return d.data;
};

/**
 * Tworzy nowa baze danych
 * @param {string} name - Nazwa nowej bazy danych
 * @param {string} path - Sciezka do pliku nazwy bazy danych
 * @param {object} IniData - Poczatkowe dane
 * @returns {boolean} - Informacja czy operacja utworzenia bazy danych sie powiodla
 */
const createDataB = (name, path, IniData = {}) => {
    if (!name?.length) throw new TypeError("'name' is undefined");
    checkDataBPath(path);
    if (typeof IniData !== "object") throw new TypeError("IniData is not object!");

    if (DataBMap.has(name)) throw new Error(`Database '${name}' already exists`);

    const p = {path, data: IniData };

    writeQueue.push(p);
    addDataBList(name, path);
    DataBMap(name, p);
    return true;
};

const setDataB = (name, data) => {
    if (!name?.length) throw new TypeError("'name' is undefined");
    if (!data) throw new TypeError("'data' is undefined");
    if (typeof data !== "object") throw new TypeError("'data' is not object!");

    const n = DataBMap(name);
    if (!n) throw new RangeError(`No database with the name ${name}`);

    n.data = data;
    writeQueue.push(n);
    return true;
};

const removeDataB = (name) => {
    if (!name?.length) throw new TypeError("'name' is undefined");

    const n = DataBMap(name);
    if (!n) throw new RangeError(`No database with name ${name}`);

    dataQueue.push(n.path);
    removeDataBList(name);
    DataBMap.delete(name);
    return true;
};

module.exports = {
    getDataB,
    setDataB,
    removeDataB,
    createDataB,
};







