import { Router } from "express";
import {
  getCustomers,
  postCustomers,
  getCustomersById,
  putCustomers,
} from "../controller/customers.controller.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { customersSchema } from "../schemas/customers.schema.js";

const customersRouter = Router();

customersRouter.get("/customers", getCustomers);
customersRouter.get("customers/:id", getCustomersById);
customersRouter.post(
  "/customers",
  validateSchema(customersSchema),
  postCustomers
);
customersRouter.put("/customers:id", putCustomers);

export default customersRouter;
