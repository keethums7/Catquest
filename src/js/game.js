// Keith Wangler - CS233JS - Lane Community College - 06/05/2025

export class Game {
    constructor(selectedCats, allCats, $gameArea) {
        this.$gameArea = $gameArea;

        // assign your team to the cats selected
        // on the previous screen
        this.team = selectedCats;
        this.team.forEach((cat, i) => {console.log(`player cat ${i}: ${cat.name}`);});

        this.enemies = [];
        for (let i of allCats) {
            // if it isn't one of the player team,
            // recruit it for the enemy team
            if (!(selectedCats.includes(i))) {
                this.enemies.push(i);
            }
        }

        this.addEventListeners = this.addEventListeners.bind(this);
        this.checkSwaps = this.checkSwaps.bind(this);
        this.checkGameEnd = this.checkGameEnd.bind(this);
        this.updateBoard = this.updateBoard.bind(this);

        // kick things off by updating the board
        this.updateBoard()
    }

    checkSwaps() {
        console.log('start of checkSwaps:\n-player team:', this.team, '\n- enemy team:', this.enemies);
        if (this.team[0].doSwap) {
            this.team[0].doSwap = false;
            // hotswap the active and a benched cat from player team
            if (!(this.team[1].stats.fainted)) {
                console.log(`swapping active cat - ${this.team[0].name} - with bench cat 1: ${this.team[1].name}`);
                [this.team[0], this.team[1]] = [this.team[1], this.team[0]];
                console.log(`after swap: active cat - ${this.team[0].name} - bench cat 1: ${this.team[1].name}`);
            // if the first bench slot was fainted, try the next
            } else if (!(this.team[2].stats.fainted)) {
                console.log(`swapping active cat - ${this.team[0].name} - with bench cat 2: ${this.team[2].name}`);
                [this.team[0], this.team[2]] = [this.team[2], this.team[0]];
                console.log(`after swap: active cat - ${this.team[0].name} - bench cat 2: ${this.team[2].name}`);
            } else {
                console.log("couldn't swap active cat with either bench cat, checking game end...");
                this.checkGameEnd()
            }
        }
        if (this.enemies[0].doSwap) {
            this.enemies[0].doSwap = false;
            // hotswap the enemy cat with a benched enemy cat
            // if the bench cat 1 isn't fainted, swap with it
            if (!(this.enemies[1].stats.fainted)) {
                console.log(`swapping enemy cat - ${this.enemies[0].name} - with bench cat 1: ${this.enemies[1].name}`);
                [this.enemies[0], this.enemies[1]] = [this.enemies[1], this.enemies[0]];
                console.log(`after swap: enemy cat - ${this.enemies[0].name} - bench cat 1: ${this.enemies[1].name}`);
                // if the first bench slot was fainted, try the next
            } else if (!(this.team[2].stats.fainted)) {
                console.log(`swapping enemy cat - ${this.enemies[0].name} - with bench cat 2: ${this.enemies[2].name}`);
                [this.enemies[0], this.enemies[2]] = [this.enemies[2], this.enemies[0]];
                console.log(`after swap: enemy cat - ${this.team[0].name} - bench cat 2: ${this.enemies[2].name}`);
            } else {
                console.log("couldn't swap enemy cat with either bench cat, checking game end...");
                this.checkGameEnd();
            }
        }
        console.log('end of checkSwaps:\n-player team:', this.team, '\n- enemy team:', this.enemies);
    }

    checkGameEnd () {
        // count total KOs
        let enemyKO = 0, teamKO = 0;
        this.enemies.forEach((e) => {
            if (e.stats.fainted) {
                enemyKO++;
            }
        })
        this.team.forEach((t) => {
            if (t.stats.fainted) {
                teamKO++;
            }
        })
        console.log('teamKO:', teamKO, '\nteam:',this.team.length);

        // if all player's team is fainted
        if (teamKO >= this.team.length) {
            // check for a tie
            if (enemyKO >= this.enemies.length) {
                alert("You tied...");
            } else {
                alert("You lose...");
            }
        // otherwise check for a win
        } else if (enemyKO >= this.enemies.length) {
            alert("You win!");
        }
    }

