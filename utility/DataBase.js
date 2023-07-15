"use strict";

// Node.Js Modules
const colors = require("colors");
const path = require("path");
const fs = require("fs");

// Okreslenie sciezki do Database
const databaseDirectory = path.join(__dirname, "..", "Database");
const globalDatabasePath = path.join(databaseDirectory, "database.json");
const databaseListPath = path.join(databaseDirectory, "databaselist.json");

// Flagi informujace
let hasGlobalDatabase = false;
let hasDatabaselist = false;

// Sprawdzanie czy pliki Database istnieja "database.json" i "databaselist.json"
try {
    const fileList = fs.readFileSync(databaseDirectory);
    hasGlobalDatabase = fileList.includes("database.json");
    hasDatabaselist = fileList.includes("databaselist.json");
} catch (error) {
    console.warn(`${"[DB]".yellow} No global database exists`);
}

// Odczyt listy baz danych z pliku / utworzenie pustej listy
const databaseList = hasDatabaselist ? require(databaseListPath) || [] : [];

// Utworzenie nowej Mapy z danymi "path" i "data"
const databases = new Map([
    [
        "global", {
            path: globalDatabasePath,

            data: hasGlobalDatabase ? require(globalDatabasePath) || {} : {}
        }
    ],
]);

// Petla po bazach danych na liscie i dodanie ich do mapy
for (const item of databaseList) {
    try { databases.set(item.name, {
        path: item.path,
        data: require(item.path) || {}
    });
  } catch (error) {
    console.error("[DB]".yellow + "Can't load database '" + item.name + "' in '" + item.path + "'");
  }
}

/**
 * Sprawdza poprawnosc sciezki do bazy danych
 * @param {string} path 
 */
const validateDatabasePath = (path) => {
    if (typeof path !== "string") throw TypeError("'path' isn't string");
    if (!path.endsWith(".json")) throw TypeError("'path' does not point to JSON file");
};

/**
 * Zapisuje dane do pliku
 * @param {string} path - sciezka do pliku
 * @param {object} data - Dane do zapisania
 * @returns {boolean} - Informacja czy operacja zapisu sie powiodla
 */
