import { Selector } from "./selector"


// test
// console.log('API_KEY:', CAT_API_KEY);

// simple handler to load the game object once page loads
let selector;

window.onload = () => {
   selector = new Selector();
}