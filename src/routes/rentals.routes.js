import { Router } from "express";
import {
  getRentals,
  postRentals,
  postReturns,
  deleteRentals,
} from "../controller/rentals.controller.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals", postRentals);
rentalsRouter.post("/rentals/:id/return", postReturns);
rentalsRouter.delete("/rentals/:id", deleteRentals);

export default rentalsRouter;
