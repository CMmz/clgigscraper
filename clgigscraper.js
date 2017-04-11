var jquery = require ('jquery');
var Nightmare = require('nightmare');
nightmare = Nightmare();

var json2csv = require('json2csv');
var fs = require('fs');



var city = process.argv[2];
//Use the 1st argument passed (in command line) as the search city

nightmare.goto('http://' + city + '.craigslist.org/search/cpg?is_paid=yes&postedToday=1')
// visits the target city computer gig page

    .wait(2000)
    // anti-scraper countermeasure. Also for ajax loads

    .evaluate(function() {
       
        var gig_listings = [];
        $('.hdrlnk').each(function () {
            item = {}
			item["title"] = $(this).text()
            item["link"] = $(this).attr("href")
            console.log(item);
            gig_listings.push(item)
        });
    
        // create an object with title and link, then pushes it into the gig_listings array
        return gig_listings;
        //pass the array forward to loop through later
    })
    .end()

.then (function (result) {
  
    var str ="";
    
    for (gig in result) {
        str += "Title = "+result[gig].title;
        str += "Url = "+result[gig].link;
        str += '\n';
    }
    
    
    //console.log(result);
    
    var fields = ['title', 'link'];
    var csv = json2csv({ data: result, fields: fields });
    
     var d = new Date();
     date = (d.getMonth() + 1) + '-' + d.getDate() + '-' +  d.getFullYear();
     var fileName = '['+city+']'+'clgigsearch'+'['+date+']'+'.csv';
    // var writer = csv.createCsvStreamWriter(fs.createWriteStream(fileName)); 
     
    // writer.writeRecord(result);  */
    
    fs.writeFile(fileName, csv, function(err) {
      if (err) throw err;
      console.log('file saved');
    });
    
    
});

//prints each gig to the console in a neat format
