Pilot = function(game, x, y, key, shooter, timeStart, isArmed, isInteligent, player, frame) {

    Phaser.Sprite.call(this, game, x, y, key, frame);
    game.add.existing(this);
    this.forget = [];
    this.anchor.setTo(0.5, 0.5);
    this.scale.setTo(0.20);
    this.scale.x *= -1;
    this.player = player;
    this.animations.add('run', [1, 2]);
    this.animations.add('die', [0]);
    this.animations.add('shoot', [3, 4, 5, 6, 7]);
    this.shootRecall = game.time.now;
    if (isArmed) this.animations.play('shoot', 18, true);
    else this.animations.play('run', 18, true);

    this.game.physics.arcade.enableBody(this);
    this.body.collideWorldBounds = true;
    this.body.allowGravity = false;
    this.upsidedown = false;
    this.vel = -(Math.random() * 107);
    this.life = 1 + JustRun.Game.difficulty;

    this.dead = false;

    this.update = function() {
        let ratio = Math.pow(2.0, -10 * (this.game.width - this.x) / this.game.width);
        let velocity = (ratio * this.vel * 10) - (5 * JustRun.Game.difficulty);
        this.body.velocity.x = velocity;
        if (isArmed && this.shootRecall <= game.time.now) {
            shooter.shootBullet(this);
            this.shootRecall = game.time.now + 2200;
        }
        if (this.body.x < 130 && !this.dead) {
            this.dead = true;
            player.life -= 3;
            this.destroy();
        }

        //[AI] Calculate a random number for upsidedown flying 
        if (!this.dead && isInteligent) {
            let random = Math.floor(Math.random() * 1000);
            if (random == 999 && !this.upsidedown) {
                this.scale.y *= -1;
                this.upsidedown = true
            } else if (this.upsidedown && random < 5) {
                this.scale.y *= -1;
                this.upsidedown = false
            }
            if (random > 990) {
                this.goToLane([0, 5][Math.floor(Math.random() * 2)])

            }
            /* [AI] Iterate every fireball, if a fireball it's going to hit the Pilot, the Pilot moves away.
                The screen is divided in 10 parts; if Pilot is on the top 3 row goes down. if it is on the bottom 2 it goes up,
                if it is in the middle 5 it goes half of the time up and half of the time down.
                Then Pilot "forget" that fireball so it won't be trying again to avoid it.
                The velocity with which Pilot avoid fireball is randomized to give a more realistic user experience.
            */
            shooter.fireballs.children.filter((fireball) => fireball.body.x < this.body.x && !this.forget.includes(fireball)).forEach((fireball) => {
                this.forget.filter(fireball => fireball.x > this.game.width).forEach(fireball => fireball.destroy());
                let whereIam = 10 - Math.floor(this.body.y / ((this.game.height - 200) / 10));
                if (whereIam < 0) whereIam = 0;
                if (this.body.x - fireball.body.x < 400 + (this.vel / 10) && (Math.abs(this.body.y - fireball.body.y) < 100)) {
                    this.forget.push(fireball);
                    if (whereIam > 8) n = 0
                    else if (whereIam < 2) n = 5;
                    else n = [0, 5][Math.floor(Math.random() * 2)]
                    setTimeout(this.goToLane(n), 600 + Math.random() * 600);
                }
            })


        }
    }


    this.goToLane = function(lane) {
        let y = this.game.height - (130 + (this.game.height / 5 * lane))

        game.physics.arcade.moveToXY(this, this.x, y, 1400);

    }

    this.die = function() {
        /* Removes a life from Pilot, if Pilot has 0 life it die
           Otherwise it flash red and change sprite to a broken airplane
        */
        if (!isArmed) this.animations.play("die", false);
        this.body.velocity.x *= 0.3;
        this.life--;
        if (this.life < 1) {
            this.body.velocity.x = 0;
            this.body.velocity.y = 400;
            this.rotation += 2;
            this.tint = 0xF42336;
            this.body.collideWorldBounds = false;
            this.dead = true;
        } else {
            let normalTint = this.tint;
            this.tint = 0xF42336;
            setTimeout(() => this.tint = normalTint, 300)
        }

    }


    //    This function has been taken from https://github.com/AlmasB/
    this.bounce = function(ratio) {
        if (ratio < 1 / 2.75) {
            return 7.5625 * ratio * ratio
        } else if (ratio < 2 / 2.75) {
            let r = ratio - 1.5 / 2.75
            return 7.5625 * r * r + 0.75
        } else if (ratio < 2.5 / 2.75) {
            let r = ratio - 2.25 / 2.75
            return 7.5625 * r * r + 0.9375
        } else {
            let r = ratio - 2.625 / 2.75
            return 7.5625 * r * r + 0.984375
        }
    }



};

Pilot.prototype = Object.create(Phaser.Sprite.prototype);
Pilot.prototype.constructor = Pilot;