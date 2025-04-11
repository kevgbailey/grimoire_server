export interface Role {
    id: number;           // Changed from id to id to match GameRoles
    name: string;
    description: string;
    night_order: number | null;
    first_night_order: number | null;
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
                { id: 1, name: 'Washerwoman', description: "You start knowing that 1 of 2 players is a particular Townsfolk.", first_night_order: 3, night_order: null  },
                { id: 2, name: 'Librarian', description: "You start knowing that 1 of 2 players is a particular Outsider.", first_night_order: 4, night_order: null  },
                { id: 3, name: 'Investigator', description: "You start knowing that 1 of 2 players is a particular Minion.", first_night_order: 5, night_order: null  },
                { id: 4, name: 'Chef', description: "You start knowing how many pairs of evil players there are.", first_night_order: 6, night_order: null  },
                { id: 5, name: 'Empath', description: "Each night, you learn how many of your 2 alive neighbors are evil.", first_night_order: 7, night_order: 6  },
                { id: 6, name: 'Fortune Teller', description: "Each night, choose 2 players: you learn if either is a Demon. There is a good player that registers as a Demon to you.", first_night_order: 1, night_order: 7  },
                { id: 7, name: 'Undertaker', description: "Each night*, you learn which character died by execution today.", first_night_order: 8, night_order: 8  },
                { id: 8, name: 'Monk', description: "Each night*, choose a player (not yourself): they are safe from the Demon tonight.", first_night_order: null, night_order: 2  },
                { id: 9, name: 'Ravenkeeper', description: "If you die at night, you are woken to choose a player: you learn their character.", first_night_order: null, night_order: 5  },
                { id: 10, name: 'Virgin', description: "The 1st time you are nominated, if the nominator is a Townsfolk, they are executed immediately.", first_night_order: null, night_order: null  },
                { id: 11, name: 'Slayer', description: "Once per game, during the day, publicly choose a player: if they are the Demon, they die.", first_night_order: null, night_order: null  },
                { id: 12, name: 'Soldier', description: "You are safe from the Demon.", first_night_order: 1, night_order: 1  },
                { id: 13, name: 'Mayor', description: "If only 3 players live & no execution occurs, your team wins. If you die at night, another player might die instead.", first_night_order: null, night_order: null  }
            ],
            outsiders: [
                { id: 14, name: 'Recluse', description: "Each night, choose a player (not yourself): tomorrow, you may only vote if they are voting too.", first_night_order: null, night_order: null  },
                { id: 15, name: 'Saint', description: "If you die by execution, your team loses.", first_night_order: null, night_order: null  },
                { id: 16, name: 'Drunk', description: "You do not know you are the Drunk. You think you are a Townsfolk character, but you are not.", first_night_order: null, night_order: null  },
                { id: 17, name: 'Butler', description: "You might register as evil & as a Minion or Demon, even if dead.", first_night_order: null, night_order: null  }
            ],
            minions: [
                { id: 18, name: 'Poisoner', description: "Each night, choose a player: they are poisoned tonight and tomorrow day.", first_night_order: 2, night_order: 1  },
                { id: 19, name: 'Spy', description: "Each night, you see the Grimoire. You might register as good & as a Townsfolk or Outsider, even if dead.", first_night_order: null, night_order: 7  },
                { id: 20, name: 'Scarlet Woman', description: "If there are 5 or more players alive & the Demon dies, you become the Demon. (Travellers don't count)", first_night_order: null, night_order: 3  },
                { id: 21, name: 'Baron', description: "There are extra Outsiders in play. [+2 Outsiders]", first_night_order: 1, night_order: 1 },
            ],
            demons: [
                { id: 22, name: 'Imp', description: "Each night*, choose a player: they die. If you kill yourself this way, a Minion becomes the Imp.", first_night_order: 1, night_order: 4 },
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