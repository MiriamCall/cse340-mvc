// Import required modules using ESM import syntax
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Import the devModeMiddleware function from the dev-mode.js file
import devModeMiddleware from "./src/middleware/dev-mode.js";

// Import all other required modules: Route handlers, Middleware, etc.
import baseRoute from "./src/routes/index.js";
import layouts from "./src/middleware/layout.js";
import staticPaths from "./src/middleware/static-paths.js";
import {
  notFoundHandler,
  globalErrorHandler,
} from "./src/middleware/error-handler.js";
import assetInjector from "./src/middleware/asset-injector.js";

// Get the current file path and directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create an instance of an Express application
const app = express();

// Use the devModeMiddleware to set the isDevMode flag
app.use(devModeMiddleware);

// Serve static files from the public directory
// app.use(staticPaths);
app.use("/css", express.static(path.join(__dirname, "public/css")));
app.use("/js", express.static(path.join(__dirname, "public/js")));
app.use("/images", express.static(path.join(__dirname, "public/images")));

// Use the assetInjector middleware to inject styles and scripts into views
app.use(assetInjector);

// Set EJS as the view engine and record the location of the views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

// Set Layouts middleware to automatically wrap views in a layout and configure default layout
app.set("layout default", "default");
app.set("layouts", path.join(__dirname, "./src/views/layouts"));
app.use(layouts);

// Use the home route for the root URL
app.use("/", baseRoute);

// Apply error handlers
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Start the server on the specified port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});
