import CardManager from "./CardManager";
import OneTimeSignal from "../classes/OneTimeSignal";

const CARD_SEPARATOR = 1.2;

class BoardManager {
    constructor(game) {
        this.game = game;

        this.displayGroup = this.game.add.group();
        this.display = {
            cards: null,
            cardsMask: null
        };

        this.numCards = 0;
        this.numCardsRevealed = 0;

        this.cards = new CardManager(game);
    }

    initialize(numCards = 5) {
        // TODO - this will need to be dynamic for other game types
        this.numCards = numCards;
        this.cards.initialize(numCards);
    }

    initializeDisplay() {
        this.display.cards = this.cards.displayGroup;
        this.display.cards.align(-1, 1, this.cards.cardWidth * CARD_SEPARATOR, 1);

        this.display.cardsMask = this.createCardsMask();
        this.display.cardsMask.top = 0;
        this.cards.mask = this.display.cardsMask;

        this.displayGroup.add(this.display.cards);
        this.displayGroup.add(this.display.cardsMask);

        this.hideCards();
    }

    createCardsMask() {
        let height = this.display.cards.height * CARD_SEPARATOR;
        let width = this.display.cards.width;
        let mask = this.game.add.graphics(0, 0);
        mask.beginFill(0xffffff);
        mask.drawRect(0, 0, width, height);
        return mask;
    }

    animateReveal(cards) {
        if (!cards) {
            return;
        }

        let delay = 0;
        let complete = new OneTimeSignal();
        for (let i = this.numCardsRevealed; i < cards.length; i++) {
            this.game.time.events.add(delay, () => {
                this.cards.cards[i].name = cards[i];
                const tween = this.game.add.tween(this.cards.cards[i]).to({bottom: 0}, 1000, Phaser.Easing.Back.InOut, true);
                this.game.time.events.add(500, this.cards.cards[i].animateFlip, this.cards.cards[i]);

                if (i === this.cards.length - 1) {
                    tween.onComplete.add(complete.dispatch, complete);
                }
            });
            delay += 200;
        }

        this.numCardsRevealed = cards.length;

        return complete;
    }

    animateHide() {
        let delay = 0;
        let complete = new OneTimeSignal();
        for (let i = 0; i < this.numCardsRevealed; i++) {
            this.game.time.events.add(delay, () => {
                const tween = this.game.add.tween(this.cards.cards[i]).to({top: 0}, 1000, Phaser.Easing.Back.InOut, true);
                tween.onComplete.add(() => {
                    this.cards.cards[i].faceUp = false;
                });

                if (i === this.numCardsRevealed - 1) {
                    tween.onComplete.add(complete.dispatch, complete);
                }
            });
        }

        complete.add(() => {
            this.numCardsRevealed = 0;

        });

        return complete;
    }

    hideCards() {
        this.display.cards.top = this.display.cardsMask.bottom;
    }

    showCards() {
        this.display.cards.bottom = this.display.cardsMask.bottom;
    }
}

export default BoardManager;
