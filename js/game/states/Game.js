JustRun.Game = function() {}
JustRun.Game = {

    create: function() {
        this.score = 0;
        this.higherCombo=0;
        game.physics.startSystem(Phaser.Physics.ARCADE);
        this.gameStartAt = game.time.now;
        this.background = game.add.tileSprite(0, 0, game.width, game.height - 1, 'background');
        this.background.autoScroll(-350, 0);
        this.pilots = game.add.group();
        this.shooters = new Shooters(this.game)
        this.messages = game.add.group()
        this.dead = game.add.group();
        this.difficulty = 0;
        game.physics.enable(this.dead, Phaser.Physics.ARCADE)
        this.player = new Player(this.game, 200, game.height, 'player', this.pilots, this.shooters)
        this.combo = {
            lastKill: this.time.now,
            killNumber: 0
        };
        this.upgradesManager = new Upgrades(game, this.shooters, this.player);
        this.timer6 = game.time.events.loop(10000, () => this.background.tint = Math.random() * 0xffffff, this)

        this.audios = {
            upgradeAudio: game.add.audio('upgradeAudio'),
            hitAudio: game.add.audio('hitAudio'),
            hitPlaneAudio: game.add.audio('hitPlane'),
            direcHitAudio: game.add.audio('directHit'),
            planeHitAudio: game.add.audio('combo'),
            soundtrack: game.add.audio('soundtrack')
        }

        this.audios.soundtrack.loop = true;
        this.audios.soundtrack.play();


    },
    update: function() {
            if(this.scoreText) this.scoreText.destroy();
            if(this.higherComboText) this.higherComboText.destroy();

            let style = { font: "2rem Orbitron", fill: "#fff4e6", align: "center" };    
            this.scoreText = game.add.text(10, 10, 'Score: '+this.score, style);
            style = { font: "1rem Orbitron", fill: "#C21807", align: "center" };    
            this.higherComboText = game.add.text(10, 45, 'Biggest Combo: '+this.higherCombo+"X", style);

        
        this.manageCollisionAndOverlap();
        this.stageLoop();
    },
    hitPilot: function(fireball, player) {

        if (fireball) fireball.kill();

        this.audios.planeHitAudio.volume = 0.6;
        this.audios.planeHitAudio.play();

        player.die();

        if (player.life < 1) {
            if (this.time.now > this.combo.lastKill) {
                this.combo.lastKill = this.time.now;
                this.combo.killNumber = 0
            }
            this.combo.lastKill = this.time.now + 1000
            this.combo.killNumber++;

            let style = {
                font: "3rem Orbitron",
                fill: ["#732C7B", "#CC0000", "#660099", "#FFD300", "#DF6E21", "#2096BA"]
                    [Math.floor(Math.random() * 6)],
                align: "center"
            };

            this.messages.removeAll();
            if (this.combo.killNumber > 1) {
                this.messages.add(game.add.text(player.x - 200, player.y, this.combo.killNumber + ' X HIT!', style));
                this.score+=this.combo.killNumber;
                if(this.higherCombo<this.combo.killNumber) this.higherCombo = this.combo.killNumber;
            }
            this.score+=10;
            this.upgradesManager.generateUpgrade(player);
            this.pilots.remove(player);
            this.dead.add(player);
        }
    },
    stageLoop: function() {

        if (game.time.now - this.gameStartAt < 20000) {
            //[STAGE 1] Pilots NOT ARMED, W/O AI
            if (this.pilots.length < 6 + this.difficulty) {
                this.createPilots(10 + this.difficulty - this.pilots.length, false, false);
            }
        } else if (game.time.now - this.gameStartAt < 40000) {
            //[STAGE 2] Pilots ARMED, W/O AI
            if (this.pilots.length < 4 + this.difficulty)
                this.createPilots(6 + this.difficulty - this.pilots.length, true, false);

        } else if (game.time.now - this.gameStartAt < 60000) {
            //[STAGE 3] Pilot ARMED, WITH AI
            if (this.pilots.length < 1 + this.difficulty) {
                this.shooters.fireballs.removeAll();
                this.createPilots(4 + this.difficulty, true, true);
            }
        } else if (game.time.now - this.gameStartAt > 60000) {
            //INCREASE DIFFICULTY AND RESTART FROM STAGE 1
            this.gameStartAt = game.time.now;
            this.difficulty++;
        }

    },
    createPilots: function(numberOfPilots, areArmed, areInteligents) {
        this.audios.direcHitAudio.play();
        for (let i = 0; i < numberOfPilots; i++)
            this.pilots.add(new Pilot(this.game, this.game.width, game.height / numberOfPilots * i, 'pilot', this.shooters, this.gameStartAt, areArmed, areInteligents, this.player));


    },
    manageCollisionAndOverlap() {
        // [COLLISION] Pilot vs Pilot 
        game.physics.arcade.collide(this.pilots, this.pilots);
        // [OVERLAP] Fireball vs Pilot 
        game.physics.arcade.overlap(this.shooters.fireballs, this.pilots, this.hitPilot, null, this);
        // [OVERLAP] Upgrade vs Player 
        game.physics.arcade.overlap(this.upgradesManager.fisicalUpgrades, this.player,
            (player, upgrade) => {
                this.upgradesManager.applyUpgrade(player, upgrade);
                upgrade.destroy();
                this.audios.upgradeAudio.play()
            }, null, this);
        // [COLLISION] Bullets vs Player 
        game.physics.arcade.collide(this.shooters.bullets, this.player, (player, bullet) => {
            bullet.destroy();
            player.life -= 1 + this.difficulty;
            this.audios.hitAudio.play();
        }, null, this);
        // [COLLISION] Pilot vs Player 
        game.physics.arcade.collide(this.pilots, this.player, (player, pilot) => {
            pilot.life = 1;
            this.hitPilot(null, pilot);
            player.life -= 5;
            this.audios.hitAudio.play();

        }, null, this);
    },
    


};