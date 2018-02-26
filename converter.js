var convertExcel = require('excel-as-json').processFile;
var yml = require('yandex-market-language');
const { writeFile } = require('fs');

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

console.log('Wellcome');
const YML = yml(MIN_VALID_INPUT).end({ pretty: true });


writeFile('yandex-market.yml', YML, (err) => {
  if (err) throw err
  console.log('YML has been saved!')
})
