import { action, computed, makeObservable, observable } from "mobx";
import axios from 'axios';
import { BaseAPIURL } from "../utils/constants";

export class EmployeeStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
        this.employeeById = null;
        this.employees = [];
        this.savedEmployeeId = 0;

        makeObservable(this, {
            employees: observable,
            savedEmployeeId: observable,
            employeeById: observable,
            fetchEmployees: action,
            fetchEmployeeById: action,
            resetEmployeeById: action,
            saveEmployee: action,
            deleteEmployee: action,
            getEmployees: computed,
            getEmployeeById: computed,
            getSavedEmployeeById: computed
        });

    }

    fetchEmployees = async () => {
        this.rootStore.commonStore.setLoader(true);
        const apiResponse = await axios.get(`${BaseAPIURL}/Employee/GetAll`);
        this.employees = apiResponse?.data?.data;
        this.rootStore.commonStore.setLoader(false);
    }

    fetchEmployeeById = async (employeeId) => {
        this.rootStore.commonStore.setLoader(true);
        const apiResponse = await axios.get(`${BaseAPIURL}/Employee/GetById/${employeeId}`);
        this.employeeById = apiResponse?.data?.data;
        this.rootStore.commonStore.setLoader(false);
    }

    saveEmployee = async (employee) => {
        this.rootStore.commonStore.setLoader(true);
        const apiResponse = await axios.post(`${BaseAPIURL}/Employee/Save`, employee);
        this.savedEmployeeId = apiResponse?.data?.data;
        this.rootStore.commonStore.setLoader(false);
    }

    deleteEmployee = async (employeeId) => {
        this.rootStore.commonStore.setLoader(true);
        await axios.delete(`${BaseAPIURL}/Employee/Delete/${employeeId}`);
        this.rootStore.commonStore.setLoader(false);
    }

    resetEmployeeById = () => {
        this.employeeById = null;
    }

    get getEmployees() {
        return this.employees;
    }

    get getEmployeeById() {
        return this.employeeById;
    }

    get getSavedEmployeeById() {
        return this.savedEmployeeId;
    }
};