/// <reference path="Helper.ts" />
/// <reference path="Pos.ts" />
/// <reference path="GameState.ts" />
/// <reference path="Solver.ts" />
/// <reference path="Bench.ts" />
/// <reference path="CheckerPanel.ts" />
/// <reference path="..\typings\jquery.d.ts" />

// With Visual Studio, you can add an _references.ts file to the project. This file will be the first passed to the compiler, allowing to control over the order the generated.js file
// when used in combination with the Combine JavaScript output into file option.

// With IntelliJ, you have to put "/// <reference path" on every source file
//IntelliJ will automatically combine js output in this order:
//    "Helper.ts"
//    "Pos.ts"
//    "GameState.ts"
//    "CheckerPanel.ts"
//    "Solver.ts"
//    "Bench.ts"
//    "app.ts"
//

enum PlayerMode {
    PlayWolf = 1,
    PlaySheep = 2,
    TwoPlayers = 3, // not yet implemented
}

const DEFAULT_DEPTH = 16;

class Game {
    checker: CheckerPanel;
    gameHistory: GameState[] = [];
    ready = false;
    playerMode: PlayerMode;

    getWolfDepth(): number {
        let d = parseInt((<HTMLInputElement>document.getElementById("wolf_depth")).value);

        if (isNaN(d) || d <= 0)
            return DEFAULT_DEPTH;
        else
            return d;
    }

    getSheepDepth(): number {
        let d = parseInt((<HTMLInputElement>document.getElementById("sheep_depth")).value);

        if (isNaN(d) || d <= 0)
            return DEFAULT_DEPTH;
        else
            return d;
    }

    getGS(): GameState {
        return this.gameHistory.length > 0 ? this.gameHistory[this.gameHistory.length - 1] : null;
    }

    addGS(gs: GameState) {
        this.gameHistory.push(gs);
    }

    resetGame() {
        this.gameHistory = [];
        this.checker.SetPositions(null, false);
        this.ready = true;

        $("#menu_game").hide();
        $("#menu_play").show();
        this.updateContext();
    }

    displayStatus(msg: string) {
        //document.getElementById("status").innerText = msg;	// not working with Firefox
        $("#status").text(msg);
    }

    displayDebug(msg: string) {
        //document.getElementById("dbg").innerText = msg; // not working with Firefox
        $("#dbg").text(msg);
        console.log(msg);
    }

    public run(): void {
        let wolfDepth = parseInt(Params["wolf"]);
        let sheepDepth = parseInt(Params["sheep"]);

        if (isNaN(wolfDepth) || wolfDepth <= 0)
            wolfDepth = DEFAULT_DEPTH;

        if (!isNaN(sheepDepth) || sheepDepth <= 0)
            sheepDepth = DEFAULT_DEPTH;

        (<HTMLInputElement>document.getElementById("wolf_depth")).value = wolfDepth.toString();
        (<HTMLInputElement>document.getElementById("sheep_depth")).value = wolfDepth.toString();

        //window.document.title = Helper.StringFormat( "Loup et les Agneaux - wolf:{0} sheep:{1}", wolfDepth, sheepDepth);

        if (Params["bench"] !== undefined) {
            let win = window.open("", "Benchmark");

            Bench.Run(wolfDepth, sheepDepth, win);
            return;
        }

        if (IsExpertMode) {
            $("#menu_bench").show();
            $("#menu_depth").show();
            $("#dbg").show();
        }

        $("#test").click(() => {
            alert("test");
        });

        window.onkeydown = (ev: KeyboardEvent) => {
            if (ev.keyCode === 32 && this.ready && IsExpertMode) {
                ev.preventDefault();

                this.ready = false;
                this.displayStatus("Thinking...");

                this.cpuPlay(false);

                if (!this.getGS().isGameOver()) {
                    setTimeout(() => {
                        this.cpuPlay(true);
                        this.ready = true;
                    }, 200);
                }


            }
        };

        document.getElementById('bench').onclick = () => {
            //from http://en.nisi.ro/blog/development/javascript/open-new-window-window-open-seen-chrome-popup/
            //Open the window just after onClick event so that Chrome consider that it is not a popup (which are blocked by default on Chrome)
            //Chrome Settings / Advanced Settings / Content Settings : Do not allow any site to show popups - Manage exceptions
            let win = window.open("", "Benchmark");
            this.ready = false;
            Bench.Run(this.getWolfDepth(), this.getSheepDepth(), win);
            this.ready = true;
        };

        document.getElementById('game_new').onclick = () => {
            if (this.getGS() != null && !this.getGS().isGameOver() && !confirm("Cancel current game and start a new game?"))
                return;

            this.resetGame();
        };

        document.getElementById('game_back').onclick = () => {
            if (this.playerMode === PlayerMode.TwoPlayers) {
                this.gameHistory.pop();
            }
            else {
                //Remove both player move and computer move
                this.gameHistory.pop();
                this.gameHistory.pop();
            }


            this.checker.SetPositions(this.getGS(), true);

            this.updateContext();
        };

        $("#play_wolf").click(() => {
            this.playerMode = PlayerMode.PlayWolf;
            this.startGame();
        });

        $("#play_sheep").click(() => {
            this.playerMode = PlayerMode.PlaySheep;
            this.startGame();
        });

        this.checker = new CheckerPanel(<HTMLCanvasElement>document.getElementById('can'));

        this.checker.onGetValidMoves = (selected: Pos) => {
            return this.getGS().getValidMoves(selected);
        };

        this.checker.onPreloadDone = () => {
            this.resetGame();
        };

        this.checker.onMovePiece = (oldPos: Pos, newPos: Pos) => {
            let gs = this.getGS().makePlayerMove(oldPos, newPos);
            this.addGS(gs);
            this.checker.SetPositions(gs, false);

            this.updateContext();
            if (!gs.isGameOver())
                this.makeCpuPlay();
        }

        this.checker.preloadAssets();
    }

