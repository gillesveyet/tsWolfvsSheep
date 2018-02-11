/// <reference path="Helper.ts" />
/// <reference path="Pos.ts" />

enum GameStatus
{
	SheepWon = -1,
	NotFinished = 0,
	WolfWon = 1
}


class GameState
{
	//Const
	private static NB_SHEEP = 5;

	// Static Init
	private static DictWolf: HashTable<number> = {};

	private static Ctor = (() =>
	{
		GameState.InitDictWolf();
	})();

	private static InitDictWolf()
	{
		var patterns: string[] = [
			//Size: 1

			" X " + '!' +
			"O _",

			//Size: 2

			"_ X _" + '!' +
			" _ _ " + '!' +
			"O _ _",

			"_ X _" + '!' +
			" _ _ " + '!' +
			"_ O _",


			"_ X _" + '!' +
			" _ _ " + '!' +
			"O _ O",

			"_ X _" + '!' +
			" _ _ " + '!' +
			"O O _",

			"_ X _" + '!' +
			" O _ " + '!' +
			"O _ _",

			// size: 2 - shift: 1
			//" X _" + '!' +
			//"_ _ " + '!' +
			//" _ _",

			" X _" + '!' +
			"_ _ " + '!' +
			" O _",

			" X _" + '!' +
			"_ _ " + '!' +
			" _ O",

			" X _" + '!' +
			"_ O " + '!' +
			" _ O",

			//Size: 3
			//" _ X _ " + '!' +
			//"_ _ _ _" + '!' +
			//" _ _ _ " + '!' +
			//"_ _ _ _",

			" _ X _ " + '!' +
			"_ _ _ _" + '!' +
			" _ _ _ " + '!' +
			"O _ _ _",

			" _ X _ " + '!' +
			"_ _ _ _" + '!' +
			" _ _ _ " + '!' +
			"_ O _ _",

			" _ X _ " + '!' +
			"_ _ _ _" + '!' +
			" _ _ _ " + '!' +
			"O O _ _",

			" _ X _ " + '!' +
			"_ _ _ _" + '!' +
			" _ _ _ " + '!' +
			"O _ O _",

			" _ X _ " + '!' +
			"_ _ _ _" + '!' +
			" _ _ _ " + '!' +
			"O _ _ O",

			" _ X _ " + '!' +
			"_ _ _ _" + '!' +
			" _ _ _ " + '!' +
			"_ O O _",

			" _ X _ " + '!' +
			"_ O _ _" + '!' +
			" _ _ _ " + '!' +
			"O _ _ _",

			" _ X _ " + '!' +
			"_ O _ _" + '!' +
			" _ _ _ " + '!' +
			"_ O _ _",

			" _ X _ " + '!' +
			"_ O _ _" + '!' +
			" _ _ _ " + '!' +
			"_ _ O _",

			" _ X _ " + '!' +
			"_ O _ _" + '!' +
			" _ _ _ " + '!' +
			"_ _ _ O",

			" _ X _ " + '!' +
			"_ _ _ _" + '!' +
			" O _ _ " + '!' +
			"O _ _ _",

			" _ X _ " + '!' +
			"_ _ _ _" + '!' +
			" O _ _ " + '!' +
			"_ O _ _",

			" _ X _ " + '!' +
			"_ _ _ _" + '!' +
			" O _ _ " + '!' +
			"_ _ O _",

			" _ X _ " + '!' +
			"_ _ _ _" + '!' +
			" O _ _ " + '!' +
			"_ _ _ O",

			" _ X _ " + '!' +
			"_ _ _ _" + '!' +
			" _ O _ " + '!' +
			"O _ _ _",

			" _ X _ " + '!' +
			"_ _ _ _" + '!' +
			" _ O _ " + '!' +
			"_ O _ _",

			" _ X _ " + '!' +
			"_ _ _ _" + '!' +
			" _ O _ " + '!' +
			"_ _ O _",

			" _ X _ " + '!' +
			"_ _ _ _" + '!' +
			" _ O _ " + '!' +
			"_ _ _ O",

			" _ X _ " + '!' +
			"_ O _ _" + '!' +
			" O _ _ " + '!' +
			"O _ _ _",

			" _ X _ " + '!' +
			"_ O _ _" + '!' +
			" O _ _ " + '!' +
			"O O _ _",

			" _ X _ " + '!' +
			"_ O _ _" + '!' +
			" O _ _ " + '!' +
			"O _ O _",

			" _ X _ " + '!' +
			"_ O _ _" + '!' +
			" O _ _ " + '!' +
			"O _ _ O",

			" _ X _ " + '!' +
			"_ O _ _" + '!' +
			" _ _ _ " + '!' +
			"O O _ _",

			" _ X _ " + '!' +
			"_ O _ _" + '!' +
			" _ _ _ " + '!' +
			"O _ O _",

			" _ X _ " + '!' +
			"_ O _ _" + '!' +
			" _ _ _ " + '!' +
			"O _ _ O",

			" _ X _ " + '!' +
			"_ _ _ _" + '!' +
			" O _ _ " + '!' +
			"O O _ _",

			" _ X _ " + '!' +
			"_ _ _ _" + '!' +
			" O _ _ " + '!' +
			"O _ O _",

			" _ X _ " + '!' +
			"_ _ _ _" + '!' +
			" O _ _ " + '!' +
			"O _ _ O",

			" _ X _ " + '!' +
			"_ _ _ _" + '!' +
			" O _ O " + '!' +
			"O _ _ O",

			" _ X _ " + '!' +
			"_ _ _ _" + '!' +
			" O _ O " + '!' +
			"O _ _ _",

			" _ X _ " + '!' +
			"_ _ _ _" + '!' +
			" O O _ " + '!' +
			"O _ _ _",

			" _ X _ " + '!' +
			"_ _ _ _" + '!' +
			" _ O _ " + '!' +
			"O O _ _",

			//Size: 3 - shift 1
			//"_ X _ " + '!' +
			//" _ _ _" + '!' +
			//"_ _ _ " + '!' +
			//" _ _ _",

			"_ X _ " + '!' +
			" _ _ _" + '!' +
			"_ _ _ " + '!' +
			" O _ _",

			"_ X _ " + '!' +
			" _ _ _" + '!' +
			"_ _ _ " + '!' +
			" _ O _",


			"_ X _ " + '!' +
			" _ _ _" + '!' +
			"_ _ _ " + '!' +
			" _ _ O",

			"_ X _ " + '!' +
			" _ _ _" + '!' +
			"_ _ _ " + '!' +
			" O O _",

			"_ X _ " + '!' +
			" _ _ _" + '!' +
			"_ _ _ " + '!' +
			" O _ O",

			"_ X _ " + '!' +
			" _ _ _" + '!' +
			"_ _ _ " + '!' +
			" _ O O",

			"_ X _ " + '!' +
			" O _ _" + '!' +
			"_ _ _ " + '!' +
			" O _ _",

			"_ X _ " + '!' +
			" O _ _" + '!' +
			"O _ _ " + '!' +
			" O _ _",

			"_ X _ " + '!' +
			" O _ _" + '!' +
			"_ _ _ " + '!' +
			" _ O _",

			"_ X _ " + '!' +
			" O _ _" + '!' +
			"O _ _ " + '!' +
			" _ O _",

			"_ X _ " + '!' +
			" O _ _" + '!' +
			"_ _ _ " + '!' +
			" _ _ O",

			"_ X _ " + '!' +
			" O _ _" + '!' +
			"O _ _ " + '!' +
			" _ _ O",

			"_ X _ " + '!' +
			" _ O _" + '!' +
			"_ _ _ " + '!' +
			" O _ _",

			"_ X _ " + '!' +
			" _ O _" + '!' +
			"_ _ O " + '!' +
			" O _ _",

			"_ X _ " + '!' +
			" _ O _" + '!' +
			"_ _ _ " + '!' +
			" _ O _",

			"_ X _ " + '!' +
			" _ O _" + '!' +
			"_ _ O " + '!' +
			" _ O _",

			"_ X _ " + '!' +
			" _ O _" + '!' +
			"_ _ O " + '!' +
			" _ _ O",

			"_ X _ " + '!' +
			" _ O _" + '!' +
			"_ _ O " + '!' +
			" _ O O",

			"_ X _ " + '!' +
			" _ O _" + '!' +
			"_ _ O " + '!' +
			" O _ O",

			//Size: 3 - shift 2
			//" X _ " + '!' +
			//"_ _ _" + '!' +
			//" _ _ " + '!' +
			//"_ _ _",

			" X _ " + '!' +
			"_ _ _" + '!' +
			" _ _ " + '!' +
			"O _ _",

			" X _ " + '!' +
			"_ _ _" + '!' +
			" _ _ " + '!' +
			"_ O _",

			" X _ " + '!' +
			"_ _ _" + '!' +
			" _ _ " + '!' +
			"_ _ O",

			" X _ " + '!' +
			"O _ _" + '!' +
			" _ _ " + '!' +
			"O _ _",

			" X _ " + '!' +
			"O _ _" + '!' +
			" _ _ " + '!' +
			"_ O _",

			" X _ " + '!' +
			"O _ _" + '!' +
			" _ _ " + '!' +
			"_ _ O",

			" X _ " + '!' +
			"_ _ _" + '!' +
			" _ O " + '!' +
			"_ _ O",

			" X _ " + '!' +
			"_ O _" + '!' +
			" _ O " + '!' +
			"_ _ O",

			" X _ " + '!' +
			"_ O _" + '!' +
			" _ _ " + '!' +
			"_ _ O",

			//Size: 3 - shift 3
			//"X _ " + '!' +
			//" _ _" + '!' +
			//"_ _ " + '!' +
			//" _ _",

			"X _ " + '!' +
			" _ _" + '!' +
			"_ _ " + '!' +
			" O _",

			"X _ " + '!' +
			" _ _" + '!' +
			"_ _ " + '!' +
			" _ O",

			"X _ " + '!' +
			" _ _" + '!' +
			"_ O " + '!' +
			" _ O"
		];


		for (var ip = 0; ip < patterns.length; ++ip)
		{
			var pattern = patterns[ip];
			var rows = pattern.split("!");
			var nbCol = rows[0].length;
			var nbRow = rows.length;
			var shift = nbRow * 2 - 1 - nbCol;
			var wx = (nbCol - shift - 1) / 2;
			var row = rows[0];
			var offset = (nbRow - shift + 1) % 2;
			var hash1 = 0;
			var hash2 = 0;

			if (nbRow < 2 || nbRow > 5 || shift < 0 || row[wx] !== "X")
				throw "Invalid pattern: " + pattern;

			for (var i = 0; i < nbCol; ++i)
			{
				var c = row[i];
				if (i !== wx)
				{
					if (i % 2 === offset)
					{
						if (c !== "_")
							throw "Invalid pattern: " + pattern;
					}
					else
					{
						if (c !== " ")
							throw "Invalid pattern: " + pattern;
					}
				}
			}

			for (var dy = 1; dy < nbRow; ++dy)
			{
				row = rows[dy];

				if (row.length !== nbCol)
					throw "Invalid pattern: " + pattern;

				offset = (nbRow - shift + dy + 1) % 2;

				for (var i = 0; i < nbCol; ++i)
				{
					var c = row[i];

					if (i % 2 === offset)
					{
						if (c === "O")
						{
							var dx = ((i - wx + dy) / 2) | 0;		// optimization : use integer
							hash1 += 1 << dx + dy * 5 - 5;
							hash2 += 1 << dy - dx + dy * 5 - 5;		// symmetry ( left <-> right)
						}
						else if (c !== "_")
							throw "Invalid pattern: " + pattern;
					}
					else
					{
						if (c !== " ")
							throw "Invalid pattern: " + pattern;
					}
				}
			}

			if (hash1 === 0)
				throw "Invalid pattern: " + pattern;

			var alt = hash1 !== hash2;

			if (shift !== 0)
			{
				hash1 += shift << 26;	// bits 26-28 : shift 
				hash2 += shift << 26;
				hash2 += 1 << 25;		// bit 25 : 0 = left side,  1 =right side
			}

			GameState.DictWolf[hash1] = nbRow - 1;

			if (alt)
				GameState.DictWolf[hash2] = nbRow - 1;
		}
	}
	// End Static Init




