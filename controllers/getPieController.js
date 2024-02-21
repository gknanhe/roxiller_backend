// import Transaction from "../models/transaction.js";

// export const getPieTransactions = async (req, res) => {
//   try {
//     // Extract the month from the request body
//     let { month } = req.body;

//     // Ensure that the month is a valid number between 1 and 12
//     month = parseInt(month);
//     if (!isValidMonth(month)) {
//       return res.status(400).json({
//         error: "Invalid month format. Specify a number between 1 and 12.",
//       });
//     }

//     // Set the start and end dates for the selected month
//     // Set the start and end dates for the selected month
//     const startDate = new Date(Date.UTC(2022, month - 1, 1, 0, 0, 0));
//     const endDate = new Date(Date.UTC(2022, month, 1, 0, 0, 0));
//     console.log(startDate, endDate);

//     // MongoDB aggregation pipeline to group transactions by category and count occurrences
//     const aggregationPipeline = [
//       {
//         $match: {
//           dateOfSale: {
//             $gte: startDate,
//             $lt: endDate,
//           },
//         },
//       },
//       {
//         $group: {
//           _id: "$category",
//           count: { $sum: 1 },
//         },
//       },
//     ];

//     // Execute the aggregation pipeline
//     const pieChartData = await Transaction.aggregate(aggregationPipeline);

//     // Return the pie chart data
//     res.json(pieChartData);
//   } catch (error) {
//     console.error("Error in getPieTransactions controller", error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// // Function to validate the month format
// function isValidMonth(month) {
//   return !isNaN(month) && month >= 1 && month <= 12;
// }

//for months only

import Transaction from "../models/transaction.js";

export const getPieTransactions = async (req, res) => {
  try {
    // Extract the month from the request body
    let { month } = req.body;

    // Ensure that the month is a valid number between 1 and 12
    month = parseInt(month);
    if (!isValidMonth(month)) {
      return res.status(400).json({
        error: "Invalid month format. Specify a number between 1 and 12.",
      });
    }

    // Set the start and end dates for the selected month
    // Set the start and end dates for the selected month
    // const startDate = new Date(Date.UTC(YYYY, month - 1, 1, 0, 0, 0));
    // const endDate = new Date(Date.UTC(YYYY, month, 1, 0, 0, 0));
    // console.log(startDate, endDate);

    // MongoDB aggregation pipeline to group transactions by category and count occurrences
    const aggregationPipeline = [
      {
        $match: {
          month: parseInt(month),
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ];

    // Execute the aggregation pipeline
    const pieChartData = await Transaction.aggregate(aggregationPipeline);

    // Return the pie chart data
    res.json(pieChartData);
  } catch (error) {
    console.error("Error in getPieTransactions controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Function to validate the month format
function isValidMonth(month) {
  return !isNaN(month) && month >= 1 && month <= 12;
}
