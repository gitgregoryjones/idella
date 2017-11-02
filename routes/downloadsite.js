var express = require('express');
var router = express.Router();
var fs = require('fs')
var fx = require('mkdir-recursive');
var cheerio = require('cheerio')
var link = require('fs-symlink')
var link = require('fs-symlink')
const path = require('path')
var copy = require('recursive-copy');
var through = require('through2');

var zipper = require("zip-local");
 


var  url = require('url');
var writeRevision = require("./revisions").writeRevision;
var getRevisionFileContents = require("./revisions").getRevisionFileContents;
var getRevisionFileName = require("./revisions").getRevisionFileName;
var getAllSitePageNames = require("./site").getAllSitePageNames;
//var $ = require('jquery')

/* Create direectory and home page. */
router.get('/:site', function(req, res, next) {

	//var site = req.get("x-site-name");
	var site = req.params.site;
	/*

	1. mkdir -p website/css website/js website/images
	2. cp -R css/* website/css
	3. cp -R js/* website/js
	4. cp -R images/* website/images
	5. cp -R edit-body.html website
	6. cp -R settings.html website
	7. For each *-revisions
	    1. find latest revision and mv ‘latest revision’ website/[revision-base-dirname-before-dash].html
	    2. replace “/css”—> “css”
	    3. replace “/js” —> “js”
	    4. replace “/images” —> “images”
	    5. replace style:dashed —> style:none 
	*/



	
	var srcJsPath = path.join(process.env.SITEDIR,site,"js");
	var destJsPath = path.join(process.env.SITEDIR,site,"website","js");
	
	var srcCssPath = path.join(process.env.SITEDIR,site,"css");
	var destCssPath = path.join(process.env.SITEDIR,site,"website","css");
	
	var srcImagesPath = path.join(process.env.SITEDIR,site,"images");
	var destImagesPath = path.join(process.env.SITEDIR,site,"website","images");




	var options = {
	    overwrite: true,
	    expand: true
	    
	    ,transform: function(src,dest,stats){
	    	return through(function(chunk, enc, done)  {
	    		//if(src.indexOf("logic2") == -1){console.log("Skipping " + src);return null}
	    		//var output = chunk.toString().replace(/var\s+editing\s+=\s+(true);/,"//set to live mode\n editing=false;")
	    		var output = chunk;
	    		if(src.indexOf("logic2") > -1){
	    			output = chunk.toString().replace(/var\s+editing\s+=\s+(true)\s+;/g,"//set to live mode automatically by downloadsite.js\n editing=false;");
	    		//console.log("Found logic2 " + src)
	    			
	    		}

	    		done(null,output);
	    		
	    	});
	    } 
	};

	

	var HTMLoptions = {
	    overwrite: true,
	    expand: true, 
	    transform: function(src, dest, stats) {
	      
	        return through(function(chunk, enc, done)  {
	        	if(!chunk){
	        		return null;
	        	}

	            var output = chunk.toString().replace(/\"\/css/g,"\"css").replace(/\"\/js/g,"\"js")
	            
	            .replace(/\"\/images/g,"\"images").replace(/style\:dashed/g,"style:none");
	            //console.log("Output is " + output)
	            done(null, output);
	        });
    	}
	};
	

	var deployPath = path.join(process.env.SITEDIR,site,"website");

	console.log("Working site dir is " + path.join(process.env.SITEDIR,site))
	
	

	var list = getAllSitePageNames(path.join(process.env.SITEDIR,site))

	var revisionDirs = list.filter(function(obj){
			console.log("Page is " + obj.name)
			if(obj.name.indexOf("-revisions") > -1){
				return true;
			} else return false;
	})

	console.log(JSON.stringify(revisionDirs))
	/*

	1. mkdir -p website/css website/js website/images
	2. cp -R css/* website/css
	3. cp -R js/* website/js
	4. cp -R images/* website/images
	5. cp -R edit-body.html website
	6. cp -R settings.html website
	7. For each *-revisions
	    1. find latest revision and mv ‘latest revision’ website/[revision-base-dirname-before-dash].html
	    2. replace “/css”—> “css”
	    3. replace “/js” —> “js”
	    4. replace “/images” —> “images”
	    5. replace style:dashed —> style:none 
	*/

	var done = revisionDirs.length;


	var finalCall = function(ok){

		if(!ok){
			/* ZipFile and send response */

			res.sendStatus(500);
		} else {
			/*Zip file and send response */
			console.log("So Trying to Super Zip it up")
 			//res.writeHead({'Content-Disposition': 'inline; filename="myfile.txt"'})
 				
 				console.log(deployPath)
 				console.log(zipper)
 				//var ze = zipper.sync.zip(deployPath).compress().save("website.zip");
 				var buffer = zipper.sync.zip(deployPath).compress().memory();

 				//.save(path.join(process.env.SITEDIR,site,"website.zip"));
 				res.setHeader('Content-Disposition','inline; filename="download.zip"')
 				
 				res.send(new Buffer(buffer, 'binary'))
 				console.log("Cleaning up.... " + fs)
 				
				//res.end(JSON.stringify(list))
			
			

		
			
		}
	}

	try {

	fs.mkdirSync(srcImagesPath)

	}catch(e){
		console.log("images directory already exists");
		console.log(e)
	}


	//Step 1
	copy(srcJsPath, destJsPath, options,function(error, results) {

		console.log("Trying to copy JS" + srcJsPath + " ==> " + destJsPath)

	    if (error) {
	        console.log('JS Copy failed: ' + error);
	      
	    } else {
	    	console.log('JS Copied ' + results.length + ' files');
	    	//Step 2
	        copy(srcCssPath, destCssPath, options,function(error, results) {
			    if (error) {
			        console.log('Css Copy failed: ' + error);
			      	
			    } else {
			    	console.log('Copied ' + results.length + ' files');
			    	//Step 3
					 copy(srcImagesPath, destImagesPath, options,function(error, results) {
					    if (error) {
					        console.log('Images Copy failed: ' + error);
					    } else {
					        console.log('Image Copied ' + results.length + ' files');
					        console.log("Revision Dir length is " + revisionDirs.length)
					        
					        revisionDirs.forEach(function(revDir){
					        	
					        	getRevisionFileName(path.join(process.env.SITEDIR,site,revDir.name),new Date()
					        		,function(ok,version){
					        			
					        			if(ok){
					        				console.log("Copying " + path.join(process.env.SITEDIR,site,revDir.name,version) + " to " + deployPath )
					        				copy(path.join(process.env.SITEDIR,site,revDir.name,version), 
					        					path.join(deployPath,revDir.name.replace("-revisions",".html")), 
					        					HTMLoptions,function(error, results) {
					        					console.log("RevFile Now Done minus is " + --done);
					        					
					        					if(done == 0){
					        						finalCall(true);
					        					}
					        				})

					        			} else {
					        				console.log("Fail RevFile Now Done minus is " + --done);
					        				finalCall(false);
					        			}

					        		

					        	})
					        })

					    }
					});
			    }
			});
	    }
	});

	

});



module.exports = router;


