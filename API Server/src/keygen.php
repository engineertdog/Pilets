<?php
    $output = null;
    
    /**
     * Generates a random integer between 48 and 122.
     * <p>
     * @return int Non-cryptographically generated random number.
     */
    function findRandom() {
        $mRandom = rand(48, 122);
        return $mRandom;
    }
    
    /**
     * Checks if $random equals ranges 48:57, 56:90, or 97:122.
     * <p>
     * This function is being used to filter $random so that when used in:
     * '&#' . $random . ';' it will generate the ASCII characters for ranges
     * 0:8, a-z (lowercase), or A-Z (uppercase).
     * <p>
     * @param int $mRandom Non-cryptographically generated random number.
     * @return int 0 if not within range, else $random is returned. 
     */
    function isRandomInRange($mRandom) {
        if(($mRandom >=58 && $mRandom <= 64) ||
                (($mRandom >=91 && $mRandom <= 96))) {
            return 0;
        } else {
            return $mRandom;
        }
    }   
    
    for($loop = 0; $loop <= 31; $loop++) {
        for($isRandomInRange = 0; $isRandomInRange === 0;){
            $isRandomInRange = isRandomInRange(findRandom());
        }
        $output .= html_entity_decode('&#' . $isRandomInRange . ';');
    }
    
    echo $output;
?>