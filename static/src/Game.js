import Boot from "./states/Boot";
import Load from "./states/Load";
import Main from "./states/Main";

class Game extends Phaser.Game {
    constructor() {
        super({
            width: 1920,
            height: 1080,
            renderer: Phaser.CANVAS
        });

        this.state.add("boot", Boot, false);
        this.state.add("load", Load, false);
        this.state.add("main", Main, false);

        this.state.start("boot");
    }
}

new Game();
