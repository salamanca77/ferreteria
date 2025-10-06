<?php

use function PHPSTORM_META\type;

global $wpdb;


$observaciones = "{$wpdb->prefix}observaciones";

if (isset($_POST['btnguardar'])) {

    $datos = [
        'producto' => $_POST['producto'],
        'codigo' => $codigo  = $_POST['codigo'],
        'cantidad' => $codigo  = $_POST['cantidad'],
        'observacion' => $_POST['observacion'],
        'nombre' => $_POST['nombre'],
        'fecha' => $_POST['fecha'],
    ];

    $resultado =  $wpdb->insert($observaciones, $datos);
}

$observaciones = $wpdb->get_results("select * from {$wpdb->prefix}observaciones", ARRAY_A);

//fecha y zona horaria
function fechaHoraZonaHoraria()
{
    date_default_timezone_set('America/Caracas');
    $fechas =  date('Y-m-d H:i:s');
    return $fechas;
}

?>

<div class="wrap">
    <?php
    echo "<h1 class='wp-heading-inline'>" . get_admin_page_title() . "</h>";
    ?>
    <a id="a_adicionar" class="page-title-action">Adicionar</a>
    <a href="https://ferreteriabulcano.com/wp-content/uploads/2024/04/inventario.xls" class="page-title-action float-end">Descargar inventario</a>
    <br /><br />

    <!-- TABLA PRINCIPAL -->
    <table class="wp-list-table widefat fixed striped pages">

        <thead class="bg-red-800">
            <th>Producto</th>
            <th>Codigo</th>
            <th>Cantidad</th>
            <th>Observacion</th>
            <th>Nombre</th>
            <th>fecha y hora</th>
        <!--    <th>Borrar</th>-->
            </th>
        </thead>
<!-- <td>
<a data-id=" . $observacion['observacion_id'] . " class='page-title-actio>Borrar</a>
</td>-->
                    
        <tboby id="the-list">
            <?php

            foreach ($observaciones as $observacion) {

                echo "
                    <tr>
                    <td>" . $observacion['producto'] . "</td>
                    <td>" . $observacion['codigo'] . "</td>
                    <td>" . $observacion['cantidad'] . "</td>
                    <td>" . $observacion['observacion'] . "</td>
                    <td>" . $observacion['nombre'] . "</td>
                    <td>" . $observacion['fecha'] . "</td>
                    
                    </tr>";
            }

            ?>
        </tboby>
    </table>
</div>

<!-- MODAL -->
<div id="id_modal" class="modal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-titl   e">Observaciones</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form id="id_form" method="post">
                <div class="modal-body">
                    <div class="form-group">
                        <div class="row">

                            <div class="col-12">
                                <input type="text" name="producto" id="id_producto" class="form-control" placeholder="Producto">
                            </div>

                            <div class="col-12">
                                <input type="text" name="codigo" id="id_codigo" class="form-control" placeholder="Codigo">
                            </div>

                            <div class="col-12">
                                <input type="text" name="cantidad" id="id_cantidad" class="form-control" placeholder="Cantidad">
                            </div>


                            <div class="col-12">
                                <textarea type="text" name="observacion" id="id_observacion " rows="4" cols="3" class=" form-control" placeholder="Observacion"></textarea>
                            </div>

                            <div class="col-12">
                                <select type="text" name="nombre" id="id_nombre" rows="4" cols="3" class=" form-control" placeholder="nombre">
                                    <option value="Brenda">Brenda</option>
                                    <option value="Gladis">Gladis</option>
                                    <option value="Gavi">Gavi</option>
                                    <option value="Ivan">Ivan</option>
                                    <option value="Milenka">Milenka</option>
                                    <option value="Victor">Victor</option>
                                </select>
                            </div>

                            <input type="hidden" name="fecha" id="id_fecha" value="<?= fechaHoraZonaHoraria(); ?>">

                        </div>
                    </div>
                </div>
                <div class=" modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="submit" class="btn btn-primary" name="btnguardar">Guardar</button>
                </div>
            </form>
        </div>
    </div>
</div>