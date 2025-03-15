import express from 'express'
import movieList from "../json/movieList.json" assert { type: "json" };

export const movie  = express.Router()

// MOST DATA HERE WILL BE HARDCODED AS THERE IS NO DB, BUT TYPICALLY DB QUERIES ARE REQUIRED

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