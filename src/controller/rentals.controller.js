import { db } from "../database/database.connection.js";

export async function getRentals(req, res) {
  try {
    const rentals = await db.query(`
      SELECT rentals.id, rentals."customerId", rentals."gameId", rentals."rentDate", rentals."daysRented", rentals."returnDate", rentals."originalPrice", rentals."delayFee", 
             customers.id AS "customer.id", customers.name AS "customer.name",
             games.id AS "game.id", games.name AS "game.name"
      FROM rentals
      JOIN customers ON rentals."customerId" = customers.id
      JOIN games ON rentals."gameId" = games.id
      ORDER BY rentals.id ASC
    `);

    const formattedRentals = rentals.rows.map((rental) => {
      const formattedRental = {
        id: rental.id,
        customerId: rental.customerId,
        gameId: rental.gameId,
        rentDate: rental.rentDate.toISOString().split("T")[0],
        daysRented: rental.daysRented,
        returnDate: rental.returnDate
          ? rental.returnDate.toISOString().split("T")[0]
          : null,
        originalPrice: rental.originalPrice,
        delayFee: rental.delayFee,
      };

      if (rental["customer.id"] !== null && rental["customer.name"] !== null) {
        formattedRental.customer = {
          id: rental["customer.id"],
          name: rental["customer.name"],
        };
      }

      if (rental["game.id"] !== null && rental["game.name"] !== null) {
        formattedRental.game = {
          id: rental["game.id"],
          name: rental["game.name"],
        };
      }

      return formattedRental;
    });

    console.table(formattedRentals);
    res.status(200).send(formattedRentals);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro interno do servidor.");
  }
}

export async function postRentals(req, res) {
  const { customerId, gameId, daysRented } = req.body;

  try {
    if (!customerId || !gameId || !daysRented) {
      return res.status(400).send("Dados inválidos!");
    }

    const customerExists = await db.query(
      `SELECT * FROM customers WHERE id='${customerId}'`
    );

    if (customerExists.rows.length === 0) {
      return res.status(400).send("Cliente não encontrado!");
    }

    const gameExists = await db.query(
      `SELECT * FROM games WHERE id='${gameId}'`
    );

    if (gameExists.rows.length === 0) {
      return res.status(400).send("Jogo não encontrado!");
    }

    if (daysRented <= 0) {
      return res.status(400).send("Dias inválidos!");
    }

    const gameStock = await db.query(
      `SELECT * FROM rentals WHERE "gameId"='${gameId}' AND "returnDate" IS NULL`
    );

    if (gameStock.rows.length >= gameExists.rows[0].stockTotal) {
      return res.status(400).send("Jogo indisponível!");
    }

    const originalPrice = daysRented * gameExists.rows[0].pricePerDay;

    if (originalPrice < 0) {
      return res.status(400).send("Valor inválido!");
    }

    const rentDate = new Date().toISOString().split("T")[0];

    if (!rentDate) {
      return res.status(400).send("Data inválida!");
    }

    const insertRental = await db.query(
      `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
      VALUES ('${customerId}', '${gameId}', '${rentDate}', ${daysRented}, NULL, ${originalPrice}, NULL)`
    );

    res.status(201).send();
  } catch (error) {
    return res.status(500).send("Erro interno do servidor.");
  }
}

export async function postReturns(req, res) {
  const { id } = req.params;

  try {
    const rentalExists = await db.query(
      `SELECT * FROM rentals WHERE id='${id}'`
    );
    if (rentalExists.rows.length === 0) {
      return res.status(404).send("Aluguel não encontrado!");
    }

    if (rentalExists.rows[0].returnDate) {
      return res.status(400).send("Aluguel já finalizado!");
    }

    const returnDate = new Date().toISOString().split("T")[0];
    const rentDate = rentalExists.rows[0].rentDate.toISOString().split("T")[0];
    const daysRented = rentalExists.rows[0].daysRented;
    const pricePerDay = rentalExists.rows[0].originalPrice;

    const rentDateObj = new Date(rentDate);
    const returnDateObj = new Date(returnDate);
    const delayInMilliseconds = returnDateObj - rentDateObj;
    const delayInDays = Math.floor(delayInMilliseconds / (1000 * 60 * 60 * 24));
    const delayFee =
      delayInDays > 0 ? delayInDays * pricePerDay * daysRented : 0;

    await db.query(
      `UPDATE rentals SET "returnDate"='${returnDate}', "delayFee"=${delayFee} WHERE id='${id}'`
    );

    res.status(200).send();
  } catch (error) {
    console.error(error);
    return res.status(500).send("Erro interno do servidor.");
  }
}

export async function deleteRentals(req, res) {
  const { id } = req.params;

  try {
    const rentalExists = await db.query(
      `SELECT * FROM rentals WHERE id='${id}'`
    );
    if (rentalExists.rows.length === 0) {
      return res.status(404).send("Aluguel não encontrado!");
    }

    if (rentalExists.rows[0].returnDate) {
      return res.status(400).send("Aluguel já finalizado!");
    }

    await db.query(`DELETE FROM rentals WHERE id='${id}'`);

    return res.status(200).send();
  } catch (error) {
    return res.status(500).send("Erro interno do servidor.");
  }
}
