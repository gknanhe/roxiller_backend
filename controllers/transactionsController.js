import Transaction from "../models/transaction.js";

export const getTransactionsByFilter = async (req, res) => {
  try {
    const page = parseInt(req.body.page) || 1;
    const perPage = parseInt(req.body.perPage) || 10;

    // Search parameters
    const search = req.body.search || "";
    const maxPriceDifference = 2; // Define the maximum allowable difference between the search price and transaction price

    // MongoDB query conditions for search
    const conditions = {
      // $or: [
      //   { title: { $regex: search, $options: "i" } }, // Case-insensitive search for title
      //   { description: { $regex: search, $options: "i" } }, // Case-insensitive search for description
      //   {
      //     // Fuzzy search for price
      //     $expr: {
      //       $lte: [
      //         { $abs: { $subtract: ["$price", parseFloat(search)] } }, // Calculate the absolute difference between the prices
      //         maxPriceDifference, // Maximum allowable difference
      //       ],
      //     },
      //   },
      // ],
    };

    // find transaction in BD

    const totalCount = await Transaction.countDocuments(conditions);
    // const transactions = await Transaction.find(conditions)
    //   .skip((page - 1) * perPage)
    //   .limit(perPage);

    const transactions = await Transaction.aggregate([
      {
        $search: {
          text: {
            path: ["title", "price", "description"],
            query: "Sand",
          },
        },
      },
    ]).skip((page - 1) * perPage);
    console.log(transactions);
    // Calculate total pages for pagination
    const totalPages = Math.ceil(totalCount / perPage);

    if (!transactions) return res.status(200).json([]);

    res.json({
      transactions,
      page,
      perPage,
      totalPages,
      totalCount,
    });
  } catch (error) {
    console.log("error in getTransactionByFilter controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllTransactionsByMonth = async (req, res) => {
  try {
    console.log("inside month get", req.query);
    const page = parseInt(req.query.page) || 1;
    const limit = 10;

    // Calculate the skip value based on pagination parameters
    const skip = (page - 1) * limit;
    let { month } = req.query;
    console.log("month", month);
    // Ensure that the month is a valid number between 1 and 12
    month = parseInt(month);
    if (!isValidMonth(month)) {
      return res.status(400).json({
        error: "Invalid month format. Specify a number between 1 and 12.",
      });
    }

    // Query to find transactions with the specified month
    const transactions = await Transaction.find({ month: month })
      .skip(skip)
      .limit(limit);

    // console.log(transactions);
    // Count total number of transactions for the specified month
    const totalCount = await Transaction.countDocuments({ month: month });

    // Calculate total number of pages
    const totalPages = Math.ceil(totalCount / limit);

    // Return the retrieved transactions along with pagination metadata
    res.status(200).json({
      transactions,
      page,
      limit,
      totalPages,
      totalCount,
    });
  } catch (error) {
    console.log("Error in getAllTransaction controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Function to validate the month format
function isValidMonth(month) {
  return !isNaN(month) && month >= 1 && month <= 12;
}
