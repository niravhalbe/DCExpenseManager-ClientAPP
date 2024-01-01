import { action, computed, makeObservable, observable } from "mobx";
import axios from 'axios';

export class ProjectStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
        this.projectById = null;
        this.projects = [];
        this.savedProjectId = 0;

        makeObservable(this, {
            projects: observable,
            savedProjectId: observable,
            projectById: observable,
            fetchProjects: action,
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
        const apiResponse = await axios.get("https://localhost:44346/api/Project/GetAll");
        this.projects = apiResponse?.data?.data;
        this.rootStore.commonStore.setLoader(false);
    }

    fetchProjectById = async (projectId) => {
        this.rootStore.commonStore.setLoader(true);
        const apiResponse = await axios.get(`https://localhost:44346/api/Project/GetById/${projectId}`);
        this.projectById = apiResponse?.data?.data;
        this.rootStore.commonStore.setLoader(false);
    }

    saveProject = async (project) => {
        this.rootStore.commonStore.setLoader(true);
        const apiResponse = await axios.post("https://localhost:44346/api/Project/Save", project);
        this.savedProjectId = apiResponse?.data?.data;
        this.rootStore.commonStore.setLoader(false);
    }

    deleteProject = async (projectId) => {
        this.rootStore.commonStore.setLoader(true);
        await axios.delete(`https://localhost:44346/api/Project/Delete/${projectId}`);
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