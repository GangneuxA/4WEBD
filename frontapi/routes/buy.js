var express = require("express");
var router = express.Router();

const auth = require("../middleware/auth");
const buyControllers = require("../controllers/buyControllers");

/**
 * @swagger
 * components:
 *   schemas:
 *     Buy:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: unique buy id.
 *         User:
 *           type: string
 *           description: The user's id.
 *         Event:
 *           type: string
 *           description: The event's id.
 *         Count:
 *           type: integer
 *           description: .
 *         at:
 *           type: string
 *           description: .
 *   
 */

/**
 * @swagger
 * /buy:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer les achats
 *     tags: 
 *       - Buy
 *     description: Récupère une liste paginée des achats.
 *     parameters:
 *       - in: query
 *         name: page
 *         description: Numéro de la page à récupérer.
 *         schema:
 *           type: integer
 *       - in: query
 *         name: perPage
 *         description: Nombre d'achats par page.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Succès de la requête. Retourne une liste paginée des achats.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Success
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 5
 *                 totalCount:
 *                   type: integer
 *                   example: 50
 *                 buy:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Buy'
 *       '500':
 *         description: Une erreur s'est produite lors de la récupération des achats.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Error
 *                 message:
 *                   type: string
 *                   example: An error occurred while fetching accounts
 *                 error:
 *                   type: string
 */
router.get("/", auth, buyControllers.index);

/**
 * @swagger
 * /buy/{id}:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Récupérer les achats par utilisateur
 *     tags: 
 *       - Buy
 *     description: Récupère les achats effectués par un utilisateur spécifié.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID de l'utilisateur dont on veut récupérer les achats.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Succès de la requête. Retourne une liste des achats effectués par l'utilisateur.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Buy'
 *       '500':
 *         description: Une erreur s'est produite lors de la récupération des achats.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Error
 *                 message:
 *                   type: string
 *                   example: An error occurred while fetching accounts
 *                 error:
 *                   type: string
 */
router.get("/:id", auth, buyControllers.findByUserId);

/**
 * @swagger
 * /buy:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Créer un nouvel achat
 *     tags: 
 *       - Buy
 *     description: Crée un nouvel achat avec les détails fournis.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 description: ID de l'utilisateur effectuant l'achat.
 *               event:
 *                 type: string
 *                 description: ID de l'événement acheté.
 *               count:
 *                 type: integer
 *                 description: Nombre d'articles achetés.
 *             required:
 *               - user
 *               - event
 *               - count
 *     responses:
 *       '201':
 *         description: Achat créé avec succès. Retourne les détails de l'achat créé.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Buy'
 *       '500':
 *         description: Une erreur s'est produite lors de la création de l'achat.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Error
 *                 message:
 *                   type: string
 *                   example: An error occurred while creating the Buy.
 *                 error:
 *                   type: string
 */
router.post("/", auth, buyControllers.insert);

module.exports = router;
