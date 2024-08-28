import express from "express";
import axios from "axios";
import pkg from 'pg';

const { Client } = pkg;
let localdata = [];
let Database = false;

const db = new Client({
    user: "postgres",
    database: "Crypto",
    port: 5432,
    host: "localhost",
    password: "Sonu@123"
});

async function init() {
    try {
        // Establish connection
        await db.connect();
        Database = true;
        console.log("Connected to the database successfully");
    } catch (err) {
        console.error("Error connecting to the database:", err.stack);
    }

    try {
        const response = await axios.get("https://api.wazirx.com/api/v2/tickers");
        const dataArray = Object.values(response.data);

        for (let i = 0; i < 10; i++) {
            if (Database) {
                await db.query("DELETE FROM crypto");
                await db.query(
                    `INSERT INTO crypto (name, last, buy, sell, volume, base_unit) VALUES ($1, $2, $3, $4, $5, $6)`,
                    [dataArray[i].name, dataArray[i].last, dataArray[i].buy, dataArray[i].sell, dataArray[i].volume, dataArray[i].base_unit]
                );
                console.log("Data added successfully");
            } else {
                const data = {
                    name: dataArray[i].name,
                    last: dataArray[i].last,
                    buy: dataArray[i].buy,
                    sell: dataArray[i].sell,
                    volume: dataArray[i].volume,
                    base_unit: dataArray[i].base_unit
                };
                localdata.push(data);
            }
        }
    } catch (error) {
        console.error("Error fetching data from the API:", error.message);
    }
}

const app = express();

app.get("/getdata", async (req, res) => {
    if (Database) {
        try {
            const response = await db.query("SELECT * FROM crypto");
            res.status(200).json({ rows: response.rows });
        } catch (error) {
            console.error("Error querying the database:", error.message);
            res.status(500).send("Error querying the database");
        }
    } else {
        res.status(200).json({ rows: localdata });
        console.log(localdata);
    }
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
    init(); // Initialize database and fetch data
});
