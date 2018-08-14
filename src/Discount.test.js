import Discount from './Discount';

describe('Discount', () => {

    it('should reduce the price depending on set discout', () => {
        const deal = new Discount({ A: 0.05, B: 0.1, C: 0.5, D: 0.9 });

        expect(deal.priceHook('B', 100)).toBe(90);
        expect(deal.priceHook('D', 100)).toBe(10);
        expect(deal.priceHook('E', 100)).toBe(100);
        expect(deal.priceHook('A', 100)).toBe(95);
        expect(deal.priceHook('C', 100)).toBe(50);
    });

    it('should not give any discout if no object is set', () => {
        const deal = new Discount();

        expect(deal.priceHook('B', 100)).toBe(100);
        expect(deal.priceHook('D', 100)).toBe(100);
        expect(deal.priceHook('E', 100)).toBe(100);
        expect(deal.priceHook('A', 100)).toBe(100);
        expect(deal.priceHook('C', 100)).toBe(100);
    });

});