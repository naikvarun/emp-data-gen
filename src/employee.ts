export type Employee = {
    id: string,
    name: string,
    manager?: string,
    children: Employee[]
}
export type EmployeeWOC = Omit<Employee, 'children'>