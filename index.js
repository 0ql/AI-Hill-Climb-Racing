initPOP();
drawPlots();

var terrain = Bodies.fromVertices(6000, 600, [verticies], {
	id: -1,
	isStatic: true
});
World.add(world, terrain);

document.getElementById('mutationRate').innerHTML = 'Mutation rate: '+MUTATIONRATE*100+"%";

// Main Loop
Matter.Events.on(engine, "beforeUpdate", () => {
	genTag.innerHTML = "Generation: " + gens;
	aliveTag.innerHTML = "Alive: " + agentsAlive + " von " + POPSIZE;
	timerTag.innerHTML = "Timer: "+(TIMER-timer);

	if (agentsAlive > 0 && timer < TIMER) { 
		var bestAgent = agents[0];
		agents.forEach(Agent => {
			Agent.run();
			if (Agent.rect.position.x > bestAgent.rect.position.x && Agent.alive) {
				bestAgent = Agent;
			}
		});
		Matter.Render.lookAt(render, bestAgent.rect, { x: 400, y: 200 });
		timer++;

	} else {
		agents.forEach(Agent => {
			Agent.kill();
		});
		avarageScores.push(neat.getAverage());
		drawPlots();

		neat.evolve();
		initPOP();
		reset();
	}
});

Matter.Events.on(engine, 'collisionStart', (event) => {
	event.pairs.forEach((collision) => {
		agents.forEach(Agent => {
			if (collision.bodyB.id == Agent.rect.id) {
				Agent.kill();
			} else if (collision.bodyB.id === Agent.circle.id) {
				Agent.isTouchingGround = !Agent.isTouchingGround;
			}
		});
	});
});

Matter.Events.on(engine, 'collisionEnd', (event) => {
	event.pairs.forEach((collision) => {
		agents.forEach(Agent => {
			if (collision.bodyB.id === Agent.circle.id) {
				Agent.isTouchingGround = !Agent.isTouchingGround;
			}
		});
	});
});
