class Cell {
  constructor(xx, yy, sizee) {
    this.x = xx
    this.y = yy
    this.size = sizee
    this.c = color(255)

    //status is to keep track of X's and O's so the three possible statuses will be X,O, or empty
    this.status = "empty"
  }

  show() {
    strokeWeight(8)
    fill(this.c)
    rect(this.x, this.y, this.size, this.size)
  }

  display_Status() {
    if (this.status == "X") {
      //draw an X
      line(this.x + 15, this.y + 15, this.x + (CELL_SIZE - 15), this.y + (CELL_SIZE - 15))
      line(this.x + 15, this.y + (CELL_SIZE - 15), this.x + (CELL_SIZE - 15), this.y + 15)
    }

    if (this.status == "O") {
      //draw an O
      circle(this.x + (CELL_SIZE / 2), this.y + (CELL_SIZE / 2), this.size - 30)
    }
  }

  update_Status(status) {
    this.status = status
  }

  check_if_in_bounds(otherX, otherY) {
    return (otherX >= this.x && otherX <= this.x + CELL_SIZE && otherY >= this.y && otherY <= this.y + CELL_SIZE)
  }
}

//cell list to keep track
cells = []

//constant cell size
const CELL_SIZE = 100

//game over variable
let gameover = false

//global variable to keep track of turns
turn_status = "X"

let button;
function setup() {
  createCanvas(350, 350);

  //set up cell list
  for (let x = 0; x < 3; x++) {
    cells[x] = []
    for (let y = 0; y < 3; y++) {
      cells[x][y] = new Cell((CELL_SIZE * x) + 20, (CELL_SIZE * y) + 20, CELL_SIZE)
    }
  }

  button = select("#restart")  
  button.mouseClicked(restartGame)
}

function restartGame() {
  gameover = false

  //reset cells
  for (let x = 0; x < 3; x++) {
    cells[x] = []
    for (let y = 0; y < 3; y++) {
      cells[x][y] = new Cell((CELL_SIZE * x) + 20, (CELL_SIZE * y) + 20, CELL_SIZE)
    }
  }

  //reset turn status
  turn_status = "X"
}

function draw() {
  background(255);

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
        //check if game has ended
        if (gameover) {
          alert("Game has ended")
          return
        }

        cell = cells[x][y]
        break
      }
    }
  }

  //first check to make sure user did end up clicking a cell
  if (cell != null) {
    //update cell status if the cell is empty
    if (cell.status == "empty") {
      //change cell status (so for example: turn an empty cell to X)
      cell.update_Status(turn_status)
      turn_status != flip_turn_status()

      //check if there is a winner
      let game_result = check_winner()
      if (game_result != null) {
        console.log(game_result)
      }

      //ai move

      //get all empty cells aka possible ai moves
      let empty_cells = []
      for (x = 0; x < 3; x++) {
        for (y = 0; y < 3; y++) {
          if (cells[x][y].status == "empty") {
            empty_cells.push(cells[x][y])
          }
        }
      }

      if (empty_cells.length > 0) {
        let nextMove = bestMove()
        cells[nextMove[0]][nextMove[1]].update_Status(turn_status)
        turn_status != flip_turn_status()
      }

      //check if there is a winner
      game_result = check_winner()
      if (game_result != null) {
        get_winning_spots()
        console.log(game_result)
      }
    } else {
      alert("You may only select an empty cell")
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

//the establish winner function -> fills the winning spots and turns game off
function establish_winner(x1, y1, x2, y2, x3, y3, result) {
  let c = color(round(random(255)), round(random(255)), round(random(255)))
  cells[x1][y1].c = c
  cells[x2][y2].c = c
  cells[x3][y3].c = c

  //game ended
  gameover = true
}

function check_winner() {
  //check all vertical possibilities
  for (let i = 0; i < 3; i++) {
    if (cells[i][0].status == "X" && cells[i][1].status == "X" && cells[i][2].status == "X") {
      return "X"
    } else if (cells[i][0].status == "O" && cells[i][1].status == "O" && cells[i][2].status == "O") {
      return "O"
    }
  }

  //check all horizontal possiblities'
  for (let i = 0; i < 3; i++) {
    if (cells[0][i].status == "X" && cells[1][i].status == "X" && cells[2][i].status == "X") {
      return "X"
    } else if (cells[0][i].status == "O" && cells[1][i].status == "O" && cells[2][i].status == "O") {
      return "O"
    }
  }

  //check diaganol possibilities
  if (cells[0][0].status == "X" && cells[1][1].status == "X" && cells[2][2].status == "X") {
    return "X"
  } else if (cells[0][0].status == "O" && cells[1][1].status == "O" && cells[2][2].status == "O") {
    return "O"
  }

  if (cells[2][0].status == "X" && cells[1][1].status == "X" && cells[0][2].status == "X") {
    return "X"
  } else if (cells[2][0].status == "O" && cells[1][1].status == "O" && cells[0][2].status == "O") {
    return "O"
  }

  //check if tie
  tie = true //true unless proven false
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      if (cells[x][y].status == "empty") {
        tie = false
        break
      }
    }
  }

  if (tie) {
    return "tie"
  }
}

