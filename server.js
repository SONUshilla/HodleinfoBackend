import express from "express";
import axios from "axios";
import pkg from 'pg';
const { Client } = pkg;
let localdata=[];
let Database=false;
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
    Database=false;
    console.log("Connected to the database successfully");
} catch (err) {
    console.error("Error connecting to the database:", err.stack);
} 
const app=express();


    try{
    const response=await axios.get("https://api.wazirx.com/api/v2/tickers");

    const dataArray = Object.values(response.data);
    let i;
    for(i=0;i<10;i++)
    {   if(Database)
    {
            /*await db.query("delete from crypto");*/
            await db.query(`insert into crypto (name,last,buy,sell,volume,base_unit) Values ($1,$2,$3,$4,$5,$6)`,[dataArray[i].name,dataArray[i].last,dataArray[i].buy,dataArray[i].sell,dataArray[i].volume,dataArray[i].base_unit]);
            console.log("data added successfully");}
             const data={name:dataArray[i].name,
            last:dataArray[i].last,
            buy: dataArray[i].buy
            ,sell:dataArray[i].sell
            ,volume:dataArray[i].volume
            ,base_unit:dataArray[i].base_unit}
            localdata.push(data);
        }
        console.log(localdata);
    }
    catch(error)
    {   res.sendStatus(500);
        console.log(error);
    }

app.get("/getdata", async (req,res)=>{
if(Database){
    const response = await db.query("select * from crypto");
    res.send(response);
}
else{
    res.status(200).json({ rows: localdata });
    console.log(localdata);
}
});
app.listen(5000,()=>{console.log("server running on port 5000");})