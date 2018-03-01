var d = {
    name: 'BestSeller',
    company: 'Tne Best inc.',
    url: 'http://best.seller.ru',
    currencies: [
      { id: 'RUR', rate: 1 }
    ]
}

var f = {
  "c": 12,
  "d": 56
}

var o = JSON.stringify(d);
var y = JSON.stringify(f);

var joinData = function (title, data) {
    return JSON.stringify(Object.assign({}, JSON.parse(title), JSON.parse(data)));
}

var ii = joinData (o, y);
console.log(ii);
