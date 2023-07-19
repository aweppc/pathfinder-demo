import { Predicate } from './types';

export const composePredicates = <T extends any[]>(...fns: (Predicate<T> | undefined)[]) => {
    return (...args: T): boolean => {
        for (let i = 0; i < fns.length; i++) {
            const fn = fns[i];
            if (!fn) {
                continue;
            }
            const subResult = fn(...args);
            if (!subResult) {
                return subResult;
            }
        }
        return true;
    }
}

export const not = <T extends any[]>(fn: Predicate<T>) => (...args: T) => !fn(...args);
