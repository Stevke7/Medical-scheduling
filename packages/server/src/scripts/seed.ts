import mongoose from 'mongoose';
import { config } from '../config/index.js';
import { User, Patient, Event } from '../models/index.js';
import { AuthService } from '../services/auth.service.js';
import { addDays, addHours } from 'date-fns';

const seedData = async (): Promise<void> => {
  try {
    console.log('🌱 Starting database seed...\n');

    // Connect to MongoDB
    await mongoose.connect(config.mongodbUri);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Patient.deleteMany({});
    await Event.deleteMany({});
    console.log('✅ Existing data cleared\n');

    // Create doctors
    console.log('👨‍⚕️ Creating clinic users (doctors)...');
    const doctors = [
      {
        email: 'dr.smith@clinic.com',
        password: await AuthService.hashPassword('password123'),
        name: 'Dr. John Smith',
        timezone: 'America/New_York',
      },
      {
        email: 'dr.jones@clinic.com',
        password: await AuthService.hashPassword('password123'),
        name: 'Dr. Sarah Jones',
        timezone: 'Europe/London',
      },
      {
        email: 'dr.mueller@clinic.com',
        password: await AuthService.hashPassword('password123'),
        name: 'Dr. Hans Mueller',
        timezone: 'Europe/Berlin',
      },
    ];

    const createdDoctors = await User.insertMany(doctors);
    console.log(`✅ Created ${createdDoctors.length} doctors\n`);

    // Create patients
    console.log('🏥 Creating patients...');
    const patients = [
      {
        email: 'alice@example.com',
        password: await AuthService.hashPassword('password123'),
        name: 'Alice Johnson',
        timezone: 'America/Los_Angeles',
      },
      {
        email: 'bob@example.com',
        password: await AuthService.hashPassword('password123'),
        name: 'Bob Williams',
        timezone: 'America/New_York',
      },
      {
        email: 'carol@example.com',
        password: await AuthService.hashPassword('password123'),
        name: 'Carol Davis',
        timezone: 'Europe/Paris',
      },
      {
        email: 'david@example.com',
        password: await AuthService.hashPassword('password123'),
        name: 'David Brown',
        timezone: 'Asia/Tokyo',
      },
      {
        email: 'emma@example.com',
        password: await AuthService.hashPassword('password123'),
        name: 'Emma Wilson',
        timezone: 'Australia/Sydney',
      },
    ];

    const createdPatients = await Patient.insertMany(patients);
    console.log(`✅ Created ${createdPatients.length} patients\n`);

    // Create some sample events
    console.log('📅 Creating sample events...');
    const now = new Date();
    const events = [
      // Events for Dr. Smith with Alice
      {
        title: 'Annual Checkup',
        doctorId: createdDoctors[0]._id,
        patientId: createdPatients[0]._id,
        startTime: addDays(addHours(now, 2), 1), // Tomorrow + 2 hours
        endTime: addDays(addHours(now, 2.5), 1),
        reminderSent: false,
      },
      {
        title: 'Follow-up Consultation',
        doctorId: createdDoctors[0]._id,
        patientId: createdPatients[0]._id,
        startTime: addDays(addHours(now, 3), 7), // Next week
        endTime: addDays(addHours(now, 3.5), 7),
        reminderSent: false,
      },
      // Events for Dr. Smith with Bob
      {
        title: 'Blood Pressure Check',
        doctorId: createdDoctors[0]._id,
        patientId: createdPatients[1]._id,
        startTime: addDays(addHours(now, 4), 2),
        endTime: addDays(addHours(now, 4.5), 2),
        reminderSent: false,
      },
      // Events for Dr. Jones with Carol
      {
        title: 'Dermatology Consultation',
        doctorId: createdDoctors[1]._id,
        patientId: createdPatients[2]._id,
        startTime: addDays(addHours(now, 1), 3),
        endTime: addDays(addHours(now, 1.5), 3),
        reminderSent: false,
      },
      // Event happening soon (for testing reminders)
      {
        title: 'Urgent Consultation',
        doctorId: createdDoctors[0]._id,
        patientId: createdPatients[1]._id,
        startTime: addHours(now, 0.1), // In about 6 minutes
        endTime: addHours(now, 0.6),
        reminderSent: false,
      },
    ];

    const createdEvents = await Event.insertMany(events);
    console.log(`✅ Created ${createdEvents.length} sample events\n`);

    // Print summary
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  🎉 Seed completed successfully!');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');
    console.log('  📋 Test Accounts:');
    console.log('');
    console.log('  CLINIC USERS (Doctors):');
    console.log('  ─────────────────────────────────────────────────────────');
    doctors.forEach(d => {
      console.log(`    Email: ${d.email}`);
      console.log(`    Password: password123`);
      console.log(`    Timezone: ${d.timezone}`);
      console.log('');
    });
    console.log('  PATIENTS:');
    console.log('  ─────────────────────────────────────────────────────────');
    patients.forEach(p => {
      console.log(`    Email: ${p.email}`);
      console.log(`    Password: password123`);
      console.log(`    Timezone: ${p.timezone}`);
      console.log('');
    });
    console.log('═══════════════════════════════════════════════════════════');

  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed');
    process.exit(0);
  }
};

seedData();
