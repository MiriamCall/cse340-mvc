import dbPromise from "../../database/index.js";

const addNewGame = async (name, description, category_id, image_path = "") => {
  const db = await dbPromise;
  const sql = `
        INSERT INTO game (game_name, game_description, category_id, image_path)
        VALUES (?, ?, ?, ?)
    `;
  return await db.run(sql, [name, description, category_id, image_path]);
};

const deleteGame = async (gameId) => {
  const db = await dbPromise;
  const query = "DELETE FROM game WHERE game.game_id = ?;";
  return await db.run(query, [gameId]);
};

const getGameById = async (gameId) => {
  const db = await dbPromise;
  const query = `
        SELECT game.*, category.category_name 
        FROM game 
        JOIN category ON game.category_id = category.category_id
        WHERE game.game_id = ?;
    `;
  return await db.get(query, [gameId]);
};

const getGamesByCategory = async (categoryId) => {
  const db = await dbPromise;
  const query = `
        SELECT game.*, category.category_name 
        FROM game 
        JOIN category ON game.category_id = category.category_id
        WHERE game.category_id = ?;
    `;
  return await db.all(query, [categoryId]);
};

const moveGamesToCategory = async (oldCategoryId, newCategoryId) => {
  const db = await dbPromise;
  const query = "UPDATE game SET category_id = ? WHERE category_id = ?;";
  return await db.run(query, [newCategoryId, oldCategoryId]);
};

async function updateGame(
  gameId,
  name,
  description,
  categoryId,
  imagePath = ""
) {
  // Connect to database
  const db = await dbPromise;

  // If no image was uploaded, update basic game info
  if (imagePath === "") {
    const sql = `
            UPDATE game 
            SET game_name = ?, 
                game_description = ?, 
                category_id = ?
            WHERE game_id = ?
        `;
    return await db.run(sql, [name, description, categoryId, gameId]);
  }

  // If image was uploaded, update all info including image
  const sql = `
        UPDATE game 
        SET game_name = ?, 
            game_description = ?, 
            category_id = ?,
            image_path = ?
        WHERE game_id = ?
    `;
  return await db.run(sql, [name, description, categoryId, imagePath, gameId]);
}

export {
  addNewGame,
  deleteGame,
  getGameById,
  getGamesByCategory,
  moveGamesToCategory,
  updateGame,
};
