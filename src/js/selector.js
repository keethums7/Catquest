// Keith Wangler - CS233JS - Lane Community College - 06/05/2025

import { Cat } from "./cat"
import { Game } from  "./game";

const FETCH_URL = `https://api.thecatapi.com/v1/images/search?limit=6&has_breeds=1&api_key=${CAT_API_KEY}`;
export class Selector {
    cats = [];
    selectedCats = [];

    constructor() {
        this.$cards = document.querySelectorAll('.card');
        this.$gameArea = document.querySelector('#gameArea');
        this.$progress = document.querySelector('.progress-bar');
        this.$submit = document.querySelector('#submit');
        this.$subtitle = document.querySelector('#subtitle');

        this.fetchCats = this.fetchCats.bind(this); // array of Cat class objects
        this.loadCats = this.loadCats.bind(this);
        this.addEventListeners = this.addEventListeners.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.fetchCats();
    }

    fetchCats()
    {
        // fetch using the cat API for 6 cats each with breed info
        fetch(FETCH_URL)
            .then(response => response.json())
            .then(json => {
                json.forEach(cat => {
                    // add each cat to our own array by building a cat
                    const newCat = new Cat(cat);
                    // console.log('newCat:', newCat);
                    this.cats.push(newCat);
                })
            }).then(() => {
            this.loadCats();
        })
    }

    // method below updates the select screen once the cats are all loaded
    loadCats(){
    // console.log('cats in loadCats():', this.cats);
    // console.log('this.$cards:', this.$cards);
    for (let i = 0; i < this.$cards.length; i++) {

        // pull each individual card element and its corresponding cat
        const $card = this.$cards[i];
        const cat = this.cats[i];
        // console.log('$card:', $card);
        // console.log('cat:', cat);

        // console.log($card.children.item(0));
        const $img = $card.querySelector(".card-img-top"); // card image elem
        const $body = $card.querySelector(".card-body");

        // need to dive into the child nodelist to get to the other attribute lines
        const $name = $body.children.item(0) // card name elem
        const $breed = $body.children.item(1) // card breed elem
        const $stats = $body.children.item(2) // card stat elem

        $img.src = cat.imgUrl;
        $name.innerHTML = `Name: ${cat.name}`;
        $breed.innerHTML = `Breed: ${cat.breedStr}`;
        $stats.innerHTML = `ATK: ${cat.stats.atk}</br>HP: ${cat.stats.currHP}/${cat.stats.maxHP}`;

        // add event handling for the card container and its child elements
        this.addEventListeners($card, i);
        }
    }

    addEventListeners($card, i) {
        for (let a of $card.childNodes) {
            a.addEventListener('click', () => {
                // check to see if the cat's already in the array
                // if so:
                // - remove cat from selectedCats array
                // - increment progress bar back one level
                // - update cat to remove highlighting
                if (this.selectedCats.includes(this.cats[i])) {
                    // console.log(`removing from selectedCats: ${this.cats[i]}`);

                    // remove just the card at the index of the matched cat
                    this.selectedCats.splice(this.selectedCats.indexOf(this.cats[i]), 1)

                    // remove highlighting
                    $card.classList.remove("border-success", "border-4");


                    this.$progress.style.width = `${this.selectedCats.length * 33}%`;
                    this.$progress.innerText = `${this.selectedCats.length}/3 Selected`;
                    this.$submit.classList.remove("bg-danger");
                    this.$submit.removeEventListener('click', this.handleSubmit);
                    switch (this.selectedCats.length) {
                        case 0:
                            this.$progress.classList.remove("bg-warning", "border-4");
                            this.$progress.style.width = "10%";
                            break;
                        case 1:
                            this.$progress.classList.remove("bg-info", "border-4");
                            this.$progress.classList.add("bg-warning");
                            this.$progress.style.width = "33%";
                            break;
                        case 2:
                            this.$progress.classList.remove("border-success", "border-4");
                            this.$progress.classList.add("bg-info");
                            this.$progress.style.width = "66%";
                            break;
                    }
                } else {
                    // console.log(`adding to selectedCats: ${this.cats[i]}`);

                    // update visuals & handle a full team
                    // - push selected cat to selectedCats array
                    // - progress bar resize & bg-color change
                    // - highlight border of chosen cat
                    switch (this.selectedCats.length) {
                        // empty cat list, add the cat,
                        // update progress bar, and highlight the div
                        case 0:
                            this.$progress.style.width = "33%";
                            this.$progress.innerHTML = "1/3 Selected";
                            this.$progress.classList.add("bg-warning", "text-white");
                            this.selectedCats.push(this.cats[i]);
                            $card.classList.add("border-success", "border-4");
                            break;
                        // add the cat, update progress bar, and highlight the div
                        case 1:
                            this.$progress.style.width = "66%";
                            this.$progress.innerHTML = "2/3 Selected";
                            this.$progress.classList.remove("bg-warning");
                            this.$progress.classList.add("bg-info");
                            this.selectedCats.push(this.cats[i]);
                            $card.classList.add("border-success", "border-4");
                            break;
                        // add the cat, update progress bar,
                        // highlight the div, and enable the submit button
                        case 2:
                            this.$progress.style.width = "100%";
                            this.$progress.innerHTML = "3/3 Selected";
                            this.$progress.classList.remove("bg-info");
                            this.$progress.classList.add("bg-success");
                            this.selectedCats.push(this.cats[i]);
                            $card.classList.add("border-success", "border-4");
                            this.$submit.classList.add("bg-danger");
                            this.$submit.addEventListener('click', () => this.handleSubmit());
                            break;
                        case 3:
                            alert("de-select a cat before choosing another!");
                            break;
                        default:
                            alert("error: input could not be handled");
                            break;
                    }
                }
            })
        }
    }

    handleSubmit()
    {
        // clear the board, start an actual game
        this.$gameArea.innerHTML = "Loading Battle scene...";
        this.$subtitle.innerText = "Battle!";
        new Game(this.selectedCats, this.cats, this.$gameArea);
    }
}