
$(document).ready(function(){
// Chequeo conexión //
if(navigator.onLine){
$( "body" ).pagecontainer( "change", "#login");
}

else{
	$( "body" ).pagecontainer( "change", "#noInternet");
	$("#intentarNuevamente").on("click", function(){
	if(checkConection()){
		$( "body" ).pagecontainer( "change", "#login");
	}
});

}

function checkConection(){
	if(navigator.onLine){
		return true;
	}
	else{
		return false;
	}
}
// !Chequeo conexión //


/* Login Form */
	$('#login-form').submit(function() { 

		event.preventDefault();
		var datosUsuario = $("#nombredeusuario").val();
		var datosPassword = $("#clave").val();
		
	  	archivoValidacion = "http://juanmamigliore.com.ar/app-php/validation.php";
		
		$.ajax({ 
			url: archivoValidacion,
			type: 'POST',
		    data: {
		    	usuario:datosUsuario,
		    	password:datosPassword
		    },
		    beforeSend: function(){
		    	$(".modal").show();
		    },
		    complete: function(){
		    	$(".modal").hide();
		    },
		    
		    success: function(output) {
		    	var message= $.trim(output);

		    	switch(message){

		    		case 'login_success':
		    		$.mobile.changePage("#menu");
		    		consultarEventos();
		    		break;

		    		case 'error_password':
		    		alert("Contraseña Incorrecta");
		    		break;

		    		case 'error_user':
		    		alert("Usuario Incorrecto");
		    		break;

		    		case 'error_conection':
		    		alert("Error de Conexión");
		    		break;

		    		case 'error_empty':
		    		alert("Datos Vacíos");
		    		break;
		    	}
		    }
		});
	 });
/* !Login Form */

	    
	function consultarEventos(){

			$icons='<a href="#" class="fav-handler"><img src="images/myImg/star.png"></a><a href="#" class="delete-handler"><img src="images/myImg/trash.png" alt=""></a>'

			$.getJSON( "http://juanmamigliore.com.ar/app-php/conexion.php").done(function(resultados) {

			$.each(resultados, function(i, campo){

				$myCard = $("<li class='card' data-id="+campo.id_evento+">").append($("<div class='wrapper'>")
				.append($("<div class='text'></div>").append($("<h1>"+ campo.titulo +"</h1><p class='date'>"+ campo.fecha +"</p><p>"+campo.contenido+"</p>")))
				.append($("<div class='card-icons'>").append($icons))); 
			
			//$(".card-wrapper").append($myCard);
				categoria(campo.estado,campo.id_categoria,campo.favorito);
	       		 });
			});

		}        
	

	function categoria(estado,id_categoria,fav){

		if(estado==0){
			if(fav==0){
				if(id_categoria==1){
					$('#colectivos .card-wrapper').append($myCard);
				}
				else if(id_categoria==2){
					$('#personales .card-wrapper').append($myCard);
				}
			}
				else if(fav==1){
					$('#favoritos .card-wrapper').append($myCard);
				}
			}
	}


	function consultaAjax(value,id_value){

		$.ajax({ 
			url: 'http://juanmamigliore.com.ar/app-php/consultas.php',
			type: 'post',
		    data: {
		    	action: value,
		    	id: id_value,
		    	
		    },
		    beforeSend: function(){
		    	$(".modal").show();
		    },
		    complete: function(){
		    	$(".modal").hide();
		    },
		    success: function(output) {

		    }
		});
	}

	function addEventAjax(titulo_val,contenido_val,fecha_val,categoria_val){
		$.ajax({
			url: 'http://juanmamigliore.com.ar/app-php/newEvent.php',
			type: 'post',
			data: {
		    	titulo: titulo_val,
		    	contenido:contenido_val,
		    	fecha:fecha_val,
		    	categoria:categoria_val
			},
			beforeSend: function(){
		    	$(".modal").show();
		    },
		    complete: function(){
		    	$(".modal").hide();
		    },
		    success: function(output) {
		    	alert("Evento Agregado");
		    	var myArray = JSON.parse(output);
		    	console.log(myArray);
		    	refreshList(myArray[0],myArray[1],myArray[2],myArray[3],myArray[4]);
		    }
		});
	}




	function refreshPage()
	{
	    jQuery.mobile.changePage(window.location.href, {
	        allowSamePageTransition: true,
	        transition: 'none',
	        reloadPage: true
	    });
	}


	function modifyFavourite(id){

		consultaAjax('favourite',id);
	}

	function modifyEventStatus(id){

		consultaAjax('status',id);
	}

	$(document).on('click', '.delete-handler', function(){ 
	    alert("¿Seguro que desea eliminar?");
	    var $li = $(this).closest('li[data-id]');
	    var id = $li.data('id');
	    modifyEventStatus(id);
	    $li.hide();
	    return false;
	 });

	$(document).on('click','.fav-handler',function(){
	    var $li = $(this).closest('li[data-id]');
	    var id = $li.data('id');
	    modifyFavourite(id);
	    $li.appendTo('#favoritos');
	    return false;
	});

		/* Formulario */
	$('#nuevoEvento').submit(function() { 
			$( "body" ).pagecontainer( "change", "#menu");
			alert("yey");
			var titulo = $("#titulo").val();
			var contenido = $("#contenido").val();
			var fecha = $("#fecha").val();
			var categoria = $('#categoria').val();
			addEventAjax(titulo,contenido,fecha,categoria);
			
	});


	function refreshList(titulo,contenido,fecha,categoria,last_id){
		$icons='<a href="#" class="fav-handler"><img src="images/myImg/star.png"></a><a href="#" class="delete-handler"><img src="images/myImg/trash.png" alt=""></a>';
		$myFakeCard = $("<li class='card' data-id="+last_id+">").append($("<div class='wrapper'>")
				.append($("<div class='text'></div>").append($("<h1>"+ titulo +"</h1><p class='date'>"+ fecha +"</p><p>"+ contenido +"</p>")))
				.append($("<div class='card-icons'>").append($icons))); 


		if(categoria==1){
			$('#colectivos .card-wrapper').append($myFakeCard);
		}
		else if(categoria==2){
			$('#personales .card-wrapper').append($myFakeCard);
		}
			

	}

});
	/* !Formulario */


	/*




	Para traer los datos ordenados, los traigo directamente desde el MySQL ordenados, en la consulta.
	De esa manera me los va a tirar ordenado.


	



	Hay un método que se llama .enhanceWithin que lo que hace es un refresh de los estilos
	de jquery mobile. Puede ser que metamos botones con clases de jquery Mobile y que 
	no se vean, para eso usamos este método.

	Tengo que usar local storage para dos cosas:
	1. Para que si inicia la app y no hay conexión, muestre los datos viejos.
	2. Para que si está subiendo algo y se queda si señal, pueda mandarlo más tarde.

	Ver el refresh de las listas.

	Cuando hago la consulta de ajax, si encuentra un echo, eso es lo que recibe en la 
	función done o en la función success. Lo que puedo hacer si tengo muchos datos que devolver
	es escribir mi propio json. Me armo un objeto en el php y con json encode tengo un 
	array de datos.

	Para seleccinar múltiples tablas -> Ver INNER JOIN, LEFT, JOIN, etc.
	 SELECT * FROM preguntas LEFT JOIN respuestas ON ....


	Si el usuario borra algo o actualzia, 
	newsList.listview("refresh");

	Darle al form un val(); de "" cuando termina de hacer la consulta 

	MAPA

	1) No hay internet
		-> Pantalla con "reintentar"

	2) Hay internet (primera vez)
		-> Si no hay nada en local storage (el id del usuario) -> Muesto el login

	3) Hay algo en local storage
		-> Con internet
		-> Sin internet

	

	Si no hay conexión y no hay local storage: Cartel que diga que no funciona
		Si hay local storage le muestra algo.

	
	La primer pantalla de la app sea por default que tenga un botón qie diga
	"intentar nuevamente".

	Guardo el ID con local storage.
	Un botón salir que borre el local storage.

	AGREGAR data-role="list-view" a la lista!!

	Ver como quedar seleccionado en la navbar que usé ultimo.
	Voy a tener que guardar en una variable el lugar que cliqueé




	*/
