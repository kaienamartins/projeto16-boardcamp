import { db } from "../database/database.connection.js";

export async function getCustomers(req, res) {
  try {
    const customers = await db.query("SELECT * FROM customers");
    const formattedCustomers = customers.rows.map((customer) => ({
      ...customer,
      birthday: customer.birthday.toISOString().split("T")[0],
    }));

    console.table(formattedCustomers);
    res.status(200).send(formattedCustomers);
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function getCustomersById(req, res) {
  const { id } = req.params;

  try {
    const customers = await db.query(`SELECT * FROM customers WHERE id=${id}`);

    if (customers.rowCount === 0) {
      res.status(404).send("Cliente não encontrado!");
    }
    const formattedCustomer = {
      ...customers.rows[0],
      birthday: customers.rows[0].birthday.toISOString().split("T")[0],
    };

    return res.status(201).send(formattedCustomer);
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

export async function putCustomers(req, res) {
  const { name, phone, cpf, birthday } = req.body;

  try {
    if (!name || !phone || !cpf || !birthday) {
      return res.status(400).send("Dados inválidos!");
    }

    const customerExists = await db.query(
      `SELECT cpf FROM customers WHERE cpf='${cpf}'`
    );

    if (customerExists.rows.length === 0) {
      return res.status(404).send("Cliente não encontrado!");
    }

    const updatedCustomer = await db.query(
      `UPDATE customers SET name='${name}', phone='${phone}', birthday='${birthday}' WHERE cpf='${cpf}' RETURNING *`
    );

    return res.status(200).send(updatedCustomer.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Erro interno do servidor.");
  }
}
