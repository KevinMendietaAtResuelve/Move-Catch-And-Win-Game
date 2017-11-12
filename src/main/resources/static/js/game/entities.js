import Entity, {Trait} from "./Entity.js";
import Go from "./traits/Go.js";
import Jump from "./traits/Jump.js";
import {loadSpriteSheet} from "./loaders.js";
import {createAnimation} from "./animation.js";

export function createPlayer() {
	return loadSpriteSheet("player")
	.then((sprites) => {
		const player = new Entity();
		player.name = "local";
		player.pos.set(45, 45);
		player.size.set(12, 16);
		player.vel.set(0, 0);

		player.addTrait(new Go());
		player.addTrait(new Jump());

		const  runAnimation = createAnimation(["run_1", "run_2"], 10);
		function routeFrame(player) {
			var animation = "quiet";
			if (!player.jump.ready) {
				animation = "jump";
			} else if (player.go.dir !== 0) {
				animation = runAnimation(player.go.distance);
			}
			player.anim = animation;
			return animation;
		}

		player.draw = function drawPlayer(context) {
			sprites.draw(routeFrame(this), context, this.pos.x, this.pos.y, this.go.heading < 0);
		};

		return player;
	});
}

export function createOnlinePlayer(number) {
	return loadSpriteSheet("player" + number)
	.then((sprites) => {
		const player = new Entity();
		player.name = "online";
		player.pos.set(45, 45);
		player.anim = "quiet";
		player.heading = false;

		player.update = function updateProxy(deltaTime) {};

		player.updateOnline = function updateOnlinePlayer(eventMessage) {
			const content = JSON.parse(eventMessage.body);
			player.pos.set(content.x, content.y);
			player.anim = content.anim;
			player.heading = content.heading;
		};

		player.draw = function drawPlayer(context) {
			sprites.draw(this.anim, context, this.pos.x, this.pos.y, this.heading);
		};

		return player;
	});
}