	static GetInitialGameState()
	{
		var gs = new GameState(0, Pos.GetPos(5, 0), [Pos.GetPos(0, 9), Pos.GetPos(2, 9), Pos.GetPos(4, 9), Pos.GetPos(6, 9), Pos.GetPos(8, 9)]);
		gs.status = GameStatus.NotFinished;
		return gs;
	}

	nbMoves: number;
	isWolf: boolean;
	wolf: Pos;
	sheep: Pos[];
	status: GameStatus;

	constructor(nbMoves: number, wolf: Pos, sheep: Pos[])
	{
		this.nbMoves = nbMoves;
		this.isWolf = nbMoves % 2 === 0;
		this.wolf = wolf;
		this.sheep = sheep;
		this.status = GameStatus.NotFinished; // Optimization ?  Add all properties in constructor. cf. http://msdn.microsoft.com/en-us/library/windows/apps/hh781219.aspx
	}

	public isGameOver(): boolean
	{
		return this.status !== GameStatus.NotFinished;
	}

	//public static MakeAndCheck(nbMoves: number, wolf: Pos, sheep: Pos[]): GameState
	//{
	//	if (sheep.length !== GameState.NB_SHEEP)
	//		throw "Invalid number of sheep!";

	//	if (!wolf.isValid)
	//		throw "Invalid starting state (invalid wolf position)";

