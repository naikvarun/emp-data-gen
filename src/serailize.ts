import {Employee} from "./employee";
import * as fs from "node:fs";

let flatten  = <T>(emp: Employee[], extractChildren: (employee: Employee) => Employee[],recordGenerator: (emp: Employee) => T): T[] => {
    return Array.prototype.concat.apply([
        emp.map(recordGenerator)
    ],
      emp.map(x => flatten(extractChildren(x) || [], extractChildren, recordGenerator) )
    );
}


const flattenRecordsAsync =async  <T>(employee: Employee, recordGenerator: (emp: Employee) => T): Promise<T[]> => {

    const records: T[] = [recordGenerator(employee)];
    const childRecords = employee.children.map((child) => {
        return flattenRecordsAsync(child, recordGenerator)
    })
    const results = await Promise.all(childRecords)
    records.concat(
        results.reduce((acc, rec) => {
            return acc.concat(rec)
        }, [])
    )
    /*records.push(...results.reduce((acc, rec) => {
        acc.push(...rec)
        return acc;
    }, []));*/
    return records;
}

const flattenRecords = <T>(employee: Employee, recordGenerator: (emp: Employee) => T): T[] => {
    console.log("Flattening records")
    const records: T[] = [];
    let queue: Employee[] = [employee];
    while (queue.length > 0) {
        const curr = queue.shift()!;
        records.push(recordGenerator(curr));
        queue = queue.concat(curr.children);
    }
    console.log("Flattening records done")
    return records;
}

async function serializeData<T>(records: T[], fileName: string, recordSerializer:  (record: T[])=>string) {
    writeToFile(fileName, recordSerializer(records));
}

async function serializeToCSV(records: Omit<Employee, 'children'>[], fileName: string): Promise<void> {
    return serializeData(records,
        fileName, (records) => {
            return records.map((r) => `${r.id},${r.name},${r.manager?? ''}`).join('\n')
        });
}

async function serializeTOJSON(records: Omit<Employee, 'children'>[], fileName: string): Promise<void> {
    return serializeData(records,
        fileName, (records) => {
            return JSON.stringify(records, null, 2)
        });
}

const writeToFile = (fileName: string, data: string) => {
    fs.writeFileSync(fileName, data)
    console.log(`${fileName} created!`)
};
export const serialize = {
    serializeTOJSON, serializeToCSV, flattenRecords, flattenRecordsAsync, flatten
}