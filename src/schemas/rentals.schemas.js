import joi from 'joi';

export const gameSchema = joi.object({
    customerId: joi.number().positive().required(),
    gameId: joi.number().positive().required(),
    daysRented: joi.number().positive().required(),
});