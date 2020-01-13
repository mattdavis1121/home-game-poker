class Deck {
    constructor(game, key = "cards") {
        this.game = game;
        this.key = key;

        this.player = null;  // Current dealer
        this.displayGroup = this.game.add.group();
    }

    newCard() {
        let card = this.displayGroup.create(this.spawnX, this.spawnY, this.key, "back");
        card.x = this.player.nameplate.world.x + (this.player.nameplate.width / 2);
        card.y = this.player.nameplate.world.y + (this.player.nameplate.height / 2);
        card.anchor.setTo(0.5);
        card.scale.setTo(this.player.nameplate.height / card.height);
        return card;
    }

    initialize(player) {
        this.player = player;
    }

    dealCardToPlayer(player) {
        let card = this.newCard();
        const destX = player.nameplate.world.x + (player.nameplate.width / 2);
        const destY = player.nameplate.world.y + (player.nameplate.height / 2);
        const destAngle = 720;
        this.game.add.tween(card).to({x: destX, y: destY, angle: destAngle}, 1000, null, true);
    }

    deal(players) {
        for (let i = 0; i < players.length; i++) {
            this.dealCardToPlayer(players[i]);
        }
    }
}

export default Deck;
