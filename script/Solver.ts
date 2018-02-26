/// <reference path="Helper.ts" />
/// <reference path="Pos.ts" />
/// <reference path="GameState.ts" />

//Reference: An Introduction to Game Tree Algorithms : http://www.hamedahmadi.com/gametree/
//
//Game over & score (Negamax) :
//	if ( gameover)
//	{ 		
//		score = playerA win ? 1000 - nbMoves : -1000 + nbMoves
//		return isPlayerA ? score : -score;
//	}
//
// PlayerA : Wolf
// PlayerB : Sheep
//
//  1) gsChild.isWolf = true (gsParent.isWolf = false - sheep turn)
//     - Wolf has won : score < 0
//     - wolf has lost: score > 0
//
//  2) gsChild.isWolf = false (gsParent.isWolf = true - wolf turn)
//     - Wolf has won : score > 0
//     - wolf has lost: NA
//  
// 3) no move possible :  score <  0

class Solver {
	//Const
	private static MIN_VALUE = -999999;

	// Static Init
	private static DictSheep: HashTable<number> = {};

	private static Ctor = (() => {
		Solver.InitDictSheep();
	})();

	private static InitDictSheep(): void {
		for (let n = 0; n < 30; ++n) {
			let sheep: Pos[] = [];

			let k = n % 10;
			let by = (n / 10 | 0) * 2;

			for (let i = 0; i < 5; ++i) {
				let x = 2 * i;
				let dy;

				if (k <= 5) {
					dy = by;

					if (i < k) {
						++dy;
						++x;
					}
				}
				else {
					dy = by + 1;

					if (i >= 10 - k)
						++dy;
					else
						++x;
				}

				sheep[i] = Pos.GetPos(x, 9 - dy);
			}

			sheep.sort((a: Pos, b: Pos) => { return a.pval - b.pval; });

			let gs = new GameState(n * 2, new Pos(5, 0), sheep);	// wolf position is not important
			this.DictSheep[gs.getHashSheep()] = 100 - n;
		}
	}
	// End Static Init


	private maxMoves: number;

	public elapsed: number;
	public nbIterations: number;
	public score: number;
	public maxDepth: number;
	public statusString: string;

	public play(gsParent: GameState, maxDepth: number): GameState {
		let startDate = new Date();
		this.nbIterations = 0;
		this.maxDepth = gsParent.nbMoves;
		this.maxMoves = gsParent.nbMoves + maxDepth;

		let gs = this.play_(gsParent);

		if (!gsParent.isWolf)
			this.score = -this.score // transform negamax in normal score

		gs.checkStatus();

		this.elapsed = new Date().getTime() - startDate.getTime();
		this.maxDepth -= gsParent.nbMoves - 1;

		this.statusString = Helper.StringFormat("{0} : Moves={1} Score={2} Nb={3} Time={4} MaxDepth={5}", !gs.isWolf ? "W" : "S", gs.nbMoves, this.score, this.nbIterations, this.elapsed, this.maxDepth);

		return gs;
	}


	private play_(gsParent: GameState): GameState {
		let wolfTurn = gsParent.isWolf;		// true if wolf plays this turn
		let states = gsParent.play();
		let x: number;

		for (let gsChild of states) {

			if (wolfTurn && gsChild.wolfWillWin())	// wolf play and win
			{
				this.score = gsParent.getNegamaxScoreWin();
				return gsChild;
			}
			else if (!wolfTurn && (x = Solver.DictSheep[gsChild.getHashSheep()]) !== undefined)	// sheep : perfect move
			{
				this.score = x;
				return gsChild;
			}
		}

		let best: GameState = null;
		let max = Solver.MIN_VALUE;

		for (let gsChild of states) {
			if (!wolfTurn && gsChild.wolfHasWon())			// optimization: wolfTurn already been checked so only check if sheep turn
				x = -gsChild.getNegamaxScore(true);			// sheep lose (bad move)
			else
				x = -this.negaMax(gsChild, Solver.MIN_VALUE, -max);

			if (x > max) {
				max = x;
				best = gsChild;
			}
		}

		this.score = max;
		return best;
	}

	private negaMax(gsParent: GameState, alpha: number, beta: number): number {
		++this.nbIterations;

		let nbMoves = gsParent.nbMoves;
		if (nbMoves > this.maxDepth)
			this.maxDepth = nbMoves;

		let states = gsParent.play();

		if (states.length === 0)
			return gsParent.getNegamaxScoreLost();

		let x: number;
		let wolfTurn = gsParent.isWolf;	// true if wolf plays this turn

		for (let gsChild of states) {
			if (wolfTurn && gsChild.wolfWillWin())		//wolf play and win
				return gsParent.getNegamaxScoreWin();
			else if (!wolfTurn && (x = Solver.DictSheep[gsChild.getHashSheep()]) !== undefined)	// sheep : perfect move
				return x;
		}

		let max = Solver.MIN_VALUE;
		let amax = 1000 - 1 - nbMoves;

		for (let gsChild of states) {
			if (!wolfTurn && gsChild.wolfHasWon())			// optimization: wolfTurn already been checked so only check if sheep turn
				x = -gsChild.getNegamaxScore(true);			// sheep lose (bad move)
			else if (gsChild.nbMoves >= this.maxMoves)
				x = 0;
			else if (amax <= alpha) {
				x = amax;
			}
			else
				x = -this.negaMax(gsChild, -beta, -alpha);

			if (x > max)
				max = x;

			if (x > alpha)
				alpha = x;

			if (alpha >= beta)
				return alpha;
		}

		return max;
	}
} 