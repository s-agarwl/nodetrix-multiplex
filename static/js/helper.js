function normalizeMatrix(matrix)
{
      var min = 10000, max = -1;

      for (var i = 0; i < matrix.length; i++)   
          for (var j = 0; j < matrix.length; j++)
          {  
              if ( matrix[i][j] < min )
                min = matrix[i][j];
              if ( matrix[i][j] > max )  
                max = matrix[i][j];   
            }       

            if( min == max && 0 == min )
                      return;  

       for (var i = 0; i < matrix.length; i++)  
       {
           for (var j = 0; j < matrix.length; j++)  
           {
                    if( min == max  )
                      matrix[i][j] = 1;
                    else
                      matrix[i][j] = (matrix[i][j]-min) / (max-min);
           }
       }
}

function getMax(matrix)
{
    max = -1000;
    
    for (var i = 0; i < matrix.length; i++)   
        for (var j = 0; j < matrix.length; j++)  
            if ( matrix[i][j] > max )  
                max = matrix[i][j];  

    return max;
}

function exp(matrix, power) 
{
  var result = [];   
       for(var j = 0; j < matrix.length; j++) {
        result[j] = [];        
        for(var k = 0; k < matrix[0].length; k++) {
            var sum = 0;
            for(var i = 0; i < matrix.length; i++) {
                sum += matrix[i][k] * matrix[j][i];
            }            result[j].push(sum);
        }
    }
    return result; 
}