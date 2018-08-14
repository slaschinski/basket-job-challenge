import BuyOneGetXFree from './BuyOneGetXFree';

describe('BuyOneGetXFree', () => {

    it('should set counted to 0 on reset', () => {
        const deal = new BuyOneGetXFree();

        deal.counted = 10;
        deal.reset();

        expect(deal.counted).toBe(0);
    });

    it('should not call basket.scan if not enabled or wrong item id', () => {
        const scanMock = jest.fn();
        const basket = { scan: scanMock };

        const deal1 = new BuyOneGetXFree('A', 2);
        const deal2 = new BuyOneGetXFree('A', 2, false);
        const deal3 = new BuyOneGetXFree('A', 2, true);
        deal1.scanHook('A', basket);
        deal2.scanHook('A', basket);
        deal3.scanHook('B', basket);

        expect(basket.scan.mock.calls.length).toBe(0);
    });

    it('should not call basket.scan if enabled with correct item id', () => {
        const scanMock = jest.fn();
        const basket = { scan: scanMock };

        const deal1 = new BuyOneGetXFree('A', 2, true);
        const deal2 = new BuyOneGetXFree('B', 3, true);
        deal1.scanHook('A', basket);
        deal2.scanHook('B', basket);

        expect(basket.scan.mock.calls.length).toBe(5);
    });

    it('should reduce the price to 0 for every item applicable', () => {
        const deal = new BuyOneGetXFree('A', 3);
        deal.reset(); // to initialize counted to 0
        expect(deal.priceHook('A', 10)).toBe(10);
        expect(deal.priceHook('B', 5)).toBe(5);
        expect(deal.priceHook('A', 10)).toBe(0);
        expect(deal.priceHook('A', 10)).toBe(0);
        expect(deal.priceHook('B', 5)).toBe(5);
        expect(deal.priceHook('A', 10)).toBe(0);
        expect(deal.priceHook('A', 10)).toBe(10);
        expect(deal.priceHook('A', 10)).toBe(0);
        expect(deal.priceHook('A', 10)).toBe(0);
        expect(deal.priceHook('B', 5)).toBe(5);
        expect(deal.priceHook('A', 10)).toBe(0);
        expect(deal.priceHook('A', 10)).toBe(10);
        expect(deal.counted).toBe(9);
    });

});