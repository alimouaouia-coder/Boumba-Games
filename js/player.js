export default class Player extends Phaser.Physics.Matter.Sprite {

    constructor(data) {
        // Récupération des paramètres passés lors de la création du perso
        let{scene, x, y, texture, frame} = data;
        // Appel du constructeur "parent" (celui de la classe Sprite)
        super(scene.matter.world, x, y, texture, frame);
        // Redimensionner le perso à 25% de sa taille d'origine
        this.setScale(0.25);
        // Ajoute le perso dans la scène
        this.scene.add.existing(this);

        // Arme
        this.spriteWeapon = new Phaser.GameObjects.Sprite(this.scene,50,50,'items',162);
        this.spriteWeapon.setOrigin(0.25, 0.75);
        this.spriteWeapon.setScale(0.7);
        this.scene.add.existing(this.spriteWeapon);

        // Création du collisionneur et du détecteur
        const {Body, Bodies} = Phaser.Physics.Matter.Matter;
        let playerCollider = Bodies.circle(this.x,this.y, 12, {isSensor:false, label:'playerCollider'});
        let playerSensor = Bodies.circle(this.x,this.y, 24, {isSensor:true, label:'playerSensor'});
        const compoundBody = Body.create({
                parts: [playerCollider, playerSensor],
                frictionAir: 0.35,
        });

        this.setExistingBody(compoundBody);

        // capter la position de la souris 
        this.scene.input.on('pointermove', pointer => this.setFlipX(pointer.worldX < this.x));
        this.weaponRotation = -90;



        /*
         * Création de la propriété "direction"
         * down
         * left
         * right
         * up
         */
        this.direction = "down"; // Au départ, le perso regarde vers le bas
        this.state = "idle";     // Au départ, le perso est à l'état repos
    }

    static preload(scene) {
        //scene.load.atlas('female','../assets/images/female.png','../assets/images/female_atlas.json');
        //scene.load.animation('female_anim','../assets/images/female_anim.json');
        scene.load.atlas('samourail','../assets/zelda/atlas_anim/link.png','../assets/zelda/atlas_anim/link_atlas.json');
        scene.load.animation('link_anim','../assets/zelda/atlas_anim/link_anim.json');
        scene.load.spritesheet('items', 'assets/images/items.png',{frameWidth:32, frameHeight:32});
    }

    create() {
        
    }

    // Récupérer la vitesse du perso (getter)
    get velocity(){
        return this.body.velocity;
    }

    weaponRotate() {
        //recuperation de la souris
        let pointer = this.scene.input.activePointer;
        //lorsque le clic de la souris est pressé 
        if(pointer.isDown) {
            this.weaponRotation += 6;
        }
        else {
            this.weaponRotation = -90;
        }
        if(90<this.weaponRotation){
            this.weaponRotation = -90;
        }
        if(this.flipX) {
            this.spriteWeapon.setAngle(-this.weaponRotation -90)
        } else{
            this.spriteWeapon.setAngle(this.weaponRotation);
        }
                    
    }

    update() {
        const speed = 2.5;

        let playerVelocity = new Phaser.Math.Vector2();

        /* 
         * Si la touche Gauche (Q) est enfoncée ... 
         * sinon si la touche Droite (D) est enfoncée ...
         * sinon i la touche Haut (Z) est enfoncée ... 
         * sinon si la touche Bas (S) est enfoncée ...
         */
        if(this.inputKeys.left.isDown) {
            playerVelocity.x = -1;
            this.direction = "left";
        } else if(this.inputKeys.right.isDown) {
            playerVelocity.x = +1;
            this.direction = "right";
        } else if(this.inputKeys.up.isDown) {
            playerVelocity.y = -1;
            this.direction = "up";
        } else if(this.inputKeys.down.isDown) {
            playerVelocity.y = +1;
            this.direction = "down";
        }
        this.anims.play('link_'+ this.state + '_' + this.direction,true);
        //console.log("Direction : " + this.direction);

        playerVelocity.normalize();
        playerVelocity.scale(speed);
        this.setVelocity(playerVelocity.x,playerVelocity.y);

        if(Math.abs(this.velocity.x)>0.1 || Math.abs(this.velocity.y)>0.1) {
            this.state = "walk";
        } else {
            this.state = "idle";
        }

        //console.log("Etat : " + this.state);

        this.spriteWeapon.setPosition(this.x, this.y);

        this.weaponRotate();
    }
}