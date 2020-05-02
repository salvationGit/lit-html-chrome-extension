import { html, customElement, property} from 'lit-element';
import { translate } from "lit-translate";
import LitHauntedElement from '../helpers/lit-haunted-element';
import {setStateItem} from '../helpers/state';
import colors from '../json/colors.json';
import style from '../../css/notes-app.css';
import scroller from '../../css/scroller.css';
import ma from '../../css/ma-icons.css';
import './note-item';
import './new-note';
@customElement('notes-app')

class NotesApp extends LitHauntedElement { //eslint-disable-line 
   static styles = [ma, style, scroller];

   @property({type: Array}) notes = [];
   @property({type: Boolean}) focus = false;
   @property({type: Boolean}) showColorPick = false;

   constructor(){
     super();     
   }
   get visibleNotes(){     
     return this.notes.filter(item => {
       return this.searchQuery === '' || item.title?.includes(this.searchQuery) || item.desc?.includes(this.searchQuery);
     });     
   }
   /**
    *  initialize the components state 
    */
   initState(){        
     setStateItem('selectedItem', {}, this);         
     setStateItem('isEditingNote', false, this);     
     setStateItem('searchQuery', '', this);             
     setStateItem('focus', false, this);             
   }
   render() {
     this.initState();

     return html `
    <div @click=${this.onBoardClick}>        
        ${this.renderToolbar()}
        <div>                         
            ${this.isEditingNote ? this.renderEdit() : this.renderNotes()}
        </div>
    </div>
     `;     
   }    
   renderColorPicker(){               
     return this.showColorPick ? html` 
      <div class="color-picker-container">
           ${colors.map(color => html`     
                <div
                  @click=${() => this.setNoteColor(color)} 
                  class="color-block ${this.selectedItem.color === color ? 'active': ''}" 
                  style="background-color: ${color};">                    
                </div>`)}          
      </div>` : html``;
   }  
   renderToolbar(){
     return this.isEditingNote ? html`` :html` 
     <div class="search">       
        <i class="material-icons">search</i>
        <input type="search" placeholder="find note" @input=${this.search}/>                
     </div>
     <new-note      
      @onblur=${this.onNewNote} 
      ?focus=${this.focus}></new-note>        
    `;
   }    
   renderEdit(){  
     const {title, desc, color = "white"} = this.selectedItem;   
     
     return html`
      <div class="edit-container">         
        <input 
          class="edit-title" 
          @input=${this.editTitle}           
          value=${title} 
          type="text" />
        ${this.renderDescription()}        
        <div class="edit-toolbar">   
          ${this.renderColorPicker()}       
          <i class="material-icons btn-icon" @click=${this.onBack}>arrow_back</i>         
          <i class="material-icons btn-icon" style="color:${color};" @click=${this.toggleColorPicker}>color_lens</i>                  
        </div>                       
      </div>
     `;
   }
   imageRender({srcUrl, pageUrl}){
     return html`         
      <a href=${pageUrl} target="_blank">
        <img class="preview-image" src=${srcUrl} />
      </a> 
      <a class="preview-link" href=${pageUrl} target="_blank">
        ${pageUrl}
      </a>        
    `;
   }
   defaultDescRender({desc}){
     return html`
          <textarea
            placeholder="take a note..." 
            class="edit-desc"
            @input=${this.editDesc}>${desc}</textarea>
        `;
   }
   linkRender({desc, pageUrl}){
     return html `
      <a class="preview-link" href=${pageUrl} target="_blank">
        ${desc}
      </a>        
    `;
   }
   renderDescription(){
     const {type} = this.selectedItem;

     const descRenders = {
       image: this.imageRender,
       link: this.linkRender,
       default: this.defaultDescRender,

     };
     const descRenderFunction = descRenders[type] || descRenders.default;
     return descRenderFunction(this.selectedItem);
   }
   renderNotes(){
     return this.visibleNotes.length > 0 ? 
       html`
    <div class="container">
      ${this.visibleNotes.map(note => html `
       <note-item        
         .options=${note}
         @select=${this.onSelectNote}
         @remove=${this.onRemoveNote}>
       </note-item>`)};
    </div>`
       : html`
      ${this.renderImage()}       
    `;
   }
   renderImage(){
     const isSearchFailed = this.searchQuery != '' && this.visibleNotes.length === 0;

     return html`
     <div class="desert">
         <img src=${isSearchFailed ? "./desert_down.svg" : "./desert.svg"}/>
         <div>
           ${isSearchFailed ? translate("SEARCH_NOT_FOUND") : translate("EMPTY_BOARD")} 
         </div>
      </div>      
    `;
   }
   setNoteColor(color){     
     this.setSelectedItem({...this.selectedItem, color});          
     this.toggleColorPicker();
   }
   toggleColorPicker(){
     this.showColorPick = !this.showColorPick;     
   }   
   onBack(){           
     this.setIsEditingNote(false);
     this.updateNote();     
   }
   updateNote(){
     const {id} = this.selectedItem;
     const index = this.notes.findIndex(note => note.id === id);
     
     this.notes[index] = this.selectedItem;          
     this.dispatchUpdateNotes();
   }
   dispatchUpdateNotes(){
     this.dispatchEvent(new CustomEvent('update',{
       detail:{
         notes: this.notes
       }
     }));
   }
   editTitle(e){
     const {value} = e.target;

     this.setSelectedItem({...this.selectedItem, title: value});          
   }
   editDesc(e){
     const {value} = e.target;
     
     this.setSelectedItem({...this.selectedItem, desc: value});               
   }   
   onEdit(e){
     const {title, desc} = e.detail;
     
     this.setSelectedItem({...this.selectedItem, title, desc});     
   }
   onRemoveNote(e){
     const {id} = e.detail;
     const deleteIndex = this.notes.findIndex(item => item.id == id);
     this.notes.splice(deleteIndex,1);     
     this.dispatchUpdateNotes();
     this.resetSearch();
   }   
   onSelectNote(e){
     const {id} = e.detail;     
     this.setIsEditingNote(true);
     const selectedNote = this.visibleNotes.find(note => note.id == id);
     this.setSelectedItem(selectedNote);     
   }
   onBoardClick(e){
     const {localName} = e.target;

     this.setFocus(localName === "new-note");       
     this.requestUpdate();
   }
   onNewNote(e){
     const {title, desc} = e.detail;
     if(title !== '' && desc !== ''){
       this.notes.push({id: this.notes.length, title, desc});       
       this.dispatchUpdateNotes();
       this.resetSearch();
       this.setFocus(false);       
     }     
   }
   resetSearch(){
     this.setSearchQuery('');          
   }
   search(e){         
     this.setSearchQuery(e.target.value);     
   }     
}