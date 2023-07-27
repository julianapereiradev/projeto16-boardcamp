import { db } from "../database/database.connection.js";
import dayjs from "dayjs";

export async function getRentals(req, res){
  try {

    const rentalsQuery = await db.query(`
      SELECT rentals.*, customers."name" as "customerName", 
      games."name" as "gameName" from rentals 
      JOIN customers ON rentals."customerId" = customers."id" 
      JOIN games ON rentals."gameId" = games."id";
    `);
    
    const rentals = rentalsQuery.rows.map((rental) => ({
      id: rental.id,
      customerId: rental.customerId,
      gameId: rental.gameId,
      rentDate: dayjs(rental.rentDate).format("YYYY-MM-DD"),
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
    }));
    res.send(rentals);
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

export async function postRental(req, res) {

    const { customerId, gameId, daysRented } = req.body;

    try {
      const customerIdExistQuery = await db.query(`SELECT * FROM customers WHERE id = $1;`, [customerId]);
      if (customerIdExistQuery.rows.length === 0) {
        return res.status(400).send("Este id de cliente não existe no banco de clientes");
      }

      const gameIdExistQuery = await db.query(`SELECT * FROM games WHERE id = $1;`, [gameId]);
      if (gameIdExistQuery.rows.length === 0) {
        return res.status(400).send("Este id de jogo não existe no banco de clientes");
      }

      const game = gameIdExistQuery.rows[0];

      if (game.stockTotal <= 0) {
        return res.status(400).send("Não tem mais no estoque");
      }

      const rentDate = dayjs().format("YYYY-MM-DD");
      const originalPrice = daysRented * game.pricePerDay;

      await db.query(
        `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "originalPrice") VALUES ($1, $2, $3, $4, $5)`,
        [customerId, gameId, rentDate, daysRented, originalPrice]
      );

      await db.query(`UPDATE games SET "stockTotal" = "stockTotal" - 1 WHERE id = $1;`, [gameId]);

     res.sendStatus(201)
    
    } catch (err) {
      return res.status(500).send(err.message);
    }

}

export async function sendFinalRental(req, res){

}

export async function deleteRental(req, res){

}