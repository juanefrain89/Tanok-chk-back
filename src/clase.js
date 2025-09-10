const persona = require("./persona");

class clase extends persona {

    #hola;
    constructor(hola ){
         super(); 
this.#hola = hola
    }

    saludar(){
    return this.#hola
    }
}

module.exports = clase