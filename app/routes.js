 // app/routes.js

var User = require('./models/user');
var Level = require('./models/level');

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

        router.route('/level')

            .get(function(req,res){
                Level.find(function(err,levels){
                    if(err)
                        return res.send(err);
                    res.send(levels);
                });
            })

            .post(function(req,res){
                var level = new Level();
                for(var i = 0; i < req.body.map.length; i++){
                    level.map.push(req.body.map[i]);
                }
                level.save(function(err){
                    if(err)
                        return res.send(err);
                    res.send({'message':'Level added'});
                });
            });

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

