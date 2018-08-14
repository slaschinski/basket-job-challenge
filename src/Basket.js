import inventory from './Inventory';

const globalSaleDeals = [];

/**
 * A basket class to store items by id and calculate the total sum of all items
 * while keeping track of discounts and other deals
 */
class Basket {
    /**
     * @constructor
     */
    constructor() {
        this.content = [];
        this.saleDeals = [];
        this.combinedSaleDeals = [];
    }

    /**
     * Adds an item to the basket
     * @param {string} itemId Id of the item you want to add to the basket
     * @param {boolean|undefined} skipHooks Whether to skip the hooks or not, defaults to no skipping
     */
    scan(itemId, skipHooks = false) {
        // refresh list of active deals
        this.createCombinedDeals();

        // check if item actually exists in inventory
        if (inventory[itemId] !== undefined) {
            this.content.push(itemId);

            if (!skipHooks) {
                // go through the hook of every active deal
                for (let deal of this.combinedSaleDeals) {
                    if (deal.scanHook != undefined) {
                        deal.scanHook(itemId, this);
                    }
                }
            }
        } else {
            throw ('Item with id ' + itemId + ' not in inventory');
        }
    }

    /**
     * Lists the total sum of all items in the basket, discounts taken into account
     * @param {boolean|undefined} consoleDebug Whether or not to put debug output to the console
     */
    total(consoleDebug = false) {
        // refresh list of active deals
        this.createCombinedDeals();

        if (consoleDebug) {
            console.log("================");
            console.log("Items in basket:");
        }

        // resets item counting, etc. of the all active deals
        for (let deal of this.combinedSaleDeals) {
            if (deal.reset != undefined) {
                deal.reset();
            }
        }

        let sum = 0;
        for (let itemId of this.content) {
            let price = inventory[itemId].price;

            // adjust price by calling deal price hooks
            for (let deal of this.combinedSaleDeals) {
                if (deal.priceHook != undefined) {
                    price = deal.priceHook(itemId, price);
                }
            }

            sum += price;
            
            if (consoleDebug) {
                console.log(itemId + ": " + price);
            }
        }
        if (consoleDebug) {
            console.log("----------------");
            console.log("Total: " + sum);
            console.log("================");
        }
        return sum;
    }

    /**
     * Adds a deal to this particular basket
     * @param {BuyOneGetXFree|Discount} deal 
     */
    addSaleDeal(deal) {
        this.saleDeals.push(deal);
    }

    /**
     * Adds a deal globally to all baskets
     * @param {BuyOneGetXFree|Discount} deal
     */
    static addGlobalSaleDeal(deal) {
        globalSaleDeals.push(deal);
    }

    /**
     * Combines global deals and the deals of this basket to avoid duplicates
     */
    createCombinedDeals() {
        this.combinedSaleDeals = [...this.saleDeals, ...globalSaleDeals];
        // filter duplicates
        this.combinedSaleDeals.filter((elem, pos, arr) => {
            // if it's not the first found element, it must be a duplicate
            return arr.indexOf(elem) == pos;
        });
    }

    /**
     * Getter for content
     */
    getContent() {
        return this.content;
    }

    /**
     * Getter for combinedSaleDeals
     */
    getCombinedSaleDeals() {
        return this.combinedSaleDeals;
    }

    /**
     * Clears the globalSaleDeals variable
     */
    static clearGlobalSaleDeals() {
        globalSaleDeals.length = 0;
    }
}

export default Basket;
