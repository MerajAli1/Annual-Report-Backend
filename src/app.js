import express, { urlencoded } from "express";
import cors from "cors";
const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(express.json());
app.use(cors());

app.use("/", () => {
    console.log("Hello from the API");
}
);

export { app };
