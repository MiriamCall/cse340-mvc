import { Router } from "express";
import {
  getGamesByClassification,
  getClassifications,
  getGameById,
  updateGame,
} from "../../models/index.js";
import dbPromise from "../../database/index.js";
console.log("dbPromise", dbPromise);
import path from "path";
import fs from "fs";

const router = Router();

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

  // If the game is missing an image use a placeholder
  for (let i = 0; i < games.length; i++) {
    if (games[i].image_path == "") {
      games[i].image_path = "https://placehold.co/300x300/jpg";
    }
  }

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
  console.log("req.files?.image: ", req.files?.image);
  const image_path = getVerifiedGameImage(req.files?.image);
  console.log("image_path: ", image_path);
  await addNewGame(game_name, game_description, classification_id, image_path);
  res.redirect(`/category/view/${classification_id}`);
});

const addNewGame = async (name, description, classification_id, image_path) => {
  // console.log(
  //   "name: " + name,
  //   "description: " + description,
  //   "classification id: " + classification_id,
  //   "image_path: " + image_path
  // );
  const db = await dbPromise;
  const sql = `
      INSERT INTO game (game_name, game_description, classification_id, image_path)
      VALUES (?, ?, ?, ?)
  `;
  return await db.run(sql, [name, description, classification_id, image_path]);
};

router.get("/edit/:id", async (req, res) => {
  console.log("req.params.id:", req.params.id); // Log the original value

  try {
    // Add try...catch for error handling
    const gameIdString = req.params.id;
    const gameId = parseInt(gameIdString, 10);

    if (isNaN(gameId)) {
      console.error("Invalid gameId:", gameIdString);
      return res.status(400).send("Invalid Game ID");
    }

    const classifications = await getClassifications();
    const game = await getGameById(gameId);

    if (!game) {
      console.log("Game not found for ID:", gameId);
      return res.status(404).send("Game not found");
    }

    res.render("category/edit", { title: "Edit Game", classifications, game });
  } catch (error) {
    console.error("Error in edit route:", error);
    res.status(500).send("Internal Server Error"); // Or render an error view
  }
});

// Edit route to accept updated game information
router.post("/edit/:id", async (req, res) => {
  console.log("req.params.id:", req.params.id); // Log the original value

  try {
    // Add try...catch
    const gameIdString = req.params.id;
    const gameId = parseInt(gameIdString, 10);

    if (isNaN(gameId)) {
      console.error("Invalid gameId:", gameIdString);
      return res.status(400).send("Invalid Game ID");
    }

    const oldGameData = await getGameById(gameId); // Use gameId (integer)

    if (!oldGameData) {
      console.error("Old game data not found for ID:", gameId);
      return res.status(404).send("Old game data not found");
    }

    const { game_name, game_description, classification_id } = req.body;
    const image_path = getVerifiedGameImage(req.files?.image);

    await updateGame(
      gameId, // Use gameId (integer)
      game_name,
      game_description,
      classification_id,
      image_path
    );

    if (image_path && oldGameData && image_path !== oldGameData.image_path) {
      // Check if oldGameData exists
      const oldImagePath = path.join(
        process.cwd(),
        `public${oldGameData.image_path}`
      );
      if (fs.existsSync(oldImagePath) && fs.lstatSync(oldImagePath).isFile()) {
        fs.unlinkSync(oldImagePath);
      }
    }

    res.redirect(`/category/view/${classification_id}`);
  } catch (error) {
    console.error("Error in post edit route:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Helper function to verify and move uploaded game image
const getVerifiedGameImage = (images = []) => {
  // Exit early if no valid images array provided
  if (!images || images.length === 0) {
    return "";
  }

  // Process first image (assuming single image upload)
  const image = images[0];
  const imagePath = path.join(
    process.cwd(),
    `public/images/games/${image.newFilename}`
  );

  // Move uploaded file from temp location to permanent storage
  fs.renameSync(image.filepath, imagePath);

  // Cleanup by removing any remaining temporary files
  images.forEach((image) => {
    if (fs.existsSync(image.filepath)) {
      fs.unlinkSync(image.filepath);
    }
  });

  // Return the new frontend image path for storage in the database
  return `/images/games/${image.newFilename}`;
};

export default router;
export { addNewGame };
