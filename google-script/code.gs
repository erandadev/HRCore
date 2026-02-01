// ----------------| GLOBAL VARIABLES |---------------------
const main_config_sheet_id = "ID_OF_THE_GOOGLE_SHEET";
const id_sheet_name = "SHEET_ID";
const main_log_sheet_id = "LOGS";

function doPost(e) {
  const main_config_sheet = SpreadsheetApp.openById(main_config_sheet_id);
  const month_wise_id_sheet = main_config_sheet.getSheetByName(id_sheet_name);
  const main_log_sheet = main_config_sheet.getSheetByName(main_log_sheet_id);

  try {
    const raw_data = e.postData.contents;
    const data = JSON.parse(raw_data);

    const year = data.year;
    const month = data.month;
    const employee_id = data.employee_id;

    if (
      year === "" ||
      month === "" ||
      employee_id === "" ||
      year === undefined ||
      month === undefined ||
      employee_id === undefined
    ) {
      return ContentService.createTextOutput(
        JSON.stringify({
          status: "DATA_ERROR",
          message: `API Required 3 parameters`,
        }),
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // 1. Find the last row that actually has content
    // const lastRow = month_wise_id_sheet.getLastRow();

    // getRange(startRow, startColumn, numRows, numColumns) if using get Range
    const month_wise_sheet_data = month_wise_id_sheet
      .getDataRange()
      .getValues();

    const payroll_sheet_id_row_index = month_wise_sheet_data.findIndex(
      (row) => row[0] === year && row[1] === month,
    );

    if (payroll_sheet_id_row_index !== -1) {
      const payroll_sheet_id =
        month_wise_sheet_data[payroll_sheet_id_row_index][2];

      if (payroll_sheet_id !== "") {
        const PAYSLIP_SHEET_NAME = "Payslip";
        const payroll_sheet = SpreadsheetApp.openById(payroll_sheet_id);
        const payslip = payroll_sheet.getSheetByName(PAYSLIP_SHEET_NAME);

        const payroll_data = payslip.getDataRange().getValues();
        const employee_data_row_index = payroll_data.findIndex(
          (row) => row[0] === employee_id,
        );

        if (employee_data_row_index !== -1) {
          const employee_payroll_data = payroll_data[employee_data_row_index];

          const name = employee_payroll_data[2];
          const designation = employee_payroll_data[3];
          const epf_number = employee_payroll_data[1];
          const basic_pay = employee_payroll_data[4];
          const br_allowance_1 = employee_payroll_data[5];
          const br_allowance_2 = employee_payroll_data[6];
          const travelling_allowance = employee_payroll_data[7];
          const attendance_allowance = employee_payroll_data[8];
          const col_allowance = employee_payroll_data[9];
          const no_pay = employee_payroll_data[10];
          const commision = employee_payroll_data[11];
          const additional_commision = employee_payroll_data[12];
          const gross_pay = employee_payroll_data[13];
          const epf_8 = employee_payroll_data[14];
          const salary_advance = employee_payroll_data[15];
          const staff_loan = employee_payroll_data[16];
          const stamp_duty = employee_payroll_data[17];
          const payee_tax = employee_payroll_data[18];
          const total_deductions = employee_payroll_data[19];
          const net_pay = employee_payroll_data[20];
          const epf_12 = employee_payroll_data[21];
          const etf_3 = employee_payroll_data[23];

          const output_obj = {
            company: "Biseka Pvt Ltd",
            month,
            year,
            name: name,
            designation,
            staff_number: employee_id,
            epf_number,
            basic_pay,
            br_allowance_1,
            br_allowance_2,
            travelling_allowance,
            attendance_allowance,
            col_allowance,
            no_pay,
            commision,
            additional_commision,
            gross_pay,
            epf_8,
            salary_advance,
            staff_loan,
            stamp_duty,
            payee_tax,
            total_deductions,
            net_pay,
            epf_12,
            etf_3,
          };

          return ContentService.createTextOutput(
            JSON.stringify({ status: "SUCCESS", data: output_obj }),
          ).setMimeType(ContentService.MimeType.JSON);
        } else {
          return ContentService.createTextOutput(
            JSON.stringify({
              status: "NOT_FOUND",
              message: `Invald Employee ID`,
            }),
          ).setMimeType(ContentService.MimeType.JSON);
        }
      } else {
        return ContentService.createTextOutput(
          JSON.stringify({ status: "NOT_FOUND", message: `Data not found` }),
        ).setMimeType(ContentService.MimeType.JSON);
      }
    } else {
      return ContentService.createTextOutput(
        JSON.stringify({
          status: "NOT_FOUND",
          message: `No data for Year ${year} and month ${month}`,
        }),
      ).setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    // TODO: LOG ERROR MESSAGE IN LOG SHEET
    return ContentService.createTextOutput(
      JSON.stringify({ status: "ERROR", message: `Something went wrong` }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
