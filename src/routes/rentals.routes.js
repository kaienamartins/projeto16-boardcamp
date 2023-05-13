import { Router } from "express";
import {
  getRentals,
  postRentals,
  postReturns,
} from "../controller/rentals.controller.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals", postRentals);
rentalsRouter.post("/rentals/:id/return", postReturns);

export default rentalsRouter;
