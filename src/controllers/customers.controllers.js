import { db } from "../database/database.connection.js";
 
  export async function getCustomers(req, res) {

    const {cpf, offset, limit} = req.query;

    try {
      let query = `SELECT id, name, phone, cpf, TO_CHAR(birthday, 'YYYY-MM-DD') AS birthday FROM customers`

      if(cpf) {
        query += ` WHERE cpf ILIKE '${cpf}%'`;
      }

      if(offset && !isNaN(parseInt(offset))) {
        query += ` OFFSET ${parseInt(offset)}`
      }

      if(limit && !isNaN(parseInt(limit))) {
        query += ` LIMIT ${parseInt(limit)}`
      }

        const customers = await db.query(query);
        res.send(customers.rows);
      
    } catch (err) {
      return res.status(500).send(err.message);
    }
  }
  

export async function postCustomer(req, res) {

    const { name, phone, cpf, birthday } = req.body;

    try {
      const cpfExistQuery = await db.query(`SELECT * FROM customers WHERE cpf = $1;`, [cpf]);
      
      if (cpfExistQuery.rows.length > 0) {
        return res.status(409).send("Este cpf já existe no banco de clientes");
      }

      await db.query(
        `INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)`,
        [name, phone, cpf, birthday]
      );
     res.sendStatus(201)
    
    } catch (err) {
      return res.status(500).send(err.message);
    }

}

export async function getCustomerId(req, res) {
  const { id } = req.params;

  try {
    const customerIdQuery = await db.query(`
      SELECT
        *,
        TO_CHAR(birthday, 'YYYY-MM-DD') AS birthday
      FROM customers
      WHERE id = $1;
    `, [id]);

    if (customerIdQuery.rows.length === 0) {
      return res.status(404).send("Este id não existe no banco de clientes");
    }

    const formattedCustomerId = customerIdQuery.rows[0];
    res.send(formattedCustomerId);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

export async function updateCustomer(req, res){
  const {id} = req.params;
  const { name, phone, cpf, birthday } = req.body;

  try {

    const idExistQuery = await db.query(`SELECT * FROM customers WHERE id = $1;`, [id]);
      
    if (idExistQuery.rows.length === 0) {
      return res.status(404).send("Este id não existe no banco de clientes");
    }

    // Verificar se o CPF já pertence a outro usuário
    const cpfExistQuery = await db.query(`SELECT * FROM customers WHERE cpf = $1 AND id <> $2;`, [cpf, id]);

    if (cpfExistQuery.rows.length > 0) {
      return res.status(409).send("O CPF que você está tentando atualizar já pertence a outro usuário");
    }

    await db.query( `
    UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5`,
    [name, phone, cpf, birthday, id]);

    res.sendStatus(200);
  } catch (err) {
    return res.status(500).send(err.message)
  }
}