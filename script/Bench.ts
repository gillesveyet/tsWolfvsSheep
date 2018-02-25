/// <reference path="Helper.ts" />
/// <reference path="Pos.ts" />
/// <reference path="GameState.ts" />
/// <reference path="Solver.ts" />

class Bench
{
	private static getBrowserName() : string
	{
		let agt = navigator.userAgent;

		if (agt.indexOf("Trident") > 0)
			return "Internet Explorer";

		return agt.substring(agt.lastIndexOf(" "));
	}

	static Run(sheepDepth: number, wolfDepth: number, win: Window): void
	{
		win.document.write("<p>Benchmark running. Please wait.</p>");

		let res = Helper.StringFormat("{0} sheepDepth:{1} wolfDepth:{2} {3}", new Date().toISOString(), sheepDepth, wolfDepth, this.getBrowserName());
		res += "<br>";

		let tsTotal = 0;
		let tsMax = 0;
		let nbTotal = 0;
		let solver: Solver;

		let gs = GameState.GetInitialGameState();

		for (; !gs.isGameOver() ;)
		{
			solver = new Solver();

			if (gs.isWolf)
				gs = solver.play(gs, wolfDepth);
			else
				gs = solver.play(gs, sheepDepth);

			tsTotal += solver.elapsed;
			nbTotal += solver.nbIterations;

			if (solver.elapsed > tsMax)
				tsMax = solver.elapsed;

			res += solver.statusString + "<br>";
		}

		res += Helper.StringFormat("Done in {0} ms - Max={1} ms - NbTotal={2} - Result: {3} {4} {5}", tsTotal, tsMax, nbTotal, solver.score, GameStatus[gs.status], gs.status === GameStatus.SheepWon ? "OK" : "FAIL");

		if( !win)
			win = window.open("", "Benchmark");

		win.document.write("<p>" + res +" </p>");
	}
}