    startGame(): void {
        $("#menu_game").show();
        $("#menu_play").hide();

        let gs = GameState.GetInitialGameState()
        this.addGS(gs);

        this.checker.SetPositions(gs, this.playerMode !== PlayerMode.PlaySheep);
        this.updateContext();

        if (this.playerMode === PlayerMode.PlaySheep)
            this.makeCpuPlay();
    }

    updateContext(): void {
        let gs = this.getGS();

        this.displayInfo(gs);

        let allow = this.gameHistory.length > 2 || this.playerMode === PlayerMode.TwoPlayers && this.gameHistory.length > 1;

        (<HTMLInputElement>document.getElementById("game_back")).disabled = !(allow && (this.playerMode !== PlayerMode.TwoPlayers || IsExpertMode));

    }

    displayInfo(gs: GameState): void {
        if (gs == null)
            this.displayStatus("Select Wolf or Sheep");
        else if (gs.isGameOver())
            this.showVictory(gs);
        else {
            if (gs.isWolf)
                this.displayStatus("Your turn");
            else
                this.displayStatus("Your turn. Select a sheep (white) to play.");
        }
    }


    showVictory(gs: GameState): void {
        let msg: string;

        if (this.playerMode !== PlayerMode.TwoPlayers) {
            if ((gs.status === GameStatus.WolfWon) === (this.playerMode === PlayerMode.PlayWolf))
                msg = "You win!";
            else
                msg = "You lose!";
        }
        else {
            if (gs.status === GameStatus.SheepWon)
                msg = "Sheep win!";
            else
                msg = "Wolf wins!";
        }

        this.displayStatus(msg);
        setTimeout(() => alert(msg), 600);

    }

    cpuPlay(enable: boolean) {
        let solver = new Solver();
        let gs = solver.play(this.getGS(), this.getGS().isWolf ? this.getWolfDepth() : this.getSheepDepth());
        this.addGS(gs);

        this.displayDebug(solver.statusString);
        this.checker.SetPositions(gs, enable && !gs.isGameOver());

        this.updateContext();
    }


    makeCpuPlay(): void {
        this.ready = false;
        this.checker.ShowWaitLayer();

        this.displayStatus("Computer is thinking...");
        setTimeout(() => {
            this.cpuPlay(true);
            this.ready = true;
        }, 200);
    }
}

//Does not work. Problem with 'this' ?   Use bind ?
//$(new Game().run);

//OK
//$(() => { new Game().run() });

//OK

let _game: Game;

window.onload = () => {
    _game = new Game();
    _game.run();
};

