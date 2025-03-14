const readline = require('readline');
const axios = require('axios');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const data = fs.readFileSync('data.txt', 'utf8').split('\n');
const ACCESS_TOKEN = data[0].trim();
const WALLET = data[1].trim();

const API_URL = "https://1vpveb4uje.execute-api.us-east-2.amazonaws.com/loot/open/solana/";

const boxes = {
    "1": { name: "FARMER", slug: "monad-box1", qnt: 5, price: 5 },
    "2": { name: "SAFE", slug: "monad-box2", qnt: 1, price: 25 },
    "3": { name: "GMONAD", slug: "monad-box3", qnt: 5, price: 50 },
    "4": { name: "A HUNDRED", slug: "monad-box4", qnt: 5, price: 100 },
    "5": { name: "ONE SHOT", slug: "monad-box5", qnt: 5, price: 500 },
    "6": { name: "MON BOX", slug: "monad-mon-box", qnt: 5, price: 100 }
};

const openBox = async (box) => {
    console.log(`\nMemulai proses ${box.name}...`);
    let counter = 0;
    while (true) {
        counter++;
        console.log(`Membuka Box ke-${counter} Nama Box ${box.name}...`);
        try {
            const response = await axios.post(API_URL + box.slug, {
                network: "solana",
                slug: box.slug,
                access_token: ACCESS_TOKEN,
                wallet: WALLET,
                qnt: box.qnt,
                price: box.price
            }, {
                headers: { Authorization: `Bearer ${ACCESS_TOKEN}` }
            });
            console.log(`Sukses Membuka Box ke-${counter} Nama Box ${box.name}...`);
        } catch (error) {
            console.error("Error membuka box:", error.response?.data || error.message);
        }
        await new Promise(resolve => setTimeout(resolve, 1000)); // Delay 2 detik
    }
};

console.log("Silahkan pilih box yang ingin dibuka:");
Object.keys(boxes).forEach(key => console.log(`${key}. ${boxes[key].name}`));

rl.question("Input Number: ", async (number) => {
    if (boxes[number]) {
        await openBox(boxes[number]);
    } else {
        console.log("Pilihan tidak valid. Silakan coba lagi.");
        rl.close();
    }
});