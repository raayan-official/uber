const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const connectToDataBase = require('./db/connection');
const userRoutes = require('./routes/userRoutes');
const captainRoutes = require('./routes/captainRoutes');
const mapsRoutes = require('./routes/mapesRoutes');
const rideRoutes = require('./routes/rideRoute');
const path = require('path');
const _dirname = path.resolve();

connectToDataBase();

app.use(cors({credentials: true}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(_dirname, "/frontend/dist")));


if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(_dirname, "frontend", "dist")));

    app.get("*", (_, res) => {
        res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
    });
} else {
    console.log("Running in development mode. Frontend is not served.");
}
app.get("/", (req, res)=>{
    res.send("Welcome to the backend of the project");
});

app.use("/users", userRoutes);
app.use("/captains", captainRoutes);
app.use("/maps", mapsRoutes);
app.use("/rides", rideRoutes);





module.exports = app;