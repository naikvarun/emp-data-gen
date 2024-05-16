import {Employee, EmployeeWOC} from "./employee";
import {getId} from "./id";
import {faker} from "@faker-js/faker";
import {getRandomInt} from "./faker-util";
import {serialize} from "./serailize";

const MAX_HIERARCHIES = 1;
const MAX_CHILDREN = 15;
const MAX_LEVEL = 7;

function generateEmployee(level: number, manager?: Employee) : Employee {

    const emp: Employee = {
        id: getId(),
        name: `${faker.person.firstName()} ${faker.person.lastName()}`,
        manager: manager ? manager.id : undefined,
        children: []
    }
    if(level >= MAX_LEVEL) {
        return emp;
    }
    const childCount = getRandomInt({ min: 0, max: MAX_CHILDREN });
    emp.children = new Array(childCount).fill(0).map<Employee>((_, __) => generateEmployee(level+1, emp));
    return emp;
}

async function main() {
    const topCount =1// getRandomInt({min: 1, max: MAX_HIERARCHIES});
    const employees =  new Array(topCount).fill(0).map(()=> generateEmployee(1));
    console.log('Random Data generated');
    /*const records = employees.map((employee: Employee) => {
        return serialize.flattenRecords<Omit<Employee, 'children'>>(employee, (emp)=> ({
            id: emp.id,
            name: emp.name,
            manager: emp.manager
        }));
    }).reduce((acc, recs) => {
        acc.push(...recs)
        return acc
    } , [] )*/

    console.log("Flattening records")
    const result = serialize.flatten<EmployeeWOC>(
        employees, (emp) => emp.children, (emp)=> ({
            id: emp.id,
            name: emp.name,
            manager: emp.manager
        })
    )
    /*const result = employees.map((employee: Employee) => {
        return  serialize.flattenRecords<Omit<Employee, 'children'>>(employee, (emp)=> ({
            id: emp.id,
            name: emp.name,
            manager: emp.manager
        }));
    })*/

    /*const recordPromises = employees.map((employee: Employee) => {
        return  serialize.flattenRecords<Omit<Employee, 'children'>>(employee, (emp)=> ({
            id: emp.id,
            name: emp.name,
            manager: emp.manager
        }));
    })
    const result = await Promise.resolve(Promise.all(recordPromises));*/

    const records = result.reduce<EmployeeWOC[]>((acc, recs) => {
        return acc.concat(recs)
    } , [] )
    console.log("Flattening records done")

    console.log("Writing to file")
    await Promise.allSettled([serialize.serializeToCSV(records, "employees.csv"), serialize.serializeTOJSON(records, "employees.json")])


}

main()
.then(()=>console.log('Done')).catch((err)=> console.error('Error', err))