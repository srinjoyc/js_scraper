var request = require('request');
var cheerio = require('cheerio');
var csv = require('fast-csv');
var fs  = require('fs');

var getImgCSV = function () {
	var csvStream = csv.createWriteStream({headers: true});
	var	writeableStream = fs.createWriteStream("images.csv");
	var rows = [];
	var base = 'http://substack.net';

	request('http://substack.net/images/', function (error, response, body){
		if(!error && response.statusCode == 200){
			var $ = cheerio.load(body);
			var row = {};
			$("table tr").toArray().forEach(function (object){
				var regex,
						link,
						permission,
						extension;
				try{
				  regex = /\.\w*/
				  link = object.children[2].children[0].attribs.href;
				  permission = object.children[0].children[0].children[0].data;
				  extension = object.children[2].children[0].attribs.href.match(regex)[0];
					row = {
						url: base + link ,
						permission: permission,
						extension: extension
					}
					rows.push(row);
					}
				catch(e){}
			});
			csvStream.pipe(writeableStream);
			rows.forEach(function (data){
				csvStream.write(data);
			});
			csvStream.end();
		}
	});
}
module.exports = getImgCSV;
