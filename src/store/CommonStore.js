import { action, computed, makeObservable, observable } from "mobx";
import axios from 'axios';
import { BaseAPIURL } from "../utils/constants";

export class CommonStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
        this.showLoader = false;
        this.loggedInUser = null;

        makeObservable(this, {
            showLoader: observable,
            setLoader: action,
            validateUser: action,
            resetLoggedInUser: action,
            getLoader: computed
        });
        this.rootStore = rootStore
    }

    setLoader = (value) => {
        this.showLoader = value;
    }

    validateUser = async (credentials) => {
        this.setLoader(true);
        const apiResponse = await axios.post(`${BaseAPIURL}/Login/ValidateUser`, credentials);
        this.loggedInUser = apiResponse?.data?.data;
        this.setLoader(false);
        return this.loggedInUser;
    }

    resetLoggedInUser = () => {
        this.loggedInUser = null;
    }

    get getLoader() {
        return this.showLoader;
    }
};