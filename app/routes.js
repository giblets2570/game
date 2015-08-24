 // app/routes.js

// grab the models we want

    module.exports = function(app,express) {

        // server routes ===========================================================
        // handle things like api call
        // authentication routes

        var router = express.Router();

        // middleware to use for all requests
        router.use(function(req, res, next) {
            // do logging
            console.log('Something is happening.');
            next(); // make sure we go to the next routes and don't stop here
        });

        // router.route('/venue')

        //     .get(function(req,res){
        //         Venue.find(function(err,venues){
        //             if(err)
        //                 return res.send(err);
        //             res.send(venues);
        //         });
        //     })

        //     .post(function(req,res){
        //         var venue = new Venue();
        //         venue.name = req.body.name;
        //         venue.rating = req.body.rating;
        //         venue.type = req.body.type;
        //         venue.coordinates.latitude = req.body.latitude;
        //         venue.coordinates.longitude = req.body.longitude; 
        //         venue.save(function(err){
        //             if(err)
        //                 return res.send(err);
        //             res.send({'message':'Venue added'});
        //         });
        //     });

        // router.route('/venue/:latitude/:longitude')

        //     .get(function(req,res){
        //         Venue.find()
        //     })

        // REGISTER OUR ROUTES -------------------------------
        // all of our API routes will be prefixed with /api
        app.use('/api', router);

        // frontend routes =========================================================
        // route to handle all angular requests

    };

