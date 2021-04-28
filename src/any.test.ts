describe("any, unknown and guards", () => {
    it('should pass this canary test', function () {
        expect(true).toBe(true)
    });
    it('should show how dangerous "any" is', function () {
        const anyValue: any = "Garbage"
        const names: string[] = [anyValue, 123, "Pillows"]

        expect(names[0]).toBe("Garbage");
        expect(names[1]).toBe(123);
    });

    it('should show how easily "any" can creep into code', function () {
        type Toy = "wand" | "ball" | "laser pointer"

        interface Cat {
            name: string;
            age: number;
            toys: Toy[];
        }


        const jsonStr: string = '{"name":"Pillows", "age": 6, "toys": ["wand"]}'
        // This typing is dangerous if you are not 100% sure what JSON.parse is parsing.
        // Maybe this is fine, or maybe you won't run into an error deep in a component which would lead to painful debugging
        const jsonParser = (jsonString: string) => JSON.parse(jsonString);
        const pillows: Cat = jsonParser(jsonStr);

        expect(pillows.age).toBe(6);
        expect(pillows.toys[0]).toBe("wand")
        expect(pillows.name).toBe("Pillows");

    });
    it('should show how basic type checking', function () {
        const catName: unknown = "Pillows    "
        if (typeof catName !== "string") throw new Error("Not a string");

        expect(catName.trim()).toBe("Pillows");
    });

    it('should show how typeof fails', function () {
        class Cat {
            public name: string;

            constructor(cat: Cat) {
                this.name = cat.name;
            }
        }

        const jsonString = '{ "name": "Dozer" }'
        const jsonParserUnknown = (jsonString: string): unknown => JSON.parse(jsonString);

        const dozerParams = jsonParserUnknown(jsonString) as Cat
        const dozer: unknown = new Cat(dozerParams);


        expect(typeof dozer).toBe("object");
        expect(dozer instanceof Cat).toBe(true);


        const pillows: Cat = {name: "Pillows"}
        expect(pillows instanceof Cat).toBe(false);
        expect(typeof pillows).toBe("object");
    });

    it('should show unknown and type guards', function () {
        type Toy = "wand" | "ball" | "laser pointer"

        interface Cat {
            name: string;
            toys: Toy[];
        }

        const jsonStr: string = '{"name":"Pillows", "age": 6, "toys": ["laser pointer"]}'
        // unknown is a more accurate type to handle Non determinism
        // we can add a type guard to check your type

        const jsonParserUnknown = (jsonString: string): unknown => JSON.parse(jsonString);
        const parsed = jsonParserUnknown(jsonStr);

        function isToy(object: unknown): object is Toy {
            const toy = object as Toy;
            return toy === "wand" || toy === "ball" || toy === "laser pointer"
        }

        function isCat(object: unknown): object is Cat {
            const cat = object as Cat;
            return typeof cat.name === 'string'
                && Array.isArray(cat.toys)
                && cat.toys.every(isToy)
        }

        if (!isCat(parsed)) throw new Error("Not a cat");

        const pillows: Cat = parsed

        expect(parsed.toys[0]).toBe("laser pointer");
        expect(pillows.name).toBe("Pillows");

    });
})