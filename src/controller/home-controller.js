import {Router} from "express";
const router = Router();
/**
 * @openapi
 * /:
 *  get:
 *    summary: Endpoint for render index view
 *    description: Render index view (home-screen).
 *    responses:
 *     200:
 *      description: Success. Render index view.
 *      content:
 *          text/html:
 *             example: home-screen.ejs
 * 
*/
router.get('/', (req, res) => res.render("home-screen"));
/**
 * @openapi
 * /home:
 *  get:
 *    summary: Endpoint for render index view
 *    description: Render index view (home-screen).
 *    responses:
 *     200:
 *      description: Success. Render index view.
 *      content:
 *          text/html:
 *             example: home-screen.ejs
 * 
*/
router.get('/home', (req, res) => res.redirect("/"));
export default router;
