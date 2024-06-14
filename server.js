const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const http = require("http"); // Import http module
// swagger
const basicAuth = require("express-basic-auth")
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./utils/swaggerConfig")
const {SwaggerTheme}= require("swagger-themes")
const theme = new SwaggerTheme()
const options ={
  explorer: true,
  customCss: theme.getBuffer("dark")+".swagger-ui .topbar { display:none }"
}
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
/* routes */
// const adminRouter = require("./Route/admin_routes");

const app = express();
const server = http.createServer(app); // Create HTTP server

app.use(
  "/api-docs",
  basicAuth({
    users: { [process.env.SWAGGER_USERNAME]: process.env.SWAGGER_PASSWORD,
    },
    challenge:true,
    realm:"Imb4T3st4pp"
  }),
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec,options)
)

app.enable("trust proxy");
app.use(
  cors({
    origin: true, // Allow access from any origin
    credentials: true,
  })
);


app.use(
  express.json({
    limit: "10kb",
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// Define the desired folder structure
const folderStructure = ["files"];

// function for make all needed global files
const createFoldersMiddleware = () => {
  for (const folder of folderStructure) {
    const folderPath = path.join(__dirname, folder);

    // Check if the folder exists
    if (!fs.existsSync(folderPath)) {
      // If the folder doesn't exist, create it
      fs.mkdirSync(folderPath, { recursive: true });
    }
  }
};
// function for make all needed global files : calls here
createFoldersMiddleware();
// Serve static files from the 'files' directory
app.use("/files", express.static(path.join(__dirname, "files"))); // Corrected path for static files
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

/* routes */
// app.use("/api/v1/admin", adminRouter);

const AppError = require("./utils/appError");
const globalErrorHandler = require("./Controller/error_controller");
app.all("*", (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandler);

app.use((err, req, res, next) => {
  return next(new AppError(err, 404));
});

const DB = process.env.mongo_uri;
const port = 3000;

const connectDB = async () => {
  try {
    console.log("DB Connecting ...");
    const response = await mongoose.connect(DB);
    if (response) {
      console.log("MongoDB connect successfully");

      server.listen(port, () => {
        // Start the server using server.listen
        console.log(`App run with url: http://localhost:${port}`);
      });
    }
  } catch (error) {
    console.log("error white connect to DB ==>  ", error);
  }
};
connectDB();
