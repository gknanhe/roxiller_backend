import Transaction from "../models/transaction.js";

export const getTransactionsByFilter = async (req, res) => {
  try {
    const page = parseInt(req.body.page) || 1;
    const perPage = parseInt(req.body.perPage) || 10;

    // Search parameters
    const search = req.body.search || "";

    // MongoDB query conditions for search
    const conditions = {
      $or: [
        { title: { $regex: search, $options: "i" } }, // Case-insensitive search for title
        { description: { $regex: search, $options: "i" } }, // Case-insensitive search for description
        { price: parseFloat(search) || 0 }, // Search by price (if numeric)
      ],
    };

    // find transaction in BD

    const totalCount = await Transaction.countDocuments(conditions);
    const transactions = await Transaction.find(conditions)
      .skip((page - 1) * perPage)
      .limit(perPage);

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

export const getAllTransactions = async (req, res) => {
  try {
    const page = parseInt(req.body.page) || 1;
    const limit = 10;

    // Calculate the skip value based on pagination parameters
    const skip = (page - 1) * limit;

    const transactions = await Transaction.find().skip(skip).limit(limit);

    if (!transactions) return res.status(200).json([]);

    // Count total number of transactions
    const totalCount = await Transaction.countDocuments();

    // Calculate total number of pages
    const totalPages = Math.ceil(totalCount / limit);

    // Return the retrieved transactions along with pagination metadata
    res.json({
      transactions,
      page,
      limit,
      totalPages,
      totalCount,
    });
  } catch (error) {
    console.log("error in getAllTransaction controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
