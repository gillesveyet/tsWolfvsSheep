/// <reference path="Helper.ts" />
/// <reference path="Pos.ts" />
/// <reference path="GameState.ts" />

//Reference: An Introduction to Game Tree Algorithms : http://www.hamedahmadi.com/gametree/
//
//Game over & score :
// 	PlayerA : Wolf   WIN <=> score=1000
// 	PlayerB : Sheep  WIN <=> score=-1000
//
//  1) gsChild.isWolf = true (gsParent.isWolf = false - sheep turn)
//     - Wolf has won : NA
//     - wolf has lost: negamax_score > 0
//
//  2) gsChild.isWolf = false (gsParent.isWolf = true - wolf turn)
//     - Wolf has won : negamax_score > 0
//     - wolf has lost: NA
//  
// 3) no move possible :  score <  0  SHOULD NOT BE POSSIBLE.

const MAX_SCORE = 1000;


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
		this.maxDepth = maxDepth - 1;
		this.nbIterations = 0;

		let startDate = new Date();
		let gs = null;
		let score = Solver.MIN_VALUE;
		let wolfTurn = gsParent.isWolf;	// true if wolf plays this turn


		for (let gsChild of gsParent.play()) {
			if (wolfTurn && gsChild.wolfHasWon) {
				score = MAX_SCORE
				gs = gsChild;
				break;
			}

			let val = -this.negaMax(gsChild, 0, Solver.MIN_VALUE, -score);
			if (val > score) {
				score = val;
				gs = gsChild;
			}
		}

		this.score = gs.score = gsParent.isWolf ? score : -score;	// transform negamax to normal score

		this.elapsed = new Date().getTime() - startDate.getTime();
		this.statusString = `${gsParent.playerCode} - Moves:${gs.nbMoves} Score:${this.score} Nb:${this.nbIterations} Time:${this.elapsed} Wolf:${gs.wolf} Sheep:${gs.sheep}`;

		return gs;
	}



	private negaMax(gsParent: GameState, depth: number, alpha: number, beta: number): number {
		++this.nbIterations;

		//Just to check, should never be true.
		// if (alpha >= beta)
		// 	console.warn(`alpha:${alpha}  beta:${beta}`);	

		let states = gsParent.play();

		if (states.length === 0)
			return -MAX_SCORE + depth;

		let wolfTurn = gsParent.isWolf;	// true if wolf plays this turn

		for (let gsChild of states) {
			if (wolfTurn) {
				if (gsChild.wolfHasWon)			// wolf play and win
					return MAX_SCORE - depth;		// 		=> if depth = 0 : perfect score
				else if (gsChild.wolfWillWin)		// wolf will win
					return MAX_SCORE - depth - gsChild.deltaWolfToLowestSheep;
			} else if (Solver.DictSheep[gsChild.getHashSheep()])	// sheep : perfect move
				return 100 + depth;
		}

		let max = Solver.MIN_VALUE;
		let smax = MAX_SCORE - depth;

		for (let gsChild of states) {
			let x: number;

			if (!wolfTurn && gsChild.wolfHasWon)			// optimization: wolfTurn already been checked so only check if sheep turn
				x = -MAX_SCORE + depth + 1;					// sheep bad move, wolf win on next turn.
			else if (depth === this.maxDepth)
				x = 0;
			else if (smax <= alpha)
				x = smax;
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