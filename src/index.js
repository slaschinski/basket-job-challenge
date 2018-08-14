import _ from 'lodash';
import Basket from './Basket';
import Discount from './Discount';
import BuyOneGetXFree from './BuyOneGetXFree';

/**
 * Lists the total sum of a given basket and is also
 * able to activate console debug output
 * @param {string} name Name of the customer or basket to be shown
 * @param {Basket} basket The basket object to calculate the total of
 * @param {boolean} debug Whether or not to show debug output on console
 */
function showTotal(name, basket, debug = false) {
    if (debug) {
        console.log("");
        console.log(name);
    }

    // calculate total sum of items in basket
    let basketTotal = basket.total(debug);

    // create a new div containing the given name and the calculated total
    let element = document.createElement('div');
    element.innerHTML = _.join([name, basketTotal.toFixed(2)], ' - ');
    document.body.appendChild(element);
}

/**
 * Adds an article to the basket and catches exceptions
 * @param {Basket} basket 
 * @param {String} itemId 
 */
function addArticle(basket, itemId) {
    try {
        basket.scan(itemId);
    } catch (e) {
        console.log('Error: ' + e);
    }
}


let visitor1 = new Basket;
let visitor2 = new Basket;

// first visitor
addArticle(visitor1, 'A0002');
addArticle(visitor1, 'A0001');
addArticle(visitor1, 'A0002');
addArticle(visitor1, 'A0003'); //does not exist
// now we should have an error on the console,
// but the script should keep running

// second visitor, same items except A0003 which does not exist
addArticle(visitor2, 'A0002');
addArticle(visitor2, 'A0001');
addArticle(visitor2, 'A0002');

// since there is no A0003, the output should be the same
showTotal('Visitor 1', visitor1, true);
showTotal('Visitor 2', visitor2, true);

// create a new discout object we'll use in a moment
let tenPercentDiscount = new Discount({ A0001: 0.10 });

// add discout to second visitor
visitor2.addSaleDeal(tenPercentDiscount);

// now the outputs should differ because one customer got discout
showTotal('Visitor 1 got no discount', visitor1, true);
showTotal('Visitor 2 with discount', visitor2, true);

// this time we have a free item for every item with id A0002
let BuyOneGetOneFree = new BuyOneGetXFree('A0002', 1, true);
// this one gets added to the global deals, so it should affect every visitor
Basket.addGlobalSaleDeal(BuyOneGetOneFree);

// the sums will still differ, but should be reduced by the same amout (the price of one A0002)
showTotal('Visitor 1 with free article', visitor1, true);
showTotal('Visitor 2 with discount and free article', visitor2, true);

// the third visitor should also be applicable to the free A0002 items if one is in the basket
let visitor3 = new Basket;
addArticle(visitor3, 'A0001');
// a second A0002 should be added automatically, but should have a 0 price
addArticle(visitor3, 'A0002');

// the total of the third customer should be the same as the first customer
showTotal('Visitor 3 with free article added automatically', visitor3, true);

let element = document.createElement('div');
element.innerHTML = "--> See console for more details! <--"
document.body.appendChild(element);
