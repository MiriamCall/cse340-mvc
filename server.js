// Import required modules using ESM import syntax
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Import Middleware
import devModeMiddleware from "./src/middleware/dev-mode.js";
import configMode from "./src/middleware/config-mode.js";
import layouts from "./src/middleware/layout.js";
// import staticPaths from "./src/middleware/static-paths.js";
import {
  notFoundHandler,
  globalErrorHandler,
} from "./src/middleware/error-handler.js";

// Import Routes
import baseRoute from "./src/routes/index.js";

// Get the current file path and directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create an instance of an Express application
const app = express();

// Determine environment mode
const isDevMode = process.env.NODE_ENV === "development";
const PORT = process.env.PORT || 3000;

// Use Middleware
app.use(devModeMiddleware);
app.use(configMode);

// Serve static files
// app.use(staticPaths);
app.use("/css", express.static(path.join(__dirname, "public/css")));
app.use("/js", express.static(path.join(__dirname, "public/js")));
app.use("/images", express.static(path.join(__dirname, "public/images")));

// Set EJS as the view engine and configure views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

// Set Layouts middleware
app.set("layout default", "default");
app.set("layouts", path.join(__dirname, "./src/views/layouts"));
app.use(layouts);

// Use Routes
app.use("/", baseRoute);

// Apply error handlers
app.use(notFoundHandler);
app.use(globalErrorHandler);

// When in development mode, start a WebSocket server for live reloading
if (isDevMode) {
  const { WebSocketServer } = await import("ws");

  try {
    const wsPort = PORT + 1;
    const wsServer = new WebSocketServer({ port: wsPort });

    wsServer.on("listening", () => {
      console.log(`WebSocket server running on ws://127.0.0.1:${wsPort}`);
    });

    wsServer.on("connection", (ws) => {
      console.log("WebSocket client connected");

      ws.on("close", () => {
        console.log("WebSocket client disconnected");
      });
    });

    wsServer.on("error", (error) => {
      console.error("WebSocket server error:", error);
    });
  } catch (error) {
    console.error("Failed to start WebSocket server:", error);
  }
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});
