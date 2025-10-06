<?php
/*
Plugin URI: http://actualizar-producto.com
Plugin Name: Actualizar producto plugins
Description: Este un plugin de actualizacin de productos_actualizarProducto
Version: 0.0.1
 */


function Activar_actualizarProducto()
{
    global $wpdb;

    $sql = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}productos_actualizarproducto(
        `producto_id` INT NOT NULL AUTO_INCREMENT,
        `producto` VARCHAR(70) NULL,
        `precio_compra` DECIMAL NULL,
        `precio_venta` DECIMAL NULL NULL,
        `cantidad` DECIMAL NULL NULL,
        `codigo` VARCHAR(150) NULL,
        `observacion` VARCHAR(100) NULL,
        `fecha` varchar(50) NOT NULL,
        PRIMARY KEY (`producto_id`));
      ";
    $wpdb->query($sql);
}

function Desactivar_actualizarProducto()
{
}

function Borrar_actualizarProducto()
{
}

register_activation_hook(__FILE__, 'Activar_actualizarProducto');
register_deactivation_hook(__FILE__, 'Desactivar_actualizarProducto');
register_uninstall_hook(__FILE__, 'Borrar_actualizarProducto');


//ADICION AL MENU PRINCIPAL 
add_action('admin_menu', 'CrearMenu_actualizarProducto');

function CrearMenu_actualizarProducto()
{
    add_menu_page(
        'Actualizar producto', //Titulo pagina
        'Actualizar producto', //Tiulo del menu
        "manage_options", //Capacidad
        plugin_dir_path(__FILE__) . 'admin/php/registro_actualizar_producto.php',
        NULL, //MostrarContenido de la pagina
        plugin_dir_url(__FILE__) . 'admin/imagen/icono.svg', //direcion de la imagen
        '4'
    );
};

// ENCOLAR JS DE BOOTSTRAP
function EncolarBootstrapJS_actualizarProducto($hook)
{
    // echo "<script>console.log('$hook')</script>";
    if ($hook != "actualizar-producto-plugins/admin/php/registro_actualizar_producto.php") {
        return;
    }

    wp_enqueue_script('bootstrapJS', plugins_url('admin/bootstrap/js/bootstrap.min.js', __FILE__), array('jquery'));
}

add_action('admin_enqueue_scripts', 'EncolarBootstrapJS_actualizarProducto');

// ENCOLAR CCS DE BOOTSTRAP
function EncolarBootstrapCSS_actualizarProducto($hook)
{
    // echo "<script>console.log('$hook')</script>";
    if ($hook != "actualizar-producto-plugins/admin/php/registro_actualizar_producto.php") {
        return;
    }

    wp_enqueue_style('bootstrapCSS', plugins_url('admin/bootstrap/css/bootstrap.min.css', __FILE__));
}

add_action('admin_enqueue_scripts', 'EncolarBootstrapCSS_actualizarProducto');

// ENCOLAR JS PERSONAL
function EncolarJS_actualizarProducto($hook)
{
    // echo "<script>console.log('$hook')</script>";
    if ($hook != "actualizar-producto-plugins/admin/php/registro_actualizar_producto.php") {
        return;
    }

    wp_enqueue_script('personalJS', plugins_url('admin/js/observaciones.js', __FILE__), array('jquery'));

    wp_localize_script('personalJS', 'SolicitudesAjax', [
        'url' => admin_url('admin-ajax.php'),
        'seguridad' => wp_create_nonce('seg')
    ]);
}

add_action('admin_enqueue_scripts', 'EncolarJS_actualizarProducto');


// AJAX

function EliminarEncuesta_actualizarProducto()
{
    $nonce = $_POST['nonce'];

    if (!wp_verify_nonce($nonce, 'seg')) {
        die('no tiene permisos para ejecutar ese ajax');
    }

    $id = $_POST['id'];

    global $wpdb;
    $tabla = "{$wpdb->prefix}productos_actualizarproducto";

    $wpdb->delete($tabla, array('producto_id' => $id));
    return true;
}

add_action('wp_ajax_peticioneliminar', 'EliminarEncuesta_actualizarProducto');
