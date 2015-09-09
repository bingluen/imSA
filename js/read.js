Query(document).ready(function($) {
	//讀取檔案
	$.ajax({
		url: 'dateEdit.json',
		type: 'get',
		dataType: 'txt',
	})
	.done(function(data){
		console.log(data)
	}.bind(this))
	.fail(function(error) {
	})


});

