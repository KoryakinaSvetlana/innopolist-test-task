var preloadFiles = [
  {name: 'Текстовый документ.txt', size: 29, type: 'text/plain', lastModifiedDate: new Date(2017, 9, 13)},
  {name: 'Текстовый документ.doc', size: 11438, type: 'application/msword', lastModifiedDate: new Date(2017, 9, 13)},
  {name: 'Изображение.jpg', size: 4178, type: 'image/jpeg', lastModifiedDate: new Date(2017, 9, 13)},
  {name: 'Гипертекстовая страница.html', size: 46, type: 'text/html', lastModifiedDate: new Date(2017, 9, 13)},
];

var uploadFiles = [];

function getClassName(type) {
  var result = 'file--txt';
  switch (type) {
    case 'text/plain':
      result = 'file--txt';
    break;
    case 'application/msword':
      result = 'file--doc';
    break;
    case 'image/jpeg':
      result = 'file--jpg';
    break;
    case 'text/html':
      result = 'file--html';
    break;
  }
  return result;
}

function getSize(size) {
  return (size < 1024) ? size + ' байт' :  Math.round(size / 1024 * 100) / 100 + ' Кб';
}

function getDate(date) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  return (day < 10 ? '0' + day : day) + '.' + (month < 10 ? '0' + month : month) + '.' + year;
}

function addTableRow(table, data, prefix) {
  var count = table.find('tr').length;
  var id = prefix + count;

  var newRow = $("<tr>");
  var cols = "";

  cols += '<td class="checkbox"><input type="checkbox" id="' + id + '"><label for="' + id + '"></label></td>';
  cols += '<td><span class="file">' + data.name + '</span><span>' + getSize(data.size) + '</span></td>';
  cols += '<td>от '+ getDate(data.lastModifiedDate) +'</td>';

  newRow.append(cols);
  //add Class
  newRow.find('.file').addClass(getClassName(data.type));
  //add event listener
  newRow.find('input[type="checkbox"]').on('click', checkboxClick);
  //add row to table
  table.append(newRow);
}

function clearTable(table) {
  table.find("tr").remove();
}

function checkboxClick(e) {
  var id = $(this).prop('id');
  //uncheck other checknox
  $('.file-actions__table input[type="checkbox"]').each(function() {
    if ($(this).prop('id') != id) {
      $(this).prop('checked', false);
      $(this).parent().parent().removeClass('file-actions__checked-item');
    }
  });

  if ($(this).prop('checked')) {
    $(this).parent().parent().addClass('file-actions__checked-item');
  } else {
    $(this).parent().parent().removeClass('file-actions__checked-item');
  }

  if ($('.file-actions__table input[type="checkbox"]:checked').length > 0) {
    showStep(2);
  } else {
    hideStep();
  }
}

function showStep(num) {
  $('.steps__item:eq(' + (num - 1) + ')').removeClass('steps__item--hidden');
}

function hideStep() {
  $('.steps__item:gt(0)').addClass('steps__item--hidden');
  $('#apply').prop("disabled", true);
  clearOperation();
}

function clearOperation() {
  $('.steps__operation input[type="radio"]').prop('checked', false);
}

function getSelectedFile() {
  var index;
  var result = false;
  var checkElem = $('.file-actions__table input[type="checkbox"]:checked');
  if (checkElem.length > 0) {
     if (checkElem.prop("id").indexOf('upload')!== -1) {
       index = checkElem.prop("id").substring(6);
       result = uploadFiles[index];
     } else {
       index = checkElem.prop("id").substring(7);
       result = preloadFiles[index];
     }
  }
  return result;
}

$(function() {
  var $form = $('.box');
  var $toggleButton = $('.navigation__toggle button');
  var $navigation = $('.navigation');
  var $input = $form.find('input[type="file"]');
  var $menuItem = $('.navigation__popup-item a');
  var $fileCheck = $('.file-actions__table input[type="checkbox"]');
  var $operations = $('.steps__operation input[type="radio"]');
  var $applyButton = $('#apply');
  var $modal = $('.modal');
  var $modalCloseButton = $('.modal-close');
  var $newStartButton = $('#newStart');

  //init page
  var init = function() {
    $('.file-actions__table-wrapper').simplebar();

    //data for preload table
    clearTable($('#preloadFilesTable'));

    $.each(preloadFiles, function( index, item ) {
      addTableRow($('#preloadFilesTable'), item, 'preload')
    });

    clearTable($('#uploadFilesTable'));
  }();

  //check browser abilities
  var isAdvancedUpload = function() {
    var div = document.createElement('div');
    return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
  }();

  //events
  $toggleButton.on('click', function(e) {
    e.preventDefault();
    $navigation.toggleClass('navigation--open');
  });

  $menuItem.on('click', function(e) {
    e.preventDefault();
    $navigation.removeClass('navigation--open');
  });

  $fileCheck.on('click', checkboxClick);

  $operations.on('click', function(e) {
    showStep(3);
    $applyButton.prop("disabled", false);
  });

  $applyButton.on('click', function(e) {
    $('.modal__content p').remove();

    var file = getSelectedFile();
    var fileInfo = $("<p>");
    var fileInfoContent = '<strong>Выбранный файл:</strong> ' + (file ? file.name : '-');
    fileInfo.append(fileInfoContent);

    var operationInfo = $("<p>");
    var operationInfoContent = '<strong>Операция:</strong> ' + $('.steps__operation input[type="radio"]:checked').prop('id');
    operationInfo.append(operationInfoContent);

    var signTypeInfo = $("<p>");
    var signTypeInfoContent = '<strong>Тип подписи:</strong> ' + ($('#sign-type').prop('checked') ? 'Отсоединенная' : 'Присоединенная');
    signTypeInfo.append(signTypeInfoContent);

    $('.modal__content').append(fileInfo);
    $('.modal__content').append(operationInfo);
    $('.modal__content').append(signTypeInfo);

    $modal.addClass('modal--open');
  });

  $modalCloseButton.on('click', function(e) {
    $modal.removeClass('modal--open');
  });

  $newStartButton.on('click', function(e) {
    $modal.removeClass('modal--open');

    $('.file-actions__table input[type="checkbox"]').each(function() {
      $(this).prop('checked', false);
      $(this).parent().parent().removeClass('file-actions__checked-item');
    });

    uploadFiles = [];
    $('#uploadFilesTable tr').remove();
    $('#uploadFilesTableContainer').addClass('file-actions__table-wrapper--hidden');
    hideStep();
  });

  //File Uploader
  if (isAdvancedUpload) {
    $form.addClass('has-advanced-upload');
    var droppedFiles = false;

    $form.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
      e.preventDefault();
      e.stopPropagation();
    })
    .on('dragover dragenter', function() {
      $form.addClass('is-dragover');
    })
    .on('dragleave dragend drop', function() {
      $form.removeClass('is-dragover');
    })
    .on('drop', function(e) {
      droppedFiles = e.originalEvent.dataTransfer.files;
      $('#uploadFilesTableContainer').removeClass('file-actions__table-wrapper--hidden');
      $.each( droppedFiles, function(i, file) {
        addTableRow($('#uploadFilesTable'), file, 'upload');
        uploadFiles.push(file)
      });
    });
  }

  $input.on('change', function(e) {
    $('#uploadFilesTableContainer').removeClass('file-actions__table-wrapper--hidden');
    $.each( e.target.files, function(i, file) {
      addTableRow($('#uploadFilesTable'), file, 'upload');
      uploadFiles.push(file)
    });
  });

});
