const cheerio = require('cheerio'),
      request = require('request'),
      fs      = require('fs'),
      csv     = require('fast-csv');

const sponsor = "https://5euros.com/categorie/publication-d-articles-sponsorises?page=1-10";
const backlink = "https://5euros.com/categorie/creation-de-backlinks?page=1-10";

var url = '';
var fileName = '';
const arr = [];
var dt = new Date();

var month = dt.getMonth()+1;
var day = dt.getDate();
var year = dt.getFullYear();
var date = (month + '-' + day + '-' + year);

///////////CHANGE WHICH PAGES ARE SCRAPED////////////////////////////////////////////////////////////////////////////////////////////////////////////
//if document is created with nothing in it add time to setTimout function (ms) because site may be responding slower then 3s

const sponsored = false;


///////////if false then scrapes backlink webpage/////////////////////////////////////////////////////////////////////////////////////////////

if (sponsored === true) {
  url = sponsor;
  fileName = '5euroSponsorLink_'+date+'.csv';
}else{
  url = backlink;
  fileName = '5euroBackLink_'+date+'.csv';
}
var ws = fs.createWriteStream(fileName);

request(url, function (err, res, html){
    if (!err) {
      const $ = cheerio.load(html);
      $('.row--fixgutter-xs').children('.col-6').each(function()
        {
          var arr2 = [];
          arr2[1] = ($(this).children('.mainBlock').children('.serviceTitle').children('a').text())
          arr2[0] = ($(this).children('.mainBlock').children('.serviceBottom').children('.serviceAuthor').children('.sA-name').children('.sA-name__nd').text())
          arr2[2] = ('https://5euros.com'+ $(this).children('.mainBlock').children('a.serviceIllu').attr('href'))
          var pusher = arr2.slice(0);
          arr.push(pusher);
        })
    }
})

setTimeout(function(){
  arr.map((data)=>{
    return data
  })
  console.log('document will be in scrape folder'+' ('+fileName+')');
  csv.write(arr ,{headers:true})
    .pipe(ws);
}, 3000);
