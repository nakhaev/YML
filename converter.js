var convertExcel = require('excel-as-json').processFile;
var yml = require('yandex-market-language');
var { writeFile, readFile } = require('fs');

var options = {
    sheet:'1',
    isColOriented: false,
    omitEmtpyFields: false
}

var jsonData;

var cb = function (err, data) {
    console.log('start');
    if(err) {
        console.log(err);
    } else if(data){
        jsonData = data;
    } else {
        console.log('fuck!');
    }
}

convertExcel('src/example-data_.xlsx', 'output/example-data_.json', options, cb);

const MIN_VALID_INPUT = {
  name: 'BestSeller',
  company: 'Tne Best inc.',
  url: 'http://best.seller.ru',
  currencies: [
    { id: 'RUR', rate: 1 }
  ],
  categories: [
    { id: '1', name: 'Бытовая техника' }
  ],
  'delivery-options': [
    {
      cost: 300,
      days: [1, 20],
      'order-before': 12
    }
  ],
  offers: [
    {
      name: 'Вафельница First FA-5300',
      id: '12346',
      price: 1490,
      currencyId: 'RUR',
      categoryId: '101'
    }
  ]
}

const YML = yml(jsonData).end({ pretty: true });


writeFile('yandex-market.yml', YML, (err) => {
  if (err) throw err
  console.log('YML has been saved!')
})
