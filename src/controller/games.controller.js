import { db } from "../database/database.js";

export async function getGames(req, res) {
  try {
    const games = await db.query("SELECT * FROM games");
    console.table(games.rows);
    res.status(200).send(games.rows);
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function postGames(req, res) {
  const { name, image, stockTotal, pricePerDay } = req.body;

  try {
    const gameExists = await db.query("SELECT * FROM games WHERE name = $1", [
      name,
    ]);
    if (gameExists.rows.length > 0) {
      return res.status(409).send("Esse jogo já existe!");
    }

    if (
      !name ||
      !stockTotal ||
      !pricePerDay ||
      stockTotal <= 0 ||
      pricePerDay <= 0
    ) {
      return res.status(400).send("Dados inválidos!");
    }

    const game = await db.query(
      'INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4) RETURNING *',
      [name, image, stockTotal, pricePerDay]
    );

    if (game.rowCount > 0) {
      console.table(game.rows);
      return res.status(201).send(game.rows[0]);
    } else {
      return res.status(500).send("Falha ao salvar o jogo no banco de dados.");
    }
  } catch (error) {
    return res.status(500).send(error);
  }
}
