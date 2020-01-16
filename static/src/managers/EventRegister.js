class EventRegister {
    constructor(game) {
        this.game = game;
        this.events = {};
    }

    add(key, signal) {
        if (this.events[key]) {
            console.warn("TimingManager already has an event for key " + key);
            return;
        }
        this.events[key] = signal;
        signal.add(() => {
            console.log("DELETING EVENT");
            delete this.events[key];
        });
    }

    get(key) {
        return this.events[key];
    }
}

export default EventRegister;
