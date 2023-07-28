import { db } from "../database/database.connection.js";
import dayjs from "dayjs";

function mapRentalData(rental) {
  return {
    id: rental.id,
    customerId: rental.customerId,
    gameId: rental.gameId,
    rentDate: rental.rentDate,
    daysRented: rental.daysRented,
    returnDate: rental.returnDate,
    originalPrice: rental.originalPrice,
    delayFee: rental.delayFee,
    customer: {
      id: rental.customerId,
      name: rental.customerName,
    },
    game: {
      id: rental.gameId,
      name: rental.gameName,
    },
  };
}


export async function getRentals(req, res) {

    const {customerId, gameId, offset, limit} = req.query;

  try {
    let query = `SELECT rentals.*, 
    TO_CHAR(rentals."rentDate", 'YYYY-MM-DD') AS "rentDate",
    TO_CHAR(rentals."returnDate", 'YYYY-MM-DD') AS "returnDate", 
    customers."name" as "customerName", 
    games."name" as "gameName"
    FROM rentals
    JOIN customers ON rentals."customerId" = customers."id" 
    JOIN games ON rentals."gameId" = games."id"`

    if(customerId) { 
      query += ` WHERE "customerId" = '${customerId}'`;
      const resultCustomerId = await db.query(query);

      const rentalsCustomer = resultCustomerId.rows.map(mapRentalData);
      return res.send(rentalsCustomer);
    }

    if (gameId) {
      query += ` WHERE "gameId" = '${gameId}'`;
      const resultGameId = await db.query(query);
      
      const rentalsGame = resultGameId.rows.map(mapRentalData);
      return res.send(rentalsGame);
    }

    if(offset && !isNaN(parseInt(offset))) {
      query += ` OFFSET ${parseInt(offset)}`
    }

    if(limit && !isNaN(parseInt(limit))) {
      query += ` LIMIT ${parseInt(limit)}`
    }

    const rentalsQuery = await db.query(query);
    const rentals = rentalsQuery.rows.map(mapRentalData);
    res.send(rentals);

  } catch (err) {
    return res.status(500).send(err.message)
  }
}

export async function postRental(req, res) {

    const { customerId, gameId, daysRented } = req.body;

    try {

      if(daysRented <= 0) {
        return res.sendStatus(400);
      }

      const customerIdExistQuery = await db.query(`SELECT * FROM customers WHERE id = $1;`, [customerId]);
      if (customerIdExistQuery.rows.length === 0) {
        return res.status(400).send("Este id de cliente não existe no banco de clientes");
      }

      const gameIdExistQuery = await db.query(`SELECT * FROM games WHERE id = $1;`, [gameId]);
      if (gameIdExistQuery.rows.length === 0) {
        return res.status(400).send("Este id de jogo não existe no banco de clientes");
      }

      const game = gameIdExistQuery.rows[0];

      const counting = await db.query(`SELECT COUNT(*) AS open_rentals FROM rentals WHERE "gameId" = $1 AND "returnDate" IS NULL;`, [gameId]);

        const numberRentalsOpen = Number(counting.rows[0].open_rentals);
        const totalStockGame = game.stockTotal;
        const availableGames = totalStockGame - numberRentalsOpen;

        if (availableGames <= 0) {
            return res.status(400).send("Jogo não está disponíveis para ser alugado.");
        }

      const rentDate = dayjs().format("YYYY-MM-DD");
      const originalPrice = daysRented * game.pricePerDay;
      const returnDate = null;
      const delayFee = null;

      await db.query(
        `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee]
      );

      await db.query(`UPDATE games SET "stockTotal" = "stockTotal" - 1 WHERE id = $1;`, [gameId]);

     res.sendStatus(201)
    
    } catch (err) {
      return res.status(500).send(err.message);
    }

}

export async function sendFinalRental(req, res) {
  const { id } = req.params;

  try {
    const rentalExist = await db.query(`SELECT * FROM rentals WHERE id = $1;`, [id]);
    
    if (rentalExist.rows.length === 0) {
      return res.status(404).send("Este id não existe no banco de clientes");
    }

    const game = await db.query(`SELECT "pricePerDay" FROM games WHERE id = ${rentalExist.rows[0].gameId}`);

    if (rentalExist.rows[0].returnDate !== null) {
      return res.status(400).send("Não é possível porque o cliente já devolveu o jogo");
    }

    const dateReturn = new Date();
    const dateSend = new Date(rentalExist.rows[0].rentDate);

    const differenceDays = Math.abs(dateReturn - dateSend); 
    const diffInDays = Math.ceil(differenceDays / (1000 * 60 * 60 * 24)); 
    
    const isdelayFee = diffInDays - rentalExist.rows[0].daysRented - 1;
    
    let totalvalueFee = 0;
    if (isdelayFee > 0) {
      totalvalueFee = Math.abs(isdelayFee) * game.rows[0].pricePerDay;
    }

    const delayFee = totalvalueFee;

    await db.query(`
    UPDATE rentals
    SET "returnDate" = Now(), "delayFee" = $1
    WHERE id = $2;
  `, [delayFee, id]);

    await db.query(`UPDATE games SET "stockTotal" = "stockTotal" + 1 WHERE id = ${rentalExist.rows[0].gameId};`);

    res.sendStatus(200);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

export async function deleteRental(req, res) {
  const { id } = req.params;

  try {
    const rentalExist = await db.query(`SELECT * FROM rentals WHERE id = $1;`, [id]);

    if (rentalExist.rows.length === 0) {
      return res.status(404).send("Este id não existe no banco de clientes");
    }

    if(rentalExist.rows[0].returnDate === null) {
      return res.status(400).send("Não é possível excluir o aluguel porque o cliente ainda não devolveu o jogo")
    }

    await db.query(`DELETE FROM rentals WHERE id = $1;`,[id]);

    res.status(200).send("Aluguel Deletado");
  } catch (err) {
    return res.status(500).send(err.message);
  }
}