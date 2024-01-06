

import { ProjectStore } from "./ProjectStore";
import { CommonStore } from "./CommonStore";
import { CustomerStore } from "./CustomerStore";
import { EmployeeStore } from "./EmployeeStore";
import { MappingStore } from "./MappingStore";

export class RootStore {
    constructor() {
        this.projectStore = new ProjectStore(this);
        this.customerStore = new CustomerStore(this);
        this.commonStore = new CommonStore(this);
        this.employeeStore = new EmployeeStore(this);
        this.mappingStore = new MappingStore(this);
    }
}