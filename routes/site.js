var express = require('express');
var router = express.Router();
var fs = require('fs')
var fx = require('mkdir-recursive');
var cheerio = require('cheerio')
var link = require('fs-symlink')
var link = require('fs-symlink')
var  url = require('url');
//var $ = require('jquery')

/* Create direectory and home page. */
router.post('/', function(req, res, next) {

		
	console.log(req.headers['content-type']);
	
	console.log(req.body);


	srvUrl =url.parse(`http://${req.url}`);

	fs.readFile(__dirname + '/../public/index.html', 'utf8', function(err, template){

		console.log("Here is the 2:")
		console.log(template)

		$ = cheerio.load(template);
		$('head').find('title').text(req.body["new-site-name"]);
		$('body').html($('body').html().trim())
		

		//$('body').append(req.body.currentRevision.html)
		$('body').find('ul.custom-menu').remove();
		$('body').find('.responsive-design-tab').remove();

		img = $('<div class="squarepeg dropped-object" id="begin" type="IMG" style="background-image:url(http://www.britishsarcomagroup.org.uk/wp-content/uploads/2016/09/new-website.jpg)"></div>')

		

		//http://www.britishsarcomagroup.org.uk/wp-content/uploads/2016/09/new-website.jpg
		$('body').append(img);

		var createDir = __dirname + '/../public/' + req.body["new-site-name"];

		console.log("Making " + createDir)

		fx.mkdir(createDir, function(err) {
 
				if(err){
					res.sendStatus(404);
				}

  				fs.writeFile(createDir+ "/index.html",$.html(),function(){
  					console.log("Wrote File")
  					if(err){
  						res.sendStatus(404);
  					} else {
  						//create symlinks
  						
  						console.log("Linking " + createDir+'js' + " to " + __dirname + '/../public/js')
  						link(__dirname + '/../public/js', createDir+'/js', 'junction')
							.then(function () {})
						link(__dirname + '/../public/css',  createDir+ '/css', 'junction')
							.then(function () {})
						link(__dirname+ '/../public/settings.html', createDir + '/settings.html', 'junction')
							.then(function () {})
						link(__dirname + '/../public/edit-body.html', createDir+'/edit-body.html', 'junction')
							.then(function () {})

  						res.sendStatus(200);
  					}
  				})
		});


		console.log($.html())

	})

	
	
});

module.exports = router;
