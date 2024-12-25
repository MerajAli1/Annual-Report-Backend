import express, { urlencoded } from "express";
import cors from "cors";
const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(express.json());
app.use(cors());


import AlumniRouter from "./routes/alumini.routes.js";

app.use("/api/v1/", AlumniRouter);



// app.use("/", () => {
//     console.log("Hello from the API");
// }
// );

export { app };
