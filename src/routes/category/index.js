import { Router } from "express";
import { getGamesByClassification } from "../../models/index.js";

const router = Router();

// Game category route
// Game category route
router.get("/:id", async (req, res) => {
  const games = await getGamesByClassification(req.params.id);
  const title = `${games[0]?.classification_name || ""} Games`.trim();
  res.render("category/index", { title, games });
});

// Add game route
router.get("/add", async (req, res) => {
  const classifications = await getClassifications();
  res.render("category/add", { title: "Add New Game", classifications });
});

// Add route to accept new game information
router.post("/add", async (req, res) => {
  const { game_name, game_description, classification_id } = req.body;
  await addNewGame(game_name, game_description, classification_id, "");
  res.redirect(`/category/view/${classification_id}`);
});

export default router;
