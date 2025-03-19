//  /movie

/**
* @swagger
* /movieList:
*   get:
*     description: Gets list of movies available for showinng
*     tags: 
*       - /movie
*     responses:
*       200:
*         description: GET movieList
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 code:
*                   type: number
*                   description: Response Code
*                   example: 200
*                 msg:
*                   type: string
*                   description: Response Message
*                   example: GET movieList
*                 movies:
*                   type: array
*                   description: List of movie data
*                   items:
*                     type: object
*                     properties:
*                       id:
*                         type: integer
*                         example: 1
*                       title:
*                         type: string
*                         example: "Venom: Let There Be Carnage"
*                       genre:
*                         type: array
*                         items:
*                           type: string
*                         example: ["Action", "Adventure", "Sci-Fi"]
*                       release:
*                         type: string
*                         example: "October 2021"
*                       rating:
*                         type: object
*                         properties:
*                           star:
*                             type: number
*                             format: float
*                             example: 4.5
*                           totalRatings:
*                             type: integer
*                             example: 28
*                       age_rating:
*                         type: string
*                         example: "18+"
*                       runtime:
*                         type: object
*                         properties:
*                           hour:
*                             type: integer
*                             example: 1
*                           minute:
*                             type: integer
*                             example: 37
*                       details:
*                         type: object
*                         properties:
*                           sypnosis:
*                             type: string
*                             example: "Eddie Brock is still struggling to co-exist with the shape-shifting extraterrestrial Venom..."
*                           cast:
*                             type: string
*                             example: "Tom Hardy, Woody Harrelson, Michelle Williams, Naomi Harris"
*                           director:
*                             type: string
*                             example: "Andy Serkis"
*                           writers:
*                             type: string
*                             example: "Kelly Marcel, Tom Hardy"
*                       trailer:
*                         type: string
*                         format: uri
*                         example: "https://www.youtube.com/watch?v=USAsr2i4jiQ"
*                       poster:
*                         type: string
*                         format: uri
*                         example: "https://upload.wikimedia.org/wikipedia/en/a/a7/Venom_Let_There_Be_Carnage_poster.jpg"
*       401:
*         description: "Failed GET movieList [ERROR_MSG]"
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 code:
*                   type: number
*                   example: 401
*                 msg:
*                   type: string
*                   example: Unauthorized
*/


/**
* @swagger
* /cinemaList:
*   get:
*     description: Gets list of cinemas categorized by state
*     tags:
*       - /movie
*     responses:
*       200:
*         description: GET cinemaList
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 code:
*                   type: number
*                   description: Response Code
*                   example: 200
*                 msg:
*                   type: string
*                   description: Response Message
*                   example: GET cinemaList
*                 locations:
*                   type: object
*                   additionalProperties:
*                     type: array
*                     items:
*                       type: string
*                   example:
*                     Kuala Lumpur: ['Pavilion KL', 'TRX Exchange', 'Mid Valley', 'Berjaya Times Square']
*       401:
*         description: Failed GET cinemaList
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 code:
*                   type: number
*                   example: 401
*                 msg:
*                   type: string
*                   example: "Failed GET cinemaList: [ERROR_MSG]"
*/


/**
* @swagger
* /movieTimes:
*   get:
*     description: Gets available movie times
*     tags:
*       - /movie
*     parameters:
*       - in: query
*         name: date
*         schema:
*           type: string
*           format: date
*         required: false
*         description: Date to fetch movie times for (YYYY-MM-DD)
*         example: 2025-03-16
*     responses:
*       200:
*         description: GET movieTimes
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 code:
*                   type: number
*                   example: 200
*                 msg:
*                   type: string
*                   example: GET movieTimes
*                 time:
*                   type: array
*                   items:
*                     type: string
*                   example: ['9:20AM', '11:40AM', '1:20PM', '3:30PM', '5:40PM', '7:30PM', '9:20PM']
*       401:
*         description: Failed GET movieTimes
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 code:
*                   type: number
*                   example: 401
*                 msg:
*                   type: string
*                   example: "Failed GET movieTimes: [ERROR_MSG]"
*/











// seatsManager
/**
 * @swagger
 * connection:
 *   post:
 *     description: Manages live seat booking statuses by receiving and sending seat updates between users under the same movieId using socket.io WebSocket.
 *     tags:
 *       - /seatsManager/socket.io
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movieId:
 *                 type: string
 *                 example: "1-pavillion-17-9:30am"
 *     responses:
 *       101:
 *         description: WebSocket connection established
 */

/**
 * @swagger
 * join_movie:
 *   post:
 *     description: Joins a WebSocket room for a specific movieId to receive live seat updates.
 *     tags:
 *       - /seatsManager/socket.io
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movieId:
 *                 type: string
 *                 example: "1-pavillion-17-9:30am"
 *     responses:
 *       200:
 *         description: Seat status emitted for the joined movieId.
 */

/**
 * @swagger
 * select_seat:
 *   post:
 *     description: Marks a seat as selected (status 1) for a specific movieId and broadcasts the seat update.
 *     tags:
 *       - /seatsManager/socket.io
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movieId:
 *                 type: string
 *                 example: "1-pavillion-17-9:30am"
 *               seatId:
 *                 type: string
 *                 example: "A1"
 *     responses:
 *       200:
 *         description: Seat status broadcasted to users in the same movieId room.
 */

/**
 * @swagger
 * deselect_seat:
 *   post:
 *     description: Removes the selected status (status 1) from a seat and updates other users in the same movieId room.
 *     tags:
 *       - /seatsManager/socket.io
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movieId:
 *                 type: string
 *                 example: "1-pavillion-17-9:30am"
 *               seatId:
 *                 type: string
 *                 example: "A1"
 *     responses:
 *       200:
 *         description: Seat deselection status updated for all users in the room.
 */

/**
 * @swagger
 * disconnect:
 *   post:
 *     description: Handles client disconnection from the WebSocket.
 *     tags:
 *       - /seatsManager/socket.io
 *     responses:
 *       200:
 *         description: Client disconnected from WebSocket.
 */




/**
 * @swagger
 * /payForSeat:
 *   post:
 *     description: Process payment and update seat status
 *     tags:
 *       - /seatsManager
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movieId:
 *                 type: string
 *                 description: ID of the selected scheduled movie
 *                 example: "1-pavillion-17-9:30am"
 *               seats:
 *                 type: array
 *                 description: List of selected seat IDs
 *                 items:
 *                   type: string
 *                 example: ["A1", "A2", "B3"]
 *               subtotal:
 *                  type: float
 *                  description: Subtotal price to be paid for purchased seats
 *                  example: 2500.00
 *               payment:
 *                 type: object
 *                 description: Payment details (to be sent to bank API)
 *                 properties:
 *                   method:
 *                     type: string
 *                     example: "credit_card"
 *                   cardNumber:
 *                     type: string
 *                     example: "4111111111111111"
 *                   expiry:
 *                     type: string
 *                     example: "12/26"
 *                   cvv:
 *                     type: string
 *                     example: "123"
 *     responses:
 *       200:
 *         description: Payment successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 200
 *                 msg:
 *                   type: string
 *                   example: Payment successful
 *       401:
 *         description: Payment failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 401
 *                 msg:
 *                   type: string
 *                   example: "Payment failed: [error message]"
 */