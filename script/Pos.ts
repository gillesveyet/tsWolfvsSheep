/// <reference path="Helper.ts" />

// 0 --------> X
// |
// !
// Y

/// <summary>
/// Byte value from position.
/// 
///   49  48  47  46  45 
/// 40  41  42  43  44
/// .....................
/// .....................
/// .....................
/// 20  21  22  23  24
///   19  18  17  16  15
/// 10  11  12  13  14
///    9   8   7   6   5
///  0   1   2   3   4 
/// 
/// Sheep start pos are 0,1,2,3,4
/// Wolf start pos is 47

class Pos
{
	private static _allPos: Pos[][] = [];

	private static Ctor = (() =>
	{
		Pos.Init();
	})();

	static Init(): void
	{
		for (let x = 0; x < 10; ++x)
		{
			Pos._allPos[x] = [];

			for (let y = 0; y < 10; ++y)
				Pos._allPos[x][y] = new Pos(x, y);
		}
	}

	static GetPos(x: number, y: number)
	{
		return Pos._allPos[x][y];
	}

	x: number;
	y: number;
	pval: number;

	constructor(x: number, y: number)
	{
		this.x = x;
		this.y = y;

		let n = (9 - this.y) * 5;

		if (this.y % 2 === 0)
			n += 4 - (this.x / 2 | 0);
		else
			n += (this.x / 2 | 0);

		this.pval = n;
	}


	isValid(): boolean
	{
		return this.x >= 0 && this.x < 5 && this.y >= 0 && this.y < 5 && (this.x + this.y) % 2 !== 0;
	}

	//compareTo(other: Pos)
	//{
	//	return this.pval - other.pval;
	//}

	//equals(other: Pos): boolean
	//{
	//	return this === other;
	//}

	toString()
	{
		return Helper.StringFormat("({0},{1})", this.x, this.y);
	}

	getWolfMoves(): Pos[]
	{
		let x = this.x;
		let y = this.y;
		let result: Pos[] = [];

		let z = 0;
		//Can omit check Y < 9 because it would mean that wolf has already win. 
		//if (Y < 9)
		//{

		if (y % 2 === 0)
		{
			if (x < 9)
				//result.push(Pos.GetPos(x + 1, y + 1));
				result[z++] = Pos.GetPos(x + 1, y + 1);

			if (x > 0)
				//result.push(Pos.GetPos(x - 1, y + 1));
				result[z++] = Pos.GetPos(x - 1, y + 1);
		}
		else
		{
			//same moves as above but in different order : so that wolf try to remain in center position (X = 4 or x=5)
			if (x > 0)
				//result.push(Pos.GetPos(x - 1, y + 1));
				result[z++] = Pos.GetPos(x - 1, y + 1);

			if (x < 9)
				//result.push(Pos.GetPos(x + 1, y + 1));
				result[z++] = Pos.GetPos(x + 1, y + 1);
		}

		//}

		if (y > 0)
		{
			if (x < 9)
				//result.push(Pos.GetPos(x + 1, y - 1));
				result[z++] = Pos.GetPos(x + 1, y - 1);

			if (x > 0)
				//result.push(Pos.GetPos(x - 1, y - 1));
				result[z++] = Pos.GetPos(x - 1, y - 1);
		}

		return result;
	}

	getSheepMoves(): Pos[]
	{
		let x = this.x;
		let y = this.y;
		let result: Pos[] = [];
		let z = 0;

		if (y > 0)
		{
			if (y % 2 === 0)
			{
				if (x > 0)
					//result.push(Pos.GetPos(x - 1, y - 1));
					result[z++] = Pos.GetPos(x - 1, y - 1);

				if (x < 9)
					//result.push(Pos.GetPos(x + 1, y - 1));
					result[z++] = Pos.GetPos(x + 1, y - 1);
			}
			else
			{
				//same moves as above but in different order : so that sheep do not leave hole
				if (x < 9)
					//result.push(Pos.GetPos(x + 1, y - 1));
					result[z++] = Pos.GetPos(x + 1, y - 1);


				if (x > 0)
					//result.push(Pos.GetPos(x - 1, y - 1));
					result[z++] = Pos.GetPos(x - 1, y - 1);
			}
		}

		return result;
	}
}
