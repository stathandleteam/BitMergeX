import morgan from "morgan";

import { env, logger } from "../helpers";

const stream = {
  write: (message: string) => {
    logger.info(message.substring(0, message.lastIndexOf("\n")));
  },
};

export default morgan(":method :url :status :res[content-length] - :response-time ms", {
  stream,
  skip: () => env("NODE_ENV") === "test",
});