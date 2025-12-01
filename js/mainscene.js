// On importe la définition de la classe Player
//import Player from './js/Player.js';
// On importe la définition de la classe Resource

export default class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
    }

    preload() {
        Player.preload(this);
        Resource.preload(this);
        this.load.image('tiles', 'assets/map/TX Tileset Grass.png');
        this.load.tilemapTiledJSON('map', 'assets/map/map.json');
    }

    create() {
        const map = this.make.tilemap({key:'map'});
        this.map = map;
        const tileset = map.addTilesetImage('samourail', 'tiles');
        const layer1 = map.createLayer('Calque de Tuiles 1', tileset, 0, 0);

        // Activer le collisionneur des tuiles qui possèdent une propriété collides à true
        layer1.setCollisionByProperty({collides:true});
        // Convertir de layer1 (ajoute de la matière pour réaliser la collision)
        this.matter.world.convertTilemapLayer(layer1);

        //this.addResources();
        
        // Affiche le joueur dans la fenêtre
        this.player = new Player({scene:this, x:200, y:300, texture:'link', frame:'idle_1'});
        
        // Les touches utilisées
        this.player.inputKeys = this.input.keyboard.addKeys({
            up:Phaser.Input.Keyboard.KeyCodes.Z,
            down:Phaser.Input.Keyboard.KeyCodes.S,
            left:Phaser.Input.Keyboard.KeyCodes.Q,
            right:Phaser.Input.Keyboard.KeyCodes.D
        });

        // Empêche le perso de tourner lorsqu'il touche une matière physique
        this.player.setFixedRotation();

        // on affiche les ressources après le joueur
        this.map.getObjectLayer('Resources').objects.forEach(resource => 
            { let resourceItem = new Resource({scene:this, resource});});
    }

    update() {
        this.player.update();
    }

}