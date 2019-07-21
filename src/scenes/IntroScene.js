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
        this.load.image('intro_alpha', 'assets/images/intro_splash_alpha.png');
        this.load.image('intro_beta', 'assets/images/intro_splash_beta.png');
    }

    create() {
        // Add the background image
        this.bkg = this.add.image(400, 300, 'intro_bkg').setAlpha(0);
        this.title = this.add.image(400, -300, 'intro_title');
        this.alpha = this.add.image(1200, 300, 'intro_alpha');
        this.beta = this.add.image(-204, 300, 'intro_beta');

        var timeline = this.tweens.createTimeline();
        var timelineb = this.tweens.createTimeline();
        timeline.add({
            targets: this.bkg,
            alpha: 1,
            ease: 'QuadraticOut',
            duration: 1000,
            delay: 0
        });
        timeline.add({
            targets: [this.alpha],
            x: 400,
            ease: 'QuadraticIn',
            duration: 250,
            delay: 0
        });
        timelineb.add({
            targets: this.beta,
            x: 204,
            ease: 'QuadraticIn',
            duration: 250,
            delay: 1000
        });
        timeline.add({
            targets: this.title,
            y: 300,
            ease: 'Bounce.easeOut',
            duration: 1000,
            delay: 0
        });

        timeline.play();
        timelineb.play();
        
        this.alpha.setInteractive().on('pointerdown', () => { 
            localStorage.setItem("character", "alpha");
            this.scene.start('Level1');
        });

        this.beta.setInteractive().on('pointerdown', () => { 
            localStorage.setItem("character", "beta");
            this.scene.start('Level1');
        });

        this.alpha.setInteractive().on('pointerover', () => { 
            this.beta.setAlpha(0.5);
            this.alpha.setAlpha(1);
        });

        this.beta.setInteractive().on('pointerover', () => { 
            this.alpha.setAlpha(0.5);
            this.beta.setAlpha(1);
        });
    }
}