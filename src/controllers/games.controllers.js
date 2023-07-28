import { db } from "../database/database.connection.js";

export async function getGames(req, res) {
  const { name, offset, limit } = req.query;

  try {
    let query = `SELECT * FROM games`;

    if (name) {
      query += ` WHERE name ILIKE '${name}%'`;
    }

    if (offset && !isNaN(parseInt(offset))) {
      query += ` OFFSET ${parseInt(offset)}`;
    }

    if (limit && !isNaN(parseInt(limit))) {
      query += ` LIMIT ${parseInt(limit)}`;
    }

    const games = await db.query(query);
    res.send(games.rows);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}


export async function postGame(req, res) {
  const { name, image, stockTotal, pricePerDay } = req.body;

  try {
    const nameExistQuery = await db.query(`SELECT * FROM games WHERE name = $1;`, [name]);
    
    if (nameExistQuery.rows.length > 0) {
      return res.status(409).send("Este nome de jogo já existe no banco de jogos");
    }
   
   await db.query(`
   INSERT INTO games (name, image, "stockTotal", "pricePerDay")
   VALUES($1, $2, $3, $4)
   `,
   [name, image, stockTotal, pricePerDay]);

   res.sendStatus(201)
  
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
