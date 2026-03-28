import bcrypt from 'bcryptjs';
import { User, Employee, Payroll, ServiceHistory } from './models/index.js';

const seedDatabase = async () => {
    try {
        console.log('🌱 Seeding database...');

        // Create sample employees
        const emp1 = Employee.create(
            'James Anderson',
            'james.anderson@gov.in',
            'Technology',
            'Senior Developer',
            'B-14',
            50000,
            '2019-01-15'
        );

        const emp2 = Employee.create(
            'Sarah Connor',
            'sarah.connor@gov.in',
            'Civil Engineering',
            'HR Director',
            'A-12',
            80000,
            '2018-06-10'
        );

        const emp3 = Employee.create(
            'Robert Wilson',
            'robert.wilson@gov.in',
            'Administration',
            'System Administrator',
            'A-15',
            75000,
            '2017-03-20'
        );

        console.log('✅ Employees created');

        // Create users with hashed passwords
        const hashedPassword = await bcrypt.hash('password123', 10);

        User.create('james.anderson', hashedPassword, 'james.anderson@gov.in', 'EMPLOYEE', emp1.lastInsertRowid);
        User.create('sarah.connor', hashedPassword, 'sarah.connor@gov.in', 'OFFICER', emp2.lastInsertRowid);
        User.create('robert.wilson', hashedPassword, 'robert.wilson@gov.in', 'ADMIN', emp3.lastInsertRowid);

        console.log('✅ Users created (password: password123)');

        // Create payroll records
        Payroll.create(emp1.lastInsertRowid, 10, 2023, 2800, 450, 200, 3050);
        Payroll.create(emp1.lastInsertRowid, 11, 2023, 2800, 450, 200, 3050);
        Payroll.create(emp1.lastInsertRowid, 12, 2023, 2800, 450, 200, 3050);

        console.log('✅ Payroll records created');

        // Create service history
        ServiceHistory.create(
            emp1.lastInsertRowid,
            'Joining',
            'Joined Service',
            'Appointed as Junior Developer in the Ministry of IT.',
            '2019-01-15'
        );

        ServiceHistory.create(
            emp1.lastInsertRowid,
            'Transfer',
            'Department Transfer',
            'Transferred from IT Support to Software Development Wing.',
            '2021-06-10'
        );

        ServiceHistory.create(
            emp1.lastInsertRowid,
            'Promotion',
            'Senior Developer Promotion',
            'Promoted to Senior Grade 1 based on annual performance review.',
            '2023-03-15'
        );

        console.log('✅ Service history created');
        console.log('\n🎉 Database seeded successfully!\n');
        console.log('📝 Sample credentials:');
        console.log('   Employee: james.anderson / password123');
        console.log('   Officer:  sarah.connor / password123');
        console.log('   Admin:    robert.wilson / password123\n');

    } catch (error) {
        console.error('❌ Error seeding database:', error.message);
    }
};

seedDatabase();
