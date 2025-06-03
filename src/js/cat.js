export class Cat {
    constructor (data) {
        this.breeds = data.breeds;
        this.name = data.id;
        this.imgUrl =  data.url;
        this.breedStr = "";
        for(let breed of this.breeds){
            this.breedStr += breed.name;
        }

        // set the base stats for each cat randomly
        const maxHP = getRandomInteger(20, 40);
        const atk = getRandomInteger(10, 20);

        this.stats = {
            maxHP: maxHP, // randomly assigned HP
            atk: atk, // randomly assigned ATK
            currHP: maxHP,
            fainted: false
        }
    }



}

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
