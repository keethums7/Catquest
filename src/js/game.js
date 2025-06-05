export class Game {
    constructor(selectedCats, allCats, $gameArea) {
        this.$gameArea = $gameArea;

        // assign your team to the cats selected
        // on the previous screen
        this.team = selectedCats;
        this.team.forEach((cat, i) => {console.log(`player cat ${i}: ${cat.name}`);});

        const nme = [];
        this.enemies = allCats.reduce((acc, curr) => {
            // if the cat isn't one of the selected cats,
            if (!(selectedCats.includes(curr))) {
                console.log(`adding enemy cat: ${curr.name}`);
                // add it to the helper list,
                // finally returns to update enemies list
                return nme.push(curr);
            }
        })

        this.startBoard = this.startBoard.bind(this);
    }

    startBoard(){
        this.$gameArea.innerHTML =
            `<div class="card" id="cat1">
            <div class="row">
                <div class="col-md">
                    <img class="card-img-top w-50 p-3" src="" alt="cat1">
                </div>
                <div class="col-md">
                    <div class="card-body">
                        <h4 class="card-title">Cat 1</h4>
                        <h5 class="card-subtitle">Breed</h5>
                        <p class="card-text" >Stats</p>
                    </div>
                </div>
            </div>
        </div>`;
    }
}