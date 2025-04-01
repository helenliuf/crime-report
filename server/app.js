var express = require("express");
//Cross Origin Resource Sharing - Security Purposes
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

var userRouter = require("./routes/userRoutes");
var crimeRouter = require("./routes/crimeRoutes");
const PORT = process.env.PORT || 8080;
const path = require("path");
const mongoose = require("mongoose");

// Instantiating express application
var app = express();

// Make our application use JSON request format
app.use(express.json());

// Cors Config
let corsoptions = {
	origin: "http://localhost:3000",
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};
app.use(cors(corsoptions));

// ###### Connecting Router ######
// http://localhost:8080/api/user/xyz
app.use("/api/user", userRouter);
app.use("/api/crime", crimeRouter);

//Connecting to Mongodb
if (!process.env.MONGO_URI) {
	console.error("MONGO_URI is not defined in the environment variables.");
	process.exit(1);
}

mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		return mongoose.connection.db.admin().command({ ping: 1 });
	})
	.then(() => {
		console.log("Connected to MongoDB!");
	})
	.catch((error) => {
		console.error("MongoDB connection error:", error);
	});

// Listening to application on the PORT
app.listen(PORT, () => console.log("Server is up and running!!"));
