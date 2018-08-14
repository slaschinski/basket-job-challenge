/**
 * A deal to get x free items for every bought item of a specific kind
 */
class BuyOneGetXFree {
    /**
     * Provide the item id and the amount of free items this deal grants
     * @param {string} itemId Id of the item this deal affects
     * @param {number} X Amount of items which are granted for free for every bought item
     * @param {boolean} autoAdd Whether or not free items will be placed automatically in the basket
     */
    constructor(itemId, X, autoAdd = false) {
        this.itemId = itemId;
        this.X = X;
        this.autoAdd = autoAdd;
    }

    /**
     * Resets the counted, deal related items in basket
     */
    reset() {
        this.counted = 0;
    }

    /**
     * Hook that adds free items for every deal related item added to basket
     * @param {string} itemId Id of the item added to basket
     * @param {Basket} basket Basket object for callbacks
     */
    scanHook(itemId, basket) {
        if (this.autoAdd && this.itemId == itemId) {
            // add the same item X times
            for (let i = 0; i < this.X; i++) {
                basket.scan(itemId, true);
            }
        }
    }

    /**
     * Hook to reduce costs of affcted items to zero
     * @param {string} itemId Id of the item processed by the basket
     * @param {number} price Actual price before discount
     */
    priceHook(itemId, price) {
        if (itemId == this.itemId) {
            // 0 items will have 0 rest, every other item count will have rest
            // until we get back to X + 1 items, which will have no rest again
            // so we can discard the price on every item count with rest
            if (this.counted % (this.X + 1) != 0) {
                price = 0;
            }
        
            // notice: the counting is done after the calculations
            this.counted++;
        }

        return price;
    }
}

export default BuyOneGetXFree;
