export default function configMode(req, res, next) {
  res.locals.styles = res.locals.styles || [];
  res.locals.scripts = res.locals.scripts || [];

  // Function to add styles dynamically
  res.locals.addStyles = (stylePath) => {
    if (!res.locals.styles.includes(stylePath)) {
      res.locals.styles.push(stylePath);
    }
  };

  // Function to add scripts dynamically
  res.locals.addScripts = (scriptPath) => {
    if (!res.locals.scripts.includes(scriptPath)) {
      res.locals.scripts.push(scriptPath);
    }
  };

  // Inject live reload script ONLY in development mode
  if (process.env.NODE_ENV === "development") {
    const port = process.env.PORT || 3000; // Ensure port is correctly set
    res.locals.scripts.push(`
          <script>
              const ws = new WebSocket('ws://127.0.0.1:${parseInt(port) + 1}');
              ws.onclose = () => {
                  setTimeout(() => location.reload(), 2000);
              };
          </script>
      `);
  }

  next();
}
