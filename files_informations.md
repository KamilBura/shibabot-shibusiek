ShibaBot-Shibusiek/

├── **class** // Main folder with class extends
⅂──── *ShibaBot.js* // Bot main file

├── **code_explaining** // In this file you can find examples to the code i used. Its explainded in Polish but i will make it in English in some time.

├── **commands** // Main commands directory file, where all the commands find place, like. play, stop, resume, etc.
⅂──── **slash** // There will be all slash commands.

├── **components** // Folder with stored Buttons/select function
⅂──── **button** // Button functions
⅂──── **select** // Select menus function

├── **config** // Config folder for .gitingore to not suddenly post the config file again :P
⅂──── *config.js* // Config file for the Bot like. (token, clientID, SecretID, and couple of settings)

├── **events** // Events folder, where all main events take place.
⅂──── **Client** // All events that takes client prorities, example ready.js
⅂────── *ready.js* // Noticing on the console when the bot logged successfully
⅂──── **Guild** // All events working for multiple servers (using GuildID for example)
⅂────── *interactionCreate.js* // checking the context of the interaction
⅂────── *messageCreate.js* // Creating message on mention
⅂────── *raw.js* // updatingVoiceStates (Needed for Lavalink!)

├── **handlers** // All the handlers like loading commands/events etc.
⅂──── *commands.js* // Loading commands
⅂──── *components.js* // Loading Buttons/select menus
⅂──── *deploy.js* // Reloading Commands, and loading them to the map
⅂──── *events.js* // Loading Events
⅂──── *mongoose.js* // Loading Database

├── **images** // There will be all images used in this project.

├── **log** // All commands log are stored with actual date

├── **module**  // Additional Modules like custom CommandLog
⅂──── *CommandLog.js* // Custom Command log using winston

├── **schemas** // MongoDB additional Database export and import
⅂──── *GuildSchema.js* // import Guild (GuildID) to the database

├── *.gitignore* //Ignore some couple of Important Files
├── *files_informations.md* //Information file which you already see yourself 👀
├── *index.js* //Redirection script with redirect "npm start", to run the structure file with you can find in **class** file.
├── *LICENSE.md* //License to this code, for the moment being it is AGPL-3.0
├── *package.json* //Package file, where you can find common information about the Project, but also all Dependency used in this Project.
├── *README.md* //Readme file which will be edited later (●'◡'●)