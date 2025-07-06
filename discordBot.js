const { Client, GatewayIntentBits } = require("discord.js");
const dotenv = require("dotenv");
dotenv.config();

// Initialize Discord client
const discordClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// When the bot is ready
discordClient.once("ready", () => {
  console.log(`🤖 Bot is online as ${discordClient.user.tag}`);
});

// Optional command handler: listens for "!connect"
discordClient.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content.trim().toLowerCase() === "!connect") {
    const userId = message.author.id;
    await message.reply(
      `✅ Got your Discord ID! Please log in at http://localhost:5000 to finish linking.\nYour ID: \`${userId}\``
    );
  }
});

// ✅ Function to assign "Premium" role
async function assignPremiumRole(discordId) {
  try {
    const guild = await discordClient.guilds.fetch(process.env.DISCORD_GUILD_ID);
    const member = await guild.members.fetch(discordId);
    await guild.roles.fetch(); // Load all roles into cache
    const role = guild.roles.cache.find((r) => r.name === "💎 Premium Member");

    if (!role) {
      console.error("❌ Premium role not found.");
      return;
    }

    await member.roles.add(role);
    console.log(`✅ Premium role assigned to ${member.user.tag}`);
  } catch (err) {
    console.error("❌ Error assigning premium role:", err);
  }
}

// Export for use in server.js
module.exports = { assignPremiumRole };

// Start the bot
discordClient.login(process.env.DISCORD_BOT_TOKEN);
