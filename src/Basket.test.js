import Basket from './Basket';

Basket.__Rewire__('inventory',
    {
        A: {
            price: 1
        },
        B: {
            price: 2
        },
    }
);

describe('Basket', () => {

    it('should add an item to the basket', () => {
        const basket = new Basket();
        basket.scan('A', true);

        const res = basket.getContent();
        expect(res).toEqual(['A']);
    });

    it('should add two items to the basket', () => {
        const basket = new Basket();
        basket.scan('A', true);
        basket.scan('B', true);

        const res = basket.getContent();
        expect(res).toEqual(['A', 'B']);
    });

    it('should not add non-existent items to the basket', () => {
        const basket = new Basket();
        basket.scan('B', true);

        expect(() => {
            basket.scan('C', true)
        }).toThrow('Item with id C not in inventory');

        const res = basket.getContent();
        expect(res).toEqual(['B']);
    });

    it('should add sale deal object to combined list', () => {
        const deal = { mock: null };

        const basket = new Basket();
        basket.addSaleDeal(deal);
        basket.createCombinedDeals();

        const res = basket.getCombinedSaleDeals();
        expect(res).toEqual([deal])
    });

    it('should add global sale deal object to combined list', () => {
        Basket.clearGlobalSaleDeals(); // clear global sales
        const deal = { mock: null };

        const basket1 = new Basket();
        Basket.addGlobalSaleDeal(deal); // static function call inbetween
        const basket2 = new Basket();

        // recreate combined deals list for both objects
        basket1.createCombinedDeals();
        basket2.createCombinedDeals();

        // should be present in both objects
        const res1 = basket1.getCombinedSaleDeals();
        expect(res1).toEqual([deal])
        const res2 = basket2.getCombinedSaleDeals();
        expect(res2).toEqual([deal])
        Basket.clearGlobalSaleDeals(); // clear global sales
    });

    it('should ignore double added sale deal objects', () => {
        Basket.clearGlobalSaleDeals(); // clear global sales
        const deal = { mock: null };

        Basket.addGlobalSaleDeal(deal); 
        const basket1 = new Basket();
        const basket2 = new Basket();

        basket1.addSaleDeal(deal);

        // recreate combined deals list for both objects
        basket1.createCombinedDeals();
        basket2.createCombinedDeals();

        // should be present only once in both objects
        const res1 = basket1.getCombinedSaleDeals();
        expect(res1).toEqual([deal])
        const res2 = basket2.getCombinedSaleDeals();
        expect(res2).toEqual([deal])
        Basket.clearGlobalSaleDeals(); // clear global sales
    });

    it('should call scan hooks if flag is not set or set to false', () => {
        const deal = { scanHook: jest.fn() };

        const basket = new Basket();
        basket.addSaleDeal(deal);
        basket.scan('A');
        basket.scan('A', false);
        basket.scan('B');
        basket.scan('B', false);

        expect(deal.scanHook.mock.calls.length).toBe(4);
    });

    it('should not call scan hooks if flag is set to true', () => {
        const deal = { scanHook: jest.fn() };

        const basket = new Basket();
        basket.addSaleDeal(deal);
        basket.scan('A', true);
        basket.scan('B', true);

        expect(deal.scanHook.mock.calls.length).toBe(0);
    });

    it('should return the correct total value of all items', () => {
        const basket = new Basket();
        basket.scan('A');
        basket.scan('B');
        basket.scan('A');
        basket.scan('B');

        const res = basket.total();
        expect(res).toBe(6);
    });

    it('should return the correct total value after discounts', () => {
        const priceHookMock = jest.fn();
        priceHookMock
            .mockReturnValueOnce(0.25)
            .mockReturnValueOnce(0.15)
            .mockReturnValueOnce(10)
            .mockReturnValueOnce(1.25)
            .mockReturnValueOnce(0)
        const deal1 = { priceHook: priceHookMock };
        const resetMock = jest.fn();
        const deal2 = { reset: resetMock };

        const basket = new Basket();
        basket.addSaleDeal(deal1);
        basket.addSaleDeal(deal2);
        basket.scan('A');
        basket.scan('B');
        basket.scan('A', false);
        basket.scan('B');
        basket.scan('B', true);

        const res = basket.total();
        expect(res).toBe(11.65);
        expect(deal1.priceHook.mock.calls.length).toBe(5);
        expect(deal2.reset.mock.calls.length).toBe(1);
    });

});