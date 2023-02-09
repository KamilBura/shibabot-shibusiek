const { Message } = require("discord.js");
const { Structure } = require("erela.js");
const Client = require("../structures/ShibaBot");

// Rozrzerzamy Structure z Biblioteki "erela.js", rozrzerzamy "Player"
Structure.extend(
    "Player",
    (Player) => class extends Player {
        constructor(...props) {
            super(...props)
            // Ustawiamy "24/7" na false
            this.twentyFourSeven = false;
        }
        
        // Sprawdzanie czy "pausedMessage" jest zdefinowana i czy nie zostala usunieta. 
        ResumeMessage(client, message) {

        }

        // Sprawdzanie czy "resumeMessage" jest zdefinowana i czy nie zostala usunieta
        PausedMessage(client, message) {

        }

        // Sprawdzanie czy "NowPlayingMessage" jest zdefiniowana i czy nie zostala usunieta.
        NowPlayingMessage(client, message) {

        }

        // !WILL BE DONE LATER!


    }
)