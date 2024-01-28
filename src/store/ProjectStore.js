import { action, computed, makeObservable, observable } from "mobx";
import axios from 'axios';
import { BaseAPIURL } from "../utils/constants";
import { getValueFromLocalstorage } from "../utils/helperFunctions";

export class ProjectStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
        this.projectById = null;
        this.projects = [];
        this.savedProjectId = 0;
        this.loggedInUser = JSON.parse(getValueFromLocalstorage());

        makeObservable(this, {
            projects: observable,
            savedProjectId: observable,
            projectById: observable,
            fetchProjects: action,
            fetchAssignedProjects: action,
            fetchProjectById: action,
            resetProjectById: action,
            saveProject: action,
            deleteProject: action,
            getProjects: computed,
            getProjectById: computed,
            getSavedProjectId: computed
        });

    }

    fetchProjects = async () => {

        this.rootStore.commonStore.setLoader(true);
        const apiResponse = await axios.get(`${BaseAPIURL}/Project/GetAll`);
        this.projects = apiResponse?.data?.data;
        this.rootStore.commonStore.setLoader(false);
    }

    fetchProjectById = async (projectId) => {
        this.rootStore.commonStore.setLoader(true);
        const apiResponse = await axios.get(`${BaseAPIURL}/Project/GetById/${projectId}`);
        this.projectById = apiResponse?.data?.data;
        this.rootStore.commonStore.setLoader(false);
    }

    fetchAssignedProjects = async (userId) => {
        this.rootStore.commonStore.setLoader(true);
        const apiResponse = await axios.get(`${BaseAPIURL}/Project/GetAssinged/${userId}`);
        this.projects = apiResponse?.data?.data;
        this.rootStore.commonStore.setLoader(false);
    }

    saveProject = async (project) => {
        this.rootStore.commonStore.setLoader(true);
        const apiResponse = await axios.post(`${BaseAPIURL}/Project/Save`, project, { headers: { userId: this.loggedInUser.userId } });
        this.savedProjectId = apiResponse?.data?.data;
        this.rootStore.commonStore.setLoader(false);
    }

    deleteProject = async (projectId) => {
        this.rootStore.commonStore.setLoader(true);
        await axios.delete(`${BaseAPIURL}/Project/Delete/${projectId}`, { headers: { userId: this.loggedInUser.userId } });
        this.rootStore.commonStore.setLoader(false);
    }

    resetProjectById = () => {
        this.projectById = null;
    }

    get getProjects() {
        return this.projects;
    }

    get getProjectById() {
        return this.projectById;
    }

    get getSavedProjectId() {
        return this.savedProjectId;
    }
};