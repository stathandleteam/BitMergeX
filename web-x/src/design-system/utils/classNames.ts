// classNames.ts

type ClassValue = string | number | ClassDictionary | ClassArray | undefined | null;

interface ClassDictionary {
    [id: string]: any;
}

interface ClassArray extends Array<ClassValue> { }

export default function classNames(...classes: ClassValue[]): string {
    return classes.map((item: any) => {

        if (Array.isArray(item)) {
            return item.filter(Boolean).join(' ');
        }

        if (typeof item === 'object') {
            const classNames = Object.keys(item)
                .filter(key => item[key])
                .map(key => key);

            return classNames.join(' ');
        }

        return item;
    })
        .filter(Boolean)
        .join(' ');
}