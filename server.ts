import app from "./src/app";
import "dotenv/config";
import routes from "./src/routes/index";

const port = process.env.PORT || 5011;

routes(app);

app.listen(port, () => {
  console.log(`Servidor escutando em http://localhost:${port}`);
});
