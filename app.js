const { MongoClient } = require('mongodb');

// Verbindung zur MongoDB-Instanz herstellen
const uri = 'mongodb+srv://retro143tutu:tertiluwer34@cluster0.rtf9g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);

async function run() {
  try {
    // Verbindung zur Datenbank herstellen
    await client.connect();
    console.log('Verbunden zur MongoDB');

    // Datenbank und Sammlung auswählen
    const database = client.db('meinDatenbank');
    const users = database.collection('benutzer');

    // Neuen Benutzer einfügen
    const newUser = {
      name: 'Max Mustermann',
      email: 'max@beispiel.de',
      passwort: 'geheim123',
      erstelltAm: new Date(),
    };

    const result = await users.insertOne(newUser);
    console.log(`Neuer Benutzer erstellt mit der ID: ${result.insertedId}`);
  } finally {
    // Verbindung schließen
    await client.close();
  }
}

run().catch(console.dir);
