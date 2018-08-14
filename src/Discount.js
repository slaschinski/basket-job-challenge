/**
 * A deal to get a discount of items with given ids
 */
class Discount {
    /**
     * Provide an object containing item ids (one or more) and
     * their discount (10% = 0.10)
     * Example:
     * {
     *   A0001: 0.10,
     *   A0009: 0.05
     * }
     * @param {Object} articleDiscounts
     */
    constructor(articleDiscounts = {}) {
        this.discounts = articleDiscounts;
    }

    /**
     * Hook to reduce costs of affcted items by given amount
     * @param {string} itemId Id of the item processed by the basket
     * @param {number} price Actual price before discount
     */
    priceHook(itemId, price) {
        if (this.discounts[itemId] != undefined) {
            price -= price * this.discounts[itemId];
        }
        return price
    }
}

export default Discount;
