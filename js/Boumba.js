import MainScene from "./MainScene.js";

const config = {
    width: 512,
    height: 512,
    backgroundColor : '#ffff00',
    type: Phaser.AUTO,
    parent:'survival-game',
    scene:[MainScene],
    scale: {
        zoom:1,
    },
    physics:{
        default:'matter',
        matter : {
            debug:true,
            gravity: {
                y:0
            }
        }
    },
    plugins:{
        scene:[
            {
                plugin: PhaserMatterCollisionPlugin.default,
                key: 'MatterCollision',
                mapping: 'matterCollision'
            }
        ]
    }
}

new Phaser.Game(config);