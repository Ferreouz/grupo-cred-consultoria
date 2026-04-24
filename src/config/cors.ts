import { CorsOptions } from "cors";

const origins = process.env.CORS_ORIGIN?.split(",") ?? [];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server or tools like curl/postman
    if (!origin) return callback(null, true);

    if (origins.includes(origin)) {
      return callback(null, true);
    }

    callback(new Error("Not allowed by CORS"));
  },

  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204
};

export default corsOptions;