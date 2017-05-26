$("#someid").on("click",function(){
	alert('it works')
})

$("#search-button").on('mouseover',function(){
	val = new Date().getTime();
	console.log("New value is " + val)
	$("#someid").val(val)
})
