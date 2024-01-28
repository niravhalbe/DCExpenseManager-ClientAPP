import { action, computed, makeObservable, observable } from "mobx";
import axios from 'axios';
import { BaseAPIURL } from "../utils/constants";
import { getValueFromLocalstorage } from "../utils/helperFunctions";

export class TimesheetStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
        this.savedTimesheetId = 0;
        this.timesheets = [];
        this.loggedInUser = JSON.parse(getValueFromLocalstorage());

        makeObservable(this, {
            savedTimesheetId: observable,
            timesheets: observable,
            saveTimesheet: action,
            fetchTimesheets: action,
            getSavedTimesheetId: computed,
            getTimesheets: computed
        });
    }

    saveTimesheet = async (timesheetData) => {
        this.rootStore.commonStore.setLoader(true);
        const apiResponse = await axios.post(`${BaseAPIURL}/Timesheet/Save`, timesheetData, { headers: { userId: this.loggedInUser.userId } });
        this.savedTimesheetId = apiResponse?.data?.data;
        this.rootStore.commonStore.setLoader(false);
    }

    fetchTimesheets = async (userId) => {
        this.rootStore.commonStore.setLoader(true);
        const apiResponse = await axios.get(`${BaseAPIURL}/Timesheet/GetAll/${userId}`);
        this.timesheets = apiResponse?.data?.data;
        this.rootStore.commonStore.setLoader(false);
    }

    deleteTimesheet = async (timesheetId) => {
        this.rootStore.commonStore.setLoader(true);
        await axios.delete(`${BaseAPIURL}/Timesheet/Delete/${timesheetId}`, { headers: { userId: this.loggedInUser.userId } });
        this.rootStore.commonStore.setLoader(false);
    }

    get getSavedTimesheetId() {
        return this.savedTimesheetId;
    }

    get getTimesheets() {
        return this.timesheets;
    }
};