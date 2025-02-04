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

  //not working how it should....need to fix
  //   // Add livereload script
  //   res.locals.scripts.push(`
  //   <script>
  //       const ws = new WebSocket('ws://127.0.0.1:${parseInt(port) + 1}');
  //       ws.onclose = () => {
  //           setTimeout(() => location.reload(), 2000);
  //       };
  //   </script>
  // `);

  next();
}
