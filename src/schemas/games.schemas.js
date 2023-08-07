import joi from 'joi';

export const gameSchema = joi.object({
    name: joi.string().required(),
    stockTotal: joi.number().positive().required(),
    pricePerDay: joi.number().positive().required(),
    image: joi.required(), //faltou .uri()
});