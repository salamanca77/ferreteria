<?php
/*
Plugin URI: http://nuevo-producto.com
Plugin Name: Nuevo producto plugins
Description: Este un plugin de registro de nuevos productos
Version: 0.0.1
 */


function Activar_nuevoProducto()
{
    global $wpdb;

    $sql = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}productos_nuevoproducto(
        `producto_id` INT NOT NULL AUTO_INCREMENT,
        `producto` VARCHAR(70) NULL,
        `precio_compra` DECIMAL NULL,
        `precio_venta` DECIMAL NULL,
        `cantidad` DECIMAL NULL NULL,
        `atributo_uno` VARCHAR(150) NULL,
        `atributo_dos` VARCHAR(150) NULL,
        `atributo_tres` VARCHAR(150) NULL,
        `atributo_cuatro` VARCHAR(150) NULL,
        `observacion` VARCHAR(100) NULL,
        `fecha` varchar(50) NOT NULL,
        PRIMARY KEY (`producto_id`));
      ";
    $wpdb->query($sql);
}

function Desactivar_nuevoProducto()
{
}

function Borrar_nuevoProducto()
{
}

register_activation_hook(__FILE__, 'Activar_nuevoProducto');
register_deactivation_hook(__FILE__, 'Desactivar_nuevoProducto');
register_uninstall_hook(__FILE__, 'Borrar_nuevoProducto');


//ADICION AL MENU PRINCIPAL 
add_action('admin_menu', 'CrearMenu_nuevoProducto');

function CrearMenu_nuevoProducto()
{
    add_menu_page(
        'Nuevo producto', //Titulo pagina
        'Nuevo producto', //Tiulo del menu
        "manage_options", //Capacidad
        plugin_dir_path(__FILE__) . 'admin/php/registro_nuevo_producto.php',
        null, //MostrarContenido de la pagina
        plugin_dir_url(__FILE__) . 'admin/imagen/icono_menu.svg', //direcion de la imagen
        '2'
    );
};

// ENCOLAR JS DE BOOTSTRAP
function EncolarBootstrapJS_nuevoProducto($hook)
{
    // echo "<script>console.log('$hook')</script>";
    if ($hook != "nuevo-producto-plugins/admin/php/registro_nuevo_producto.php") {
        return;
    }

    wp_enqueue_script('bootstrapJS', plugins_url('admin/bootstrap/js/bootstrap.min.js', __FILE__), array('jquery'));
}

add_action('admin_enqueue_scripts', 'EncolarBootstrapJS_nuevoProducto');

// ENCOLAR CCS DE BOOTSTRAP
function EncolarBootstrapCSS_nuevoProducto($hook)
{
    // echo "<script>console.log('$hook')</script>";
    if ($hook != "nuevo-producto-plugins/admin/php/registro_nuevo_producto.php") {
        return;
    }

    wp_enqueue_style('bootstrapCSS', plugins_url('admin/bootstrap/css/bootstrap.min.css', __FILE__));
}

add_action('admin_enqueue_scripts', 'EncolarBootstrapCSS_nuevoProducto');

// ENCOLAR JS PERSONAL
function EncolarJS_nuevoProducto($hook)
{
    // echo "<script>console.log('$hook')</script>";
    if ($hook != "nuevo-producto-plugins/admin/php/registro_nuevo_producto.php") {
        return;
    }

    wp_enqueue_script('personalJS', plugins_url('admin/js/observaciones.js', __FILE__), array('jquery'));

    wp_localize_script('personalJS', 'SolicitudesAjax', [
        'url' => admin_url('admin-ajax.php'),
        'seguridad' => wp_create_nonce('seg')
    ]);
}

add_action('admin_enqueue_scripts', 'EncolarJS_nuevoProducto');


// AJAX

function EliminarEncuesta_nuevoProducto()
{
    $nonce = $_POST['nonce'];

    if (!wp_verify_nonce($nonce, 'seg')) {
        die('no tiene permisos para ejecutar ese ajax');
    }

    $id = $_POST['id'];
    global $wpdb;
    $tabla = "{$wpdb->prefix}productos_nuevoproducto";

    $wpdb->delete($tabla, array('producto_id' => $id));
    return true;
}

add_action('wp_ajax_peticioneliminar', 'EliminarEncuesta_nuevoProducto');
