import joi from "joi";

export const rentalsSchema = joi.object({
  customerId: joi.number().integer().required(),
  gameId: joi.number().integer().required(),
  rentDate: joi.date().iso().required(),
  daysRented: joi.number().integer().min(1).required(),
  returnDate: joi.date().iso().allow(null),
  originalPrice: joi.number().integer().min(0).required(),
  delayFee: joi.number().integer().min(0).allow(null),
});
