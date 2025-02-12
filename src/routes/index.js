import { Router } from "express";
import { getNav } from "../utils/index.js";

const router = Router();

// The home page route
router.get("/", async (req, res) => {
  res.render("index", { title: "Home Page" });
});

// About page route
router.get("/about", async (req, res) => {
  res.render("about", { title: "About Page" });
});

// Game category route
router.get("/view/:id", async (req, res, next) => {
  //  <-- Notice we added the next parameter
  const games = await getGamesByClassification(req.params.id);
  const title = `${games[0]?.classification_name || ""} Games`.trim();

  // If no games are found, throw a 404 error
  if (games.length <= 0) {
    const title = "Category Not Found";
    const error = new Error(title);
    error.title = title;
    error.status = 404;
    next(error); //  <-- Pass the error to the global error handler
    return;
  }

  res.render("category/index", { title, games });
});

export default router;
