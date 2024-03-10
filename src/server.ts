import app from "./app";
import { createMemoryRepository, populateRepositoryFromFile } from "./domain/card/repository";
import { createMemoryGameRepository } from "./domain/game/repository";

/**
 * Start Express server.
 */

const server = app.listen(app.get("port"), () => {
    console.log("  App is running at http://localhost:%d in %s mode", app.get("port"), app.get("env"));
    console.log("  Press CTRL-C to stop\n");
});

export default server;
