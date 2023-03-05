const { Message } = require("discord.js");
const { Structure } = require("erela.js");
const Client = require("../structures/ShibaBot");

//? Rozrzerzamy Structure z Biblioteki "erela.js", rozrzerzamy "Player"
Structure.extend(
    "Player",
    (Player) => class extends Player {
        constructor(...props) {
            super(...props)
            //! Ustawiamy "24/7" na false
            this.twentyFourSeven = false;
        }
        
        //? Sprawdzanie czy "pausedMessage" jest zdefinowana i czy nie zostala usunieta. 
        FuncResumeMessage(client, message) {
            //? Jezeli "pausedMessage" 'i' nie jest oznaczona jako usunieta 
            if (this.pausedMessage && !client.isMessageDeleted(this.pausedMessage)) {
                //? Usuwamy wiadomosc "pausedMessage"
                this.pausedMessage.delete();
                //? Zaznaczami Wiadomosc jako usunieta za pomoca "markMessageAsDeleted" z discord.js
                client.markMessageAsDeleted(this.pausedMessage);
                
            }
            //? Zwracamy wiadomosc i przypisujemy ja do "resumeMessage"
            return (this.resumeMessage = message);

        }

        //? Sprawdzanie czy "resumeMessage" jest zdefinowana i czy nie zostala usunieta
        FuncPausedMessage(client, message) {
            if (this.resumeMessage && !client.isMessageDeleted(this.resumeMessage)) {
                this.resumeMessage.delete();
                client.markMessageAsDeleted(this.resumeMessage);
                
            }
            return (this.pausedMessage = message);

        }

        //? Sprawdzanie czy "NowPlayingMessage" jest zdefiniowana i czy nie zostala usunieta.
        FuncNowPlayingMessage(client, message) {
            if (this.nowPlayingMessage && !client.isMessageDeleted(this.nowPlayingMessage)) {
                this.nowPlayingMessage.delete();
                client.markMessageAsDeleted(this.nowPlayingMessage);

            }
            return (this.nowPlayingMessage = message);

        }



    },
);