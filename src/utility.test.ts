describe("Utility Types", () => {
    it('should show utility types Partial, Required, Readonly', function () {
        interface Cat {
            name: string;
            pseudoBreed: "Domestic Shorthair" | "Domestic Longhair"
            owner: string;
            isVaccinated: boolean;
        }

        type SCat = Partial<Pick<Cat, "name" | "owner">> & Omit<Cat, "name" | "owner">
        const catttt: SCat = {isVaccinated: false, pseudoBreed: "Domestic Longhair"}


        interface StrayCat {
            name?: string;
            pseudoBreed: "Domestic Shorthair" | "Domestic Longhair"
            owner?: string;
            isVaccinated?: boolean;
        }

        interface ShelterCat {
            name: string;
            pseudoBreed: "Domestic Shorthair" | "Domestic Longhair"
            owner?: string;
            isVaccinated: boolean;
        }


        const stray: StrayCat = {pseudoBreed: "Domestic Shorthair"}
        const processStray = (cat: StrayCat): ShelterCat => ({
            ...cat,
            isVaccinated: !!cat.isVaccinated,
            name: cat.name || "limerick"
        })

        const shelterCat = processStray(stray)


        expect(shelterCat.name).toBe("limerick");
    });


    it('should show utility types Partial, Required, Readonly', function () {

        interface ShelterCat {
            name: string;
            pseudoBreed: "Domestic Shorthair" | "Domestic Longhair"
            owner?: string;
            isVaccinated: boolean;
        }

        interface AdoptedCat {
            readonly name: string;
            pseudoBreed: "Domestic Shorthair" | "Domestic Longhair"
            owner: string;
            isVaccinated: true;
        }


        const adopt = (cat: ShelterCat, applicant: string, catName: string): AdoptedCat => {
            if (cat.owner && cat.owner !== applicant) throw new Error("Cat is not eligible for adoption");
            return {...cat, name: catName, isVaccinated: true, owner: applicant}
        }

        const cat: ShelterCat = {name: "limerick", pseudoBreed: "Domestic Shorthair", isVaccinated: false}

        const pillows = adopt(cat, "Kadin", "Pillows");
        // pillows.name = "Hairy Houdini";
        expect(pillows.name).toBe("Pillows");
    });


    it('should show Parameters and ReturnType', function () {
        interface Cat {
            name: string;
            pseudoBreed: "DSH" | "DLH"
        }

        type Clean = { isClean: true }
        type Dirty = { isClean: false }

        // we can make more types with an intersection
        type CleanCat = Cat & Clean;
        type DirtyCat = Cat & Dirty
        const batheCat = (cat: DirtyCat, soap: string): CleanCat => {
            if (soap !== "Cat Shampoo") throw new Error("Need Cat Shampoo")
            return {...cat, isClean: !cat.isClean}
        }

        // Constructs a tuple type from the types used in the parameters of a function type Type.

        const params = [
            [
                {
                    name: "Pillows",
                    pseudoBreed: "DSH",
                    isClean: false
                },
                "Shampoo"
            ],
            [
                {
                    name: "Fluffy",
                    pseudoBreed: "DLH",
                    isClean: false
                },
                "Cat Shampoo"
            ],
        ]

        // constructs arrays as OR instead of a tuple
        // Also of note, this typeof is NOT the JS version because its in a type context
        const cleanCats: ReturnType<typeof batheCat>[] = params.map((p) => batheCat(...p))
        // const dirty: DirtyCat = cleanPillows
        expect(cleanCats[0].isClean).toBe(true)
    });

    it('should show Pick and Record', function () {
        interface Cat {
            name: string;
            coat: "Long hair" | "Short hair";
            SSN: number;
        }

        type Cute = { isCute: true }
        type NotCute = { isCute: false }
        // type HipaaCompliantCat = Pick<Cat, "name" | "coat">;
        type HipaaCompliantCat = Omit<Cat, "SSN">;
        type CuteCat = HipaaCompliantCat & Cute
        type NotCuteCat = HipaaCompliantCat & NotCute
        type OpinionOfCat = CuteCat | NotCuteCat
        type Owner = string

        function isCute(object: unknown): object is Cute {
            const cuteObject = object as Cute;
            return !!cuteObject.isCute;
        }

        function isHipaaCompliantCat(object: unknown): object is HipaaCompliantCat {
            const cat = object as HipaaCompliantCat;
            return cat.name !== undefined;
        }


        const catMap: Record<Owner, OpinionOfCat> = {
            kadin: {name: "pillows", coat: "Short hair", isCute: true},
            fred: {name: "dozer", coat: "Long hair", isCute: false},
        }

        const onlyCute: Record<Owner, HipaaCompliantCat & Cute> = Object.keys(catMap).reduce((acc, ownerName) => {
            const cat: unknown = catMap[ownerName]
            if (isCute(cat) && isHipaaCompliantCat(cat)) {
                const cuteCat: CuteCat = cat
                return {...acc, [ownerName]: cuteCat}
            }
            return {...acc}
        }, {})

        expect(onlyCute.fred).toBeUndefined()
        expect(onlyCute.kadin).toBeDefined()
    });
})