// Importujemy biliboteke "colors", zeby moc dodawac Kolory do Outpotow z konsoli
const colors = require("colors");
// "winston" - Biblioteka do Loggowania do konsoli
const winston = require("winston");
const config = require("../config");

// Zapisuje "new Date()" do zmiennej "Calendar", zeby nie musiec za kazdym razem pisac "new Date()"
let Calendar = new Date();
// Przypisujemy Klasy "hours" i "minutes" i "seconds" = getHours,Minutes,Seconds / `padStart` oznacza ze jak Liczba jest <10 to dodawane jest "0" na poczatku.
const hours = Calendar.getHours().toString().padStart(2, '0');
const minutes = Calendar.getMinutes().toString().padStart(2, '0');
const seconds = Calendar.getSeconds().toString().padStart(2, '0');
// To samo robimy z Data
const day = Calendar.getDate().toString().padStart(2, '0');
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dev"];

const month = Calendar.getMonth();


// Tworzymy nowa Klasse "CommandLog", ktory potem w Pliku "ShibaBot" bedzie sluzyc do zapisywania wiadomosci w pliku i wyswietlania ich w konsoli
class CommandLog {
    // tworzymy "consturctor" do constructora transportujemy klase "file" z biblioteki "winston"
    constructor(file) {
        // Tworzymy zmienna o nazwie "CommandLog"
        this.CommandLog = winston.createLogger({
            // "transports" - Wlasciwosc ta okresla sposob zapisywania wiadomosci.
            transports: [new winston.transports.File({ filename: file })],
        });

    }
    

    log(InputText) {
        /**
         * Wywolujemy Funkcje z wlasciwoscia "log" i przekazujemy tablice obiektow "time" - Czas,data / "level" - Poziom informacji (jak wazna jest ta wiadomosc)
         * "message" - Glowna wiadomosc przesylana przez console.log()
         */
        this.CommandLog.log({
            time: `${ day } ${ months[month] } ${ Calendar.getFullYear() } - ${ hours }:${ minutes }:${ seconds }`,
            level: "info",
            message: "[Info] " + InputText,
        });
        console.log(
            colors.gray(
                `[${ day } ${ months[month] } ${ Calendar.getFullYear() } - ${ hours }:${ minutes }:${ seconds }]`,
            ) + colors.yellow(config.consolePrefix) + " " + colors.green("[Info] ") + colors.green(InputText),
        );

    }

    warn(InputText) {
        this.CommandLog.log({
            time: `${ day } ${ months[month] } ${ Calendar.getFullYear() } - ${ hours }:${ minutes }:${ seconds }`,
            level: "warn",
            message: "[Warning] " + InputText,
        });
        console.log(
            colors.gray(
                `[${ day } ${ months[month] } ${ Calendar.getFullYear() } - ${ hours }:${ minutes }:${ seconds }]`,
            ) + colors.yellow(config.consolePrefix) + " " + colors.yellow("[Warning] ") + colors.yellow(InputText),
        );
    }

    error(InputText) {
        this.CommandLog.log({
            time: `${ day } ${ months[month] } ${ Calendar.getFullYear() } - ${ hours }:${ minutes }:${ seconds }`,
            level: "warn",
            message: "[Warning] " + InputText,
        });
        console.log(
            colors.gray(
                `[${ day } ${ months[month] } ${ Calendar.getFullYear() } - ${ hours }:${ minutes }:${ seconds }]`,
            ) + colors.yellow(config.consolePrefix) + " " + colors.red("[Error] ") + colors.red(InputText),
        );
    }

}

module.exports = CommandLog;