<?php 

/*
Plugin Name: File Groups Manager
Plugin URI: http://www.pulsarmedia.ca
Description: File Groups Manager
Version: 1.0
Author: Pulsar Media
Author URI: http://www.pulsarmedia.ca
License: GPLv2
*/

//Actions
add_action('init', 'fw_register_post_type');
//add_action('init', 'fw_register_categories');
//add_action('init', 'fw_register_tags');

//Custom metaboxes
add_action('admin_init', 'fw_metaboxes');

//Load scripts
add_action('admin_enqueue_scripts', 'fw_admin_scripts');
//add_action('wp_enqueue_scripts', 'fw_frontend_scripts');

//Settings page
//add_action('admin_menu', 'fw_settings_page' );

//Save post fields
add_action('save_post', 'fw_save_fields', 10, 2);

add_action( 'pre_get_posts', 'fw_output_files' );

//Translation support
add_action('plugins_loaded', 'fw_load_textdomain');


/**** FUNCTIONS **********************************************************************************************/

//Output files on front end
function fw_output_files( $query ) {

	if ( $query->is_main_query() && $query->get( 'post_type' ) == 'post_filemanager' ) {
		
		add_filter('the_content', 'fw_after_post_content');

	}

}

function fw_after_post_content($content) {

	$post_id = get_the_ID();

	$fw_filemanager_post_files = get_post_meta( $post_id, 'fw_filemanager_post_files', true ); //ARRAY VALUE	

	$after_content = '';

	if( is_array($fw_filemanager_post_files) && count($fw_filemanager_post_files) > 0 ){

		$after_content .= '<div class="fw-file-groups-embed-container">';
																
			foreach($fw_filemanager_post_files as $file) {
					
				$after_content .= '<embed src="'. $file['file'] .'#toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0&scrollbar=0 " type="application/pdf" width="100%" height="1000px" />';
					
			}

		$after_content .= '</div>';
			
	}

	return $content . $after_content;

}


function fw_register_post_type() {
	
    register_post_type('post_filemanager',
		array(
			'labels' => array(
				'name' => __( 'File Groups', 'filemanager' ),
				'singular_name' => __( 'File Groups', 'filemanager' ),
				'add_new' => __( 'Add New File Group', 'filemanager' ),
				'add_new_item' => __( 'Add New File Group', 'filemanager' ),
				'edit' => __( 'Edit', 'filemanager' ),
				'edit_item' => __( 'Edit File Group', 'filemanager' ),
				'new_item' => __( 'New File Group', 'filemanager' ),
				'view' => __( 'View', 'filemanager' ),
				'view_item' => __( 'View File Groups', 'filemanager' ),
				'search_items' => __( 'Search File Groups', 'filemanager' ),
				'not_found' => __( 'No File Groups found', 'filemanager' ),
				'not_found_in_trash' => __( 'No File Groups found in Trash', 'filemanager' ),
				'parent' => __( 'Parent File Group', 'filemanager' )
			),
			'public' => true,
            'menu_position' => 5, 
            'supports' => array('title'),
            'has_archive' => true,
			'description' => __( 'An effective tool for creating and managing file groups.', 'filemanager' ),
			'public' => true,
			'show_ui' => true, 
			'_builtin' => false,
			'map_meta_cap' => true,
			'capability_type' => 'post',
			'hierarchical' => false,
			'pages' => true,
			'rewrite' => array('slug' => 'file-group' ),
		)
	); 
	
	flush_rewrite_rules();
	
}


