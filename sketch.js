class Cell {
  constructor(xx, yy, sizee) {
    this.x = xx
    this.y = yy
    this.size = sizee

    //status is to keep track of X's and O's so the three possible statuses will be X,O, or empty
    this.status = "empty"
  }

  show() {
    strokeWeight(8)
    rect(this.x, this.y, this.size, this.size)
  }

  display_Status() {
    if (this.status == "X") {
      //draw an X
      line(this.x+15, this.y+15, this.x+(CELL_SIZE-15), this.y+(CELL_SIZE-15))
      line(this.x+15, this.y+(CELL_SIZE-15), this.x+(CELL_SIZE-15), this.y+15)
    }

    if (this.status == "O") {
      //draw an O
      circle(this.x+(CELL_SIZE/2), this.y+(CELL_SIZE/2), this.size-30)
    }
  }

  update_Status(status){
    this.status = status
  }

  check_if_in_bounds(otherX, otherY) {
    return (otherX >= this.x && otherX <= this.x+CELL_SIZE && otherY >= this.y && otherY <= this.y+CELL_SIZE)
  }
}

//cell list to keep track
cells = []

//constant cell size
const CELL_SIZE = 100

//global variable to keep track of turns
turn_status = "X"

function setup() {
  createCanvas(400, 400);

  //set up cell list
  for (let x = 0; x < 3; x++) {
    cells[x] = []
    for (let y = 0; y < 3; y++) {
      cells[x][y] = new Cell((CELL_SIZE*x)+50, (CELL_SIZE*y)+50, CELL_SIZE)
    }
  }
}

function draw() {
  background(220);

  //display cells
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      cells[x][y].show()
      cells[x][y].display_Status()
    }
  }
}

//update status of cells
function mouseReleased() {
  //get mouse cords once so do not have to check it multiple times
  mouseX_coord = mouseX
  mouseY_coord = mouseY

  //find which cell user clicked on by mouse location
  let cell = null
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      if (cells[x][y].check_if_in_bounds(mouseX_coord, mouseY_coord)) {
        cell = cells[x][y]
        break
      }
    }
  }

  //first check to make sure user did end up clicking a cell
  if (cell != null) {
    //update cell status if the cell is empty
    if (cell.status == "empty") {
      cell.update_Status(turn_status)
      turn_status != flip_turn_status()
    } else {
      alert("You may only select an empty cell")
    }

    //check if there is a winner
    let game_result = check_winner()
    if (game_result != null) {
      console.log(game_result)
    }
  }
}

function flip_turn_status() {
  if (turn_status == "X") {
    turn_status = "O"
  } else {
    turn_status = "X"
  }
}

function check_winner() {
  //check all vertical possibilities
  for (let i = 0; i < 3; i++) {
    if (cells[i][0].status == "X" && cells[i][1].status == "X" && cells[i][2].status== "X") {
      return "X"
    } else if (cells[i][0].status == "O" && cells[i][1].status == "O" && cells[i][2].status== "O") {
      return "O"
    }
  }

  //check all horizontal possiblities'
  for (let i = 0; i < 3; i++) {
    if (cells[0][i].status == "X" && cells[1][i].status == "X" && cells[2][i].status== "X") {
      return "X"
    } else if (cells[0][i].status == "O" && cells[1][i].status == "O" && cells[2][i].status== "O") {
      return "O"
    }
  }

  //check diaganol possibilities
  if (cells[0][0].status == "X" && cells[1][1].status == "X" && cells[2][2].status== "X") {
    return "X"
  } else if (cells[0][0].status == "O" && cells[1][1].status == "O" && cells[2][2].status== "O") {
    return "O"
  }

  if (cells[2][0].status == "X" && cells[1][1].status == "X" && cells[0][2].status== "X") {
    return "X"
  } else if (cells[2][0].status == "O" && cells[1][1].status == "O" && cells[0][2].status== "O") {
    return "O"
  }

  //check if tie
  tie = true //true unless proven false
  for (x = 0; x < 3; x++) {
    for (y = 0; y < 3; y++){
      if (cells[0][0].status == "empty") {
        tie = false
        break
      }
    }
  }

  if (tie) {
    return "tie"
  }
}