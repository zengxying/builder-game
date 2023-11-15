import {resources, Asset, assetManager, AssetManager } from "cc";
import Bundle = AssetManager.Bundle;
class ResItem {
    public url: string;
    public isLoading = false;
    public callbackArr = [];
}

export class ResourceMgr {
    private static _inst: ResourceMgr = null;
    public static get inst(): ResourceMgr {
        if (!this._inst) {
            this._inst = new ResourceMgr();
        }
        return this._inst;
    }

    private loadingQueue:[] = [];

    public loadRes<T>(url: string, type: any, callback: (err, assets: T) => void, bundle:Bundle = resources) {
        let cache = bundle.get(url,type) as any;
        if(cache){
            if(callback){
                setTimeout(()=>{
                    callback(null,cache);
                },10);
            }
            return;
        }
        let loadingItem:ResItem = this.loadingQueue[url];
        if(!loadingItem){
            loadingItem = this.loadingQueue[url] = new ResItem();
            loadingItem.url = url;
        }
        loadingItem.callbackArr.push(callback);
        if(!loadingItem.isLoading){
            loadingItem.isLoading = true;
            bundle.load(url, type, (err,asset:Asset)=>{
                delete this.loadingQueue[url];
                for(let k in loadingItem.callbackArr){
                    let cb = loadingItem.callbackArr[k];
                    if(cb){
                        cb(err,asset);
                    }
                }
            });
        }
    }
    
    public loadBundleNameRes<T>(url: string, type: any, callback: (err, assets: T) => void,bundleName?:string) {
        let bundle = bundleName?assetManager.getBundle(bundleName):resources;
        if (!bundle) {
            assetManager.loadBundle(bundleName, null, (err, loadedBundle) => {
                if (err) {
                    console.log(err);
                }
                else {
                    this.loadBundleNameRes(url, type, callback, bundleName);
                }
            });
            return;
        }
        this.loadRes(url, type, callback, bundle);
    }
}