import { writable } from 'svelte/store';

if(!localStorage.getItem("linkPreset")) {
    localStorage.setItem("linkPreset", '{"Folders": []}')
}

export const localPreset = writable(
    JSON.parse(localStorage.getItem("linkPreset")) || "");

    localPreset.subscribe(val => 
        localStorage.setItem("linkPreset", JSON.stringify(val)));

export const linkOverlayOptions = 
    writable({
        "showOverlay": false, 
        "currentFolderId": undefined,
        "currentFolder": undefined,
        "currLinkId": undefined,
        "currLinkName": undefined,
        "currLinkUrl": undefined
    });

if(!localStorage.getItem("light-theme")) {
    localStorage.setItem("light-theme", "false")
}

export const lightTheme = writable(
    localStorage.getItem("light-theme") || "");

lightTheme.subscribe(val => {
    localStorage.setItem("light-theme", val)
});