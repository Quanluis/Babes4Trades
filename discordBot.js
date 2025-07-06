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

discordClient.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content.trim().toLowerCase() === "!botassign") {
    const member = await message.guild.members.fetch(message.author.id);
    const role = message.guild.roles.cache.find(r => r.name === "💎 Premium Member");
    if (role) {
      await member.roles.add(role);
      message.reply("✅ Premium role assigned.");
    } else {
      message.reply("❌ Role not found.");
    }
  }

  if (message.content.trim().toLowerCase() === "!botremove") {
    const member = await message.guild.members.fetch({ user: message.author.id, force: true });
    const role = message.guild.roles.cache.find(r => r.name === "💎 Premium Member");
    if (role && member.roles.cache.has(role.id)) {
      await member.roles.remove(role);
      message.reply("🛑 Premium role removed.");
    } else {
      message.reply("⚠️ You don't have that role or it's missing.");
    }
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
};

async function removePremiumRole(discordId) {
  try {
    console.log("🔧 Starting role removal for Discord ID:", discordId);

    const guild = await discordClient.guilds.fetch(process.env.DISCORD_GUILD_ID);

    // Force fresh fetch of member (avoid relying on cache)
    const member = await guild.members.fetch({ user: discordId, force: true });

    // Re-fetch roles too
    await guild.roles.fetch(); 
    await member.fetch(true); // force latest member data

    console.log("👤 Fetched member:", member.user.tag);

    const role = guild.roles.cache.find((r) => r.name === "💎 Premium Member");
    console.log("🎯 Role found:", role?.name || "Not found");

    if (!role) {
      console.log("⚠️ Role not found in guild.");
      return;
    }

    if (!member.roles.cache.has(role.id)) {
      console.log(`ℹ️ Member does not currently have the role: ${role.name}`);
      return;
    }

    await member.roles.remove(role);
    console.log(`🛑 Removed Premium role from: ${member.user.tag}`);
  } catch (error) {
    console.error("❌ Error in removePremiumRole:", error);
  }
}


// async function removePremiumRole(discordId) {
//   try {
//     console.log("🔧 Starting role removal for Discord ID:", discordId);

//     const guild = await discordClient.guilds.fetch(process.env.DISCORD_GUILD_ID);
//     await guild.roles.fetch(); // Ensure all roles are cached

//     // Force fetch latest member info
//     const member = await guild.members.fetch({ user: discordId, force: true });

//     console.log("👤 Fetched member:", member.user.tag);

//     const roleName = "💎 Premium Member";
//     const roleToRemove = guild.roles.cache.find((role) => role.name === roleName);

//     if (!roleToRemove) {
//       console.log(`⚠️ Role "${roleName}" not found in guild.`);
//       return;
//     }

//     if (!member.roles.cache.has(roleToRemove.id)) {
//       console.log(`ℹ️ ${member.user.tag} does not have the role "${roleName}".`);
//       return;
//     }

//     await member.roles.remove(roleToRemove);
//     console.log(`🛑 Successfully removed "${roleName}" from ${member.user.tag}.`);
//   } catch (error) {
//     console.error("❌ Error in removePremiumRole:", error);
//   }
// }


// Export for use in server.js
module.exports = { assignPremiumRole, removePremiumRole };

// Start the bot
discordClient.login(process.env.DISCORD_BOT_TOKEN);