const wrtieToDatabase = (path, data) => {
    validateDatabasePath(path);
    try {
        fs.writeFileSync(path, JSON.stringify(data));
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
const deleteDatabase = (path) => {
    validateDatabasePath(path);
    try {
        fs.unlinkSync(path);
        return true;
    } catch (error) {
        console.error(`${"[DB]".yellow} Can't delete '${path}'`);
        return false;
    }
};

// Kolejki zapisow i usuwan z bazy danych
const writeQueue = [];
const deleteQueue = [];

// Glowna petla programu obslugujaca kolejke zapisu i usuwania
const run = async () => {
    while (true) {
        await new Promise((resolve, reject) => setTimeout(resolve, 100));

        while (writeQueue.length) {
            // Pobranie pierwszego elementu z kolejki zapisow
            const item = writeQueue.shift();
            if (!item) continue;
            // Zapis danych do bazy danych
            wrtieToDatabase(item.path, item.data);
        }

        while (dataQueue.length) {
            // Pobranie pierwszego elementu z kolejki usuwan
            const path = dataQueue.shift();
            if (!path?.length) continue;
            // Usuniecie bazy danych
            deleteDatabase(path);
        }
    }
};

run();

/**
 * Dodaje wpis do listy baz danych
 * @param {string} name - Nazwa bazy danych
 * @param {string} path - Sciezka do pliku bazy danych
 */
const addToDatabaseList = (name, path) => {
    if (!name?.length) throw new TypeError("'name' is undefined");
    validateDatabasePath(path);
    databaseList.push({ name, path });
    writeQueue.push({ path: databaseListPath, data: databaseList });
};

/**
 * Usuwa wpis z listy baz danych
 * @param {string} name - Nazwa bazy danych do usuniecia
 */
const removeFromDatabaseList = (name) => {
    if (!name?.length) throw new TypeError("'name' is undefined");

    databaseList.forEach((item, index) => {
        if (item.name === name) {
            databaseList.splice(index, 1);
        }
    });
    writeQueue.push({ path: databaseListPath, data: databaseList });
};

/**
 * Pobiera dane z bazy danych
 * @param {string} name - Nazwa bazy danych
 * @returns {object} - Pobrane dane
 */
const getFromDatbase = (name) => {
    if (!name?.length) throw new TypeError("'name' is undefined");
    const database = databases.get(name);
    if (!database) throw new TypeError(`No database was found with name ${name}`);
    return database.data;
};

/**
 * Tworzy nowa baze danych
 * @param {string} name - Nazwa nowej bazy danych
 * @param {string} path - Sciezka do pliku nazwy bazy danych
 * @param {object} IniData - Poczatkowe dane
 * @returns {boolean} - Informacja czy operacja utworzenia bazy danych sie powiodla
 */
const createDatabase = (name, path, IniData = {}) => {
    if (!name?.length) throw new TypeError("'name' is undefined");
    validateDatabasePath(path);
    if (typeof IniData !== "object") throw new TypeError("IniData is not object!");

    for (const [existingName, database] of databases) {
        if (existingName === name) throw new Error("Database '" + name + "' already exists")
        if (database.path === path) {
            throw new Error("Database in path '" + path + "' already exists with name '" + existingName + "'");
        }
    }

    const database = {
        path: path,
        data: IniData,
    };

    // Dodanie zadania zapisu bazy danych do kolejki zapisow
    writeQueue.push(database);
    // Dodanie bazy danych do listy baz danych
    addToDatabaseList(name, path);
    // Dodanie bazy danych do mapy i zwrocenie flagi sukcesu
    return !!databases.set(name, database);
};

/**
 * Funcka ustawiajaca dane w bazie danych
 * @param {string} name - Nazwa bazy danych
 * @param {object} data - Dame do zapisania
 * @returns {boolean} - True, jesli ustawienia powiodlo sie; False w przeciwnym razie
 */
const setInDatabase = (name, data) => {
    if (!name?.length) throw new TypeError("'name' is undefined");
    if (!data) throw new TypeError("'data' is undefined");
    if (typeof data !== "object") throw new TypeError("'data' is not object!");

    const database = databases.get(name);
    if (!database) throw new RangeError(`No database with the name ${name}`);
    // Aktualizacja danych w bazie danych
    database.data = data;

    // Dodanie zadania zapisu bazy danych
    writeQueue.push(database);
    // Aktualizacja bazy danych w mapie
    return !!databases.set(name, database);
};

/**
 * Funkcja usuwajaca baze danych
 * @param {string} name - Nazwa bazy danych
 * @returns {boolean} 
 */
const removeFromDatabase = (name) => {
    if (!name?.length) throw new TypeError("'name' is undefined");

    const database = databases.get(name);
    if (!database) throw new RangeError(`No database with name ${name}`);

    deleteQueue.push(database.path);
    removeFromDatabaseList(name);
    return databases.delete(name);
};

/**
 * Guild DATABASE SECTION
 */

const guildDatabaseDirectory = join(__dirname, "..", "Database", ".guild_dbs");

try { fs.readdirSync(guildDatabaseDirectory);
} catch (error) {
    try {
        fs.mkdirSync(guildDatabaseDirectory);
    } catch (error) {
        console.error(`${"[ERROR]".red} + "Can't create guild database folder, module might not work properly."`);
    }
}

/**
 * Funkcja zwracajaca nazwe bazy danych gildii
 * @param {string} guild_id 
 * @returns {string} - Nazwa bazy danych gildii
 */
const getGuildDatabaseName = (guild_id) => {
    return "guild-" + guild_id;
};

/**
 * Funkcja zwracajaca sciezke do bazy danych gildii
 * @param {string} guild_id 
 * @returns {string}
 */
const getGuildDatabasePath = (guild_id) => {
    return join(guildDatabaseDirectory, getGuildDatabaseName(guild_id) + ".json");
};

/**
 * 
 * @param {string} guild_id 
 * @returns {object}
 */
const getOrCreateGuildDatabase = (guild_id) => {
    const databaseName = getGuildDatabaseName(guild_id);

    let database;
    try {
        // Sprawdzenie, czy baza danych gildii istnieje
        database = getFromDatbase(databaseName);
    } catch (error) {
        if (error.message.startsWith("No database with name ")) {
            // Tworzenie bazy danych gildii
            createDatabase(databaseName, getGuildDatabasePath(guild_id));
            database = {};
        } else {
            console.error("[ERROR] Unexpected error: ".red);
            console.error(error);
        }
    }
    // Zwrocenie bazy danych gildii
    return database;
};

/**
 * Funkcja usuwajaca baze danych gildii
 * @param {string} guild_id 
 * @returns {boolean}
 */
const deleteGuildDatabase = (guild_id) => {
    // Usuwanie bazy danych gildii
    return removeFromDatabase(getGuildDatabaseName(guild_id));
};

/**
 * Funkcja ustawiajaca flage "djOnly" dla bazy danych gildii
 * @param {string} guild_id - ID Gildii
 * @param {boolean} djOnly - Wartosc flagi "djOnly" 
 */
const setGuildDjOnly = (guild_id, djOnly) => {
    const database = getOrCreateGuildDatabase(guild_id);
    database.djOnly = djOnly;
    // Zapisanie danych w bazie danych gildii
    setInDatabase(getGuildDatabaseName(guild_id), database);
}

/**
 * Funkcja pobierajaca wartosc flagi "djOnly" dla bazy danych gildii
 * @param {string} guild_id 
 * @returns {boolean} - Wartosc flagi "djOnly"
 */
const getGuildDjOnly = (guild_id) => {
    return !!getOrCreateGuildDatabase(guild_id)?.djOnly;
}

module.exports = {
    get: getFromDatbase,
    set: setInDatabase,
    remove: removeFromDatabase,
    create: createDatabase,
    setGuildDjOnly,
    getGuildDjOnly,
    deleteGuildDatabase,
};







