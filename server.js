require('dotenv').config();
const pedidosRoutes = require('./routes/pedidos');

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const session = require('express-session');


const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // Para poder leer req.body en formato JSON
app.use('/api/pedidos', pedidosRoutes);


// Configuración de sesión
app.use(session({
  secret: 'clave_super_secreta', // cámbiala por algo seguro
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'lax' }
}));

// Rutas y controladores
const adminRoutes = require('./routes/admin'); 
const productosRoutes = require('./routes/productos'); 
const adminPedidosRoutes = require('./routes/adminPedidos');
const { verificarAdmin } = require('./utils/auth'); // Middleware de protección

app.use('/admin', adminRoutes);
app.use('/admin', verificarAdmin, adminPedidosRoutes);
app.use('/productos', productosRoutes);

// Middleware para proteger panel
// verifica si existe req.session.adminId, si no redirige a /login

// Rutas públicas
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public/login.html')));

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) console.error(err);
    res.clearCookie('connect.sid', { path: '/' }); // borra cookie de sesión
    res.redirect('/login');
  });
});

// Panel protegido
app.get('/panel', verificarAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'public/admin.html'));
});

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
