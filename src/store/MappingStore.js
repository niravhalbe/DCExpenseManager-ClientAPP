import { action, computed, makeObservable, observable } from "mobx";
import axios from 'axios';
import { BaseAPIURL } from "../utils/constants";

export class MappingStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
        this.mappingById = null;
        this.mappings = [];
        this.savedMappingId = 0;

        makeObservable(this, {
            mappings: observable,
            savedMappingId: observable,
            mappingById: observable,
            fetchMappings: action,
            fetchMappingById: action,
            resetMappingById: action,
            saveMapping: action,
            deleteMapping: action,
            getMappings: computed,
            getMappingById: computed,
            getSavedMappingId: computed
        });

    }

    fetchMappings = async () => {
        this.rootStore.commonStore.setLoader(true);
        const apiResponse = await axios.get(`${BaseAPIURL}/Mapping/GetAll`);
        this.mappings = apiResponse?.data?.data;
        this.rootStore.commonStore.setLoader(false);
    }

    fetchMappingById = async (mappingId) => {
        this.rootStore.commonStore.setLoader(true);
        const apiResponse = await axios.get(`${BaseAPIURL}/Mapping/GetById/${mappingId}`);
        this.mappingById = apiResponse?.data?.data;
        this.rootStore.commonStore.setLoader(false);
    }

    saveMapping = async (mapping) => {
        this.rootStore.commonStore.setLoader(true);
        const apiResponse = await axios.post(`${BaseAPIURL}/Mapping/Save`, mapping);
        this.savedMappingId = apiResponse?.data?.data;
        this.rootStore.commonStore.setLoader(false);
    }

    deleteMapping = async (mappingId) => {
        this.rootStore.commonStore.setLoader(true);
        await axios.delete(`${BaseAPIURL}/Mapping/Delete/${mappingId}`);
        this.rootStore.commonStore.setLoader(false);
    }

    resetMappingById = () => {
        this.mappingById = null;
    }

    get getMappings() {
        return this.mappings;
    }

    get getMappingById() {
        return this.mappingById;
    }

    get getSavedMappingId() {
        return this.savedMappingId;
    }
};