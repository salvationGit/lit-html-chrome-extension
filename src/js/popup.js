import { html, customElement} from 'lit-element';
import { registerTranslateConfig, use} from "lit-translate";
import LitHauntedElement from './helpers/lit-haunted-element';
import localstorageHelper from './helpers/localstorage';
import {setStateItem} from './helpers/state';
import './components/notes-app';
import i18n from '../../i18n';
import '../img';
import '../css/scroller.css';
import './helpers/icons';
import style from '../css/popup.css';
import ma from '../css/ma-icons.css';
import scroller from '../css/scroller.css';
import '../css/floating.css';

@customElement('extension-popup')

class ExtensionPopup extends LitHauntedElement { //eslint-disable-line
   static styles = [ma, style, scroller];

   constructor(){
     super();                     
     this.localStorageState = {};      
     this.initLangService();          
   } 
   initLangService(){
     registerTranslateConfig({
       loader: () => i18n.en       
     });                     
     use("en");        
   }
   initState(){
     const {notes = []} = this.localStorageState;
     setStateItem('notes',notes, this);
   }
   async connectedCallback() {            
     this.localStorageState.notes = await localstorageHelper.loadFromStorage("notes");     
     super.connectedCallback();    
   }     
   onUpdate(e){
     const {notes} = e.detail;
     this.setNotes(notes); 
     localstorageHelper.persistToStorage('notes',notes);
   }
   render() {     
     this.initState();
     const {notes} = this;

     return html `
      <div class="container">          
        <notes-app 
          .notes=${notes}
          @update=${this.onUpdate}>
        </notes-app>                
      </div>
     `;     
   }         
}