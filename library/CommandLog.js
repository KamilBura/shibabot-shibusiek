// Importujemy biliboteke "colors", zeby moc dodawac Kolory do Outpotow z konsoli
const colors = require("colors");
// "winston" - Biblioteka do Loggowania do konsoli
const winston = require("winston");
const config = require("../config");

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
        // Zapisuje "new Date()" do zmiennej "Calendar", zeby nie musiec za kazdym razem pisac "new Date()"
        let Calendar = new Date();
        const hours = Calendar.getHours().toString().padStart(2, '0');
        const minutes = Calendar.getMinutes().toString().padStart(2, '0');
        const seconds = Calendar.getSeconds().toString().padStart(2, '0');
        this.CommandLog.log({
            time: `${ Calendar.getDate() }:${ Calendar.getMonth() }:${ Calendar.getFullYear() } - ${ hours }:${ minutes }:${ seconds }`,
            level: "info",
            message: "[Info] " + InputText,
        });
        console.log(
            colors.gray(
                `[${ Calendar.getDate() }:${ Calendar.getMonth() }:${ Calendar.getFullYear() } - ${ hours }:${ minutes }:${ seconds }]`,
            ) + colors.yellow(config.consolePrefix ) + colors.green(InputText),
        );

    }

    warn(InputText) {
        // Zapisuje "new Date()" do zmiennej "Calendar", zeby nie musiec za kazdym razem pisac "new Date()"
        let Calendar = new Date();
        const hours = Calendar.getHours().toString().padStart(2, '0');
        const minutes = Calendar.getMinutes().toString().padStart(2, '0');
        const seconds = Calendar.getSeconds().toString().padStart(2, '0');
        this.CommandLog.log({
            time: `${ Calendar.getDate() }:${ Calendar.getMonth() }:${ Calendar.getFullYear() } - ${ hours }:${ minutes }:${ seconds }`,
            level: "warn",
            message: "[Warning] " + InputText,
        });
        console.log(
            colors.gray(
                `[${ Calendar.getDate() }:${ Calendar.getMonth() }:${ Calendar.getFullYear() } - ${ hours }:${ minutes }:${ seconds }]`,
            ) + colors.yellow(config.consolePrefix ) + colors.yellow(InputText),
        );
    }

    error(InputText) {
        // Zapisuje "new Date()" do zmiennej "Calendar", zeby nie musiec za kazdym razem pisac "new Date()"
        let Calendar = new Date();
        const hours = Calendar.getHours().toString().padStart(2, '0');
        const minutes = Calendar.getMinutes().toString().padStart(2, '0');
        const seconds = Calendar.getSeconds().toString().padStart(2, '0');
        this.CommandLog.log({
            time: `${ Calendar.getDate() }:${ Calendar.getMonth() }:${ Calendar.getFullYear() } - ${ hours }:${ minutes }:${ seconds }`,
            level: "warn",
            message: "[Warning] " + InputText,
        });
        console.log(
            colors.gray(
                `[${ Calendar.getDate() }:${ Calendar.getMonth() }:${ Calendar.getFullYear() } - ${ hours }:${ minutes }:${ seconds }]`,
            ) + colors.yellow(config.consolePrefix ) + colors.red(InputText),
        );
    }

}

module.exports = CommandLog;