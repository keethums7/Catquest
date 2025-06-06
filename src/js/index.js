// Keith Wangler - CS233JS - Lane Community College - 06/05/2025

import { Selector } from "./selector"


// test
// console.log('API_KEY:', CAT_API_KEY);

// simple handler to load the game object once page loads
let selector;

window.onload = () => {
   selector = new Selector();
}