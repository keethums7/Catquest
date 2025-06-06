// Keith Wangler - CS233JS - Lane Community College - 06/05/2025

export class Cat {
    constructor(data) {
        this.breeds = data.breeds;
        this.imgUrl = data.url;
        this.name = data.id;

        this.breedStr = "";
        for (let breed of this.breeds) {
            this.breedStr += breed.name;
        }

        this.block = 0;
        this.recoil = 0;
        this.doSwap = false;
        // set the base stats for each cat randomly
        const maxHP = this.rng(20, 40);
        const atk = this.rng(10, 20);

        this.stats = {
            maxHP: maxHP, // randomly assigned HP
            atk: atk, // randomly assigned ATK
            currHP: maxHP,
            fainted: false
        }

        this.checkFaint = this.checkFaint.bind(this);
        this.passTurn = this.passTurn.bind(this);
        this.attack = this.attack.bind(this);
        this.defend = this.defend.bind(this);
        this.heal = this.heal.bind(this);
        this.swap = this.swap.bind(this);
    }

    checkFaint(enemy){
        console.log('start checkFaint():\n-this cat:', this, '\n-enemy cat:', enemy);
        this.stats.fainted = (this.stats.currHP <= 0);
        this.doSwap = !this.doSwap ? this.stats.fainted: this.doSwap;
        this.stats.currHP =  this.stats.currHP < 0 ? 0 : this.stats.currHP;

        enemy.stats.fainted = (enemy.stats.currHP <= 0);
        enemy.doSwap =  !enemy.doSwap ? enemy.stats.fainted : enemy.doSwap;
        enemy.stats.currHP =  enemy.stats.currHP < 0 ? 0 : enemy.stats.currHP;
        console.log('end checkFaint():\n-this cat:', this, '\n-enemy cat:', enemy);
    }
    passTurn(enemy) {
        // 2/3 chance for enemy to attack,
        // 1/3 to heal
        const d3 = this.rng(0, 2);
        if ([0, 1].includes(d3)) {
            // don't want to heal from a negative value here, just block the full atk
            this.stats.currHP -= Math.max(0, (enemy.stats.atk - this.block));
            enemy.stats.currHP -= this.recoil;
        } else {
            // else the enemy heals, unless you managed to faint it during the attack
            if (enemy.currHP <= 0) {
                enemy.stats.currHP += this.rng(1, (enemy.stats.maxHP - enemy.stats.currHP));
            }
        }

        this.recoil = 0;
        this.block = 0;
        this.checkFaint(enemy);
    }

    // deal damage to the opposing cat
    attack(enemy) {
        console.log('enemy currHP:', enemy.stats.currHP, 'damage:', this.stats.atk);
        enemy.stats.currHP -= this.stats.atk;
        this.passTurn(enemy);
    }

    // block and recoil an attack
    defend(enemy) {
        // get values for block and recoil
        this.block = this.rng(5, this.stats.atk);
        this.recoil = this.rng(5, enemy.stats.atk);
        console.log('block:', this.block, '\nrecoil: ', this.recoil);
        this.passTurn(enemy);
    }

    // heal a random value between 1 and the active cat's missing HP
    heal(enemy) {
        const healAmt = this.rng(1, (this.stats.maxHP - this.stats.currHP));
        console.log('currHP:', this.stats.currHP, 'healAmt:', healAmt);
        this.stats.currHP += healAmt;
        this.passTurn(enemy)
    }

    // flag the active cat for swapping
    swap(enemy) {
        this.doSwap = true;
        console.log('swapping...');
        this.passTurn(enemy);
    }

    // helper function
    rng(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
