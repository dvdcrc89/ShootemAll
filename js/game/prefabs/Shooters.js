Shooters = function(game) {
    this.game = game;
    this.fireballs = game.add.group();
    this.isReady = true;
    this.fireballTime = game.time.now;
    
    this.upgradeLevel = 0;
    this.upgrade= {
        shots:[{
            velX: -900,
            velY: 0,
            size: 0.3
            }
            ],
        shootRecall:500
    };
    this.shoot= function (x,y){
        if(game.time.now > this.fireballTime){

        this.upgrade.shots.forEach(shot=>{
            let fireball = this.game.add.sprite(x, y, 'fireball');
            fireball.animations.add('shoot', [0, 1, 2, 3]);
            fireball.animations.play('shoot', 18, true);
            fireball.scale.setTo(shot.size);
            game.physics.arcade.enableBody(fireball);
            fireball.body.velocity.x = shot.velX;
            fireball.body.velocity.y = shot.velY
            fireball.body.allowGravity = false;
            fireball.outOfBoundsKill = true;
            fireball.update=function(){
                if(shot.rotation) fireball.rotation+=shot.rotation;
            }
            game.physics.enable(fireball,Phaser.Physics.ARCADE)
            this.fireballs.add(fireball);
 
        })
         this.fireballTime=game.time.now+this.upgrade.shootRecall;                                                                         
        }
    }
    
    
    this.getUpgrade=function(number){
    
        if(number<=this.upgradeLevel) 
            return;
        console.log(this.upgrade.shots,this.upgradeLevel);    
        switch(number){
            case 3: this.upgrade.shots = [{velX: -900,velY: 0,size: 0.5}];
                    this.upgradeLevel=3;
                    break;
            case 4: this.upgrade.shots = [{velX: -900,velY: 0,size: 0.3},{velX: -900,velY: +300,size: 0.3}];
                    this.upgradeLevel=4;
                    break;
            case 5: this.upgrade.shots = 
                [{velX: -900,velY: +300,size: 0.3},{velX: -900,velY: -300,size: 0.3}];
                    this.upgradeLevel=5;
                    break;
            case 6: this.upgrade.shots = 
                    [{velX: -200,velY: 0,size: 0.3,rotation:0.2}];
                    this.upgradeLevel=6;
                    break;

            case 7: this.upgrade.shots = 
                [{velX: -900,velY: 0,size: 0.3},{velX: -900,velY: +300,size: 0.3},{velX: -900,velY: -300,size: 0.3},
                 {velX: -900,velY: +450,size: 0.3},{velX: -900,velY: -450,size: 0.3}];
                    this.upgradeLevel=7;
                    break;
            case 8: this.upgrade.shots = 
                [{velX: -900,velY: 0,size: 0.3},{velX: -900,velY: +300,size: 0.3},{velX: -900,velY: -300,size: 0.3},
                 {velX: -900,velY: +450,size: 0.3},{velX: -900,velY: -450,size: 0.3},
                {velX: -900,velY: +150,size: 0.3},{velX: -900,velY: -150,size: 0.3}];
                    this.upgradeLevel=8;
                    break;
            case 9: this.upgrade.shots = 
                [{velX: -900,velY: 0,size: 0.3,rotation:0.2},
                 {velX: -900,velY: +300,size: 0.3, rotation:0.2},
                 {velX: -900,velY: -300,size: 0.3, rotation:0.2},
                 {velX: -900,velY: +450,size: 0.3, rotation:0.2},
                 {velX: -900,velY: -450,size: 0.3, rotation:0.2},
                 {velX: -900,velY: +150,size: 0.3, rotation:0.2},
                 {velX: -900,velY: -150,size: 0.3,rotation:0.2}];
                    this.upgradeLevel=9;
                    break;
            }
        }
    
        
        
      

    }
    
    
Shooters.prototype = Object.create(Phaser.Sprite.prototype);
Shooters.prototype.constructor = Shooters;