	//	for (var i = 0; i < sheep.length; ++i)
	//	{
	//		var p = sheep[i];

	//		if (!p.isValid)
	//			throw "Invalid starting state : invalid sheep position " + p.toString();

	//		if (p === wolf)
	//			throw "Invalid starting state : wolf at same position than Sheep " + p.toString();
	//	}

	//	sheep.sort((a: Pos, b: Pos) => { return a.pval - b.pval; });

	//	for (var i = 0; i < this.NB_SHEEP - 1; ++i)
	//		if (sheep[i] === sheep[i + 1])
	//			throw "Invalid starting state : several sheep at same position " + sheep[i].toString();

	//	var gs = new GameState(nbMoves, wolf, sheep);
	//	gs.checkStatus();

	//	return gs;
	//}

	private makeNewGameStateWolf(wolf: Pos): GameState
	{
		return new GameState(this.nbMoves + 1, wolf, this.sheep);
	}

	private makeNewGameStateSheep(olds: Pos, news: Pos): GameState
	{
		var newSheep: Pos[] = [];
		var shift = false;
		var newspval = news.pval;
		var z = 0;

		for (var i = 0; i < GameState.NB_SHEEP; ++i)
		{
			var p = this.sheep[i]

			if (p === olds)
			{
				shift = true;
				continue;
			}

			if (shift && newspval < p.pval)
			{
				//newSheep.push(news);
				newSheep[z++] = news;
				shift = false;
			}

			//newSheep.push(p);
			newSheep[z++] = p;
		}

		if (shift)
			//newSheep.push(news);
			newSheep[z++] = news;

		//if (newSheep.length < 5)
		//	throw "Missing sheep";

		return new GameState(this.nbMoves + 1, this.wolf, newSheep);
	}

