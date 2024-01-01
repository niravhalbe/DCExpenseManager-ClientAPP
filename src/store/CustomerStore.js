import { action, computed, makeObservable, observable } from "mobx";
import axios from 'axios';

export class CustomerStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
        this.customerById = null;
        this.customers = [];
        this.savedCustomerId = 0;

        makeObservable(this, {
            customers: observable,
            savedCustomerId: observable,
            customerById: observable,
            fetchCustomers: action,
            fetchCustomerById: action,
            resetCustomerById: action,
            saveCustomer: action,
            deleteCustomer: action,
            getCustomers: computed,
            getCustomerById: computed,
            getSavedCustomerId: computed
        });

    }

    fetchCustomers = async () => {
        this.rootStore.commonStore.setLoader(true);
        const apiResponse = await axios.get("https://localhost:44346/api/Customer/GetAll");
        this.customers = apiResponse?.data?.data;
        this.rootStore.commonStore.setLoader(false);
    }

    fetchCustomerById = async (customerId) => {
        this.rootStore.commonStore.setLoader(true);
        const apiResponse = await axios.get(`https://localhost:44346/api/Customer/GetById/${customerId}`);
        this.customerById = apiResponse?.data?.data;
        this.rootStore.commonStore.setLoader(false);
    }

    saveCustomer = async (customer) => {
        this.rootStore.commonStore.setLoader(true);
        const apiResponse = await axios.post("https://localhost:44346/api/Customer/Save", customer);
        this.savedCustomerId = apiResponse?.data?.data;
        this.rootStore.commonStore.setLoader(false);
    }

    deleteCustomer = async (customerId) => {
        this.rootStore.commonStore.setLoader(true);
        await axios.delete(`https://localhost:44346/api/Customer/Delete/${customerId}`);
        this.rootStore.commonStore.setLoader(false);
    }

    resetCustomerById = () => {
        this.customerById = null;
    }

    get getCustomers() {
        return this.customers;
    }

    get getCustomerById() {
        return this.customerById;
    }

    get getSavedCustomerId() {
        return this.savedCustomerId;
    }
};