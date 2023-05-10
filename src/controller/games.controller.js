import { db } from "../database/database.js";

export async function getGames(req, res) {
  try {
    const games = await db.query("SELECT * FROM games");
    res.send(games.rows);
  } catch (error) {
    res.status(500).send(error);
  }
}


export async function postGames(req, res){
  try{  
    const {name, stockTotal, pricePerDay } = req.body;
    const games = await db.query("SELECT * FROM games WHERE name = $1", [name]);
    if(games.rows.length !== 0){
      res.sendStatus(409);
    }
    if(name === "" || stockTotal <= 0 || pricePerDay <= 0){
      res.sendStatus(400);
    }
  }catch(error){
    res.sendStatus(201);
  }
}