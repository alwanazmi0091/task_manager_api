import sessioMiddleware from "./middlewares/sessionMiddleware.js";
import handleError from "./middlewares/errorMiddleware.js";
import "dotenv/config";
import userRoutes from "./routes/userRoutes.js";
import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(sessioMiddleware);
app.use("/users", userRoutes);
app.use(handleError);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
})
