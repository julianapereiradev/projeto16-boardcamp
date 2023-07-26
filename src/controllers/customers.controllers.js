import { db } from "../database/database.connection.js";

//Função para converter uma data para o formato 'YYYY-MM-DD'
function formatDate(date) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


export async function getCustomers(req, res){

    try {
        const customers = await db.query(`SELECT * FROM customers;`);

// Formatando o birthday antes de enviar como resposta
    const formattedCustomers = customers.rows.map(customer => {
        return {
          ...customer,
          birthday: formatDate(customer.birthday),
        };
      });
      res.send(formattedCustomers);
      } catch (err) {
        return res.status(500).send(err.message)
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
    const idExistQuery = await db.query(`SELECT * FROM customers WHERE id = $1;`, [id]);

    if (idExistQuery.rows.length === 0) {
      return res.status(404).send("Este id não existe no banco de clientes");
    }

    const customerId = await db.query(`SELECT * FROM customers WHERE id=$1;`, [id]);

    // Formatando o birthday antes de enviar como resposta
    const formattedCustomerId = {
      ...customerId.rows[0],
      birthday: formatDate(new Date(customerId.rows[0].birthday)),
    };

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