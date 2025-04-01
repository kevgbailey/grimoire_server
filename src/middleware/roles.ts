export interface Role {
    id: number;
    name: string;
    description: string;
    firstNightOrder: number | null;
    nightOrder: number | null;
}

export interface RoleCategories {
    townsfolk: Role[];
    outsiders: Role[];
    minions: Role[];
    demons: Role[];
}

export class GameRoles {
    private static instance: GameRoles;
    private readonly roles: RoleCategories;

    private constructor() {
        this.roles = {
            townsfolk: [
                { id: 1, name: 'Washerwoman', description: "You start knowing that 1 of 2 players is a particular Townsfolk.", firstNightOrder: 3, nightOrder: null  },
                { id: 2, name: 'Librarian', description: "You start knowing that 1 of 2 players is a particular Outsider.", firstNightOrder: 4, nightOrder: null  },
                { id: 3, name: 'Investigator', description: "You start knowing that 1 of 2 players is a particular Minion.", firstNightOrder: 5, nightOrder: null  },
                { id: 4, name: 'Chef', description: "You start knowing how many pairs of evil players there are.", firstNightOrder: 6, nightOrder: null  },
                { id: 5, name: 'Empath', description: "Each night, you learn how many of your 2 alive neighbors are evil.", firstNightOrder: 7, nightOrder: 6  },
                { id: 6, name: 'Fortune Teller', description: "Each night, choose 2 players: you learn if either is a Demon. There is a good player that registers as a Demon to you.", firstNightOrder: 1, nightOrder: 7  },
                { id: 7, name: 'Undertaker', description: "Each night*, you learn which character died by execution today.", firstNightOrder: 8, nightOrder: 8  },
                { id: 8, name: 'Monk', description: "Each night*, choose a player (not yourself): they are safe from the Demon tonight.", firstNightOrder: null, nightOrder: 2  },
                { id: 9, name: 'Ravenkeeper', description: "If you die at night, you are woken to choose a player: you learn their character.", firstNightOrder: null, nightOrder: 5  },
                { id: 10, name: 'Virgin', description: "The 1st time you are nominated, if the nominator is a Townsfolk, they are executed immediately.", firstNightOrder: null, nightOrder: null  },
                { id: 11, name: 'Slayer', description: "Once per game, during the day, publicly choose a player: if they are the Demon, they die.", firstNightOrder: null, nightOrder: null  },
                { id: 12, name: 'Soldier', description: "You are safe from the Demon.", firstNightOrder: 1, nightOrder: 1  },
                { id: 13, name: 'Mayor', description: "If only 3 players live & no execution occurs, your team wins. If you die at night, another player might die instead.", firstNightOrder: null, nightOrder: null  }
            ],
            outsiders: [
                { id: 14, name: 'Recluse', description: "Each night, choose a player (not yourself): tomorrow, you may only vote if they are voting too.", firstNightOrder: null, nightOrder: null  },
                { id: 15, name: 'Saint', description: "If you die by execution, your team loses.", firstNightOrder: null, nightOrder: null  },
                { id: 16, name: 'Drunk', description: "You do not know you are the Drunk. You think you are a Townsfolk character, but you are not.", firstNightOrder: null, nightOrder: null  },
                { id: 17, name: 'Butler', description: "You might register as evil & as a Minion or Demon, even if dead.", firstNightOrder: null, nightOrder: null  }
            ],
            minions: [
                { id: 18, name: 'Poisoner', description: "Each night, choose a player: they are poisoned tonight and tomorrow day.", firstNightOrder: 2, nightOrder: 1  },
                { id: 19, name: 'Spy', description: "Each night, you see the Grimoire. You might register as good & as a Townsfolk or Outsider, even if dead.", firstNightOrder: null, nightOrder: 7  },
                { id: 20, name: 'Scarlet Woman', description: "If there are 5 or more players alive & the Demon dies, you become the Demon. (Travellers don't count)", firstNightOrder: null, nightOrder: 3  },
                { id: 21, name: 'Baron', description: "There are extra Outsiders in play. [+2 Outsiders]", firstNightOrder: 1, nightOrder: 1 },
            ],
            demons: [
                { id: 22, name: 'Imp', description: "Each night*, choose a player: they die. If you kill yourself this way, a Minion becomes the Imp.", firstNightOrder: 1, nightOrder: 4 },
            ]
        };
    }

    public static getInstance(): GameRoles {
        if (!GameRoles.instance) {
            GameRoles.instance = new GameRoles();
        }
        return GameRoles.instance;
    }

    public getAllRoles(): RoleCategories {
        return this.roles;
    }

    public getTownsfolk(): Role[] {
        return this.roles.townsfolk;
    }

    public getOutsiders(): Role[] {
        return this.roles.outsiders;
    }

    public getMinions(): Role[] {
        return this.roles.minions;
    }

    public getDemons(): Role[] {
        return this.roles.demons;
    }

    public getRoleById(id: number): Role | undefined {
        const allRoles = [
            ...this.roles.townsfolk,
            ...this.roles.outsiders,
            ...this.roles.minions,
            ...this.roles.demons
        ];
        return allRoles.find(role => role.id === id);
    }

    public getRoleByName(name: string): Role | undefined {
        const allRoles = [
            ...this.roles.townsfolk,
            ...this.roles.outsiders,
            ...this.roles.minions,
            ...this.roles.demons
        ];
        return allRoles.find(role => role.name === name);
    }
}