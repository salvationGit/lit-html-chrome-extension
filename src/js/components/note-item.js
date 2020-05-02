import LitHauntedElement from '../helpers/lit-haunted-element';
import { html, customElement, property} from 'lit-element';
import style from '../../css/note-item.css';
import ma from '../../css/ma-icons.css';

const EVENTS = {
  REMOVE: 'remove',
  SELECT: 'select'
};

@customElement('note-item')
class NoteItem extends LitHauntedElement { //eslint-disable-line 
   static styles = [style, ma];

   @property({type: Object}) options = {
     desc: '',
     id: '',
     color: '',
     type: '',
     srcUrl: '',
     pageUrl: ''
   };   
   
   constructor(){
     super();                               
   }
             
   render() {
     const {title, color} = this.options;

     return html `
     <div>
        <button style="background-color:${color};" class="list-item">                                    
            <div class="title">
              <div class="title-label">${title}</div>
              <div>${this.renderNoteType()}</div>              
            </div>            
            <div class="desc">
              ${this.renderDesc()}
            </div>
            <div class="overlay">
              <i @click=${this.onSelect} class="material-icons" title="edit">edit</i>
              <i @click=${this.onRemove} class="material-icons" title="remove">delete</i>
            </div>
        </button>  
     </div>
     `;     
   }     
   renderDesc(){
     const {srcUrl, desc} = this.options;

     return html`
      ${srcUrl ? html`<img class="preview-image" src=${srcUrl} />` : html``}
      ${desc ? html`${desc}` : html``} 
     `;
   }
   renderNoteType(){
     const {type = "note"} = this.options;
     const types = {       
       'image': 'camera_alt',
       'video': 'play_circle_full'
     };
     return types[type] ? 
       html`<i class="material-icons note-icon">${types[type]}</i>`: 
       html``;
   }
   onRemove(){
     const {id} = this.options;

     this.dispatchEvent(new CustomEvent(EVENTS.REMOVE,{
       detail:{
         id
       }
     }));
   } 
   onSelect(){
     const {id} = this.options;

     this.dispatchEvent(new CustomEvent(EVENTS.SELECT,{
       detail:{
         id
       }
     }));
   }    
}