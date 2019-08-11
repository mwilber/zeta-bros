import Phaser from 'phaser';

export class IntroScene extends Phaser.Scene {
    constructor() {
		super({
			key: 'IntroScene'
        });

	}

	preload() {
        this.load.image('intro_bkg', 'assets/images/intro_splash_bkg.png');
        this.load.image('intro_title', 'assets/images/intro_splash_title.png');
        this.load.spritesheet('intro_alpha', 
            'assets/images/intro_splash_alpha.png',
            { frameWidth: 208, frameHeight: 483 }
        );
        this.load.spritesheet('intro_beta', 
            'assets/images/intro_splash_beta.png',
            { frameWidth: 207, frameHeight: 436 }
        );

        this.load.audio('aud_intro_jingle', 'assets/audio/intro_jingle.mp3');
        this.load.audio('aud_intro_start', 'assets/audio/intro_start.mp3');
        this.load.audio('aud_intro_title', 'assets/audio/intro_title.wav');
        this.load.audio('aud_intro_wooshhit', 'assets/audio/intro_woosh_hit.mp3');
        this.load.audio('aud_select', 'assets/audio/intro_select.mp3');
        //this.load.audio('aud_intro_loop','assets/audio/intro_loop.mp3')
    }

    create() {

        this.anims.create({
            key: 'alpha_static',
            frames: [ { key: 'intro_alpha', frame: 0 } ],
            frameRate: 20
        });
        this.anims.create({
            key: 'alpha_hilite',
            frames: [ { key: 'intro_alpha', frame: 1 } ],
            frameRate: 20
        });
        this.anims.create({
            key: 'beta_static',
            frames: [ { key: 'intro_beta', frame: 0 } ],
            frameRate: 20
        });
        this.anims.create({
            key: 'beta_hilite',
            frames: [ { key: 'intro_beta', frame: 1 } ],
            frameRate: 20
        });

        this.audJingle = this.sound.add('aud_intro_jingle');
        this.audStartGame = this.sound.add('aud_intro_start');
        this.audSelect = this.sound.add('aud_select');
        this.audTitle = this.sound.add('aud_intro_title');
        this.audWooshHit = this.sound.add('aud_intro_wooshhit');
        //this.audLoop = this.sound.add('aud_intro_loop');

        // Add the background image
        this.bkg = this.add.image(400, 300, 'intro_bkg').setAlpha(0);
        this.title = this.add.image(400, -300, 'intro_title');
        this.alpha = this.add.sprite(1200, 358, 'intro_alpha');
        this.beta = this.add.sprite(-204, 382, 'intro_beta');
        this.selector = this.add.container();

        this.selector.add(this.alpha);
        this.selector.add(this.beta);

        var timeline = this.tweens.createTimeline();
        var timelineb = this.tweens.createTimeline();
        timeline.add({
            targets: this.bkg,
            alpha: 1,
            ease: 'QuadraticOut',
            duration: 1000,
            delay: 0,
            onStart: ()=>{this.audJingle.play()}
        });
        timeline.add({
            targets: [this.alpha],
            x: 488,
            ease: 'QuadraticIn',
            duration: 250,
            delay: 0,
            onStart: ()=>{this.audWooshHit.play()}
        });
        timelineb.add({
            targets: this.beta,
            x: 324,
            ease: 'QuadraticIn',
            duration: 250,
            delay: 1000
        });
        timeline.add({
            targets: this.title,
            y: 300,
            ease: 'Bounce.easeOut',
            duration: 1000,
            delay: 0,
            onStart: ()=>{/*this.audLoop.play('',{loop:true})*/}
        });

        timeline.play();
        timelineb.play();
        
        this.alpha.setInteractive();
        this.beta.setInteractive();
        
        this.alpha.on('pointerdown', () => { 
            this.audStartGame.play();
            localStorage.setItem("character", "alpha");
            this.scene.start('Level1');
        });

        this.beta.on('pointerdown', () => { 
            this.audStartGame.play();
            localStorage.setItem("character", "beta");
            this.scene.start('Level1');
            
        });

        this.alpha.on('pointerover', () => { 
            this.audSelect.play();
            this.selector.bringToTop(this.alpha);
            this.alpha.anims.play('alpha_hilite');
        }, this);

        this.alpha.on('pointerout', () => { 
            this.alpha.anims.play('alpha_static');
        }, this);

        this.beta.on('pointerover', () => { 
            this.audSelect.play();
            this.selector.bringToTop(this.beta);
            this.beta.anims.play('beta_hilite');
        }, this);

        this.beta.on('pointerout', () => { 
            this.beta.anims.play('beta_static');
        }, this);

    }
}