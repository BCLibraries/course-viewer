export class CitationType {
    public readonly delivery: CitationType.DELIVERY;
    public readonly material: CitationType.MATERIAL;

    public constructor(delivery: CitationType.DELIVERY, material: CitationType.MATERIAL) {
        this.delivery = delivery;
        this.material = material;
    }
}

export namespace CitationType {
    export enum DELIVERY {
        Electronic = "electronic",
        Physcial = "physical"
    }

    export enum MATERIAL {
        Book = "book",
        Chapter = "chapter",
        Article = "article",
        Video = "video",
        Audio = "audio"
    }
}
