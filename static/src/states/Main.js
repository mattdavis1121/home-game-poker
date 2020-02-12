import {Action, ActionText} from "../classes/Action";
import BoardManager from "../managers/BoardManager";
import BuyInManager from "../managers/BuyInManager";
import DealerButton from "../classes/DealerButton";
import EventRegister from "../managers/EventRegister";
import Panel from "../classes/Panel";
import PlayerManager from "../managers/PlayerManager";
import Pot from "../classes/Pot";
import Poker from "../Poker";
import SSE from "../SSE";
import TweenQueue from "../classes/TweenQueue";

class Main extends Phaser.State {
    init() {
        this.table_sse = new SSE(this.game, this.game.initialData.tableSSEUrl);
        this.user_sse = new SSE(this.game, this.game.initialData.userSSEUrl);

        window.addEventListener("unload", () => {
            this.game.controller.disconnectBeacon();
        }, false);
    }

    create() {
        this.background = this.game.add.image(0, 0, "background");
        this.newHandBtn = this.makeBtn(100, 100, "new\nhand", this.game.textures.whiteSquare, this.newHand);
        this.dealBtn = this.makeBtn(100, 220, "deal", this.game.textures.whiteSquare, this.deal);
        this.leaveBtn = this.makeBtn(100, 340, "leave", this.game.textures.whiteSquare, this.leaveTable);
        this.bbBtn = this.makeBtn(100, 460, "BB", this.game.textures.whiteSquare, this.bb);
        this.sbBtn = this.makeBtn(100, 580, "SB", this.game.textures.whiteSquare, this.sb);

        this.game.players = new PlayerManager(this.game, this.game.initialData.userId, this.game.config.seats, this.game.config.chips);
        this.game.players.initialize(this.game.initialData.players, this.game.config.seats);

        this.game.dealerButton = new DealerButton(this.game);

        this.game.board = new BoardManager(this.game);
        this.game.board.initialize();
        this.game.board.initializeDisplay();
        this.game.board.displayGroup.centerX = this.game.world.centerX;
        this.game.board.displayGroup.centerY = this.game.world.centerY + 80;

        this.game.pot = new Pot(this.game);
        this.game.pot.initializeDisplay();
        this.game.pot.chips.displayGroup.centerX = this.game.world.centerX;     // TODO - Positions in config
        this.game.pot.chips.displayGroup.centerY = this.game.world.centerY - 140;

        // TODO - These should go somewhere else. Maybe in Pot?
        this.game.roundBet = 0;
        this.game.roundRaise = 0;

        this.game.panel = new Panel(this.game, "panel");
        this.game.panel.initialize();
        this.game.panel.displayGroup.x = this.game.config.panel.pos.x;
        this.game.panel.displayGroup.y = this.game.config.panel.pos.y;
        this.game.panel.alwaysVisible = this.game.initialData.emulatorEnabled;

        this.game.buyIn = new BuyInManager(this.game, "buyIn");
        this.game.buyIn.initialize(this.game.config.seats, this.game.players.getOccupiedSeats(), this.game.config.buyInModal);
        this.game.buyIn.setButtonsVisible(this.game.players.userPlayer === null);

        // TODO - These are not currently used. Scrap?
        this.game.queue = new TweenQueue(this.game);
        this.game.register = new EventRegister(this.game);

        this.registerListeners();

        this.table_sse.addListener("newHand", event => {
            let data = JSON.parse(event.data);
            console.log("newHand: ", data);
            for (let i = 0; i < this.game.players.length; i++) {
                const player = this.game.players.players[i];
                player.animateFold().add(player.cards.reset, player.cards);
                player.chips.clear();
            }
            this.game.board.animateHide().add(this.game.board.cards.reset, this.game.board.cards);
            this.game.roundBet = 0;
            this.game.roundRaise = 0;
            this.game.players.dealerPlayer = this.game.players.getById(data.dealer);
            this.game.players.nextPlayer = this.game.players.getById(data.next);
            for (let i = 0; i < this.game.players.players.length; i++) {
                let player = this.game.players.players[i];
                player.update({
                    isDealer: player.id === data.dealer,
                    isNext: player.id === data.next,
                    roundBet: 0
                });
            }
            this.game.panel.setBets(Poker.generateRaises(this.game.rules.blinds.small, this.game.rules.blinds.big, this.game.roundBet, this.game.players.nextPlayer.roundBet, this.game.roundRaise, this.game.players.nextPlayer.balance));
            this.game.panel.setSecondaryBet(0);
            this.game.panel.setVisible(this.game.players.nextPlayer === this.game.players.userPlayer);
            this.game.dealerButton.moveToSeat(this.game.players.dealerPlayer.seat);
        });
        this.table_sse.addListener("deal", event => {
            let data = JSON.parse(event.data);
            console.log("deal: ", data);

            let delay = 0;
            let seats = this.game.players.getOccupiedSeats();
            let seatIndex = seats.indexOf(this.game.players.dealerPlayer.seat);
            seatIndex = (seatIndex + 1) % seats.length;  // Start with player to left of dealer
            for (let i = 0; i < seats.length; i++) {
                this.game.time.events.add(delay, () => {
                    this.game.players.getBySeat(seats[seatIndex]).animateDeal();
                    seatIndex = (seatIndex + 1) % seats.length;
                }, this);
                delay += 200;
            }

            this.game.players.nextPlayer = this.game.players.getById(data.next);
            this.game.panel.setBets(Poker.generateRaises(this.game.rules.blinds.small, this.game.rules.blinds.big, this.game.roundBet, this.game.players.nextPlayer.roundBet, this.game.roundRaise, this.game.players.nextPlayer.balance));
            this.game.panel.setSecondaryBet(Poker.getMinBet(this.game.roundBet, this.game.players.nextPlayer.roundBet, this.game.players.nextPlayer.balance));
            this.game.panel.setVisible(this.game.players.nextPlayer === this.game.players.userPlayer);
        });
        if (this.game.initialData.emulatorEnabled) {
            this.table_sse.addListener("emulateDeal", event => {
                let data = JSON.parse(event.data);
                console.log("emulateDeal: ", data);
                for (let i = 0; i < data.length; i++) {
                    let playerData = data[i];
                    // UNCOMMENT TO REINSTATE GOD MODE
                    // this.game.players.getById(playerData.playerId).cards.setCardNames(playerData.holdings);
                }
            });
        }
        this.table_sse.addListener("action", event => {
            let data = JSON.parse(event.data);
            console.log("action: ", data);

            if (data.actionType === Action.FOLD) {
                this.game.players.getById(data.playerId).animateFold();
            }

            this.game.players.nextPlayer = this.game.players.getById(data.next);
            this.game.players.getById(data.playerId).update({
                balance: data.playerBalance,
                isNext: false,
                roundBet: data.playerRoundBet
            });
            this.game.players.getById(data.playerId).nameplate.flash(this.parseActionText(data));
            this.game.players.getById(data.next).update({isNext: true});
            this.game.roundBet = data.roundBet;
            this.game.roundRaise = data.roundRaise;

            this.game.panel.setBets(Poker.generateRaises(this.game.rules.blinds.small, this.game.rules.blinds.big, this.game.roundBet, this.game.players.nextPlayer.roundBet, this.game.roundRaise, this.game.players.nextPlayer.balance));
            this.game.panel.setSecondaryBet(Poker.getMinBet(this.game.roundBet, this.game.players.nextPlayer.roundBet, this.game.players.nextPlayer.balance));
            this.game.panel.setVisible(this.game.players.nextPlayer === this.game.players.userPlayer);

            if (data.newRound) {
                this.game.board.animateReveal(data.board);
            }

            if (data.handComplete) {
                this.game.pot.gatherChips(this.game.players.players).add(() => {
                    this.game.time.events.add(1000, () => {
                        if (data.showdown) {
                            for (let i = 0; i < data.showdown.length; i++) {
                                const playerData = data.showdown[i];
                                const player = this.game.players.getById(playerData.playerId);
                                player.cards.setCardNames(playerData.holdings);
                                player.cards.setCardsFaceUp(true);
                            }
                        }

                        // Delay one second for each player going to showdown
                        const delay = data.showdown ? 1000 * data.showdown.length : 0;
                        this.game.time.events.add(delay, () => {
                            this.game.players.getById(data.winners[0].id).chips.takeChips(this.game.pot.chips.chips);
                        });
                    });
                });
            } else if (data.roundComplete) {
                this.game.pot.gatherChips(this.game.players.players);

                if (data.newRound) {
                    this.game.roundBet = 0;
                    this.game.roundRaise = 0;
                    for (let i = 0; i < this.game.players.players.length; i++) {
                        this.game.players.players[i].update({roundBet: 0}, false);
                    }
                    this.game.panel.setBets(Poker.generateRaises(this.game.rules.blinds.small, this.game.rules.blinds.big, this.game.roundBet, this.game.players.nextPlayer.roundBet, this.game.roundRaise, this.game.players.nextPlayer.balance));
                    this.game.panel.setSecondaryBet(0);
                }
            }
        });
        this.table_sse.addListener("newPlayer", (event) => {
            let data = JSON.parse(event.data);
            console.log("newPlayer: ", data);
            this.game.players.newPlayer(data);
            this.game.buyIn.newPlayer(data);
            this.game.buyIn.setButtonsVisible(this.game.players.userPlayer === null);
        }, this);
        this.table_sse.addListener("playerLeft", (event) => {
            let data = JSON.parse(event.data);
            console.log("playerLeft: ", data);
            this.game.players.playerLeft(data);
            this.game.buyIn.playerLeft(data);
            this.game.buyIn.setButtonsVisible(this.game.players.userPlayer === null);
        }, this);
        this.user_sse.addListener("deal", (event) => {
            let data = JSON.parse(event.data);
            console.log("deal: ", data);
            this.game.players.userPlayer.cards.setCardNames(data.holdings);
            this.game.players.userPlayer.cards.setCardsFaceUp(true);
        }, this);
    }

