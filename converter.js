'use strict'

const convertExcel = require('excel-as-json').processFile;
const yml = require('yandex-market-language');
const { writeFile, readFile } = require('fs');
const xlsx = require('node-xlsx').default;
const base = require('./base');



const options = {
    sheet:'1',
    isColOriented: false,
    omitEmtpyFields: false
};

const companyData = {
    "name": "BestSeller",
    "company": "Tne Best inc.",
    "url": "http://best.seller.ru",
    "currencies": [
        { "id": "RUR", "rate": 1 }
    ]
};

var jsonData = {};

function init() {
    convertExcel('src/test2.xlsx', 'output/test2.json', options, getJsonData);
}

function readJson(path) {
    let temp, full;
    readFile(path, 'utf8', function (err, data) {
      if (err) throw err;
        temp = JSON.parse(data);
        full = Object.assign({}, companyData, temp[0]);

        writeFile('output/readed.json', JSON.stringify(full, null, 2), (err) => {
            if (err) throw err
            console.log('readedJSON has been saved!')
        })
        return temp;
    });
}

readJson('output/test2.json');




//assign generated json string to jsonData variable
function getJsonData(err, data) {
    console.log('start');
    if(err) {
        console.log(err);
    } else if(data) {
        jsonData = joinData(companyData, data);
        final(JSON.stringify(jsonData, null, 2));
    } else {
        console.log('fuck!');
    }
}

//join data about company to data about goods
function joinData(title, data) {
    return Object.assign({}, title, data);
};

function final(data) {
     let YML = yml(data).end({ pretty: true });
    writeFile('output/yandex-market.yml', YML, (err) => {
        if (err) throw err
        console.log('YML has been saved!')
    })
};

// new way

function newWay() {
    let workSheetsFromFile = xlsx.parse('src/test2.xlsx');
    let newdata = workSheetsFromFile[0].data
    // console.log(workSheetsFromFile[0].data);

    writeFile('output/newTest.json', JSON.stringify(jsonData, null, 2), (err) => {
        if (err) throw err
        console.log('JSON has been saved!')
    })
}


//end new way
// newWay();
// init();
final(base);
