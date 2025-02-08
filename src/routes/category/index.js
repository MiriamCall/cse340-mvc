import { Router } from "express";
import { getGamesByClassification } from "../../models/index.js";

const router = Router();

// Game category route
router.get("/:id", async (req, res) => {
  const games = await getGamesByClassification(req.params.id);
  res.render("category/index", { title: "Games", games });
});

export default router;
