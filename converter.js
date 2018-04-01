'use strict'

const yml = require('yandex-market-language');
const { writeFile, readFile } = require('fs');
const xlsx = require('node-xlsx').default;
const base = require('./base');

//path constant
const SOURCE_PATH = 'src/input.xlsx';
const JSON_INPUT_PATH = 'output/json-input.json';
const JSON_OUTPUT_PATH = 'output/yandex-market.json';
const YML_PATH = 'output/yandex-market.yml';

let inputJson = {};

let ymlData = {
  name: 'Center-jeweler',
  company: 'Center-jeweler',
  url: 'http://center-jeweler.com.ua',
  currencies: [
    { id: 'UAH', rate: 1 }
  ],
  categories: [
    { id: '1', name: 'Бытовая техника' },
    { id: '10', parentId: '1', name: 'Мелкая техника для кухни' },
    { id: '101', parentId: '10', name: 'Сэндвичницы и приборы для выпечки' },
    { id: '102', parentId: '10', name: 'Мороженицы' }
  ],
  'delivery-options': [
    { cost: 300, days: [1, 20], 'order-before': 12 }
  ],
  offers: [
    {
      name: 'Вафельница First FA-5300',
      vendor: 'First',
      price: 1490,
      currencyId: 'RUR',
      categoryId: '101',
      description: `<p>Отличный подарок для любителей венских вафель.</p>`,
      param: [
          { name: 'Размер экрана', unit: 'дюйм', value: 27 },
          { name: 'Материал', value: 'алюминий' }
      ],
      stock_quantity: 100,
      picture: [
          'http://best.seller.ru/img/large_12348.jpg - DSCN4853.JPG',
          'http://center-jeweler.com.ua/image/data/kolca11/watermarked - DSCN4854.JPG'
      ],
      url: 'http://best.seller.ru/product_page.asp?pid=12348'
    }
  ]
}


function init() {
    read_xlsx(() => {
        readJson(JSON_INPUT_PATH)
        .then((data) => {
            inputJson = JSON.parse(data);
            ymlData.currencies = parseCellToArray(['id', 'rate'], inputJson[0]);
            ymlData.categories = parseCellToArray(['id', 'name'], inputJson[1]);
            ymlData['delivery-options'] = parseCellToArray(['cost', 'days', 'order-before'], inputJson[2]);
            ymlData.offers[0].name = inputJson[3];
            ymlData.offers[0].description = inputJson[5];
            let offersOptions = parseCellToObject(['vendor', 'price', 'currencyId', 'categoryId'], inputJson[4]); //, 'id', 'aviable'
            ymlData.offers[0] = Object.assign(ymlData.offers[0], offersOptions);
            ymlData.offers[0].param = parseCellToArray(['name', 'value'], inputJson[6]);
            ymlData.offers[0].stock_quantity = inputJson[7];
            ymlData.offers[0].picture = parseCellToArray([], inputJson[8]); //fi names = [] return array with string instead array with objects
            ymlData.offers[0].url = inputJson[9];


            writeFile(JSON_OUTPUT_PATH, JSON.stringify(ymlData, null, 2), (err) => {
                if (err) throw err
                console.log('JSON has been saved!')
            });

            toNumber();

            write_yml(ymlData);
        })
        .catch((error) => {
            console.log(error);
        });
    });
    // write_yml(data);

};

function toNumber() {
    ymlData.offers[0].price = Number(ymlData.offers[0].price);
}

function readJson(path) {
    //create promise for reading file
    let promise = new Promise((resolve, reject) => {
        readFile(path, (err, data) => {
            if (err) {
                reject(error);
            } else {
                resolve(data)
            }
        });
    });
    return promise;
 };

 /**
  * Perser for cell data
  * TODO: mo clearfull comment about this function
  *
  * @param { Array } names with property names ['id', 'rate']
  * @param { String } dataString with data 'UAH:1, RUR:5, USD:56'
  * @returns { Array } with objects which determine some proprtyes of product_page
  * @public
  */

function parseCellToArray(names, dataString) {
    // console.log(dataString);
    let output = [];
    let devider = dataString.indexOf(',') == -1 ? '\n' : ',';
    let temp = dataString.split(devider);

    if(names.length>0) {
        for(let i = 0; i < temp.length; i++) {
            let tempItem = temp[i].split('::');
            let obj = {};
            for(let j = 0; j < names.length; j++) {
                obj[names[j]] = tempItem[j];
            }
            output.push(obj);
        }
    } else {
        output = temp;
        // console.log('output', output);
    }
    return output;
}

function write_yml(data) {
     let YML = yml(data).end({ pretty: true });
    writeFile('output/yandex-market.yml', YML, (err) => {
        if (err) throw err
        console.log('YML has been saved!')
    })
};

/**
 * Perser for cell data
 * TODO: mo clearfull comment about this function
 *
 * @param { Array } names with property names ['id', 'rate']
 * @param { String } dataString with data 'UAH:1, RUR:5, USD:56'
 * @returns { Array } with objects which determine some proprtyes of product_page
 * @public
 */

function parseCellToObject(names, dataString) {
   // console.log(dataString);
   let output = {};
   let devider = dataString.indexOf(',') == -1 ? '\n' : ',';
   let temp = dataString.split(devider);

   for(let i = 0; i < temp.length; i++) {
       let tempItem = temp[i].split('::');
       for(let j = 0; j < names.length; j++) {
           output[names[j]] = tempItem[j];
       }
   }
   return output;
}

// read input xlsx and create json
function read_xlsx(callback) {
    let workSheetsFromFile = xlsx.parse(SOURCE_PATH);
    let names = workSheetsFromFile[0].data[0];
    let newdata = workSheetsFromFile[0].data[1];

    writeFile(JSON_INPUT_PATH, JSON.stringify(newdata, null, 2), (err) => {
        if (err) throw err
        // console.log('JSON has been saved!')
        callback();
    });
};

init();
