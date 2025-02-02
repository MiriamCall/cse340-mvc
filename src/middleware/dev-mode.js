export default function devMode(req, res, next) {
  res.locals.isDevMode = process.env.NODE_ENV === "development";

  res.locals.devModeWarning = res.locals.isDevMode;
  if (res.locals.isDevMode) {
    console.log("Warning: Development mode is enabled");
  }
  next();
}
