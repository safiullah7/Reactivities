import { RootStore } from "./rootStore";
import { observable, action, runInAction, computed } from "mobx";
import { IProfile, IPhoto } from "../models/profile";
import agent from "../api/agent";
import { toast } from "react-toastify";
import { async } from "q";

export default class ProfileStore {
    rootStore: RootStore;
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    @observable profile: IProfile | null = null;
    @observable loadingProfile = true;
    @observable uploadingPhoto = false;
    @observable loading = false;

    @computed get isCurrentUser() {
        if (this.rootStore.userStore.user && this.profile) {
            return this.rootStore.userStore.user.username === this.profile.username;
        } else {
            return false;
        }
    }

    @action loadProfile = async (username: string) => {
        this.loadingProfile = true;
        try {
            const profile = await agent.Profiles.get(username);
            runInAction(() => {
                this.profile = profile;
                this.loadingProfile = false;
            })
        } catch(error) {
            runInAction(() => {
                this.loadingProfile = false;
            })
            console.log(error);
        }
    }

    @action uploadPhoto = async (file: Blob) => {
        this.uploadingPhoto = true;
        try {
            const photo = await agent.Profiles.uploadPhoto(file);
            runInAction(() => {
                if (this.profile) {
                    this.profile.photos.push(photo);
                    if (photo.isMain && this.rootStore.userStore.user) {
                        this.rootStore.userStore.user.image = photo.url;
                        this.profile.image = photo.url;
                    }
                }
                this.loadingProfile = false;
            })
        } catch (error) {
            console.log(error);
            toast.error('Problem uploading photo');
            runInAction(() => {
                this.loadingProfile = false;
            })
        }
    }

    @action setMainPhoto = async (photo: IPhoto) => {
        this.loading = true;
        try {
            await agent.Profiles.setMainPhoto(photo.id);
            runInAction(() => {
                // 1. user object mein image set
                this.rootStore.userStore.user!.image = photo.url;
                
                // 2. profile object ki photos mein main current photo ko false karna, aur es photo ko true karna
                this.profile!.photos.find(a => a.isMain)!.isMain = false;
                this.profile!.photos.find(a => a.id === photo.id)!.isMain = true;
                
                // 3. profile object ki image ko es photo k url pe set karna
                this.profile!.image = photo.url;
                
                this.loading = false;
            })
        } catch (error) {
            toast.error('Problem setting main photo');
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    @action deletePhoto = async (photo: IPhoto) => {
        this.loading = true;
        try {
            await agent.Profiles.deletePhoto(photo.id);
            runInAction(() => {
                this.profile!.photos = this.profile!.photos.filter(a => a.id !== photo.id);
                this.loading = false;
            })
        } catch (error) {
            toast.error('Problem deleting photo');
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    @action EditProfile = async (values: Partial<IProfile>) => {
        try {
            await agent.Profiles.Edit(values);
            runInAction(() => {
                if (values.displayName !== this.rootStore.userStore.user!.displayName) {
                    this.rootStore.userStore.user!.displayName = values.displayName!;
                }
                this.profile = {...this.profile!, ...values};
            })
        } catch(error) {
            toast.error('Problem updating profile')
        }
    }

    @action follow = async (username: string) => {
        this.loading = true;
        try {
            await agent.Profiles.follow(username);
            runInAction(() => {
                this.profile!.following = true;
                this.profile!.followersCount++;
                this.loading = false;
            })
        } catch (error) {
            toast.error('Problem following the user');
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    @action unfollow = async (username: string) => {
        this.loading = true;
        try {
            await agent.Profiles.unfollow(username);
            runInAction(() => {
                this.profile!.following = false;
                this.profile!.followersCount--;
                this.loading = false;
            })
        } catch (error) {
            toast.error('Problem unfollowing the user');
            runInAction(() => {
                this.loading = false;
            });
        }
    }
}