import express from "express";
import axios from "axios";
import pkg from 'pg';
const { Client } = pkg;
const db = new Client({
    user: "postgres", // Corrected key name from 'username' to 'user'
    database: "Crypto",
    port: 5432, // Port should be an integer, not a string
    host: "localhost",
    password: "Sonu@123"
});

try {
    // Establish connection
    db.connect();
    console.log("Connected to the database successfully");
} catch (err) {
    console.error("Error connecting to the database:", err.stack);
} 
const app=express();
app.get("/",async (req,res)=>{
    try{
    const response=await axios.get("https://api.wazirx.com/api/v2/tickers");
    
    const dataArray = Object.values(response.data);
    let i;
    for(i=0;i<10;i++)
    {
            /*await db.query("delete from crypto");*/
            await db.query(`insert into crypto (name,last,buy,sell,volume,base_unit) Values ($1,$2,$3,$4,$5,$6)`,[dataArray[i].name,dataArray[i].last,dataArray[i].buy,dataArray[i].sell,dataArray[i].volume,dataArray[i].base_unit]);
            console.log("data added successfully");
        }
    res.sendStatus(200);
    }
    catch(error)
    {   res.sendStatus(500);
        console.log(error);
    }
});
app.get("/getdata", async (req,res)=>{

    const response = await db.query("select * from crypto");
    console.log(response.rows);
    res.send(response);

});
app.listen(5000,()=>{console.log("server running on port 5000");})