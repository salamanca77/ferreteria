<?php

use function PHPSTORM_META\type;

global $wpdb;

//obteniendo prefijo de la tabla producto
$productos = "{$wpdb->prefix}productos_actualizarproducto";

//obteniendo la informacion del formulario incrustado en el  modal
if (isset($_POST['btnguardar'])) {

    $datos = [
        'producto' => $_POST['producto'],
        'codigo' => $_POST['codigo'],
        'precio_compra' => $_POST['precio_compra'],
        'precio_venta' => $_POST['precio_venta'],
        'cantidad' => $_POST['cantidad'],
        'observacion' => $_POST['observacion'],
        'fecha' => $_POST['fecha'],
    ];

    //insertado la informacion del formulario en la base de datos
    $resultado =  $wpdb->insert($productos, $datos);
}


$productos = $wpdb->get_results("select * from {$wpdb->prefix}productos_actualizarproducto", ARRAY_A);

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
    <a href="https://ferreteriabulcano.com/wp-content/uploads/2024/04/Inventario.xls" class="page-title-action float-end">Descargar inventario</a>
    <br /><br />

    <!-- TABLA PRINCIPAL -->
    <table class="wp-list-table widefat fixed striped pages">

        <thead class="bg-red-800">
            <th>Producto</th>
            <th>Codigo</th>
            <th>P/C</th>
            <th>P/V</th>
            <th>Cantidad</th>
            <th>Observacion</th>
            <th>Fecha</th>
            </th>
        </thead>
        
<!-- <td>
<a data-id=" . $producto['producto_id'] . " class='page-title-action'>Borrar</a>
</td> -->        
        

        <tboby id="the-list">
            <?php

            foreach ($productos as $producto) {

                echo "
                    <tr>
                    <td>" . $producto['producto'] . "</td>
                    <td>" . $producto['codigo'] . "</td>
                    <td>" . $producto['precio_compra'] . "</td>
                    <td>" . $producto['precio_venta'] . "</td>
                    <td>" . $producto['cantidad'] . "</td>
                    <td>" . $producto['observacion'] . "</td>
                    <td>" . $producto['fecha'] . "</td>
                   
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
                <h5 class="modal-title">Actualizacion de Producto</h5>
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
                                <input type="text" name="precio_compra" id="id_precio_compra" class="form-control" placeholder="Precio de compra">
                            </div>

                            <div class="col-12">
                                <input type="text" name="precio_venta" id="id_precio_venta" rows="4" cols="3" class="form-control" placeholder="Precio de venta"></input>
                            </div>

                            <div class="col-12">
                                <input type="text" name="cantidad" id="id_cantidad" rows="4" cols="3" class="form-control" placeholder="Cantidad"></input>
                            </div>

                            <div class="col-12">
                                <textarea type="text" name="observacion" id="id_observacion" rows="2" cols="3" class="form-control" placeholder="Observacion"></textarea>
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