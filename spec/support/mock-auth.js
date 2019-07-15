module.exports = {

  //fakeIt takes express instance and mounts the middleware and route needed for our fake auth endpoint
  fakeIt(app){

    // keep outside of middleware fxn
    let role, id, email, name;

    // middleware def
    function middleware(req,res,next){

      //eval props from req.body
      role = req.body.role || role;
      id = req.body.userId || id;
      email = req.body.email || email;
      name = req.body.name || name;

      //loads the auth user in req.user, and if id has value, 0 = signing out
      if(id && id != 0){
        req.user = {
          "id": id,
          "email": email,
          "role": role,
          "name": name
        };
      } else if(id == 0) {
        delete req.user;
      }

      if( next ){ next() }
    }

    // defining route
    function route(req,res){
      res.redirect("/")
    }

    //mount the middleware route
    app.use(middleware)
    app.get("/auth/fake", route)
  }
}
