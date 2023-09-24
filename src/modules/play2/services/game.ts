import SocketLatest from "@/common/services/Socket";
import { KeyStroke, useCodeStore } from "../state/code-store";
import { RacePlayer, RaceResult, useGameStore } from "../state/game-store";
import { useSettingsStore } from "../state/settings-store";
import { useUserStore } from "@/common/state/user-store";
import { useConnectionStore } from "../state/connection-store";


export class Game {

    onConnectHasRun: boolean = false;

    onConnect(raceId?: string) {
        if (this.onConnectHasRun) return;

        this.listenForCountdown();
        this.listenForMemberJoined();
        this.listenForRaceStarted();
        this.listenForRaceJoined();
        this.listenForProgressUpdated();
        this.listenForRaceCompleted();

        this.socket.subscribe("challenge_selected", (_) => {
            useGameStore.setState((game) => {
                return {
                    ...game,
                    results: {},
                    myResult: undefined,
                };
            });
        });

        if (!raceId) {
            this.play();
        } else if (this.id !== raceId) {
            this.join(raceId);
        }
        this.onConnectHasRun = true;
    }

    join(id: string) {
        this.socket.emit("join", id);
    }

    constructor(private socket: SocketLatest, raceId?: string) {
        console.log("Game constructor: " + raceId);
        this.initializeConnectedState(socket);
        this.onConnect(raceId);
    }

    private initializeConnectedState(socket: SocketLatest) {
        const connected = socket.socket.connected;
        useGameStore.setState((game) => {
            return {
                ...game,
                connected,
                game: this,
            };
        });
    }

    private listenForMemberJoined() {
        this.socket.subscribe("member_joined", (_, member: RacePlayer) => {
            console.log("member_joined", member);
            this.updateMemberInState(member);
        });
    }

    private listenForCountdown() {
        this.socket.subscribe("countdown", (_, countdown: number) => {
            useGameStore.setState((state) => ({
                ...state,
                countdown,
            }));
        });
    }


    private listenForRaceStarted() {
        this.socket.subscribe("race_started", (_, time: string) => {
            console.log("Race started.");
            useCodeStore.setState((codeState) => ({
                ...codeState,
                startTime: new Date(time),
            }));
            useGameStore.setState((state) => ({
                ...state,
                countdown: undefined,
            }));
        });
    }


    private listenForProgressUpdated() {
        this.socket.subscribe("progress_updated", (_, member: RacePlayer) => {
            this.updateMemberInState(member);
        });
    }

    private listenForRaceJoined() {
        this.socket.subscribe("race_joined", (_, race) => {
            console.log(race);
            useConnectionStore.setState((s) => ({ ...s, isConnected: true }));
            useGameStore.setState((game) => ({
                ...game,
                id: race.id,
                owner: race.owner,
                members: race.players,
                countdown: undefined,
            }));
            useConnectionStore.setState((state) => ({
                ...state,
                raceExistsInServer: true,
            }));
            useSettingsStore.setState((s) => ({ ...s, raceIsPublic: race.isPublic }));
        });
    }



    private listenForRaceCompleted() {
        this.socket.subscribe("race_completed", (_, result: RaceResult) => {
            const userId = useUserStore.getState().id;
            const isMyResult = userId === result.user.id;
            useGameStore.setState((game) => {
                const results = {
                    ...game.results,
                    [result.user.id]: result,
                };
                return {
                    ...game,
                    results,
                    myResult: isMyResult ? result : game.myResult,
                };
            });
        });
    }

    private updateMemberInState(member: RacePlayer) {
        console.log("Progress updated: " + JSON.stringify(member));
        useGameStore.setState((game) => {
            const members = { ...game.members };
            members[member.id] = member;
            return {
                ...game,
                members,
            };
        });
    }

    sendKeyStroke(keyStroke: KeyStroke) {
        this.socket.emit("key_stroke", keyStroke);
    }

    play(): void {
        const isPublic = useSettingsStore.getState().defaultIsPublic;
        const language = useSettingsStore.getState().languageSelected?.language;
        const dto = {
            language,
            isPublic,
            user: {
                userId: useUserStore.getState().id,
            },
        };
        this.socket.emit("play", dto);

        console.log("Play sent");
    }

    start() {
        this.socket.emit("start_race");
    }

    get id() {
        return useGameStore.getState().id;
    }

    next() {

    }
}