    registerListeners() {
        this.game.panel.primaryClicked.add(this.handleAction, this);
        this.game.panel.secondaryClicked.add(this.handleAction, this);
        this.game.panel.tertiaryClicked.add(this.handleAction, this);
        this.game.buyIn.buyInRequested.add(this.game.controller.join, this.game.controller);
    }


    /**
     * @summary Route actions to controller requests
     * @param {number} action - The action to be requested, defined in Action.js
     * @param {number} bet - The bet (if any) to be sent to the controller
     */
    handleAction(action, bet) {
        switch (action) {
            case Action.FOLD:
                this.game.controller.fold();
                break;
            case Action.CHECK:
                this.game.controller.check();
                break;
            case Action.BET:
                this.game.controller.bet(bet);
                break;
            default:
                console.warn("Invalid Action Type: " + action);
        }
    }

    /**
     * @summary Transform action data into more descriptive bet string
     *
     * All bets are bets, but some require more description to follow poker
     * convention. Specifically, a bet which just equals an existing bet is a
     * call, and one which increases an existing bet is a raise.
     *
     * NOTE: This function must be called BEFORE the state's `roundBet` and
     * `roundRaise` variables are updated, as this function must compare
     * new bet data against the previous state.
     *
     * @param actionData
     * @returns {string} - The text to be flashed
     */
    parseActionText(actionData) {
        let actionText = ActionText[actionData.actionType];
        if (actionData.actionType === Action.BET) {
            if (actionData.playerRoundBet === this.game.roundBet) {
                actionText = "CALL";
            } else if (actionData.playerRoundBet > this.game.roundBet && this.game.roundBet > 0) {
                actionText = "RAISE";
            }

            if (actionData.playerBalance === 0) {
                actionText = "ALL IN";
            }
        }
        return actionText;
    }

    update() {
        this.game.buyIn.update();
    }

    makeBtn(x, y, text, texture, callback) {
        let btn = this.game.add.button(x, y, texture, callback, this);
        btn.anchor.setTo(0.5);

        let btnText = this.game.add.text(0, 0, text);
        btnText.anchor.setTo(0.5);
        btn.addChild(btnText);
        btn.text = btnText;

        return btn;
    }

    deal() {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', '/tables/' + this.game.initialData.tableName + '/deal/');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            tableName: initialData.tableName,
        }));
    }

    newHand() {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', '/tables/' + this.game.initialData.tableName + '/new-hand/');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            tableName: initialData.tableName,
        }));
    };

    leaveTable() {
        this.game.controller.leave();
    }

    bb() {
        this.game.controller.bb();
    };

    sb() {
        this.game.controller.sb();
    };

    generateBets(playerRoundBet, playerBalance) {
        return Poker.generateBets(25, 50, this.game.roundBet, playerRoundBet, this.game.roundRaise, playerBalance);
    }
}

export default Main;
