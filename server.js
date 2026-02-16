const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./data.db");

// Create table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    amount REAL,
    description TEXT,
    type TEXT
  )
`);

const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Static files serve
app.use(express.static("public"));

// Mail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "kayalvizhiboopathi06@gmail.com",
    pass: "tyyw pkak eers jjnf"
  }
});

// Contact route
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await transporter.sendMail({
      from: email,
      to: "kayalvizhiboopathi06@gmail.com",
      subject: "New Contact Message",
      text: `From: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
});

// COD Order route
app.post("/cod-order", async (req, res) => {
  const { name, address, productName, price, quantity, total } = req.body;

  try {
    await transporter.sendMail({
      from: "kayalvizhiboopathi06@gmail.com",
      to: "kayalvizhiboopathi06@gmail.com",
      subject: "🛍️ New COD Order",
      text: `
New Cash on Delivery Order

Name: ${name}
Address: ${address}

Product: ${productName}
Price: ₹${price}
Quantity: ${quantity}
Total: ₹${total}

Prepare for shipping 🚚
      `
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
});

// Add transaction
app.post("/add-transaction", (req, res) => {
  const { date, amount, description, type } = req.body;

  db.run(
    "INSERT INTO transactions (date, amount, description, type) VALUES (?, ?, ?, ?)",
    [date, amount, description, type],
    (err) => {
      if (err) {
        console.error(err);
        res.json({ success: false });
      } else {
        res.json({ success: true });
      }
    }
  );
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
