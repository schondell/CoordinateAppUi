import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'groupBy', standalone: true })
export class GroupByPipe implements PipeTransform {
    transform(collection: any[], property: string): any[] {
        if (!Array.isArray(collection) || !property) return collection;
        const grouped = collection.reduce((acc, item) => {
            const key = item[property] || 'Other';
            acc[key] = acc[key] || [];
            acc[key].push(item);
            return acc;
        }, {} as { [key: string]: any[] });
        return Object.keys(grouped).map(key => ({ key, value: grouped[key] }));
    }
}
