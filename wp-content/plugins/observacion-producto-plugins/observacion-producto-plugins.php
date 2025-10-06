<?php
/*
Plugin URI: http://observacion.com
Plugin Name: Observacion producto plugins
Description: Este un plugin de registro de observacion
Version: 0.0.1
 */


function Activar_observacionProducto()
{
    global $wpdb;

    $sql = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}observaciones(
        `observacion_id` INT NOT NULL AUTO_INCREMENT,
        `producto` VARCHAR(70) NULL,
        `codigo` VARCHAR(15) NULL,
        `cantidad` INT NULL,
        `observacion` VARCHAR(100) NULL,
        `nombre` VARCHAR(30) NULL,
        `fecha` varchar(50) NOT NULL,
        PRIMARY KEY (`observacion_id`));
      ";
    $wpdb->query($sql);
}

function Desactivar_observacionProducto()
{
}

function Borrar_observacionProducto()
{
}

register_activation_hook(__FILE__, 'Activar_observacionProducto');
register_deactivation_hook(__FILE__, 'Desactivar_observacionProducto');
register_uninstall_hook(__FILE__, 'Borrar_observacionProducto');


//ADICION AL MENU PRINCIPAL 
add_action('admin_menu', 'CrearMenu_observacionProducto');

function CrearMenu_observacionProducto()
{
    add_menu_page(
        'Observaciones', //Titulo pagina
        'Observaciones', //Tiulo del menu
        "vendedor-1", //Capacidad
        plugin_dir_path(__FILE__) . 'admin/php/registro_observaciones.php',
        null, //MostrarContenido de la pagina
        plugin_dir_url(__FILE__) . 'admin/imagen/icono_menu.svg', //direcion de la imagen
        '3'
    );
};

// ENCOLAR JS DE BOOTSTRAP
function EncolarBootstrapJS_observacionProducto($hook)
{
    // echo "<script>console.log('$hook')</script>";
    if ($hook != "observacion-producto-plugins/admin/php/registro_observaciones.php") {
        return;
    }

    wp_enqueue_script('bootstrapJS', plugins_url('admin/bootstrap/js/bootstrap.min.js', __FILE__), array('jquery'));
}

add_action('admin_enqueue_scripts', 'EncolarBootstrapJS_observacionProducto');

// ENCOLAR CCS DE BOOTSTRAP
function EncolarBootstrapCSS_observacionProducto($hook)
{
    // echo "<script>console.log('$hook')</script>";
    if ($hook != "observacion-producto-plugins/admin/php/registro_observaciones.php") {
        return;
    }

    wp_enqueue_style('bootstrapCSS', plugins_url('admin/bootstrap/css/bootstrap.min.css', __FILE__));
}

add_action('admin_enqueue_scripts', 'EncolarBootstrapCSS_observacionProducto');

// ENCOLAR JS PERSONAL
function EncolarJS_observacionProducto($hook)
{
    echo "<script>console.log('$hook')</script>";
    if ($hook != "observacion-producto-plugins/admin/php/registro_observaciones.php") {
        return;
    }

    wp_enqueue_script('personalJS', plugins_url('admin/js/observaciones.js', __FILE__), array('jquery'));
    wp_localize_script('personalJS', 'SolicitudesAjax', [
        'url' => admin_url('admin-ajax.php'),
        'seguridad' => wp_create_nonce('seg')
    ]);
}

add_action('admin_enqueue_scripts', 'EncolarJS_observacionProducto');


// AJAX

function EliminarEncuesta_observacionProducto()
{
    $nonce = $_POST['nonce'];
    if (!wp_verify_nonce($nonce, 'seg')) {
        die('no tiene permisos para ejecutar ese ajax');
    }

    $id = $_POST['id'];
    global $wpdb;
    $tabla = "{$wpdb->prefix}observaciones";

    $wpdb->delete($tabla, array('observacion_id' => $id));
    return true;
}

add_action('wp_ajax_peticioneliminar', 'EliminarEncuesta_observacionProducto');
