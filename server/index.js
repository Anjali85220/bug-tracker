const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projectRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const commentRoutes = require('./routes/comments');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Allow only your frontend (Vercel) URL
app.use(cors({
  origin: 'https://bug-tracker-jof6irpha-shivanjali-dumpalas-projects.vercel.app', // ⬅️ Replace with your actual Vercel frontend URL
  credentials: true
}));

app.use(express.json());

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/comments', commentRoutes);

// ✅ Root Test Route
app.get('/', (req, res) => {
  res.send('API is running');
});

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
