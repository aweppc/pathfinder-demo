import { ScoreFirstList } from './score-first-list';

class NumberList extends ScoreFirstList<number> {
    protected getScore(value: number): number {
        return value;
    }
    protected getId(value: number): string {
        return value.toString();
    }
}

describe('ScoreFirstList', () => {
    it('should work', () => {
        const ll = new NumberList();
        ll
            .add(5)
            .add(4)
            .add(1)
            .add(10)
            .add(2)
            .add(200)
            .add(100)
            .add(3);
        const r: number[] = [];
        while (ll.hasNext()) {
            r.push(ll.pop() ?? 9000);
        }
        expect(r).toEqual([1,2,3,4,5,10,100,200])
    });
});