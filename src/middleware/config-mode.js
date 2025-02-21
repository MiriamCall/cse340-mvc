import { getNav } from "../utils/index.js";

export default async function configMode(req, res, next) {
  try {
    // Fetch and set navigation HTML dynamically
    res.locals.navHTML = await getNav();

    // Initialize styles and scripts if not set
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
                setTimeout(() => location.reload(), 15000);
            };
        </script>
      `);
    }

    next();
  } catch (error) {
    console.error("Error in configMode middleware:", error);
    next(error); // Pass error to error-handling middleware
  }
}
