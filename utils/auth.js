const verificarAdmin = (req, res, next) => {
  if (req.session?.adminId) {
    // sesión válida
    next();
  } else {
    // no hay sesión, redirige al login
    res.redirect('/login');
  }
};

module.exports = { verificarAdmin };
