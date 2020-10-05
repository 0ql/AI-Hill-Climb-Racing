class Agent {
	constructor(i) {
		this.isTouchingGround = false; // back Weel
		this.alive = true;
		this.index = i;
	}

	addToWorld() {
		this.rect = Bodies.rectangle(300, 300, 100, 40, {
			id: this.index * 3,
			collisionFilter: {
				group: -1
			},
		});
		this.circle = Bodies.circle(260, 320, 20, {
			id: this.index * 3 + 1,
			friction: 1,
			collisionFilter: {
				group: -1
			}
		});
		this.circle2 = Bodies.circle(340, 320, 20, {
			id: this.index * 3 + 2,
			friction: 1,
			collisionFilter: {
				group: -1
			}
		});
		this.constr1 = Matter.Constraint.create({
			bodyA: this.rect,
			pointA: { x: -40, y: 20 }, // offset!
			bodyB: this.circle,
			stiffness: 1,
			length: 0
		});
		this.constr2 = Matter.Constraint.create({
			bodyA: this.rect,
			pointA: { x: 40, y: 20 },
			bodyB: this.circle2,
			stiffness: 1,
			length: 0
		})

		World.add(world, [
			this.rect, this.circle, this.circle2, this.constr1, this.constr2
		]);
	}

	run() {
		if (this.alive) {
			if (this.rect.position.x < 0 || this.rect.position.x > 11500 || this.rect.position.y > 1000) { this.kill(); } else {
				var vertex1 = verticies[Math.round((this.rect.position.x - 250) / 200) + 3];
				var vertex2 = verticies[Math.round((this.rect.position.x - 250) / 200) + 4];
				var m = (vertex1.y - vertex2.y) / (vertex2.x - vertex1.x);
				var output = neat.population[this.index].activate([this.rect.speed / 100, Math.sin(this.rect.angle), this.isTouchingGround, m]);
				if (output[0] > 0.5 && this.circle.angularVelocity < 1.5) Matter.Body.setAngularVelocity(this.circle, this.circle.angularVelocity += 0.2);
				if (output[1] > 0.5 && this.circle.angularVelocity > -1.5) Matter.Body.setAngularVelocity(this.circle, this.circle.angularVelocity -= 0.2);
			}
		}
	}

	kill() {
		if (this.alive) {
			neat.population[this.index].score = this.rect.position.x;
			scoresThisRound.push(this.rect.position.x);
			this.alive = false;
			World.remove(world, [
				this.rect, this.circle, this.circle2, this.constr1, this.constr2
			]);
			agentsAlive--;
		}
	}
}