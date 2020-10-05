const POPSIZE = 100,
	WINDOWWIDTH = 400,
	WINDOWHEIGHT = 300,
	TIMER = 1500,
	MUTATIONRATE = 0.2,
	nt = neataptic,
	neat = new nt.Neat(4, 2, null, {
		mutation: nt.methods.mutation.ALL,
		popsize: POPSIZE,
		mutationRate: MUTATIONRATE,
		elitism: 0
	}),
	genTag = document.getElementById('gens'),
	aliveTag = document.getElementById('alive'),
	lastScoreTag = document.getElementById('lastScore'),
	timerTag = document.getElementById('timer');

var Engine = Matter.Engine,
	Render = Matter.Render,
	World = Matter.World,
	Runner = Matter.Runner,
	Bodies = Matter.Bodies,
	agents = [],
	agentsAlive = POPSIZE,
	gens = 0,
	timer = 0,
	avarageScores = [],
	scoresThisRound = [],
	engine = Engine.create(),
	world = engine.world,
	render = Render.create({
		element: document.getElementById('main'),
		engine: engine,
		options: {
			width: 800,
			height: 400,
			showAngleIndicator: true,
			wireframes: false
			// showCollisions: true
		}
	});

Render.run(render);

var runner = Runner.create();
Runner.run(runner, engine);

var mouse = Matter.Mouse.create(render.canvas),
	mouseConstraint = Matter.MouseConstraint.create(engine, {
		mouse: mouse,
		constraint: {
			stiffness: 0.2,
			render: {
				visible: false
			}
		}
	});

Matter.World.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;

function initPOP() {
	agents = [];
	for (var i = 0; i < POPSIZE; i++) {
		agents.push(new Agent(i));
		agents[i].addToWorld();
	}
}

function drawPlots() {
	var data = [{
			x: avarageScores.length,
			y: avarageScores,
			type: 'bar'}
	];
	var layout = {
		title: "Durschnittliche Punktzahl",
		xaxis: { title: "Generation" },
		yaxis: { title: "Punktzahl" }
	}

	Plotly.newPlot('chart', data, layout);

	var data = {
		x: scoresThisRound,
		type: 'histogram',
	};
	var layout = {
		title: "Punktzahl der Agenten der letzten Generation",
		xaxis: { title: "Erreichte Punktzahl" },
		yaxis: { title: "Anzahl der Agenten" }
	}
	Plotly.newPlot('chart2', [data], layout);
}

function reset() {
	agentsAlive = POPSIZE;
	timer = 0;
	gens++;
	scoresThisRound = [];
	lastScoreTag.innerHTML = "Durchschnitt letzter Generation: " + Math.round(avarageScores[avarageScores.length - 1]);
	genTag.innerHTML = "Generation: " + gens;
}