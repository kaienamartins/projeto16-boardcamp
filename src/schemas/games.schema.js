import joi from 'joi';

export const gamesSchema = joi.object({
  name: joi.string().required(),
  image: joi.string().required(),
  stockTotal: joi.number().integer().positive().required(),
  pricePerDay: joi.number().integer().positive().required(),
});