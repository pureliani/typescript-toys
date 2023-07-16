export {}

type Store<Extendable, Items extends Extendable[] = []> = {
    items: Items
    add: <NewItem extends Extendable>(item: NewItem) => Store<Extendable, [...Items, NewItem]>
}

const store: Store<string> = {
    items: [],
    add(item) {
        this.items.push(item as never)
        return this as never
    },
}

const result = store.add('bob')    // { items: ["bob"], add: fn }
                    .add('billy')  // { items: ["bob", "billy"], add: fn }
                    .add('bobert') // { items: ["bob", "billy", "bobert"], add: fn }

const billy = result.items[1];     // "billy"
