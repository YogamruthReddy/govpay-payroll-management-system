import PDFDocument from 'pdfkit';

export const generatePayslipPDF = (payrollData, res) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });

            // Stream document to response
            doc.pipe(res);

            // Header Section
            doc.fontSize(20).text('GovPay - Government Payroll System', { align: 'center' });
            doc.moveDown();
            doc.fontSize(16).text('Payslip', { align: 'center' });
            doc.moveDown(2);

            // Employee and Payroll info
            doc.fontSize(12);
            doc.text(`Employee Name: ${payrollData.employee_name}`);
            doc.text(`Department: ${payrollData.department}`);
            doc.text(`Salary Month/Year: ${payrollData.month}/${payrollData.year}`);
            
            doc.moveDown(2);

            // Horizontal Line
            doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown();

            // Earnings
            doc.fontSize(14).text('Earnings', { underline: true });
            doc.fontSize(12);
            doc.text(`Basic Pay: ${Number(payrollData.basic_pay).toFixed(2)} Rs`);
            doc.text(`HRA: ${Number(payrollData.hra).toFixed(2)} Rs`);
            doc.text(`DA (Default Calculation): ${(Number(payrollData.basic_pay) * 0.1).toFixed(2)} Rs`);
            doc.text(`Allowances: 2000.00 Rs`); // Hardcoded here for visual as per logic
            
            // Re-calculate gross for display parity with the route if we haven't stored everything
            const basic = Number(payrollData.basic_pay);
            const hra = Number(payrollData.hra);
            const da = basic * 0.1;
            const gross = basic + hra + da + 2000;
            
            doc.moveDown();
            doc.fontSize(12).text(`Total Earnings (Gross): ${gross.toFixed(2)} Rs`, { bold: true });

            doc.moveDown(2);

            // Horizontal Line
            doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown();

            // Deductions
            doc.fontSize(14).text('Deductions', { underline: true });
            doc.fontSize(12);
            doc.text(`Total Deductions Recorded: ${Number(payrollData.deductions).toFixed(2)} Rs`);
            
            const pf = basic * 0.12;
            const tax = gross * 0.1;
            doc.text(`Provident Fund (Est): ${pf.toFixed(2)} Rs`);
            doc.text(`Tax (Est): ${tax.toFixed(2)} Rs`);

            doc.moveDown(2);

             // Horizontal Line
             doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
             doc.moveDown();

            // Net Pay block
            doc.fontSize(16).text(`Net Salary: ${Number(payrollData.net_pay).toFixed(2)} Rs`, { align: 'right', bold: true });

            doc.moveDown(3);
            doc.fontSize(10).text('This is a computer generated payslip and does not require signature.', { align: 'center', italic: true });

            doc.end();
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};
