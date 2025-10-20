const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  let connection;
  
  try {
    // Connect to MySQL server (without specifying database)
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '', // XAMPP default
    });

    console.log('Connected to MySQL server');

    // Read and execute the setup script
    const setupScript = fs.readFileSync(path.join(__dirname, 'setup-mysql.sql'), 'utf8');
    const statements = setupScript.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement);
        console.log('Executed:', statement.substring(0, 50) + '...');
      }
    }

    console.log('Database setup completed successfully!');

    // Read and execute the seed script
    const seedScript = fs.readFileSync(path.join(__dirname, 'seed-mysql.sql'), 'utf8');
    const seedStatements = seedScript.split(';').filter(stmt => stmt.trim());
    
    for (const statement of seedStatements) {
      if (statement.trim()) {
        await connection.execute(statement);
        console.log('Seeded:', statement.substring(0, 50) + '...');
      }
    }

    console.log('Database seeding completed successfully!');

  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();
