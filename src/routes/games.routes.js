import { Router } from "express";
import { getGames, postGames } from "../controller/games.controller.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { gamesSchema } from "../schemas/games.schema.js";

const gamesRouter = Router();

gamesRouter.get("/games", getGames);
gamesRouter.post("/games", validateSchema(gamesSchema), postGames);

export default gamesRouter;