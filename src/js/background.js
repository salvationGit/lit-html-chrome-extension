import '../img/icon-128.png';
import '../img/icon-34.png';
import localstorageHelper from './helpers/localstorage';
import '../manifest.json';

const MENU_CONTEXT = ["page","selection","link","image","video","audio"];

chrome.contextMenus.create({
  title: "make a note", 
  contexts: MENU_CONTEXT,
  onclick: async e => {
    const {selectionText, linkUrl, mediaType, srcUrl, pageUrl} = e;

    if(selectionText || mediaType){
      let notes = await localstorageHelper.loadFromStorage("notes");
      notes = notes || [];

    
      const id = notes.reduce((id, note) => {
        id = note.id > id ? note.id : id ;
        return id;
      }, 0);    

      let newNote = {
        id: id + 1,
        title: 'quick note'
      };
      if(linkUrl){
        newNote.pageUrl = linkUrl; 
        newNote.type = "link";
      }
      if(selectionText){      
        newNote.desc = selectionText;      
      }
      if(mediaType === "image"){      
        newNote.type = "image";
        newNote.pageUrl = pageUrl; 
        newNote.srcUrl = srcUrl;      
      }    
      notes.push(newNote);
      localstorageHelper.persistToStorage('notes',notes);
    }
    
  }});


const selectedContent = null;

/**
 * messages from site
 */
chrome.runtime.onMessageExternal.addListener(
  (request, sender, sendResponse) => {
    console.info('------------------------------- Got request', request);

    if (request.getSelectedContent) {
      sendResponse(selectedContent);
    }
    if (request.action === 'openExtension') {
      chrome.tabs.create({ url: 'popup.html' });
    }
  },
);
/**
 * get messages from content.js
 */
// chrome.runtime.onMessage.addListener(async req => {
  
// });