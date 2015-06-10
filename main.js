var express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    mysql = require('mysql'),
    server;

var store = {
    home: {
        page: "Our Super Awesome App",
        content: "Home, sweet home"
    },
    about: {
        page: "About page",
        content: "Some incredibly awesome content"
    },
    downloads: {
        page: "Downloads page",
        content: "Download all stuff here"
    },
    profile: {
        page: "Profile page",
        content: "This is your profile, dawg"
    }
};

var storeKeys = Object.keys(store);

app.disable('x-powered-by');
app.set('view engine', 'jade');

app.use(function(req, res, next){
    console.log('%s %s', req.method, req.url);
    next();
});

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
//console.log(app);

app.get('/about', function(req, res){
    res.render('about', {
        links: storeKeys
    });
});

app.route('/new')
    .get(function(req, res){
        res.render('new', {
            page: 'AddNew',
            links: storeKeys
        });
    })
    .post(function(req, res){
        var data = req.body;
        if(data.pageurl && data.pagename && data.pagecontent){
            store[data.pageurl] = {
                page: data.pagename,
                content: data.pagecontent
            };
            storeKeys = Object.keys(store);
        }
        console.log(req.body);
        res.redirect('/');
    });

app.get('/:page?', function(req, res){
    var page = req.params.page, data;
    if(!page) page = 'home';
    data = store[page];
    if(!data){
        res.redirect('/');
        return 0;
    }
    data.links = storeKeys;
    data.query = req.query;
    //console.log(req.params);
    res.render('main', data);
});
server = app.listen(3000, function(){
    console.log('listening on port 3000');
});