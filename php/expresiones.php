<?php
return [
    'cuil' => '/^\d{2}-\d{8}-\d{1}$/',
    'nombre' => '/^[a-zA-ZÀ-ÿ\s.]{1,20}$/',
    'apellido' => '/^[a-zA-ZÀ-ÿ\s]{1,20}$/',
    'tipo_contratacion' => '/^(1|2|3|4|5)$/',
    'tipo_liquidacion' => '/^(1|2|3)$/',
    'dias_trabajados' => '/^([0-9]|[1-2][0-9]|3[0])$/',
    'cargo' => '/^[a-zA-ZÀ-ÿ\s.]{1,50}$/',
    'clase' => '/^[a-zA-ZÀ-ÿ\s.]{1,50}$/',
    'categoria' => '/^[a-zA-ZÀ-ÿ\s.]{1,50}$/',
    'total_remunerativo' => '/^\$?\s*\d{1,3}(,\d{3})*(\.\d{1,2})?$/',
    'total_no_remunerativo' => '/^\$?\s*\d{1,3}(,\d{3})*(\.\d{1,2})?$/',
    'tipo_aporte_adicional' => '/^\$-\s*|\$?\d{1,3}(\.\d{3})*(,\d{1,2})?$/',
    'monto_aporte_adicional' => '/^\$-\s*|\$?\d{1,3}(\.\d{3})*(,\d{1,2})?$/',
    'tipo_licencia' => '/^(1|2|3)$/',
    'dias_licencia' => '/^([0-9]|[1-2][0-9]|3[0-1])$/',
    'mes' => '/^(1|2|3|4|5|6|7|8|9|10|11|12)$/',
    'year' => '/^(19[0-9]{2}|20[0-9]{2})$/',
    'input' => '/^([1-9][0-9])$/'
];
?>