import express from 'express'

// MOST DATA HERE WILL BE HARDCODED JSON AS THERE IS NO DB, BUT TYPICALLY DB QUERIES ARE REQUIRED
import movieList from "../json/movieList.json" assert { type: "json" };
import cinemaLocations from "../json/cinemaLocations.json" assert { type: "json" };

export const movie  = express.Router()


movie.get("/movieList", (req, res) => {
    try {
        res.status(200).json({
            code: 200,
            msg: "GET movieList",
            movies: movieList
        })
    }
    catch (e) {
        res.status(401).json({
            code: 401,
            msg: `Failed GET movieList: ${e}`,
        })
    }
})

movie.get("/cinemaList", (req, res) => {
    try {
        res.status(200).json({
            code: 200,
            msg: "GET cinemaList",
            locations: cinemaLocations
        })
    }
    catch (e) {
        res.status(401).json({
            code: 401,
            msg: `Failed GET cinemaList: ${e}`,
        })
    }
})

movie.get("/movieTimes", (req, res) => {
    try {
        const date = req.query.date; // Get 'date' from query parameters
        console.log("Requested date:", date);
    
        // HARD CODED TIME ASSUMED TO BE IN DB IF IN PRODUCTION
        const time = ['9:20AM', '11:40AM', '1:20PM', '3:30PM', '5:40PM', '7:30PM', '9:20PM'];
    
        res.status(200).json({
            code: 200,
            msg: "GET movieTimes",
            time: time
        });
        } catch (e) {
        res.status(401).json({
            code: 401,
            msg: `Failed GET movieTimes: ${e}`,
        });
    }
});