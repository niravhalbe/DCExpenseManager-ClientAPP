import { action, computed, makeObservable, observable } from "mobx";

export class CommonStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
        this.showLoader = false;

        makeObservable(this, {
            showLoader: observable,
            setLoader: action,
            getLoader: computed
        });
        this.rootStore = rootStore
    }

    setLoader = (value) => {
        this.showLoader = value;
    }

    get getLoader() {
        return this.showLoader;
    }
};