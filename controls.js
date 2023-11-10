class Controls{
    constructor(type){
        // Boolean changed depends on the key pressed
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;

        // Control Types
        switch(type){
            case "KEYS":
                this.#addKeyboardListeners();
                break;
            case "DUMMY":
                this.up = true;
                break;
        }
    }

    // # == Private methods (JS)
    #addKeyboardListeners(){
        document.onkeydown = (event) => {
            switch(event.key){
                case "ArrowUp":
                    this.up = true;
                    break;
                case "ArrowDown":
                    this.down = true;
                    break;
                case "ArrowLeft":
                    this.left = true;
                    break;
                case "ArrowRight":
                    this.right = true;
                    break;
            }
            //// Debugger
            // console.table(this);
        }
        document.onkeyup = (event) => {
            switch(event.key){
                case "ArrowUp":
                    this.up = false;
                    break;
                case "ArrowDown":
                    this.down = false;
                    break;
                case "ArrowLeft":
                    this.left = false;
                    break;
                case "ArrowRight":
                    this.right = false;
                    break;
            }
            //// Debugger
            // console.table(this);
        }
    }

}