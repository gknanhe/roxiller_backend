import Transaction from "../models/transaction.js";

export const getStatTransactions = async (req, res) => {
  try {
    const { month } = req.query;
    console.log("inside Statistics");
    // Extract the month part from the requested month (e.g., "07" from "2021-07")
    const requestedMonth = month.padStart(2, "0"); // Ensure it's a two-digit format

    // MongoDB aggregation pipeline to find transactions by month regardless of the year
    const transactions = await Transaction.aggregate([
      {
        $match: {
          // Extract the month part from the dateOfSale field and match it with the requested month
          $expr: { $eq: [{ $substr: ["$dateOfSale", 5, 2] }, requestedMonth] },
        },
      },
    ]);

    // Calculate total sale amount, total number of sold items, and total number of unsold items
    const totalSaleAmount = transactions.reduce(
      (total, transaction) => total + transaction.price,
      0
    );
    const totalSoldItems = transactions.filter(
      (transaction) => transaction.sold
    ).length;
    const totalNotSoldItems = transactions.filter(
      (transaction) => !transaction.sold
    ).length;

    // Return response with calculated statistics
    res.json({
      totalSaleAmount,
      totalSoldItems,
      totalNotSoldItems,
    });
  } catch (error) {
    console.log("error in getStatTransactions controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
