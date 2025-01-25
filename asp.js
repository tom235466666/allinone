const { MongoClient } = require('mongodb');

// Verbindung zur MongoDB herstellen
const uri = 'mongodb+srv://retro143tutu:tertiluwer34@cluster0.rtf9g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);

async function findUserByName() {
  try {
    // Verbindung zur Datenbank herstellen
    await client.connect();
    console.log('Verbunden zur MongoDB');

    // Datenbank und Sammlung auswählen
    const database = client.db('meinDatenbank');
    const users = database.collection('benutzer');

    // Suchen nach einem Benutzer mit einem bestimmten Namen
    const userName = 'Max Mustermann'; // Beispielname
    const user = await users.findOne({ name: userName });

    if (user) {
      console.log(`Gefundener Benutzer:`, user);
    } else {
      console.log(`Kein Benutzer mit dem Namen "${userName}" gefunden.`);
    }
  } catch (error) {
    console.error('Fehler beim Suchen des Benutzers:', error);
  } finally {
    // Verbindung schließen
    await client.close();
  }
}

// Aufrufen der Funktion zum Suchen des Benutzers
findUserByName().catch(console.dir);
