Dog = function(game, x, y, key, frame) {

    Phaser.Sprite.call(this, game, x, y, key, frame);
    game.add.existing(this);
    this.isAuto = false;
    this.scale.setTo(0.15);
    this.anchor.setTo(0.5);
    this.animations.add('run', [8, 9, 10, 11, 12, 13, 14, 15, 16]);
    this.animations.play('run', 18, true);
    this.game.physics.arcade.enableBody(this);
    this.body.collideWorldBounds = true;
    this.animations.add('jump', [0, 1, 2, 3, 4, 5, 6, 7]);
    this.body.gravity.y =6400;

    this.play = function() {
        if (this.isAuto) {
            JustRun.Game.fireballs.children.filter((fireball) => fireball.body.x - this.body.x > 0).map((fireball) => {

                if (fireball.body.x - this.body.x < 200 && fireball.body.y > this.game.height - 73 - 130) {
                    if (this.body.touching.down) {
                        this.animations.play('jump');
                        this.body.velocity.y = -1600;

                    }
                }
            })
        }
        if (!this.isAuto) {
            if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {

                if (this.body.touching.down) {
                    this.animations.play('jump');
                    this.body.velocity.y = -1600;

                }
            }
        }

    }

};

Dog.prototype = Object.create(Phaser.Sprite.prototype);
Dog.prototype.constructor = Dog;