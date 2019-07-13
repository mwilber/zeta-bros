import { GameScene } from '../scenes/GameScene';

export class Level1 extends GameScene{
    constructor() {
		super({
			key: 'Level1'
        });

        this.levelCt = 1;

	}

    createPlatforms() {

        let platforms = super.createPlatforms();

        platforms.create(100, 135, 'platform');
        platforms.create(700, 405, 'platform');

        return platforms;
    }

    createDoors(){
        let door = super.createDoors();

        // Add an exit door
        door.create(300, 508, 'door', 3);

        return door;
    }

    create() {
        super.create();

        var timer = this.time.addEvent({
            delay: 5000,
            callback: (event)=>{
                this.spawnBot('left');
            },
            callbackScope: this,
            repeat: 1
        });
    }
    
}