import { writable } from 'svelte/store';

// Daten in localStorage überprüfen
// if(process.browser && !localStorage.getItem("linkPreset")) {
//     localStorage.setItem("linkPreset", '{"Folders": []}')
// }
// if(process.browser && !localStorage.getItem("light-theme")) {
//     localStorage.setItem("light-theme", "false")
// }

// Stores anlegen
// https://sapper.svelte.dev/docs#Server-side_rendering
// https://stackoverflow.com/questions/38765194/conditionally-initializing-a-constant-in-javascript
// function returnLinkPresetStoreIfClient() {
//     if(process.browser)
//         return writable(JSON.parse(localStorage.getItem("linkPreset")) || "");
// }

// function returnThemeStoreIfClient() {
//     if(process.browser)
//         writable(localStorage.getItem("light-theme") || "");
// }

// const localPreset = returnLinkPresetStoreIfClient();
// const lightTheme = returnThemeStoreIfClient();
const linkOverlayOptions = 
    writable({
        "showOverlay": false, 
        "currentFolderId": undefined,
        "currentFolder": undefined,
        "currLinkId": undefined,
        "currLinkName": undefined,
        "currLinkUrl": undefined
    });

// Stores subscriben
// localPreset.subscribe(val => localStorage.setItem("linkPreset", JSON.stringify(val)));
// lightTheme.subscribe(val =>  localStorage.setItem("light-theme", val));

const createLocalStore = (key, startValue) => {
    const {
      subscribe,
      set,
      update
    } = writable(startValue);
  
    return {
      subscribe,
      set,
      update,
      useLocalStorage: () => {
        const json = localStorage.getItem(key);
        if (json) {
          set(JSON.parse(json));
        }
  
        subscribe(current => {
          localStorage.setItem(key, JSON.stringify(current));
        });
      }
    };
  }
const localPreset = createLocalStore('linkPreset', '{"Folders": []}')
const lightTheme = createLocalStore('light-theme', false)

export { localPreset, linkOverlayOptions, lightTheme };