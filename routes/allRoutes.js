import express from "express";
import { getPieTransactions } from "../controllers/getPieController.js";
import { getBarChartTransactions } from "../controllers/barChartController.js";
import { getStatTransactions } from "../controllers/statisticsController.js";
import {
  getTransactionsByFilter,
  getAllTransactionsByMonth,
} from "../controllers/transactionsController.js";

const router = express.Router();

router.get("/filter", getTransactionsByFilter);
router.get("/month", getAllTransactionsByMonth);
router.get("/stat-trasactions", getStatTransactions);
router.get("/bar-chart-trasactions", getBarChartTransactions);

router.get("/pie-trasactions", getPieTransactions);

export default router;
