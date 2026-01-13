/**
 * RAGE MP TypeScript Definitions
 */

declare namespace RageMP {
  interface Player {
    name: string;
    call(eventName: string, args?: any[]): void;
    outputChatBox(message: string): void;
    getVariable(key: string): any;
    setVariable(key: string, value: any): void;
  }

  interface PlayerPool {
    forEach(callback: (player: Player) => void): void;
    at(id: number): Player | undefined;
    toArray(): Player[];
  }

  interface EventMp {
    add(eventName: string, callback: (...args: any[]) => void): void;
    addCommand(commandName: string, callback: (player: Player, ...args: string[]) => void): void;
    call(eventName: string, ...args: any[]): void;
    callRemote(eventName: string, ...args: any[]): void;
  }

  interface Mp {
    events: EventMp;
    players: PlayerPool;
  }
}

declare const mp: RageMP.Mp;
