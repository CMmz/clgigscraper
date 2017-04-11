var jquery = require ('jquery');
var Nightmare = require('nightmare');
nightmare = Nightmare();

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
    for (gig in result) {
        console.log("Title = "+result[gig].title);
        console.log("Url = "+result[gig].link);
        console.log('\n');
    }
});

//prints each gig to the console in a neat format
