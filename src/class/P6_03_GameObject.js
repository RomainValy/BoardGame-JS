class GameObject extends Coordinates {
    /*CoProp pour Coordinate Proprieties*/
    constructor({ name, cssClass, ...CoProp }) {
        super(CoProp);
        this.name = name;
        this.cssClass = cssClass;

    }
}