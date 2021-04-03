const { Router } = require('express');
const Sequelize = require('sequelize');

const { User, Bid } = require('../models/db');
const router = Router();


//middleware para validar que el usuario esta logeado
function checkLogin(req, res, next) {


    if (req.session.user == null) {
        req.flash('errors', "Tienes que estar logeado para entrar a esta parte del sistema.");
        return res.redirect('/login');
    }

    res.locals.user = req.session.user;

    next();
}

//página de apuestas
router.get("/", [checkLogin], async(req, res) => {

    const errors = req.flash("errors");
    const mensajes = req.flash("mensajes");

    const apuestas = await Bid.findAll({
        include: [{ model: User }],
        order: [
            ['amount', 'DESC']
        ]
    });

    const apuesta1 = await Bid.max('amount', { where: { 'product': 1 } });
    console.log('apuesta mayor 1', apuesta1);

    const apuesta2 = await Bid.max('amount', { where: { 'product': 2 } });
    console.log('apuesta mayor 2', apuesta2);

    const apuesta3 = await Bid.max('amount', { where: { 'product': 3 } });
    console.log('apuesta mayor 3', apuesta3);

    //console.log(apuestas);
    //console.log(req.body);

    //const amount = req.body.Bid;
    //console.log('valor ', amount);



    res.render("bids.ejs", { errors, mensajes, apuestas, apuesta1, apuesta2, apuesta3 });
});




//crear apuesta
router.post("/new", [checkLogin], async(req, res) => {
    console.log("POST /");
    //console.log(req.body);

    //req.body.amount > bid.amount



    try {
        //console.log('producto', req.body.product);
        //const producto_actual = req.body.product;
        //console.log('producto actual', producto_actual);
        //const apuesta_mayor = await Bid.max('amount', { where: { 'product': producto_actual } });
        //const apuesta1 = await Bid.max('amount', { where: { 'product': 1 } });
        //console.log('prueba apuesta mayor es', apuesta_mayor);

        const apuesta = await Bid.create({
            product: req.body.product,
            amount: req.body.amount,
            UserId: req.session.user.id
        });

        req.flash("mensajes", "Apuesta agregada correctamente");

    } catch (err) {
        for (var key in err.errors) {
            req.flash('errors', err.errors[key].message);
        }
        return res.redirect('/');
    }

    //const user = await User.findByPk(req.session.user.id);


    return res.redirect("/");

});







//pagina de resultados, terminar apuesta
router.get("/result", [checkLogin], async(req, res) => {

    const errors = req.flash("errors");
    const mensajes = req.flash("mensajes");




    const ganador = await Bid.findAll({
        include: [{ model: User }],
        order: [
            ['amount', 'DESC']
        ]
    });

    const apuesta_producto1 = ganador.filter(x => x.product == 1);
    const apuesta_producto2 = ganador.filter(x => x.product == 2);
    const apuesta_producto3 = ganador.filter(x => x.product == 3);

    if (apuesta_producto1.length == 0 || apuesta_producto2.length == 0 || apuesta_producto3.length == 0) {
        req.flash("errors", "Tienes productos sin apuestas");
        return res.redirect("/");
    }

    //const apuesta1 = await Bid.max('amount', { where: { 'product': 1 } });
    //const nombre1 = await Bid.max('UserId', { where: { 'product': 1 } });

    //const apuesta2 = await Bid.max('amount', { where: { 'product': 2 } });


    //const apuesta3 = await Bid.max('amount', { where: { 'product': 3 } });

    res.render("result.ejs", { errors, mensajes, apuesta_producto1, apuesta_producto2, apuesta_producto3 })
});







//reiniciar
router.get('/bids/delete', async(req, res) => {
    await Bid.destroy({
        truncate: true,
    });
    res.redirect("/", );
});



module.exports = router;