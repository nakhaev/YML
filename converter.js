var convertExcel = require('excel-as-json').processFile;
var yml = require('yandex-market-language');
var { writeFile } = require('fs');

var options = {
    sheet:'1',
    isColOriented: false,
    omitEmtpyFields: false
}

var companyData = {
    "name": "BestSeller",
    "company": "Tne Best inc.",
    "url": "http://best.seller.ru",
    "currencies": [
      { "id": "RUR", "rate": 1 }
    ]
}

var jsonData;

//join data about company to data about goods
var joinData = function (title, data) {
    return Object.assign({}, title, data);
}


var final = function(data) {

    console.log('final', data);
    var YML = yml(data).end({ pretty: true });

    writeFile('yandex-market.yml', YML, (err) => {
        if (err) throw err
        console.log('YML has been saved!')
    })
}

//assign generated json string to jsonData variable
var getJsonData = function (err, data) {
    console.log('start');
    if(err) {
        console.log(err);
    } else if(data) {
        jsonData = joinData(companyData, data[0]);
        console.log(jsonData);
        final(jsonData);
    } else {
        console.log('fuck!');
    }
}

convertExcel('src/test2.xlsx', 'output/test2.json', options, getJsonData);
