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
	private static DictSheep: HashTable<boolean> = {};

	private static Ctor = (() => {
		Solver.InitDictSheep();
	})();

	private static InitDictSheep(): void {
		for (let n = 0; n < 30; ++n) {
			let sheep: Pos[] = [];

			let k = n % 10;
			let by = (n / 10 | 0) * 2;

			for (let i = 0; i < NB_SHEEP; ++i) {
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
			this.DictSheep[gs.getHashSheep()] = true;
		}
	}
	// End Static Init

	private maxDepth: number;

	public score: number;
	public elapsed: number;
	public nbIterations: number;
	public statusString: string;

	public play(gsParent: GameState, maxDepth: number): GameState {
		this.maxDepth = maxDepth;
		this.nbIterations = 0;

		let startDate = new Date();
		let gs = null;
		let max = Solver.MIN_VALUE;

		for (let gsChild of gsParent.play()) {
			let val = -this.negaMax(gsChild, 1, Solver.MIN_VALUE, -max);
			if (val > max) {
				max = val;
				gs = gsChild;
			}
		}

		this.score = gsParent.isWolf ? max : -max;	// transform negamax in normal score

		gs.checkStatus();

		this.elapsed = new Date().getTime() - startDate.getTime();
		this.statusString = `${!gs.isWolf ? "W" : "S"} - Moves:${gs.nbMoves} Score:${this.score} Nb:${this.nbIterations} Time:${this.elapsed} Wolf:${gs.wolf} Sheep:${gs.sheep}`;

		return gs;
	}



	private negaMax(gsParent: GameState, depth: number, alpha: number, beta: number): number {
		++this.nbIterations;

		//Just to check, should never be true.
		// if (alpha >= beta)
		// 	console.warn(`alpha:${alpha}  beta:${beta}`);	

		let nbMoves = gsParent.nbMoves;

		let states = gsParent.play();

		if (states.length === 0)
			return gsParent.getNegamaxScoreLost();

		let wolfTurn = gsParent.isWolf;	// true if wolf plays this turn

		for (let gsChild of states) {
			if (wolfTurn && gsChild.wolfWillWin())		//wolf play and win
				return gsParent.getNegamaxScoreWin();
			else if (!wolfTurn && Solver.DictSheep[gsChild.getHashSheep()])	// sheep : perfect move
				return depth;
		}

		let max = Solver.MIN_VALUE;
		let amax = 1000 - 1 - nbMoves;

		for (let gsChild of states) {
			let x: number;

			if (!wolfTurn && gsChild.wolfHasWon())			// optimization: wolfTurn already been checked so only check if sheep turn
				x = -gsChild.getNegamaxScore(true);			// sheep lose (bad move)
			else if (depth >= this.maxDepth)
				x = 0;
			else if (amax <= alpha) {
				x = amax;
			}
			else
				x = -this.negaMax(gsChild, depth + 1, -beta, -alpha);

			if (x > alpha) {
				alpha = x;

				if (alpha >= beta)
					return alpha;
			}

			if (x > max)
				max = x;
		}

		return max;
	}
} 