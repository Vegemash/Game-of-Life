var game_grid = new Array();
var game_grid_size = {x: 30, y: 30};
var alive_cell_pic = "../Game of life/alive_small.png";
var dead_cell_pic = "../Game of life/dead2.png";
var bRunSim = false;

var main = function () {
    spawnGrid();

    $('.start-stop').click(function () {
        bRunSim = !bRunSim;
    });

    //Kill/Revive cells on click
    $('.game-cell').click(function () {
        if ($(this).hasClass('active-cell')) {
            kill(this);
        } else {
            revive(this);
        }
    });
    //Run update
    setInterval(update, 200);
};

var spawnGrid = function () {
    //Set grid dimensions
    var grid_px_size = 500;
    var img_width = 50;
    var cell_size = {
        x: grid_px_size / game_grid_size.x,
        y: grid_px_size / game_grid_size.x
    };
    var background_scale = cell_size.x / img_width;

    //Set the offset to center the grid
    var top_left = { x: 0, y: 0 };
    var grid = $('.game-grid');
    top_left.x = -(game_grid_size.x * cell_size.x) / 2;
    top_left.y = 0;//grid.height() / 2 - (game_grid_size.y * cell_size.y) / 2;
   //get the grid
    for (var x = 0; x < game_grid_size.x; x++) {
        for (var y = 0; y < game_grid_size.y; y++) {
            //create new cell
            var new_cell = $('<img>');
            new_cell.addClass("game-cell");
            //position the cell
            new_cell.css({
               // position: 'absolute',
                width: cell_size.x,
                height: cell_size.y,
                'margin-top': top_left.y + cell_size.y * y,
                'margin-left': top_left.x + cell_size.y * x,
                'background-size': (cell_size.x ,cell_size.y)
            });
            new_cell.addClass("unalive-cell");
            //Add the cell to the DOM and the grid
            grid.append(new_cell);
            game_grid.push(new_cell);
        }
    }
}

//Update the grid
var update = function () {
    if (!bRunSim)
        return;

    if (game_grid.length != 0) {
        //game_grid[Math.floor(game_grid.length * Math.random())].click();

        var toKill = new Array();
        var toRevive = new Array();
        for (var x = 0; x < game_grid_size.x; ++x) {
            for (var y = 0; y < game_grid_size.y; ++y) {
                //Count the neighbours
                var alive_neighbours = 0;
                for (var dx = x - 1; dx <= x + 1; dx++) {
                    for (var dy = y - 1; dy <= y + 1; ++dy) {
                        //Check for edges and self
                        if (dy == y && dx == x
                            || dy >= game_grid_size.y || dy < 0
                            || dx >= game_grid_size.x || dx < 0)
                            continue;

                        if ($(game_grid[toIndex(dx, dy)]).hasClass('active-cell'))
                            ++alive_neighbours;
                    }// <-- Dat big O() yo :)
                }
                var cell = game_grid[toIndex(x, y)][0];
                if (alive_neighbours < 2 || alive_neighbours > 3)
                    toKill.push(cell);
                else if (alive_neighbours == 3)
                    toRevive.push(cell);
            }
        }
    }
    for (cell in toKill)
        kill(toKill[cell]);
    for (cell in toRevive)
        revive(toRevive[cell]);
}

//Switch a cell from alive to dead
function kill(cell) {
    if (!$(cell).hasClass('active-cell'))
        return;

    $(cell).removeClass('active-cell');
    $(cell).addClass('dead-cell');
}

//Switch a cell from dead to alive
var revive = function (cell) {
    if ($(cell).hasClass('dead-cell')) {
        $(cell).removeClass('dead-cell');
        $(cell).addClass('active-cell');
    }else if($(cell).hasClass('unalive-cell')){
        $(cell).removeClass('unalive-cell');
        $(cell).addClass('active-cell');
    }

}

// (x, y) to index
function toIndex(x, y) {
    return x + y * game_grid_size.x;
}

//Run main when the document is ready
$(document).ready(main);