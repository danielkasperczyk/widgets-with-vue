import { defineCustomElement } from "vue";
import CustomWidget from './widgets/CustomWidget.ce.vue';

export function register(){
    customElements.define('custom-widget', defineCustomElement(CustomWidget));
}