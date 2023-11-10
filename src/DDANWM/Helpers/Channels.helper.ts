import type DDANWM from "../DDANWM.js";

class Channels {
    public ddanwm: DDANWM;

    public constructor(ddanwm: DDANWM) {
        this.ddanwm = ddanwm;
    }
}

export default Channels;

export { Channels };