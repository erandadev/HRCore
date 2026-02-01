# HRCore - Smart Payslip Management System

HRCore is a professional grade HR and Payroll platform that bridges the gap between spreadsheet based accounting and modern web applications. It allows businesses to maintain their payroll data in Google Sheets while providing employees with a secure, high-end portal to view and download PDF payslips.

## The Core Architecture

- The system is designed with a "Source-of-Truth" philosophy

- **Payroll Management:** Admin enters data into a familiar Google Sheet.

- **Data Extraction:** A custom Google Apps Script acts as a serverless API, fetching and formatting the spreadsheet data.

- **Application Logic:** The Node.js/Express backend consumes the Google Script data and manages user sessions.

- **Security & Roles:** PostgreSQL (Supabase) handles persistent user accounts, authentication, and role management.

* **PDF Generation:** Puppeteer renders high-fidelity, printable PDF payslips directly from the browser view.

## Tech Stack

**Frontend:** React.js, Tailwind CSS, Lucide Icons.

**Backend:** Node.js, Express.js.

**Database:** PostgreSQL (via Supabase) for user identity and security.

**Data Source:** Google Sheets via Google Apps Script (REST API).

**Automation:** Puppeteer for PDF generation.

**Auth:** JWT with secure HTTP-only cookies.

## Google Sheets Integration

This app requires zero manual payroll entry on the web portal. By using Google Apps Script, the app dynamically reads the latest payroll data directly from your specific Google Sheet.

## The Google Apps Script Code

To make this work, create a script in your Google Sheet (Extensions > Apps Script) and paste the code inside the google-script folder:

> Deploy this as a Web App and set "Who has access" to "Anyone". Copy the URL into your backend .env as PAYROLL_API_URL.

## Key Features

- **Employee Self Service:** Employees log in using their ID to view their specific payroll history.

- **PDF Exports:** One click "Download PDF" for all payslips, perfectly formatted for printing.

- **Zero-Database Payroll:** Since payroll lives in Google Sheets, there is no need to worry about complex database migrations for monthly salary updates.

## License

Distributed under the **MIT** License.
