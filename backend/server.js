require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.ALLOWED_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minute
  max: 5,
  message: { error: "Prea multe cereri. Încercați din nou în 15 minute." },
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

app.post("/contact", contactLimiter, async (req, res) => {
  const { name, email, message } = req.body;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ error: "Toate câmpurile sunt obligatorii." });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Adresă de email invalidă." });
  }

  try {
    await transporter.sendMail({
      from: `"Site Notariat" <${process.env.SMTP_USER}>`,
      to: process.env.MAIL_TO,
      replyTo: `"${name}" <${email}>`,
      subject: `Mesaj nou de pe site — ${name}`,
      text: `Nume: ${name}\nEmail: ${email}\n\n${message}`,
      html: `
        <p><strong>Nume:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <hr>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    res.json({ ok: true });
  } catch (err) {
    console.error("Eroare trimitere email:", err);
    res.status(500).json({ error: "Eroare internă. Încercați din nou." });
  }
});

app.listen(PORT, () => {
  console.log(`Server pornit pe portul ${PORT}`);
});
