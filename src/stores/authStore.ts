import { makeAutoObservable } from 'mobx';

interface User {
    name: string;
    email: string;
    token: string;
}

class AuthStore {
    user: User | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    setUser(user: User) {
        this.user = user;
        localStorage.setItem('token', user.token);
    }

    logout() {
        this.user = null;
        localStorage.removeItem('token');
    }

    get isAuthenticated() {
        return this.user !== null;
    }
}

const authStore = new AuthStore();
export default authStore;
