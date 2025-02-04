export default function devMode(req, res, next) {
  // Determine if we're in development mode
  const isDevMode = process.env.NODE_ENV === "development";

  // Set both isDevMode and devModeWarning
  res.locals.isDevMode = isDevMode;
  res.locals.devModeWarning = isDevMode;

  if (isDevMode) {
    res.locals.devModeMessage = "Warning: Development Mode Enabled";
  }

  next();
}