	public makePlayerMove(oldp: Pos, newp: Pos): GameState
	{
		var gs: GameState;

		if (this.isWolf)
			gs = this.makeNewGameStateWolf(newp);
		else
			gs = this.makeNewGameStateSheep(oldp, newp);

		gs.checkStatus();
		return gs;
	}


	public checkStatus(): void
	{
		this.status = this.getStatus();
	}

	private getStatus(): GameStatus
	{
		if (this.wolfHasWon())
			return GameStatus.WolfWon;

		var list = this.play();
		if (list.length === 0)
			return this.isWolf ? GameStatus.SheepWon : GameStatus.WolfWon;

		return GameStatus.NotFinished;
	}

	public getValidMoves(selected: Pos): Pos[]
	{
		if (this.isWolf)
			return this.getValidWolfMoves();
		else
			return this.getValidSheepMoves(selected);
	}

	private getValidWolfMoves(): Pos[]
	{
		var list: Pos[] = [];
		var moves = this.wolf.getWolfMoves();
		var i = 0;

		for (var i = 0; i < moves.length; ++i)
		{
			var p = moves[i];
			var ok = true;

			for (var j = 0; j < this.sheep.length; ++j)
			{
				var s = this.sheep[j];

				if (p === s)
				{
					ok = false;
					break;
				}
			}

			if (ok)
				list.push(p);
		}

		return list;
	}

	private getValidSheepMoves(selected: Pos): Pos[]
	{
		var list: Pos[] = [];
		var moves = selected.getSheepMoves();

		for (var i = 0; i < moves.length; ++i)
		{
			var p = moves[i];

			if (p === this.wolf)
				continue;

			var ok = true;

			for (var j = 0; j < this.sheep.length; ++j)
			{
				var s = this.sheep[j];

				if (p === s)
				{
					ok = false;
					break;
				}
			}

			if (ok)
				list.push(p);

		}

		return list;
	}

