<?php

session_start();
require_once '../dbconfig.php';

try {
  if (true) {

    echo json_encode($crud->getShiftTableObject(), JSON_PRETTY_PRINT);

  } else {
    throw new Exception('Wrong arguments.');
  }
} catch (PDOException $e) {
  echo $e;
}

?>
