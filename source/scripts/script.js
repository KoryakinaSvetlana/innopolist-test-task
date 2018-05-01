$(function() {
    $('.file-actions__table-wrapper').simplebar();

    var isAdvancedUpload = function() {
      var div = document.createElement('div');
      return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
    }();

    var $form = $('.box');

    if (isAdvancedUpload) {
      $form.addClass('has-advanced-upload');
      var droppedFiles = false;

      $form.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
      })
      .on('dragover dragenter', function() {
        $form.addClass('is-dragover');
      //  console.log('dragover dragenter');
      })
      .on('dragleave dragend drop', function() {
        $form.removeClass('is-dragover');
        console.log('dragleave dragend drop');
      })
      .on('drop', function(e) {
        droppedFiles = e.originalEvent.dataTransfer.files;
        console.log('drop');
        console.log(droppedFiles);
      });

    }

});
