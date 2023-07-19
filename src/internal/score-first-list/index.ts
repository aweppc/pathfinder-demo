export abstract class ScoreFirstList<T> {
    protected abstract getScore(value: T): number;
    protected abstract getId(value: T): string;

    private arr: string[] = [];
    private values: Record<string, T> = {};

    add(value: T) {
        const id = this.getId(value);
        const score = this.getScore(value);
        const existing = this.values[id];
        if (existing) {
            const existingScore = this.getScore(existing);
            if (existingScore < score) {
                return this;
            }
            this.arr.splice(this.arr.indexOf(id), 1);
        }
        this.values[id] = value;
        let i = 0;
        while (i < this.arr.length) {
            if (score <= this.getScore(this.values[this.arr[i]])) {
                this.arr.splice(i, 0, id);
                return this;
            }
            i++;
        }
        this.arr.splice(this.arr.length, 0, id);
        return this;
    }

    pop() {
        const id = this.arr.shift();
        if (!id) {
            return null;
        }
        const value = this.values[id];
        delete this.values[id];
        return value;
    }

    hasNext() {
        return !!this.arr.length;
    }

    getArr() {
        return this.arr;
    }
}
