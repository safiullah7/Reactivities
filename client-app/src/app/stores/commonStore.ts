import {RootStore} from './rootStore';
import { observable, action, reaction } from 'mobx';

export default class CommonStore {
    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;

        /* 
            in reaction we can set some observable, reaction's job is like 'watch'
            it'll watch for changes in that observable and execute whenever that
            observable's value changes
        */
        reaction(
            () => this.token,
            token => {
                if (token) {
                    window.localStorage.setItem('jwt', token);
                } else {
                    window.localStorage.removeItem('jwt');
                }
            }
        )
    }

    @observable token: string | null = null;
    @observable appLoaded = false;

    @action setToken = (token: string | null) => {
        this.token = token;
    }
    @action setAppLoaded = () => {
        this.appLoaded = true;
    }
}