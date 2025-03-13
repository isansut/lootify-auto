const axios = require("axios");
const fs = require("fs");
const path = require("path");

const API_URL = "https://1vpveb4uje.execute-api.us-east-2.amazonaws.com/loot/open/solana/monad-box1";
const walletAddress = "0x7DE2fafd0B8D9888efbE2e3CE5A9925869164472";
const tokenPath = path.join(__dirname, "token.txt");

function getToken() {
    try {
        const token = fs.readFileSync(tokenPath, "utf8").trim();
        if (!token) throw new Error("JWT Token is empty!");
        return token;
    } catch (error) {
        console.error("[❌] Error reading token:", error.message);
        process.exit(1);
    }
}

async function openLootBox(quantity = 5, price = 5) {
    const accessToken = getToken();

    try {
        const response = await axios.post(
            API_URL,
            {
                network: "solana",
                slug: "monad-box1",
                access_token: accessToken,
                wallet: walletAddress,
                qnt: quantity,
                price: price,
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log(`[✅] Loot Box Opened: ${response.data?.message || "Success!"}`);
    } catch (error) {
        console.error(`[❌] Error: ${error.response?.data?.msg || error.message}`);
    }
}

async function autoLoot(times = 99999999999999999999) {
    console.log(`\n🚀 Starting Auto Loot (${times} times)...\n`);

    for (let i = 0; i < times; i++) {
        console.log(`[🔄] Opening loot box #${i + 1}...`);
        await openLootBox();
        await new Promise((resolve) => setTimeout(resolve, 200));
    }

    console.log("\n✅ Auto Loot Completed!\n");
}

// Jalankan auto loot
autoLoot();
