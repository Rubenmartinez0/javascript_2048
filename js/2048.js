(function($){ // State that we are creating a plugin. This avoids conflics.

    //Fix case when it creates a new cell just where you moved to.

    $.fn.game2048 = function(){ //game2048 plugin implementation.

        function generateTable(){
            //Create a 4x4 table filling every cell with a 0.
            let table = $("<table></table>");
            
            for (var y = 0; y < 4; y++) {//Create 4 rows.
                let row = $("<tr></tr>");
                for (var x = 0; x < 4; x++) {//Create 4 columns.
                    //Initial value for every cell will be 0. Also save the x, y coordinates as atributes.
                    let cell = $("<td>0</td>").attr("x",x).attr("y",y).attr("value",0);
                    row.append(cell);
                }
                table.append(row);
            }
            return table;
        } 
       
        function generateCell(numberOfCells){
            //Choose random cells in order to change their value to 2 o 4.
            for(var i = 0; i < numberOfCells; i++){
                let x = Math.floor((Math.random() * 10))%4;//Generate an X value between 0 and 3 included.
                let y = Math.floor((Math.random() * 10))%4;//Generate an Y value between 0 and 3 included.
                let cell = $("[x=" + x + "][y=" + y + "][value=0]");//Get the cell.

                if(cell[0]){//Check if the cell exists. If exists it means it is empty(value = 0).
                    let value = Math.floor(Math.random() *2);//Generate a value between 0 and 1 included.
                    if(value === 1){
                        value = 4;
                    }else{
                        value = 2;
                    }
                    cell.attr("value", value);
                    cell.text(value);
                    updateColors();           
                }else{
                    i--;
                }
            }
        }

        function updateColors(){
            //Go through the table checking the values of the cell and assigning the corresponding background-color.
            for(var y = 0; y < 4; y++){
                for(var x = 0; x < 4; x++){
                    let currentCell = $("[x=" + x + "][y=" + y + "]");
                    currentCell.css("color","black");
                    switch(currentCell.attr("value")){
                        case "0":
                            currentCell.css("background-color","white");
                            break;
                        case "2":
                            currentCell.css("background-color","rgb(180, 214, 193)");
                            break;
                        case "4":
                            currentCell.css("background-color","#8DC3A7");
                            break;
                        case "8":
                            currentCell.css("background-color","#6BAF92");
                            break;
                        case "16":
                            currentCell.css("background-color","#4E9C81");
                            break;
                        case "32":
                            currentCell.css("background-color","#358873");
                            break;
                        case "64":
                            currentCell.css("background-color","#207567");
                            break;
                        default:
                            currentCell.css("background-color","black");
                            currentCell.css("color","white");
                    }
                }
            }
        }

        function moveToLeft(){
            let cellGenerated = false;

            for(var y = 0; y < 4; y++){
                var emptySpaces = 0;
                for(var x = 0; x < 4; x++){
                    let currentCell = $("[x=" + x + "][y=" + y + "]");//Obtain data from the cell we are currently on.
                    currentCellValue = currentCell.attr("value")
                    
                    if(currentCell.attr("value") === "0"){//Check if the current cell we are on is empty.
                        emptySpaces++;//Add up if is empty
                    }else{
                        //If we are not on the edge(x = 0).
                        if(emptySpaces > 0){
                            //Calculate how many cells we need to move it.
                            newX = x - emptySpaces;
                            //Get the new location where our cell will be.
                            //Assign the value, text and color it should have.
                            newLocationCell = $("[x=" + newX + "][y=" + y + "]");
                            newLocationCell.attr("value",currentCellValue);
                            newLocationCell.text(currentCellValue);
                            //Update the cell values where our currentCell was before moving it
                            currentCell.attr("value", 0);
                            currentCell.text(0);
                            //Generate one new cell value for a movement.
                            if(cellGenerated === false){
                               cellGenerated = true;
                                generateCell(1);
                            }
                        }
                    }
                }     
            }
            mergeToLeft(cellGenerated);
        }

        function mergeToLeft(cellGenerated){
            let cellsMerged = false;
            for(var y = 0; y < 4; y++){
                for(var x = 0; x < 4; x++){
                    //Get both current and rightCell values.
                    let currentCell = $("[x=" + x + "][y=" + y + "]");
                    let currentCellValue = currentCell.attr("value");    
                    let rightX = x+1;
                    let rightCell = $("[x=" + rightX + "][y=" + y + "]");
                    let rightCellValue = rightCell.attr("value");
                    //Check if we can sum the adjacent cells.
                    if(currentCellValue === rightCellValue && currentCellValue > 0){
                        currentCell.attr("value",currentCellValue*2);
                        currentCell.text(currentCellValue*2);
                        rightCell.attr("value", 0);
                        rightCell.text(0);
                        cellsMerged = true;
                        //Add one point for each merge.
                        var points = $("#points").text();
                        points++;
                        $("#points").text(points);
                        
                        //Once merged, check if there is more empty cells to move to.
                        //Obtain the values of the left cell.
                        let leftX = x-1;
                        let leftCell = $("[x=" + leftX + "][y=" + y + "]");
                        let leftCellValue = leftCell.attr("value");
                        //Check if left cell is empty and inside bounds.
                        if(leftCellValue == 0 && leftX >=0){
                            //Update the cells and erase the current.
                            leftCell.attr("value", currentCellValue*2);
                            leftCell.text(currentCellValue*2);
                            currentCell.attr("value",0);
                            currentCell.text(0);
                        }
                    }else{
                        //If we cannot sum the values, check if there is a 0 to move to.
                        //We already have values of current value.
                        //Obtain the values of the left cell.
                        let leftX = x-1;
                        let leftCell = $("[x=" + leftX + "][y=" + y + "]");
                        let leftCellValue = leftCell.attr("value");
                        //Check if left cell is empty and inside bounds.
                        
                        if(leftCellValue == 0 && leftX >=0){
                            //Update the cells and erase the current.
                            leftCell.attr("value", currentCellValue);
                            leftCell.text(currentCellValue);
                            currentCell.attr("value",0);
                            currentCell.text(0);
                        }
                    }   
                }
            }
            //Generate one new cell value if merge happens.
            if(!cellGenerated && cellsMerged){
                cellGenerated = true;
                generateCell(1);
            }
        }

        function moveToRight(){
            let cellGenerated = false;

            for(var y = 0; y < 4; y++){
                var emptySpaces = 0;
                for(var x = 3; x > -1; x--){
                    //Obtain data from the cell we are currently on.
                    let currentCell = $("[x=" + x + "][y=" + y + "]");
                    currentCellValue = currentCell.attr("value");
                    //Check if the current cell we are on is empty.
                    if(currentCell.attr("value") === "0"){
                        emptySpaces++;//Add up if is empty
                    }else{
                        //If we are not on the edge(x = 0).
                        if(emptySpaces > 0){
                            //Calculate how many cells we need to move it.
                            newX = x + emptySpaces;
                            //Get the new location where our cell will be.
                            //Assign the value and text it should have.
                            newLocationCell = $("[x=" + newX + "][y=" + y + "]");
                            newLocationCell.attr("value",currentCellValue);
                            newLocationCell.text(currentCellValue);

                            //Update the cell values where our currentCell was before moving it
                            currentCell.attr("value", 0);
                            currentCell.text(0);
                            //Generate one new cell value for every movement.
                            if(cellGenerated === false){
                                cellGenerated = true;
                                generateCell(1);
                            }
                        }
                    }
                }
            }
            mergeToRight(cellGenerated);    
        }

        function mergeToRight(cellGenerated){
            let cellsMerged = false;
            for(var y = 0; y < 4; y++){
                for(var x = 3; x > -1; x--){
                    //Get both current and rightCell values.
                    let currentCell = $("[x=" + x + "][y=" + y + "]");
                    let currentCellValue = currentCell.attr("value");
                    let leftX = x-1;
                    let leftCell = $("[x=" + leftX + "][y=" + y + "]");
                    let leftCellValue = leftCell.attr("value");
                    //Check if we can sum the adjacent cells.
                    if(currentCellValue === leftCellValue && currentCellValue > 0){
                        currentCell.attr("value",currentCellValue*2);
                        currentCell.text(currentCellValue*2);
                        
                        leftCell.attr("value", 0);
                        leftCell.text(0);
                        cellsMerged = true;
                        //Add one point for each merge.
                        var points = $("#points").text();
                        points++;
                        $("#points").text(points);
                        //Once merged, check if there is more empty cells to move to.
                        //Obtain the values of the left cell.
                        let rightX = x+1;
                        let rightCell = $("[x=" + rightX + "][y=" + y + "]");
                        let rightCellValue = rightCell.attr("value");
                        //Check if left cell is empty and inside bounds.
                        if(rightCellValue == 0 && rightX <=3){
                            //Update the cells and erase the current.
                            rightCell.attr("value", currentCellValue*2);
                            rightCell.text(currentCellValue*2);
                            currentCell.attr("value",0);
                            currentCell.text(0);
                        }
                    }else{
                        //If we cannot sum the values, check if there is a 0 to move to.
                        //We already have values of current value.
                        //Obtain the values of the left cell.
                        let rightX = x+1;
                        let rightCell = $("[x=" + rightX + "][y=" + y + "]");
                        let rightCellValue = rightCell.attr("value");
                        //Check if left cell is empty and inside bounds.
                        
                        if(rightCellValue == 0 && rightX <=3){
                            //Update the cells and erase the current.
                            rightCell.attr("value", currentCellValue);
                            rightCell.text(currentCellValue);
                            currentCell.attr("value",0);
                            currentCell.text(0);
                        }
                    }
                    //Generate one new cell value if merge happens.
                }
            }
            if(!cellGenerated && cellsMerged){
                cellGenerated = true;
                generateCell(1);
            }
        }

        function moveUp(){
            let cellGenerated = false;

            for(var x = 0; x < 4; x++){
                var emptySpaces = 0;
                for(var y = 0; y < 4; y++){
                    //Obtain data from the cell we are currently on.
                    let currentCell = $("[x=" + x + "][y=" + y + "]");
                    currentCellValue = currentCell.attr("value");
                    //Check if the current cell we are on is empty.
                    if(currentCell.attr("value") === "0"){
                        emptySpaces++;//Add up if is empty
                    }else{
                        if(emptySpaces > 0){
                            //Calculate how many cells we need to move it.
                            newY = y - emptySpaces;
                            //Get the new location where our cell will be.
                            //Assign the value, text and color it should have.
                            newLocationCell = $("[x=" + x + "][y=" + newY + "]");
                            newLocationCell.attr("value",currentCellValue);
                            newLocationCell.text(currentCellValue);
                            //Update the cell values where our currentCell was before moving it
                            currentCell.attr("value", 0);
                            currentCell.text(0);
                            //Generate one new cell value for every movement.
                            if(cellGenerated === false){
                                cellGenerated = true;
                                generateCell(1);
                            }
                        }
                    }
                }  
            }
            mergeUp(cellGenerated);
        }

        function mergeUp(cellGenerated){
            let cellsMerged = false;

            for(var x = 0; x < 4; x++){
                for(var y = 0; y < 4; y++){
                    //Get both current and downCell values.
                    let currentCell = $("[x=" + x + "][y=" + y + "]");
                    let currentCellValue = currentCell.attr("value");
                    let downY = y+1;
                    let downCell = $("[x=" + x + "][y=" + downY + "]");
                    let downCellValue = downCell.attr("value");
                    //Check if we can sum the adjacent cells.
                    if(currentCellValue === downCellValue && currentCellValue > 0){
                        currentCell.attr("value",currentCellValue*2);
                        currentCell.text(currentCellValue*2);
                        downCell.attr("value", 0);
                        downCell.text(0);
                        cellsMerged = true;
                        //Add one point for each merge.
                        var points = $("#points").text();
                        points++;
                        $("#points").text(points);
                        //Once merged, check if there is more empty cells to move to.
                        //Obtain the values of the up cell.
                        let upY = y-1;
                        let upCell = $("[x=" + x + "][y=" + upY + "]");
                        let upCellValue = upCell.attr("value");
                        //Check if left cell is empty and inside bounds.
                        if(upCellValue == 0 && upY >=0){
                            //Update the cells and erase the current.
                            upCell.attr("value", currentCellValue*2);
                            upCell.text(currentCellValue*2);
                            currentCell.attr("value",0);
                            currentCell.text(0);
                        }
                    }else{
                        //Once merged, check if there is more empty cells to move to.
                        //Obtain the values of the up cell.
                        let upY = y-1;
                        let upCell = $("[x=" + x + "][y=" + upY + "]");
                        let upCellValue = upCell.attr("value");
                        //Check if left cell is empty and inside bounds.
                        if(upCellValue == 0 && upY >=0){
                            //Update the cells and erase the current.
                            upCell.attr("value", currentCellValue);
                            upCell.text(currentCellValue);
                            currentCell.attr("value",0);
                            currentCell.text(0);
                        }
                    }
                }
            }
            //Generate one new cell value if merge happens.
            if(!cellGenerated && cellsMerged){
                cellGenerated = true;
                generateCell(1);
            }
        }

        function moveDown(){
            let cellGenerated = false;
            for(var x = 0; x < 4; x++){
                var emptySpaces = 0;
                for(var y = 4; y > -1; y--){
                    //Obtain data from the cell we are currently on.
                    let currentCell = $("[x=" + x + "][y=" + y + "]");
                    currentCellValue = currentCell.attr("value");

                    if(currentCell.attr("value") === "0"){//Check if the current cell we are on is empty.
                        emptySpaces++;//Add up if is empty
                    }else{
                        //If we are not on the edge(x = 0).
                        if(emptySpaces > 0){
                            //Calculate how many cells we need to move it.
                            newY = y + emptySpaces;
                            //Get the new location where our cell will be.
                            //Assign the value, text and color it should have.
                            newLocationCell = $("[x=" + x + "][y=" + newY + "]");
                            newLocationCell.attr("value",currentCellValue);
                            newLocationCell.text(currentCellValue);
                            //Update the cell values where our currentCell was before moving it
                            currentCell.attr("value", 0);
                            currentCell.text(0);
                            //Generate one new cell value for every movement.
                            if(cellGenerated === false){
                                cellGenerated = true;
                                generateCell(1);
                            }
                        }
                    }
                } 
            }
            mergeDown(cellGenerated);
        }

        function mergeDown(cellGenerated){
            let cellsMerged =  false;

            for(var x = 0; x < 4; x++){
                for(var y = 4; y > -1; y--){
                    //Get both current and downCell values.
                    let currentCell = $("[x=" + x + "][y=" + y + "]");
                    let currentCellValue = currentCell.attr("value");
                    let upY = y-1;
                    let upCell = $("[x=" + x + "][y=" + upY + "]");
                    let upCellValue = upCell.attr("value");
                    //Check if we can sum the adjacent cells.
                    if(currentCellValue === upCellValue && currentCellValue > 0){
                        currentCell.attr("value",currentCellValue*2);
                        currentCell.text(currentCellValue*2);

                        upCell.attr("value", 0);
                        upCell.text(0);
                        cellsMerged =  true;
                        //Add one point for each merge.
                        var points = $("#points").text();
                        points++;
                        $("#points").text(points);
                        //Once merged, check if there is more empty cells to move to.
                        //Obtain the values of the up cell.
                        let downY = y+1;
                        let downCell = $("[x=" + x + "][y=" + downY + "]");
                        let downCellValue = downCell.attr("value");
                        //Check if left cell is empty and inside bounds.
                        if(downCellValue == 0 && downY <=3){
                            //Update the cells and erase the current.
                            downCell.attr("value", currentCellValue*2);
                            downCell.text(currentCellValue*2);
                            currentCell.attr("value",0);
                            currentCell.text(0);
                        }
                    }else{
                        //Once merged, check if there is more empty cells to move to.
                        //Obtain the values of the up cell.
                        let downY = y+1;
                        let downCell = $("[x=" + x + "][y=" + downY + "]");
                        let downCellValue = downCell.attr("value");
                        //Check if left cell is empty and inside bounds.
                        if(downCellValue == 0 && downY <=3){
                            //Update the cells and erase the current.
                            downCell.attr("value", currentCellValue);
                            downCell.text(currentCellValue);
                            currentCell.attr("value",0);
                            currentCell.text(0);
                        }

                    }
                }
            }
            //Generate one new cell value if merge happens.
            if(!cellGenerated && cellsMerged){
                cellGenerated = true;
                generateCell(1);
            }
        }

        function checkGameOver(){
            let emptyCells = false;
            for(var y = 0; y < 4; y++){
                for(var x = 0; x < 4; x++){
                    let currentCell = $("[x=" + x + "][y=" + y + "][value = 0]");
                    if (currentCell[0]) {
                        emptyCells = true;
                    }
                }
            }


            if(!emptyCells){
                alert("GAME OVER");
                $("td").attr("value", 0);
                $("td").text(0);
                generateCell(2);
                updateColors();
            } 
        }

        $("html").keydown(function(event){
            var pulsedKey = event.which;
            switch(pulsedKey){
                case 37://Code for left-arrow.
                    moveToLeft();
                    break;
                case 38://Code for up-arrow.
                    moveUp();
                    break;
                case 39://Code for right-arrow.
                    moveToRight();
                    break;
                case 40://Code for down-arrow.
                    moveDown();
                    break;
                default:
                console.log("No arrow-key was pressed");
            }
            updateColors();
            checkGameOver();
        });

        
        $(this).append(generateTable());// Call to launch the game
        generateCell(2);

        /*
        let cell = $("[x=1][y=2]");
        cell.attr("value", 2);
        cell.text(2);
        */
    }
})(jQuery);