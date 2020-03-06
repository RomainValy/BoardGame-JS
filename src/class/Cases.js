class Cases extends GameObject {
    /*GOProp pour GameObject Proprieties*/
    constructor({ accessible, nbr, ...GOProp }) {
        super(GOProp);
        this.accessible = accessible;
    }
}