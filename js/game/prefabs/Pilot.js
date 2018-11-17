Pilot = function(game, x, y, key, frame) {

    Phaser.Sprite.call(this, game, x, y, key, frame);
    game.add.existing(this);
    this.isAuto = true;
    this.scale.setTo(0.24);
    this.animations.add('run');
    this.animations.play('run', 18, true);
    this.game.physics.arcade.enableBody(this);
    this.isAuto=true;
    this.body.collideWorldBounds = true;
    this.body.allowGravity = false;

    game.physics.arcade.gravity.y = 0;
    this.play = function() {
        if (this.isAuto) {
            let whereIam = 4 - Math.floor(this.body.y / ((this.game.height - 200) / 5));
            if (whereIam < 0) whereIam = 0;
            
            JustRun.Game.fireballs.children.filter((fireball) => fireball.body.x - this.body.x > 0).map((fireball) => {
                if (fireball.body.x - this.body.x < 400 && fireball.lane === whereIam) {
                    
                    if (fireball.lane >= 2)
                        n= 0
                    else 
                        n = 4;

                    setTimeout(this.goToLane(n), 1000);
                    
                }


            })

        } else if (!this.isAuto) {
            
            if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {

                this.body.velocity.y = -355;

            }
        }

    }

    this.goToLane = function(lane) {
        let y = this.game.height - (130 + (this.game.height / 5 * lane))
        game.physics.arcade.moveToXY(this, 300, y, 400);

    }
    
    this.setAuto=function (isAuto){
        if(isAuto){
            this.body.allowGravity = false;
                    this.isAuto=isAuto;

        }else{
            this.body.allowGravity = true;
            this.body.gravity.y=850;
                                this.isAuto=isAuto;

        }
        
    }

};

Pilot.prototype = Object.create(Phaser.Sprite.prototype);
Pilot.prototype.constructor = Pilot;