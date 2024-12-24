import storage from './storage';
import http from './http';
const TOKEN_KEY = 'tid';
const OPENID_KEY = 'security.siam.openid';
const PHONE_KEY = 'security.siam.phone';
export default class AuthService {
    static getToken() {
        return Promise.resolve(storage.getStorage(TOKEN_KEY));
    }
    static setToken(token) {
        return Promise.resolve(storage.setStorage(TOKEN_KEY, token));
    }
    static deleteToken() {
        return Promise.resolve(storage.removeStorage(TOKEN_KEY));
    }
    static setOpenId(openId) {
        return Promise.resolve(storage.setStorage(OPENID_KEY, openId));
    }
    static getOpenId() {
        return Promise.resolve(storage.getStorage(OPENID_KEY));
    }
    static deleteOpenId() {
        return Promise.resolve(storage.removeStorage(OPENID_KEY));
    }
    static setPhoneNumber(phone) {
        return Promise.resolve(storage.setStorage(PHONE_KEY, phone));
    }
    static getPhoneNumber() {
        return Promise.resolve(storage.getStorage(PHONE_KEY));
    }
    static deletePhoneNumber() {
        return Promise.resolve(storage.removeStorage(PHONE_KEY));
    }
    static setWxStorage(storageText, storageValue) {
        return Promise.resolve(storage.setStorage('security.' + storageText, storageValue));
    }
    static getWxStorage(storageText) {
        return Promise.resolve(storage.getStorage('security.' + storageText));
    }
    static deleteOpenId(storageText) {
        return Promise.resolve(storage.removeStorage('security.' + storageText));
    }
    static checkIsLogin() {
        this.getToken().then(token => {
            console.log(token);
        })
        
        
        return new Promise((fulfil, reject) => {
            Promise.resolve(this.getToken())
                .then(token => {
                    fulfil(!!token);
                })
                .catch(() => {
                    fulfil(false);
                });
        });
    }
}