function fw_load_textdomain() { 
	load_plugin_textdomain( 'filemanager', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' ); 
} 

function fw_admin_scripts() {
	
	wp_enqueue_media();
	wp_enqueue_script('jquery-ui-core');
	//wp_enqueue_script("jquery-effects-core");

	wp_enqueue_script( 'main-js', plugin_dir_url(__FILE__) . 'js/backend.js', array(), '1.0', true );
	wp_enqueue_style( 'main-css', plugin_dir_url(__FILE__) . 'css/backend.css' );
	
}

function fw_frontend_scripts() {
	//wp_enqueue_script( 'pulsar-premium-properties', plugin_dir_url(__FILE__) . 'js/pm-premium-properties-front.js', array(), '1.0', true );
	//wp_enqueue_style( 'pulsar-premium-properties', plugin_dir_url(__FILE__) . 'css/pm-premium-properties.css' );	
}

function fw_metaboxes() {	
	//Post Gallery
	add_meta_box( 
		'fw_post_files', //ID
		__('Files', 'filemanager'),  //label
		'fw_post_files_function' , //function
		'post_filemanager', //Post type
		'normal', 
		'high' 
	);
	
}


function fw_post_files_function($post) {
	
	// Use nonce for verification
  wp_nonce_field( 'theme_metabox', 'post_meta_nonce' );
	
	//Retrieve the meta value if it exists
	$fw_filemanager_post_files = get_post_meta( $post->ID, 'fw_filemanager_post_files', true ); //ARRAY VALUE	
		
	?>
        
		<div class="fw-files-manager-container">
                
				<p><?php _e('Add or remove PDF files', 'filemanager') ?></p>
								
				<div id="fw_files_manager_container">
				
						<?php 
						
								$counter = 0;
						
								if( is_array($fw_filemanager_post_files) && count($fw_filemanager_post_files) > 0 ){
																
									foreach($fw_filemanager_post_files as $file) {
									
											echo '<div class="pm-files-system-field-container" id="pm_files_system_field_container_'.$counter.'">';

												echo '<div class="fw-file-drag-handle dashicons dashicons-move"></div>';
				
												echo '<input type="text" value="'.esc_html( $file['file'] ).'" name="fw_uploaded_files[]" id="fw_uploaded_files_'.$counter.'" class="pm-file-system-upload-field" readonly />';													

												echo '<input type="button" value="'.__('Select File', 'filemanager').'" class="button button-primary file_system_upload_file_button" id="fw_uploaded_files_btn_'.$counter.'" />';

												echo '&nbsp; <input type="button" value="'.__('Delete File', 'filemanager').'" class="button button-secondary button-large delete file_system_remove_file_button" id="fw_uploaded_files_remove_btn_'.$counter.'" />';	

												echo '<ul class="fw-file-information">';
													echo '<li><b>File ID:</b> '. $file['file_id'] .'</li>';
													echo '<li><b>File name:</b> '. $file['file_name'] .'</li>';
													echo '<li><b>File size:</b> '. $file['file_size'] .'</li>';
													echo '<li><b>Date added:</b> '. date( 'm-d-Y', strtotime($file['file_date_added']) ) .'</li>';
													echo '<li><b>File type:</b> '. $file['file_subtype'] .'</li>';
												echo '</ul>';

												echo '<input type="hidden" value="'. $file['file_id'] .'" name="fw_uploaded_file_id[]" id="fw_uploaded_file_id_'.$counter.'" class="fw-uploaded-file-id" />';

												echo '<input type="hidden" value="'. $file['file_name'] .'" name="fw_uploaded_file_name[]" id="fw_uploaded_file_name_'.$counter.'" class="fw-uploaded-file-name" />';

												echo '<input type="hidden" value="'. $file['file_size'] .'" name="fw_uploaded_files_size[]" id="fw_uploaded_files_size_'.$counter.'" class="fw-uploaded-files-size" />';

												echo '<input type="hidden" value="'. $file['file_date_added'] .'" name="fw_uploaded_files_date_added[]" id="fw_uploaded_files_date_added_'.$counter.'" class="fw-uploaded-files-date-added" />';

												echo '<input type="hidden" value="'. $file['file_subtype'] .'" name="fw_uploaded_files_subtype[]" id="fw_uploaded_files_subtype_'.$counter.'" class="fw-uploaded-files-subtype" />';
											
											echo '</div>';
											
											$counter++;
											
									}
										
								} else {
								
										//Default value upon post initialization
										echo '<b><i>'.__('No files found','filemanager').'</i></b><br><br>';
										
								}                    
						
						?>            
				
					</div>
					
					<div class="fw-divider"></div>

					<input type="button" id="fw_insert_new_file_btn" class="button button-primary " value="<?php _e('Insert File','filemanager') ?>">
			
			</div>      
    
    <?php
	
}


//SAVE DATA
function fw_save_fields( $post_id, $post_type ) { //@param: id @param: verify post type
	
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE )
      return;
	  
	//Security measure
	if( isset($_POST['post_meta_nonce'])) :
	
		if ( !wp_verify_nonce( $_POST['post_meta_nonce'], 'theme_metabox' ) )
		    return;
			
		if ( !current_user_can( 'edit_page', $post_id ) )
			return;	

		if ( $post_type->post_type == 'post_filemanager' ) {	
			
			if(isset($_POST["fw_uploaded_files"])){
				
				$files = array();		
				$counter = 0;
								
				foreach($_POST["fw_uploaded_files"] as $key => $file){
					
					if(!empty($file)){

						$files[$counter] = array( 
								'file' => sanitize_text_field($file),
								'file_id' => sanitize_text_field($_POST["fw_uploaded_file_id"][$counter]),
								'file_name' => sanitize_text_field($_POST["fw_uploaded_file_name"][$counter]),
								'file_size' => $_POST["fw_uploaded_files_size"][$counter],
								'file_date_added' => $_POST["fw_uploaded_files_date_added"][$counter],
								'file_subtype' => $_POST["fw_uploaded_files_subtype"][$counter],
						);

						$counter++;		

					}					
								
				}
							
				update_post_meta($post_id, "fw_filemanager_post_files", $files);
				
			} else {
					
				update_post_meta($post_id, "fw_filemanager_post_files", '');
				
			}	
			
						
		}
	
	endif;	
}

?>