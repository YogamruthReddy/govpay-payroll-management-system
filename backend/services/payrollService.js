export const calculateSalary = (employee, leavesTaken) => {
    const basic = employee.basic_salary || 0;

    // Based on the provided formula:
    const hra = basic * 0.2;
    const da = basic * 0.1;
    const allowances = 2000;

    const gross = basic + hra + da + allowances;

    const pf = basic * 0.12;
    const tax = gross * 0.1;

    // Leave deductions are calculated per approved leave days in the month
    const leaveDeduction = (basic / 30) * leavesTaken;

    const totalDeductions = pf + tax + leaveDeduction;
    const netSalary = gross - totalDeductions;

    return {
        basicPay: basic,
        hra,
        da,
        allowances,
        gross,
        pf,
        tax,
        leaveDeduction,
        deductions: totalDeductions,
        netPay: netSalary
    };
};
