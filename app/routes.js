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

        router.route('/levels')

            .get(function(req,res){
                Level.find(function(err,levels){
                    if(err)
                        return res.send(err);
                    res.send(levels);
                });
            })

            .post(function(req,res){
                Level.findOne({name:req.body.name},function(err,level){
                    if(err)
                        return res.send(err);
                    if(level)
                        return res.send({'message':'Already a level with that name!'});

                    var level = new Level();
                    for(var i = 0; i < req.body.map.length; i++){
                        level.map.push(req.body.map[i]);
                    }
                    level.name = req.body.name;
                    level.save(function(err){
                        if(err)
                            return res.send(err);
                        res.send({'message':'Level added'});
                    });
                })
            })

            .delete(function(req,res){
                Level.remove(function(err,levels){
                    if(err)
                        return res.send(err);
                    res.send({'message':'Levels deleted'});
                });
            })

        router.route('/levels/:level_id')

            .get(function(req,res){
                Level.findById(req.params.level_id, function(err,level){
                    if(err)
                        return res.send(err);
                    res.send(level);
                });
            });

        router.route('/users')

            .get(function(req,res){
                User.find(function(err,users){
                    if(err)
                        return res.send(err);
                    res.send(users);
                });
            })

            .post(function(req,res){
                User.findOne({name:req.body.name},function(err,user){
                    if(err)
                        return res.send(err);
                    if(user)
                        return res.send({'error':'Name already taken!'});
                    var user = new User();
                    user.name = req.body.name;
                    user.password = user.generateHash(req.body.password);

                    user.save(function(err){
                        if(err)
                            return res.send(err);
                        res.send({'message':'User added','user':user});
                    });
                })
            });

        router.route('/users/:user_id')

            .get(function(req,res){
                User.findById(req.params.user_id, function(err,user){
                    if(err)
                        return res.send(err);
                    res.send(user);
                });
            });

        router.route('/login')

            .post(function(req,res){
                User.findOne(req.body.name, function(err,user){
                    if(err)
                        return res.send(err);
                    if(!user)
                        return res.send({'error':'No user of that name!'});
                    if(!user.validPassword(req.body.password))
                        return res.send({'error':'Wrong password'});
                    return res.send({'message':'Login success','user':user});
                });
            });

        router.route('/score')

            .post(function(req,res){
                Level.findById(req.body.level._id, function(err,level){
                    if(err)
                        return res.send(err);
                    if(!level)
                        return res.send({'error':'No user of that id!'});
                    var highScores = level.highScores;
                    console.log(highScores.length);
                    var index = -1;
                    for(var i = 0; i < highScores.length; i++){
                        if(req.body.score > highScores[i].score){
                            if(index >=0 ){
                                if(highScores[index].score > highScores[i].score){
                                    index = i;
                                }
                            }else{
                                index = i
                            }
                        }
                    }
                    if(index >= 0 || highScores.length < 5){
                        if(highScores.length >= 5){
                            var doc = level.highScores.id(highScores[index]._id).remove();
                        }
                        level.highScores.push({
                            score: req.body.score,
                            userName: req.body.user.name,
                            user: req.body.user._id
                        });
                        level.save(function(err){
                            if(err)
                                return res.send(err);
                            return res.send({'message':'You got a highscore!'});
                        });
                    }else{
                        return res.send({'message':'You didn\'t get a highscore...'});
                    }
                });
            });

        // REGISTER OUR ROUTES -------------------------------
        // all of our API routes will be prefixed with /api
        app.use('/api', router);

        // frontend routes =========================================================
        // route to handle all angular requests

    };

