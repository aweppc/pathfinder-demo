type Modifiers = Record<string, string | boolean>;

export const classname = (block: string) => {
    function cnfn(): string;
    function cnfn(modifiers: Modifiers): string;
    function cnfn(element: string): string;
    function cnfn(element: string, modifiers: Modifiers): string;
    function cnfn(elementOrModifiers?: string | Modifiers, modifiersMaybe?: Modifiers) {
        const element: string | undefined = typeof elementOrModifiers === 'string'
            ? elementOrModifiers
            : undefined;
        const modifiers = typeof elementOrModifiers === 'object'
            ? elementOrModifiers
            : modifiersMaybe;
        const result: string[] = [];
        const baseStyle = element
            ? `${block}__${element}`
            : block;
        result.push(baseStyle);
        if (modifiers) {
            result.push(...Object.keys(modifiers).reduce<string[]>((result, key) => {
                const value = modifiers[key];
                if (value === false) {
                    return result;
                }
                const modifierValue = typeof value === 'string'
                    ? `${key}_${value}`
                    : key;
                result.push(`${baseStyle}_${modifierValue}`);
                return result;
            }, []));
        }
        return result.join(' ');
    }

    return cnfn;
}