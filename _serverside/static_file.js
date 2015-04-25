function sendSrc(req){
    if(req.path().match(/.*.css/)){             // css request handler
        var file = req.path();
        req.response.putHeader("Content-Type", "text/css");
        req.response.sendFile("../_clientside"+file);
    } else if(req.path().match(/.*.png/)){      // resource request handler
        var file = req.path();
        req.response.sendFile("../_clientside"+file);
    } else if(req.path().match(/.*.js/)){       // javascript request handler
        var file = req.path();
        req.response.sendFile("../_clientside"+file);
    } else{                                     // page and resource not found(404)
        req.response.sendFile("../_clientside/html/404NF.html");
    }
}
