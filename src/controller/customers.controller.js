import { db } from "../database/database.connection.js";

export async function getCustomers(req, res) {
  try {
    const customers = await db.query("SELECT * FROM customers");
    console.table(customers.rows);
    res.status(200).send(customers.rows);
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function getCustomersById(req, res) {
  const { id } = req.params;

  try {
    const customers = await db.query(`SELECT * FROM customers WHERE id=${id}`);

    if (customers.rowCount === 0) {
      return res.status(404).send("Cliente não encontrado!");
    }
    return res.status(201).send(customers.rows[0]);
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function postCustomers(req, res) {
  const { name, phone, cpf, birthday } = req.body;

  try {
    if (!name || name.trim() === "" || !phone || !cpf || !birthday) {
      return res.status(400).send("Dados inválidos!");
    }

    const customerExists = await db.query(
      `SELECT cpf FROM customers WHERE cpf='${cpf}'`
    );

    if (customerExists.rows.length > 0) {
      return res.status(409).send("Cliente já cadastrado!");
    }

    const newCustomer = await db.query(
      `INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, phone, cpf, birthday]
    );

    return res.status(201).send(newCustomer.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Erro interno do servidor.");
  }
}

// export async function putCustomers(req, res) {
//   const { name, phone, cpf, birthday } = req.body;

//   try {
//     if (!name || !phone || !cpf || !birthday) {
//       return res.status(400).send("Dados inválidos!");
//     }

//     const customerExists = await db.query(
//       `SELECT cpf FROM customers WHERE cpf='${cpf}'`
//     );

//     if (customerExists.rows.length === 0) {
//       return res.status(404).send("Cliente não encontrado!");
//     }

//     const updatedCustomer = await db.query(
//       `UPDATE customers SET name='${name}', phone='${phone}', birthday='${birthday}' WHERE cpf='${cpf}' RETURNING *`
//     );

//     return res.status(200).send(updatedCustomer.rows[0]);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send("Erro interno do servidor.");
//   }
// }
