async function showError() {
    console.log('error');

    var $error = $('<div>')
    $error.text('Please select a sorting algorithm')
    $error.addClass('errorMsg')
    $error.appendTo("body")
    await sleep(2000)

    $error.remove();
}