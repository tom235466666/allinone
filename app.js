const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs'); // Zum Hashen des Passworts
const jwt = require('jsonwebtoken'); // Für die Erstellung eines JWT-Tokens (optional für Authentifizierung)

const uri = 'mongodb+srv://retro143tutu:tertiluwer34@cluster0.rtf9g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);

// Express App erstellen
const app = express();

// CORS aktivieren
app.use(cors());  // Dies erlaubt Anfragen von jedem Ursprung (sehr großzügig, für Entwicklung ok)

// Middleware, um JSON-Daten zu parsen
app.use(express.json());

// POST-Route zum Hinzufügen eines neuen Benutzers
app.post('/benutzer', async (req, res) => {
  const { name, email, passwort } = req.body;

  if (!name || !email || !passwort) {
    return res.status(400).json({ error: 'Name, Email und Passwort sind erforderlich' });
  }

  try {
    // Verbindung zur MongoDB herstellen
    await client.connect();
    console.log('Verbunden zur MongoDB');

    // Datenbank und Sammlung auswählen
    const database = client.db('meinDatenbank');
    const users = database.collection('benutzer');

    // Passwort hashen
    const hashedPasswort = await bcrypt.hash(passwort, 10);

    // Neuen Benutzer erstellen
    const newUser = {
      name,
      email,
      passwort: hashedPasswort,
      erstelltAm: new Date(),
    };

    const result = await users.insertOne(newUser);
    console.log(`Neuer Benutzer erstellt mit der ID: ${result.insertedId}`);

    // Erfolgreiche Antwort senden
    res.status(201).json({
      message: 'Benutzer erfolgreich erstellt',
      userId: result.insertedId,
    });
  } catch (error) {
    console.error('Fehler beim Hinzufügen des Benutzers:', error);
    res.status(500).json({ error: 'Fehler beim Erstellen des Benutzers' });
  } finally {
    // Verbindung schließen
    await client.close();
  }
});

// POST-Route für den Login
app.post('/login', async (req, res) => {
  const { email, passwort } = req.body;

  if (!email || !passwort) {
    return res.status(400).json({ error: 'Email und Passwort sind erforderlich' });
  }

  try {
    // Verbindung zur MongoDB herstellen
    await client.connect();
    console.log('Verbunden zur MongoDB');

    // Datenbank und Sammlung auswählen
    const database = client.db('meinDatenbank');
    const users = database.collection('benutzer');

    // Benutzer anhand der E-Mail suchen
    const user = await users.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'Benutzer nicht gefunden' });
    }

    // Passwort überprüfen
    const isPasswordValid = await bcrypt.compare(passwort, user.passwort);

    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Falsches Passwort' });
    }

    // JWT-Token erstellen (optional)
    const token = jwt.sign({ userId: user._id, email: user.email }, 'torbenstinkt56', { expiresIn: '1h' });

    // Erfolgreiche Antwort senden
    res.status(200).json({
      message: 'Login erfolgreich',
      token,
    });
  } catch (error) {
    console.error('Fehler beim Login:', error);
    res.status(500).json({ error: 'Fehler beim Login' });
  } finally {
    // Verbindung schließen
    await client.close();
  }
});

// Server starten
const port = 3000;
app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});
