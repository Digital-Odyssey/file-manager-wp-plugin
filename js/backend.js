(function($){

	$(document).ready(function(e) {
		
		//post slider system
		if(wp.media !== undefined){
				
			//Global vars
			//var globalScope = 'test';
			
			var image_custom_uploader,
			target_text_field = '',
			targetFileID = '',
			targetFileName = '',
			targetFileSizeField = '',
			targetFileDateAddedField = '',
			targetFileSubtypeField = '';
						
			//Add New file btn
			if( $('#fw_insert_new_file_btn').length > 0 ){

				//Bind click events for dynamic elements
				methods.bindUploadFileClickEvent();
				methods.bindDeleteFileClickEvent();
				methods.sortableFiles();
			
				$('#fw_insert_new_file_btn').on('click', function(e) {
					
					e.preventDefault();
					
					//Get counter value based on last input field in container
					if( $('#fw_files_manager_container').find('.pm-files-system-field-container:last-child').length > 0 ){

						var counterValue = $('.pm-files-system-field-container:last-child').attr('id'),
						counterValueId = counterValue.substring(counterValue.lastIndexOf('_') + 1),
						counterValueIdFinal = ++counterValueId;

					} else {

						counterValueIdFinal = 0;
						$('#fw_files_manager_container').html('');

					}

					//alert(counterValueIdFinal);
					
					//Append new slide field
					var wrapperStart = '<div class="pm-files-system-field-container" id="pm_files_system_field_container_'+counterValueIdFinal+'">';

					var dragger = '<div class="fw-file-drag-handle dashicons dashicons-move"></div>';
					
					var field1 = '<input type="text" value="" name="fw_uploaded_files[]" id="fw_uploaded_files_'+counterValueIdFinal+'" class="pm-file-system-upload-field" readonly />';

					var field2 = '<input type="button" value="Select File" class="button button-primary file_system_upload_file_button" id="pm_slider_system_post_btn_'+counterValueIdFinal+'" />';

					var field3 = '&nbsp; <input type="button" value="Delete File" class="button button-secondary button-large delete file_system_remove_file_button" id="pm_slider_system_post_remove_btn_'+counterValueIdFinal+'" />';

					var field4 = '<input type="hidden" name="fw_uploaded_file_id[]" id="fw_uploaded_file_id_'+counterValueIdFinal+'" class="fw-uploaded-file-id" />';

					var field5 = '<input type="hidden" name="fw_uploaded_file_name[]" id="fw_uploaded_file_name_'+counterValueIdFinal+'" class="fw-uploaded-file-name" />';

					var field6 = '<input type="hidden" name="fw_uploaded_files_size[]" id="fw_uploaded_files_size_'+counterValueIdFinal+'" class="fw-uploaded-files-size" />';

					var field7 = '<input type="hidden" name="fw_uploaded_files_date_added[]" id="fw_uploaded_files_date_added_'+counterValueIdFinal+'" class="fw-uploaded-files-date-added" />';

					var field8 = '<input type="hidden" name="fw_uploaded_files_subtype[]" id="fw_uploaded_files_subtype_'+counterValueIdFinal+'" class="fw-uploaded-files-subtype" />';
					
					var wrapperEnd = '</div>';

					$('#fw_files_manager_container').append(wrapperStart + dragger + field1 + field2 + field3 + field4 + field5 + field6 + field7 + field8 + wrapperEnd);

					methods.sortableFiles();
					
				});
				
			}
				
						
		}//end if
		
	});
	
	/* ==========================================================================
	   Methods
	   ========================================================================== */
		var methods = {

			bindUploadFileClickEvent : function(e) {

				$( 'body' ).on( 'click', '.file_system_upload_file_button', function(e) {
					
					e.preventDefault();
					
					var btnId = $(this).attr('id'),
					targetTextFieldID = btnId.substring(btnId.lastIndexOf('_') + 1);		
					
					//alert(targetTextFieldID);
					
						
					//If the uploader object has already been created, reopen the media library window
					if (image_custom_uploader) {

						image_custom_uploader.open();
						target_text_field = $('#fw_uploaded_files_'+targetTextFieldID);
						targetFileID = $('#fw_uploaded_file_id_'+targetTextFieldID);
						targetFileName = $('#fw_uploaded_file_name_'+targetTextFieldID);
						targetFileSizeField = $('#fw_uploaded_files_size_'+targetTextFieldID);
						targetFileDateAddedField = $('#fw_uploaded_files_date_added_'+targetTextFieldID);
						targetFileSubtypeField = $('#fw_uploaded_files_subtype_'+targetTextFieldID);

						return;
					}

				});
							
				//Triggers the Media Library window
				image_custom_uploader = wp.media.frames.file_frame = wp.media({
					title: 'Choose File',
					button: {
						text: 'Choose File'
					},
					 multiple: false
				 });
				 
				 //When a file is selected, grab the URL and set it as the text field's value
				 image_custom_uploader.on('select', function() {
					 
					//Get file information
					attachment = image_custom_uploader.state().get('selection').first().toJSON();
					var url = attachment['url'],
					fileID = attachment['id'],
					fileName = attachment['name'],
					fileSize = attachment['filesizeHumanReadable'],
					dateAdded = attachment['dateFormatted'],
					fileSubType = attachment['subtype'];
					
					console.table(attachment);

					//Save file information to hidden fields
					$(target_text_field).val(url);
					$(targetFileID).val(fileID);
					$(targetFileName).val(fileName);
					$(targetFileSizeField).val(fileSize);
					$(targetFileDateAddedField).val(dateAdded);
					$(targetFileSubtypeField).val(fileSubType);

					//alert(fileSubType);
		
				 });
				
			},
			
			bindDeleteFileClickEvent : function() {
			
				$( 'body' ).on( 'click', '.file_system_remove_file_button', function(e) {
					
					e.preventDefault();

					var btnId = $(this).attr('id'),
					targetTextFieldID = btnId.substring(btnId.lastIndexOf('_') + 1);
					
					var targetTextFieldContainer = $('#pm_files_system_field_container_'+targetTextFieldID).remove();					

				});

			},

			sortableFiles : function() {
			
				$( '#fw_files_manager_container' ).sortable({
					handle: '.fw-file-drag-handle',
					cursor: 'grabbing',
					axis: "y",
					stop: function( e, ui ) {
						methods.updateFilesOrder();
					},
				});
				
			},
			
			updateFilesOrder : function () {
 
		    /* In each of rows */
		    $('.pm-files-system-field-container').each( function(i){
		 
					/* Increase index by 1 to avoid "0" as first number. */
					var $this =  $(this),
					counter = i;

					$this.attr('id', 'pm_files_system_field_container_'+counter+'');
					
					/* Update order number on container */

					$this.find('.file_system_upload_file_button').attr('id', 'fw_uploaded_files_btn_'+counter+'');

					$this.find('.pm-file-system-upload-field').attr('id', 'fw_uploaded_files_'+counter+'');			

					$this.find('.file_system_remove_file_button').attr('id', 'fw_uploaded_files_remove_btn_'+counter+'');

					$this.find('.fw-uploaded-file-id').attr('id', 'fw_uploaded_file_id_'+counter+'');

					$this.find('.fw-uploaded-file-name').attr('id', 'fw_uploaded_file_name_'+counter+'');

					$this.find('.fw-uploaded-files-size').attr('id', 'fw_uploaded_files_size_'+counter+'');

					$this.find('.fw-uploaded-files-date-added').attr('id', 'fw_uploaded_files_date_added_'+counter+'');

					$this.find('.fw-uploaded-files-subtype').attr('id', 'fw_uploaded_files_subtype_'+counter+'');
				

		    });

			},

		}

})(jQuery);