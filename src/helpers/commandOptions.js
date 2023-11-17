/**
 * @typedef {Object} CommandOption
 * @property {string} name - The name of the option
 * @property {string} description - A short description of the option
 * @property {number} type - The type of the option
 * @property {boolean} required - Whether the option is required or not
 */

/**
 * @typedef {Object} CommandData
 * @property {string} name - The name of the command (must be lowercase)
 * @property {string} description - A short description of the command
 * @property {number} type - The type of application command
 * @property {boolean} enabled - Whether the slash command is enabled or not
 * @property {boolean} ephemeral - Whether the reply should be ephemeral
 * @property {boolean} options - Whether the command has options or not
 * @property {CommandOption[]} [commandOptions] - The options for the command (if any)
 * @property {import('discord.js').PermissionResolvable[]} [userPermissions] - Permissions required by the user to use the command.
 * @property {number} cooldown - Command cooldown in seconds
 * @property {function(import('discord.js').CommandInteraction)} run - The callback to be executed when the command is invoked
 */

/** 
 * @type {CommandData} data - The command information
 */
module.exports = {
    data: {
        name: "",
        description: "",
        type: "",
        enabled: false,
        ephemeral: false,
        options: true,
        commandOptions: [
          {
            name: "",
            description: "",
            type: 3, // Example: STRING type
            required: true,
          },
          // Add more options as needed
        ],
        userPermissions: [],
        cooldown: 0,
        execute: async (interaction) => {
          // Your command execution logic here
        },
    }
  };
  