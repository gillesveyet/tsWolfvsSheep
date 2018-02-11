/// <reference path="Helper.ts" />
/// <reference path="Pos.ts" />
/// <reference path="GameState.ts" />

enum Color
{
	Black,
	Aqua,
}


class CheckerPanel
{
	public onPreloadDone: () => void;
	public onGetValidMoves: (selected: Pos) => Pos[];
	public onMovePiece: (oldPos: Pos, newPos: Pos) => void;

	private gameState: GameState;
	private isPlayEnabled: boolean;
	private selectedPiece: Pos = null;
	private validMoves: Pos[] = null;

	private canvas: HTMLCanvasElement
	private ctx: CanvasRenderingContext2D;
	private XMAG: number;
	private YMAG: number;

	private imgChecker = new Image();
	private imgWolf = new Image();
	private imgSheep = new Image();

	private preloadCount = 0;
    //private PRELOAD_TOTAL = 2;
    private PRELOAD_TOTAL = 3;

	constructor(canvas: HTMLCanvasElement)
	{
		this.canvas = canvas;
		//this.canvas.onclick = this.canvas_MouseClick.bind(this);
		this.canvas.onclick = (ev: MouseEvent) =>
		{
			//cf. http://miloq.blogspot.co.uk/2011/05/coordinates-mouse-click-canvas.html
			//console.log("canvas_onclick - ev:" + " (" + ev.clientX + "," + ev.clientY + ")");
			console.log(Helper.StringFormat("canvas_onclick ev:{0} x={1} y={2} clientX={3} clientY={4} pageXOffset={5} pageYOffset={6} canvas.scrollLeft={7} canvas.scrollTop={8} canvas.offsetLeft={9} canvas.offsetTop={10}", ev, ev.x, ev.y, ev.clientX, ev.clientY, window.pageXOffset, window.pageYOffset, canvas.scrollLeft, canvas.scrollTop, canvas.offsetLeft, canvas.offsetTop));
			this.canvas_MouseClick((ev.clientX - canvas.offsetLeft + window.pageXOffset) / this.XMAG | 0, (ev.clientY - canvas.offsetTop + window.pageYOffset) / this.YMAG | 0);
		};

		if (!this.canvas.getContext)
			throw "Browser does not support Canvas";
	}

	private initCanvas()
	{
		this.ctx = this.canvas.getContext('2d');
		this.XMAG = this.canvas.width / 10;
		this.YMAG = this.canvas.height / 10;
	}

	preloadAssets(): void
	{
		this.loadImage(this.imgChecker, 'media/Checker.png');
		this.loadImage(this.imgWolf, 'media/Black.png');
		this.loadImage(this.imgSheep, 'media/White.png');
	}

	private loadImage(img: HTMLImageElement, src: string)
	{
		img.onload = this.preloadUpdate.bind(this);
		img.src = src;
	}

	private preloadUpdate()
	{
		++this.preloadCount;

		if (this.preloadCount === this.PRELOAD_TOTAL)
		{
			this.resizeCanvas();
			this.initCanvas();

			if (this.onPreloadDone)
				this.onPreloadDone();
		}
	}

	private resizeCanvas()
	{
		console.log(Helper.StringFormat("Screen width={0} height={1} ", screen.width, screen.height));
		console.log(Helper.StringFormat("Windows innerWidth={0} innerHeight={1} ", window.innerWidth, window.innerHeight));

		//Firefox 29 Mobile with <meta name="viewport" content="width=device-width, initial-scale=1">
		// screen width:360 height:640
		// windows innerWidth:198 innerHeight:312 

		//Firefox 29 Mobile without "viewport"
		// screen width:360 height:640
		// windows innerWidth:360 innerHeight:615

		if (window.innerWidth >= 600 && window.innerHeight >= 600)	// if not a smartphone (small screen) : do not resize.
			return;

		if (window.innerWidth < 100 || window.innerHeight < 100)	// do nothing if size of too small or invalid. Note, on my Atrix, I sometimes have innerWidth=0 and innerHeight=0
			return;

		var siz = ((Math.min(window.innerWidth, window.innerHeight) - 10) / 10 | 0) * 10;

		console.log(Helper.StringFormat("Resize Canvas:{0}", siz));

		this.canvas.width = siz;
		this.canvas.height = siz;
	}

	SetPositions(gs: GameState, enablePlay: boolean): void
	{
		this.selectedPiece = null;
		this.validMoves = null;

		this.isPlayEnabled = enablePlay;
		this.gameState = gs;

		if (enablePlay && gs != null && gs.isWolf)
			this.updateSelected(gs.wolf, false);

		this.onPaint();
	}

    /*
    // old wait layer : centered
	ShowWaitLayer()
	{
		var text = "Wait...";
		var fontSize = this.canvas.height / 8;

		this.ctx.font = fontSize + "px Verdana";
		var width = this.ctx.measureText(text).width;

		var x = (this.canvas.width - width) / 2;
		var y = (this.canvas.height-fontSize) / 2;

		this.ctx.fillStyle = "rgba(160, 160, 160, 0.85)";
		this.ctx.fillRect(x - fontSize/2, y- fontSize/2.5, width + fontSize, fontSize*2);

		this.ctx.textBaseline = "top";
		this.ctx.fillStyle = "#FF0066";
		this.ctx.fillText(text, x , y);
	}
*/

