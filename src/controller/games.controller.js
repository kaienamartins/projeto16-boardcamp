import { db } from "../database/database.js";

export async function getGames(req, res) {
  try {
    const games = await db.query("SELECT * FROM games");
    res.send(games.rows);
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function postGames(req, res) {
  const { name, image, stockTotal, pricePerDay } = req.body;

  try {
    const games = await db.query("SELECT * FROM games WHERE name = $1", [name]);
    if (games.rows.length > 0) {
      res.status(409).send("Esse jogo já existe!");
    }

    if (
      !name ||
      !stockTotal ||
      !pricePerDay ||
      stockTotal <= 0 ||
      pricePerDay <= 0
    ) {
      res.status(400).send("Dados inválidos!");
    }

    const game = await db.query(
      'INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4)',
      [name, image, stockTotal, pricePerDay]
    );
    console.table(game.rows);

    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error);
  }
}
