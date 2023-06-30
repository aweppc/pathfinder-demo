import { Predicate } from './types';

export const composePredicates = <T>(...fns: (Predicate<T> | undefined)[]) => {
    return (arg: T): boolean => {
        for (let i = 0; i < fns.length; i++) {
            const fn = fns[i];
            if (!fn) {
                continue;
            }
            const subResult = fn(arg);
            if (!subResult) {
                return subResult;
            }
        }
        return true;
    }
}

export const not = <T>(fn: Predicate<T>) => (arg: T) => !fn(arg);