	public wolfHasWon(): boolean
	{
		return this.wolf.y >= this.sheep[0].y;
	}

	public wolfWillWin(): boolean
	{
		if (this.wolfHasWon())
			return true;

		var wy = this.wolf.y;

		if (this.sheep[0].y - wy > 4)	// if lowest sheep is more than 4 row below wolf : skip test
			return false;

		var wx = this.wolf.x;

		var hash = 0;
		var dyMax = 0;

		for (var i = 0; i < this.sheep.length; ++i)
		{
			var p = this.sheep[i];
			var dy = p.y - wy;

			if (dy <= 0)
				break;		// sheep is same row or above wolf : break is OK because remaining sheep are same or above.

			var dx = ((p.x - wx + dy) / 2) | 0;	// optimization "| 0" is only here to tell browser that dx is an integer. integer div is faster than float div and also integer allocation is faster than float.  

			if (dx < 0 || dx > dy)
				continue;

			if (dy > dyMax)
				dyMax = dy;

			hash += 1 << dx + dy * 5 - 5;
		}

		if (hash === 0)
			return true;

		if (dyMax > wx)
			hash += dyMax - wx << 26;	// shift << 26
		else if (wx + dyMax > 9)
			hash += (1 << 25) + (wx + dyMax - 9 << 26);		// 1 << 25 + shift << 26

		return GameState.DictWolf[hash] !== undefined;
	}

	public play(): GameState[]
	{
		var S0 = this.sheep[0];
		var S1 = this.sheep[1];
		var S2 = this.sheep[2];
		var S3 = this.sheep[3];
		var S4 = this.sheep[4];

		var i, j;
		var p: Pos;
		var moves: Pos[];
		var list: GameState[] = [];
		var z = 0;

		if (this.isWolf)
		{
			moves = this.wolf.getWolfMoves();

			for (i = 0; i < moves.length; ++i)
			{
				p = moves[i];
				if (p !== S0 && p !== S1 && p !== S2 && p !== S3 && p !== S4)
					//list.push(this.makeNewGameStateWolf(p));
					list[z++] = this.makeNewGameStateWolf(p);
			}
		}
		else
		{

			var wx = this.wolf.x;

			for (i = 0; i < this.sheep.length; ++i)
			{
				var olds = this.sheep[i];
				var x = olds.x;
				var y = olds.y;

				if (y === 0)
					continue;

				if (x > wx)
				{
					p = Pos.GetPos(x - 1, y - 1);
				}
				else
				{
					if (x === 9)
						continue;

					p = Pos.GetPos(x + 1, y - 1);
				}

				if (p === this.wolf || p === S0 || p === S1 || p === S2 || p === S3 || p === S4)
					continue;

				//list.push(this.makeNewGameStateSheep(olds, p));
				list[z++] = this.makeNewGameStateSheep(olds, p);
			}


			for (i = 0; i < this.sheep.length; ++i)
			{
				var olds = this.sheep[i];
				var x = olds.x;
				var y = olds.y;

				if (y === 0)
					continue;

				if (x > wx)
				{
					if (x === 9)
						continue;

					p = Pos.GetPos(x + 1, y - 1);
				}
				else
				{
					if (x === 0)
						continue;

					p = Pos.GetPos(x - 1, y - 1);
				}

				if (p === this.wolf || p === S0 || p === S1 || p === S2 || p === S3 || p === S4)
					continue;

				//list.push(this.makeNewGameStateSheep(olds, p));
				list[z++] = this.makeNewGameStateSheep(olds, p);
			}
		}

		return list;
	}

	public getNegamaxScore(wolfWon: boolean): number
	{
		return this.isWolf === wolfWon ? 1000 - this.nbMoves : -1000 + this.nbMoves;
	}

	public getNegamaxScoreLost(): number
	{
		return -1000 + this.nbMoves;
	}

	public getNegamaxScoreWin(): number
	{
		return 1000 - this.nbMoves;
	}

	public getHashSheep(): number
	{
		return this.sheep[0].pval | this.sheep[1].pval << 6 | this.sheep[2].pval << 12 | this.sheep[3].pval << 18 | this.sheep[4].pval << 24;
	}
}