    // new wait layer: bottom left
    ShowWaitLayer()
    {
        var text = "Please wait...";
        var fontSize = this.canvas.height / 20;

        this.ctx.font = fontSize + "px Verdana";
        var width = this.ctx.measureText(text).width;

        this.ctx.fillStyle = "rgba(160, 160, 160, 0.7)";
        this.ctx.fillRect(0, this.canvas.height-2*fontSize, width + fontSize, fontSize*2);

        this.ctx.textBaseline = "bottom";
        this.ctx.fillStyle = "#FF0066";
        this.ctx.fillText(text, fontSize/2 , this.canvas.height-fontSize/2);
    }


	private onPaint(): void
	{
		this.ctx.drawImage(this.imgChecker, 0, 0, this.canvas.width, this.canvas.height);
		//this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		if (!this.gameState)
			return;


		this.drawSquare(this.imgWolf, this.gameState.wolf.x, this.gameState.wolf.y);

		for (var i = 0; i < this.gameState.sheep.length; ++i)
		{
			var ps = this.gameState.sheep[i];
			this.drawSquare(this.imgSheep, ps.x, ps.y);
		}


		// To check if order of sheep position is correct
		// if (IsExpertMode)
		// {
		// 	this.ctx.textAlign = "left";
		// 	this.ctx.textBaseline = "top";
		// 	this.ctx.strokeStyle = Color[Color.Black];
		// 	this.ctx.lineWidth = 1;
        //
		// 	for (var i = 0; i < this.gameState.sheep.length; ++i)
		// 	{
		// 		var p = this.gameState.sheep[i];
		// 		this.ctx.strokeText((i + 1).toString(), p.x * this.XMAG + 2, p.y * this.YMAG + 2);
		// 	}
		// }

		if (this.selectedPiece !== null)
			this.drawSelected(this.selectedPiece, Color.Black);

		if (this.validMoves !== null)
			for (var i = 0; i < this.validMoves.length; ++i)
			{
				var p = this.validMoves[i]
				this.drawSelected(p, Color.Aqua);
			}
	}

	private drawSquare(image: HTMLImageElement, x: number, y: number)
	{
		this.ctx.drawImage(image, x * this.XMAG, y * this.YMAG, this.XMAG, this.YMAG);
	}

	private drawSelected(p: Pos, color: Color): void
	{
		this.ctx.lineWidth = 2;
		this.ctx.strokeStyle = Color[color];
		this.ctx.strokeRect(p.x * this.XMAG, p.y * this.YMAG, this.XMAG, this.YMAG);
	}


	private updateSelected(selected: Pos, refresh: boolean): void
	{
		if (this.selectedPiece === null && selected === null)
			return;

		if (selected !== null && this.selectedPiece !== null && selected === this.selectedPiece)
		{
			//click on selected piece
			//  -wolf : do nothing
			//  -sheep : unselect
			if (this.gameState.isWolf)
				return;

			this.selectedPiece = null;
		}
		else
			this.selectedPiece = selected;

		if (this.selectedPiece !== null)
		{
			if (this.onGetValidMoves)
				this.validMoves = this.onGetValidMoves(this.selectedPiece)
		}
		else
			this.validMoves = null;

		if (refresh)
			this.onPaint();
	}

	private isSelectedValid(selected: Pos): boolean
	{
		if (!selected.isValid)
			return false;

		if (this.gameState.isWolf)
			return this.gameState.wolf === selected;
		else
		{
			for (var i = 0; i < this.gameState.sheep.length; ++i)
			{
				var p = this.gameState.sheep[i];
				if (p === selected)
					return true;
			}

			return false;
		}
	}

	private isMoveValid(selected: Pos): boolean
	{
		//console.log("isMoveValid 1 : selected:" + selected + " this.validMoves:" + this.validMoves);

		if (this.validMoves === null)
			return false;

		for (var i = 0; i < this.validMoves.length; ++i)
		{
			var p = this.validMoves[i]

			if (p === selected)
				return true;
		}

		return false;
	}

	private canvas_MouseClick(x: number, y: number)
	{
		if (!this.isPlayEnabled)
			return;

		if (x >= 10 || y >= 10)
			return;

		var p = Pos.GetPos(x, y);

		console.log("canvas_MouseClick - x=" + x + " y=" + y + " p=" + p + " this.Selected=" + this.selectedPiece); // + " - onMovePiece: " + this.onMovePiece);

		if (this.isSelectedValid(p))
			this.updateSelected(p, true);
		else if (this.selectedPiece !== null && this.isMoveValid(p) && this.onMovePiece)
			this.onMovePiece(this.selectedPiece, p);
	}
}

