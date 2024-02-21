import Transaction from "../models/transaction.js";

export const getBarChartTransactions = async (req, res) => {
  try {
    // Extract the month from the request body
    const { month } = req.body;

    // Validate the month
    if (!isValidMonth(month)) {
      return res.status(400).json({ error: "Invalid month format." });
    }

    // Parse the month to ensure it's a two-digit format
    const parsedMonth = month.toString().padStart(2, "0");

    // Define price ranges
    // const priceRanges = [
    //   { min: 0, max: 100 },
    //   { min: 101, max: 200 },
    //   { min: 201, max: 300 },
    //   { min: 301, max: 400 },
    //   { min: 401, max: 500 },
    //   { min: 501, max: 600 },
    //   { min: 601, max: 700 },
    //   { min: 701, max: 800 },
    //   { min: 801, max: 900 },
    //   { min: 901, max: Infinity },
    // ];

    // MongoDB aggregation pipeline to group transactions by price range
    const aggregationPipeline = [
      {
        $match: {
          month: parseInt(parsedMonth), // Filter documents by month
        },
      },

      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $lte: ["$price", 100] }, then: "0 - 100" },
                { case: { $lte: ["$price", 200] }, then: "101 - 200" },
                { case: { $lte: ["$price", 300] }, then: "201 - 300" },
                { case: { $lte: ["$price", 400] }, then: "301 - 400" },
                { case: { $lte: ["$price", 500] }, then: "401 - 500" },
                { case: { $lte: ["$price", 600] }, then: "501 - 600" },
                { case: { $lte: ["$price", 700] }, then: "601 - 700" },
                { case: { $lte: ["$price", 800] }, then: "701 - 800" },
                { case: { $lte: ["$price", 900] }, then: "801 - 900" },
                { case: { $gt: ["$price", 900] }, then: "901-above" },
              ],
              default: "Unknown",
            },
          },
          count: { $sum: 1 },
        },
      },
    ];

    // Execute the aggregation pipeline
    const result = await Transaction.aggregate(aggregationPipeline);
    console.log("result", result);

    // Sort the result array in ascending order based on the price range
    result.sort((a, b) => {
      // Extract the numerical values from the range strings
      const rangeA = parseInt(a._id.split(" ")[0]);
      const rangeB = parseInt(b._id.split(" ")[0]);

      // Compare the numerical values
      return rangeA - rangeB;
    });

    console.log(result);

    // Return the response with bar chart data
    res.json(result);
  } catch (error) {
    console.error("Error in getBarChartTransactions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Function to validate the month format
function isValidMonth(month) {
  const monthNumber = parseInt(month);
  return !isNaN(monthNumber) && monthNumber >= 1 && monthNumber <= 12;
}
