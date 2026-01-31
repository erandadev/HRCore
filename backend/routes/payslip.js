const express = require("express");
const auth = require("../middleware/auth");
const axios = require("axios");

const puppeteer = require("puppeteer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// @route api/payslip
// @desc  Get Payslip data
// @Access Private
router.post("/", auth("user"), async (req, res) => {
  try {
    const { year, month } = req.body;
    const empId = req.user.employeeId;

    const axios_res = await axios.post(process.env.PAY_SLIP_DATA_LINK, {
      year,
      month,
      employee_id: empId,
    });

    let payslipData = axios_res.data;

    if (payslipData.status === "NOT_FOUND")
      return res
        .status(404)
        .json({ status: "NOT_FOUND", message: "Data not found" });

    payslipData = payslipData.data;

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    payslipData["month"] = monthNames[month - 1];

    // Format all numeric properties
    for (let key in payslipData) {
      if (
        typeof payslipData[key] === "number" &&
        key !== "year" &&
        key !== "epf_number"
      ) {
        if (payslipData[key] === 0) payslipData[key] = "";

        payslipData[key] = payslipData[key].toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        if (key === "no_pay" && payslipData[key] !== "")
          payslipData[key] = `-${payslipData[key]}`;
      }
    }

    // Load and Compile HTML Template
    const templatePath = path.join(__dirname, "../templates/payslip.html");
    const htmlTemplate = fs.readFileSync(templatePath, "utf8");
    const template = handlebars.compile(htmlTemplate);
    const finalHtml = template(payslipData);

    // Make PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage", // Helps with memory limits on free tiers
        "--single-process",
      ],
    });
    const page = await browser.newPage();

    await page.setContent(finalHtml, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" },
    });

    await browser.close();

    // Send PDF to Frontend
    res.set({
      "Content-Type": "application/pdf",
      "Content-Length": pdfBuffer.length,
    });
    res.send(pdfBuffer);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: "ERROR", message: "SERVER ERROR" });
  }
});

module.exports = router;
