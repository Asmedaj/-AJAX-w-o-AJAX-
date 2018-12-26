<?php 

$arr = array(1 => "one", 
   2 => "two", 
   3 => "three",
   4 => "four",
   5 => "five",
   6 => "six",
   7 => "seven",
   8 => "eight",
   9 => "nine",
   10 => "ten"
);

if (isset($_GET['id'])) {
    switch($_GET['meth']) {
        case 'fetch':
            header('content-type: application/json; charset=utf-8');
            echo json_encode(getData($_GET['id'],$arr));
            break;
        case 'JSONP':
            echo $_GET['callback'] . '('.json_encode(getData($_GET['id'],$arr)).')';
            break;
        case 'SSE':
            header('content-type: text/event-stream');
            echo "data: ".json_encode(getData($_GET['id'],$arr)). PHP_EOL; 
            break;    
        case 'IFRAME':
            echo  '<script>parent.CallbackRegistry[window.name](' .json_encode(getData($_GET['id'],$arr)).')</script>';
            break;
                    
        default: 
    }

}

function getData($id, $arr) {
    if (isset($arr[$id])) {
        return $arr[$id]; 
    } else {
        return 'no data';
    }
}
?>

