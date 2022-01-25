<?php
/*
    Plugin Name: Custom form 
    Description: Custom form plugin
    Version 1.0
    Author: vladmasliuk@gmail.com
*/

/* 
    create table in db (on plugin activation)
*/
function sports_bench_create_db() {
    global $wpdb;
    $charset_collate = $wpdb->get_charset_collate();
    require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
   
    // Create the persons table
    $table_name = $wpdb->prefix . 'persons_form';
    $sql = "CREATE TABLE IF NOT EXISTS $table_name (
        person_id INTEGER NOT NULL AUTO_INCREMENT,
        person_name TEXT NOT NULL,
        person_email TEXT NOT NULL,
        PRIMARY KEY (person_id)
    ) $charset_collate;";
    dbDelta( $sql );
}

register_activation_hook( __FILE__, 'sports_bench_create_db' );

/* 
    add styles
*/
function callback_for_setting_up_scripts() {
    // front style
    wp_enqueue_style( 'front-style', plugin_dir_url(__FILE__) . '/css/front-style.css' );
    // back style
    wp_enqueue_style( 'back-style', plugin_dir_url(__FILE__) . '/css/back-style.css' );
}
    
add_action('init', 'callback_for_setting_up_scripts');

/*  
    register shortcode form
*/
function render_custom_form(){ 
    wp_enqueue_script(
        'cu-form',
        plugin_dir_url(__FILE__) . '/build/index.js',
        ['wp-element'],
        time(),     
        true
    );

    return '<div id="cu-form-front">Loading...</div>';
}
add_shortcode('custom_form_shortcode' , 'render_custom_form');


/*  
    send form data (persone) to database
*/
add_action( 'wp_ajax_send_to_db', 'send_to_db' );
add_action( 'wp_ajax_nopriv_send_to_db', 'send_to_db' );

function send_to_db(){
    if(!empty($_POST['name']) && !empty($_POST['email'])){
        global $wpdb;
        $table_name = $wpdb->prefix .'persons_form';

        $name = $_POST['name'];
        $email = $_POST['email'];
        
        $wpdb->query("INSERT INTO $table_name (person_name, person_email) VALUES ('$name', '$email')" );

        die();
    }
}

/*  
    plugin admin page
*/
add_action('admin_menu', 'formPluginSettingPage');

// register plugin admin page
function formPluginSettingPage(){
    add_menu_page(
        'Persons form page',
        'Persons form',
        'manage_options',
        'cu-persons-form-page',
        'pluginPageTemplate'
    );
}

/*  
    plugin page template
*/
function pluginPageTemplate(){
    wp_enqueue_script(
        'cu-form-back',
        plugin_dir_url(__FILE__) . '/build/index.js',
        ['wp-element'],
        time(),     
        true
    );

    echo '<div id="cu-form-back">Loading...</div>';
}

/*  
    get persons from database
*/
add_action( 'wp_ajax_get_from_db', 'get_from_db' );
add_action( 'wp_ajax_nopriv_get_from_db', 'get_from_db' );

function get_from_db(){
    global $wpdb;
    $table_name = $wpdb->prefix .'persons_form';
    $results = $wpdb->get_results( "SELECT * FROM $table_name" );

    echo json_encode($results);

    die();
}

/*  
    update person 
*/
add_action( 'wp_ajax_update_to_db', 'update_to_db' );
add_action( 'wp_ajax_nopriv_update_to_db', 'update_to_db' );

function update_to_db(){
    if(!empty($_POST['updateName']) && !empty($_POST['updateEmail'])){
        global $wpdb;
        $table_name = $wpdb->prefix .'persons_form';

        $updateId = $_POST['updateId'];
        $updateName = $_POST['updateName'];
        $updateEmail = $_POST['updateEmail'];

        $wpdb->query("UPDATE $table_name SET person_name='$updateName', person_email='$updateEmail' WHERE person_id=$updateId" );
        
        die();
    }
}

/*  
    delete person from database
*/
add_action( 'wp_ajax_delete_from_db', 'delete_from_db' );
add_action( 'wp_ajax_nopriv_delete_from_db', 'delete_from_db' );

function delete_from_db(){
    global $wpdb;
    $table_name = $wpdb->prefix .'persons_form';
    $id = $_POST['id'];

    $wpdb->query("DELETE FROM $table_name WHERE person_id = $id");

    die();
}