import { DatabaseError } from "pg";
import app from "./app";
import { config } from "./config";
import { initDB } from "./db";

const startServer = async () => {
  try {
    await initDB();

    console.log("Database initialized");

    app.listen(config.PORT, () => {
      console.log(`Server is listening on port ${config.PORT}`);
    });
  } catch (error: unknown) {
    if (error instanceof DatabaseError) {
      console.error("Database error", error.message);
    } else if (error instanceof Error) {
      console.error("Error", error.message);
    } else {
      console.error("Unknown error", error);
    }

    process.exit(1);
  }
};

startServer();
