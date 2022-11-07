class item{
    constructor(type,dir,img){
        this.type = type;
        this.size = 7
        this.dir = dir;
        this.speed = 0.7;
        this.height = 170;
        this.pos = [0,0];
        this.color = "#ffd700";
        this.img = img
    }

    update(size){
        this.pos = [size/2 + Math.sin(this.dir)*this.height,size/2 - Math.cos(this.dir)*this.height]
        this.height -= this.speed;
        if(this.height<10){
            return true;
        }
        return false;
    }
    checkHit(posx,posy,earthSize){
        if(Math.pow(posx-this.pos[0],2)+Math.pow(posy-this.pos[1],2) < Math.pow((earthSize+this.size),2)){
            return true;
        }
        else{
            return false;
        }
    }
}

export{item}