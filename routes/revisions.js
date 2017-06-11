var express = require('express');
var router = express.Router();
var fs = require('fs')
var cheerio = require('cheerio')
url = require('url');
//var $ = require('jquery')

/* GET home page. */
router.post('/', function(req, res, next) {

		
	console.log(req.headers['content-type']);
	
	console.log(req.body);

	

	srvUrl =url.parse(`http://${req.url}`);

	fs.readFile(__dirname + '/../public/index.html', 'utf8', function(err, template){

		console.log("Here is the 2:")
		console.log(template)

		$ = cheerio.load(template);
		$('head').find('title').text(req.body.name);
		$('body').html($('body').html().trim())
		$('script').each(function(it,sc){
			$(sc).attr('src',req.protocol + "://" + req.hostname + ":" + (process.env.PORT || '3000') + $(sc).attr("src"))
			$(sc).attr('domain',req.protocol + "://" + req.hostname + ":" + (process.env.PORT || '3000'));
			//console.log(sc)
		})


		$('body').append(req.body.currentRevision.html)
		$('body').find('ul.custom-menu').remove();
		$('body').find('.responsive-design-tab').remove();

		console.log($.html())


		

	})

	
	res.sendStatus(200);
});

module.exports = router;
