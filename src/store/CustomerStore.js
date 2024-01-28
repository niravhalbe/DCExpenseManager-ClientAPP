import { action, computed, makeObservable, observable } from "mobx";
import axios from 'axios';
import { BaseAPIURL } from "../utils/constants";
import { getValueFromLocalstorage } from "../utils/helperFunctions";

export class CustomerStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
        this.customerById = null;
        this.customers = [];
        this.savedCustomerId = 0;
        this.loggedInUser = JSON.parse(getValueFromLocalstorage());

        makeObservable(this, {
            customers: observable,
            savedCustomerId: observable,
            customerById: observable,
            fetchCustomers: action,
            fetchAssignedCustomers: action,
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
        const apiResponse = await axios.get(`${BaseAPIURL}/Customer/GetAll`);
        this.customers = apiResponse?.data?.data;
        this.rootStore.commonStore.setLoader(false);
    }

    fetchAssignedCustomers = async (userId) => {
        this.rootStore.commonStore.setLoader(true);
        const apiResponse = await axios.get(`${BaseAPIURL}/Customer/GetAssinged/${userId}`);
        this.customers = apiResponse?.data?.data;
        this.rootStore.commonStore.setLoader(false);
    }

    fetchCustomerById = async (customerId) => {
        this.rootStore.commonStore.setLoader(true);
        const apiResponse = await axios.get(`${BaseAPIURL}/Customer/GetById/${customerId}`);
        this.customerById = apiResponse?.data?.data;
        this.rootStore.commonStore.setLoader(false);
    }

    saveCustomer = async (customer) => {
        this.rootStore.commonStore.setLoader(true);
        const apiResponse = await axios.post(`${BaseAPIURL}/Customer/Save`, customer, { headers: { userId: this.loggedInUser.userId } });
        this.savedCustomerId = apiResponse?.data?.data;
        this.rootStore.commonStore.setLoader(false);
    }

    deleteCustomer = async (customerId) => {
        this.rootStore.commonStore.setLoader(true);
        await axios.delete(`${BaseAPIURL}/Customer/Delete/${customerId}`, { headers: { userId: this.loggedInUser.userId } });
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