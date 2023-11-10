import type DDANWM from "../DDANWM.js";

class Guilds {
    public ddanwm: DDANWM;

    public constructor(ddanwm: DDANWM) {
        this.ddanwm = ddanwm;
    }
}

export default Guilds;

export { Guilds };