function get_winning_spots() {
  //check all vertical possibilities
  for (let i = 0; i < 3; i++) {
    if (cells[i][0].status == "X" && cells[i][1].status == "X" && cells[i][2].status == "X") {
      establish_winner(i, 0, i, 1, i, 2)
      return
    } else if (cells[i][0].status == "O" && cells[i][1].status == "O" && cells[i][2].status == "O") {
      establish_winner(i, 0, i, 1, i, 2)
      return
    }
  }

  //check all horizontal possiblities'
  for (let i = 0; i < 3; i++) {
    if (cells[0][i].status == "X" && cells[1][i].status == "X" && cells[2][i].status == "X") {
      establish_winner(0, i, 1, i, 2, i)
      return
    } else if (cells[0][i].status == "O" && cells[1][i].status == "O" && cells[2][i].status == "O") {
      establish_winner(0, i, 1, i, 2, i)
      return
    }
  }

  //check diaganol possibilities
  if (cells[0][0].status == "X" && cells[1][1].status == "X" && cells[2][2].status == "X") {
    establish_winner(0, 0, 1, 1, 2, 2)
    return
  } else if (cells[0][0].status == "O" && cells[1][1].status == "O" && cells[2][2].status == "O") {
    establish_winner(0, 0, 1, 1, 2, 2)
    return
  }

  if (cells[2][0].status == "X" && cells[1][1].status == "X" && cells[0][2].status == "X") {
    establish_winner(2, 0, 1, 1, 0, 2)
    return
  } else if (cells[2][0].status == "O" && cells[1][1].status == "O" && cells[0][2].status == "O") {
    establish_winner(2, 0, 1, 1, 0, 2)
    return
  }
}

function bestMove() {
  let bestScore = -Infinity
  let bestMove;

  //look at all availible spaces and see who has the highest minimax score
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      if (cells[x][y].status == "empty") {
        cells[x][y].update_Status("O")
        let score = minimax(cells, 0, false)
        if (score > bestScore) {
          bestScore = score
          bestMove = [x, y]
        }
        cells[x][y].update_Status("empty")
      }
    }
  }

  //return optimal cell to go to
  return bestMove
}

let scores = {
  X: -10,
  O: 10,
  tie: 0
};

function minimax(cells, depth, isMaximizing) {
  let result = check_winner();
  if (result !== undefined) {
    return scores[result];
  }

  if (isMaximizing) {
    let bestScore = -Infinity
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        if (cells[x][y].status == "empty") {
          cells[x][y].update_Status("O")
          let score = minimax(cells, depth + 1, false)
          cells[x][y].update_Status("empty")
          bestScore = max(bestScore, score)
        }
      }
    }
    return bestScore
  } else {
    let lowestScore = Infinity
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        if (cells[x][y].status == "empty") {
          cells[x][y].update_Status("X")
          let score = minimax(cells, depth + 1, true)
          cells[x][y].update_Status("empty")
          lowestScore = min(lowestScore, score)
        }
      }
    }

    return lowestScore
  }
}