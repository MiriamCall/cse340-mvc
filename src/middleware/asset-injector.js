export default function assetInjector(req, res, next) {
  res.locals.styles = res.locals.styles || [];
  res.locals.scripts = res.locals.scripts || [];

  //function to add styles and scripts dynamically
  res.locals.addStyles = (stylePath) => {
    if (!res.locals.styles.includes(stylePath)) {
      res.locals.styles.push(stylePath);
    }
  };

  res.locals.addScripts = (scriptPath) => {
    if (!res.locals.scripts.includes(scriptPath)) {
      res.locals.scripts.push(scriptPath);
    }
  };

  next();
}