    updateBoard(){
        // quickly check if the cats need swapped

        this.checkSwaps();
        console.log('after checkSwaps() in updateBoard():\n- player team:', this.team, '\n- enemy team:', this.enemies);

        this.$gameArea.innerHTML = `
        <!-- active cat placeholder -->
        <div class="row pt-3">
            <div class="card bg-danger-subtle" id="enemy-cat">
                <div class="row">
                    <div class="col-md">
                        <img class="card-img-top w-50 p-3" src="${this.enemies[0].imgUrl}" alt="cat1">
                    </div>
                    <div class="col-md">
                        <div class="card-body">
                            <h4 class="card-title" id="enemyName">Enemy Cat: ${this.enemies[0].name}</h4>
                            <h5 class="card-subtitle" id="enemyBreedline">Breed: ${this.enemies[0].breedStr}</h5>
                            <p class="card-text" id="enemyAtk">ATK:${this.enemies[0].stats.atk}</p>
                            <p class="card-text" >HP:${this.enemies[0].stats.currHP}/${this.enemies[0].stats.maxHP}</p>
                            <div class="progress">
                                <div class="progress-bar progress-bar-striped" role="progressbar" style="width: ${Math.floor(100* (this.enemies[0].stats.currHP / this.enemies[0].stats.maxHP))}%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- active cat placeholder -->
        <div class="row pt-3">
            <div class="card bg-success-subtle" id="activeCat">
                <div class="row">
                    <div class="col-md">
                        <img class="card-img-top w-50 p-3" src="${this.team[0].imgUrl}" alt="cat1">
                    </div>
                    <div class="col-md">
                        <div class="row">
                            <button class="btn btn-danger" id="attack">Attack</button>
                            <button class="btn btn-dark text-bg-dark" id="defend">Defend</button>
                        </div>
                        <div class="row">
                            <button class="btn btn-success" id="heal">Heal</button>
                            <button class="btn btn-info" id="swap">Swap</button>
                        </div>
                    </div>
                    <div class="col-md">
                        <div class="card-body">
                            <h4 class="card-title" id="enemyName">Active Cat: ${this.team[0].name}</h4>
                            <h5 class="card-subtitle" id="enemyBreedline">Breed: ${this.team[0].breedStr}</h5>
                            <p class="card-text" id="enemyAtk">ATK:${this.team[0].stats.atk}</p>
                            <p class="card-text" >HP:${this.team[0].stats.currHP}/${this.team[0].stats.maxHP}</p>
                        </div>
                        <div class="progress">
                            <div class="progress-bar progress-bar-striped" role="progressbar" style="width: ${Math.floor(100* (this.team[0].stats.currHP / this.team[0].stats.maxHP))}%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- bench cats placeholders-->
        <div class="row pt-1">
            <div class="col-md">
            <div class="card bg-info text-bg-info" id="benchCat1">
                <div class="row">
                    <div class="col-md">
                        <img class="card-img-top w-50 p-3" src="${this.team[1].imgUrl}" alt="benchCat1">
                    </div>
                    <div class="col-md">
                        <div class="card-body">
                            <h4 class="card-title" id="benchCat1Name">Bench Cat: ${this.team[1].name}</h4>
                            <h5 class="card-subtitle" id="benchCat1BreedLine">Breed: ${this.team[1].breedStr}</h5>
                            <p class="card-text" id="benchCat1Atk">ATK:${this.team[1].stats.atk}</p>
                            <p class="card-text" id="benchCat1HP" >HP:${this.team[1].stats.currHP}/${this.team[1].stats.maxHP}</p>
                            <div class="progress">
                                <div class="progress-bar progress-bar-striped" role="progressbar" style="width: ${Math.floor(100* (this.team[1].stats.currHP / this.team[1].stats.maxHP))}%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
            <div class="col-md">
            <div class="card bg-info text-bg-info" id="benchCat2">
                <div class="row">
                    <div class="col-md">
                        <img class="card-img-top w-50 p-3" src="${this.team[2].imgUrl}" alt="cat1">
                    </div>
                    <div class="col-md">
                        <div class="card-body">
                            <h4 class="card-title" id="enemyName">Bench Cat: ${this.team[2].name}</h4>
                            <h5 class="card-subtitle" id="enemyBreedline">Breed: ${this.team[2].breedStr}</h5>
                            <p class="card-text" id="enemyAtk">ATK:${this.team[2].stats.atk}</p>
                            <p class="card-text" >HP:${this.team[2].stats.currHP}/${this.team[2].stats.maxHP}</p>
                            <div class="progress">
                                <div class="progress-bar progress-bar-striped" role="progressbar" style="width: ${Math.floor(100* (this.team[2].stats.currHP / this.team[2].stats.maxHP))}%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
        `;

        // finish the loop!
        this.addEventListeners();
    }

    // add each respective method from the cat object
    // as the event handler for onclick
    addEventListeners() {
        // add event handlers for the buttons
        const $attack = document.querySelector("#attack");
        const $defend = document.querySelector("#defend");
        const $heal = document.querySelector("#heal");
        const $swap = document.querySelector("#swap");

        $attack.addEventListener('click', () => {
            console.log('attack');
            this.team[0].attack(this.enemies[0]);
            this.updateBoard();
        });
        $defend.addEventListener('click', () => {
            console.log('defend');
            this.team[0].defend(this.enemies[0]);
            this.updateBoard();
        });
        $heal.addEventListener('click', () => {
            console.log('heal');
            this.team[0].heal(this.enemies[0]);
            this.updateBoard();
        });
        $swap.addEventListener('click', () => {
            console.log('swap');
            if (this.team.length > 1) {
                this.team[0].swap(this.enemies[0]);
            } else {
                alert('team size must be >1 to swap');
            }
            this.updateBoard();
        });
    }
}