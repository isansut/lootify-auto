const axios = require("axios");
const fs = require("fs");
const path = require("path");

const API_URL = "https://1vpveb4uje.execute-api.us-east-2.amazonaws.com/loot/open/solana/monad-box1";
const dataPath = path.join(__dirname, "data.txt");

function getData() {
    try {
        const data = fs.readFileSync(dataPath, "utf8").trim().split("\n").map(line => line.trim());
        if (data.length < 2) throw new Error("File data.txt harus berisi minimal 2 baris (token dan address)");
        
        const accessToken = data[0];  
        const walletAddress = data[1]; 

        if (!accessToken || !walletAddress) throw new Error("Token atau address kosong!");
        
        return { accessToken, walletAddress };
    } catch (error) {
        console.error("[❌] Error membaca data.txt:", error.message);
        process.exit(1);
    }
}

async function openLootBox(quantity = 5, price = 5) {
    const { accessToken, walletAddress } = getData();

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


autoLoot();
