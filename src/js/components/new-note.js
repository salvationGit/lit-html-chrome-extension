import { html, customElement, property} from 'lit-element';
import { translate } from "lit-translate";
import LitHauntedElement from '../helpers/lit-haunted-element';
import {setStateItem} from '../helpers/state';
import style from '../../css/new-note.css';
import ma from '../../css/ma-icons.css';



@customElement('new-note')
class NewNote extends LitHauntedElement { //eslint-disable-line
    static styles = [ma, style];

    @property({type: Boolean}) focus;
    
    constructor(){
      super();                          
    }
    initState(){        
      setStateItem('desc', '', this);         
      setStateItem('title', '', this);           
    }    
    render() {
      const {focus} = this;

      this.initState();
      return html `
        <div class="container">
            ${focus ? this.renderFocus() : this.renderBlur()}    
        </div>
     `;     
    }  
    renderFocus(){
      return html`
        <div class="focus">         
            <input 
                tabindex="1" 
                placeholder=${translate("NEW_NOTE.TITLE_PLACEHOLDER")}
                value=${this.title} 
                @input=${this.onTitle}/>
            <input 
                tabindex="2" 
                value=${this.desc}
                class="take-note" 
                placeholder=${translate("NEW_NOTE.DESC_PLACEHOLDER")}
                @input=${this.onDesc}
                @keypress=${this.onEnter}/>
        </div>
       `;
    }
    renderBlur(){
      return html`
        <div class="blur">
          <i class="material-icons">add</i>
          <input type="text" placeholder=${translate("TAKE_NOTE")} />
        </div>
        `;
    } 
    updated(changedProperties) {
      if(changedProperties.has('focus') && this.focus == false){
        this.onBlur();        
      }            
    }
    onBlur(){
      this.dispatchEvent(new CustomEvent('onblur',{
        detail:{
          title: this.title,
          desc: this.desc
        }            
      }));
      this.setTitle('');
      this.setDesc('');      
    }
    onEnter(e){
      const {keyCode} = e;
      
      if (keyCode === 13) {
        this.onBlur();
      }
    }
    onTitle(e){
      const {value} = e.target;
      this.setTitle(value);            
    }
    onDesc(e){
      const {value} = e.target;
      this.setDesc(value);         
    }      
}