const { Router } = require('express');
const { User } = require('../models/db');
const bcrypt = require('bcrypt');
const router = Router();



router.get("/login", (req, res) => {

    console.log("GET /login");

    if (req.session.user != null) {
        req.flash('errors', "Tu ya estas logeado en el sistema. Para salir tienes que cerrar sesión.");
        return res.redirect('/');
    }

    //consultar por errores o mensajes
    const errors = req.flash("errors");
    const mensajes = req.flash("mensajes");

    res.render("login.ejs", { errors, mensajes });
});

//registrarse
router.post("/register", async(req, res) => {

    console.log("POST /register");

    //mostrar los datos en consola
    console.log(req.body);

    //validar si las contraseñas coinciden
    if (req.body.password != req.body.password_confirm) {
        req.flash('errors', "Las contraseñas no coinciden.");
        return res.redirect('/login');
    }

    //encriptar contraseñas
    const password_encrypted = await bcrypt.hash(req.body.password, 10);
    console.log(password_encrypted);

    //validacion
    try {
        // Después intentamos ingresar el nuevo usuario
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: password_encrypted
        });

        // guardamos el usuario creado en session
        req.session.user = user;

        req.flash("mensajes", "El usuario " + user.name + " fue creado correctamente.")
    } catch (err) {
        for (var key in err.errors) {
            req.flash('errors', err.errors[key].message);
        }
        return res.redirect('/login');
    }

    res.redirect("/");
});

//ingresar
router.post("/login", async(req, res) => {

    console.log("POST /login");

    //mostrar los datos en consola
    console.log(req.body);

    const user = await User.findOne({ where: { email: req.body.email } });

    if (user == null) {
        // en caso de que ese email no exista
        req.flash('errors', 'Usuario inexistente o contraseña incorrecta');
        return res.redirect('/login');
    }

    // Después comparamos contraseñas
    let isCorrect = await bcrypt.compare(req.body.password, user.password);
    if (isCorrect == false) {
        // en caso de que ese email no exista
        req.flash('errors', 'Contraseña incorrecta o usuario inexistente');
        return res.redirect('/login');
    }

    // Finalmente redirigimos al home
    console.log(user);
    req.session.user = user;
    req.flash('mensajes', "Usuario logeado correctamente.");
    console.log("Usuario Logeado Correctamente.");

    res.redirect("/");
});

// 4. Ruta para cerrar sesión
router.get('/logout', async(req, res) => {
    req.session.user = null;
    req.flash('mensajes', "Saliste del sistema correctamente.");
    res.redirect('/login');
});




module.exports = router;