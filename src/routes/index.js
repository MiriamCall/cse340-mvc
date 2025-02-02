import { Router } from "express";

const router = Router();

// The home page route
router.get("/", (req, res) => {
  res.locals.addStyles("css/home.css");
  res.locals.addScripts("js/home.js");
  res.render("index", { title: "Home Page" });
});

// The about page route
router.get("/about", (req, res) => {
  res.locals.addStyles("css/about.css");
  res.render("about", { title: "About Page" });
});

export default router;
