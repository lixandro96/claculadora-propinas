// activar el servidor 
// json-server --watch db.json --port 4000

const contenido = document.querySelector("#resumen .contenido");

let cliente = {
  mesa: '',
  hora: '',
  pedido: []
}
const categorias = {
  1 :'Comida',
  2 :'Bebida',
  3 :'Postres'
}

const btnGuardarCliente = document.querySelector("#guardar-cliente");
btnGuardarCliente.addEventListener("click", guardarCliente);

function guardarCliente() {
  const mesa = document.querySelector("#mesa").value;
  const hora = document.querySelector("#hora").value;
  
  const camposVacios = [mesa,hora].some(campo => campo === '');
  if (camposVacios) {
    mostrarAlerta("Por favor, rellene todos los campos");
    return;
  }
  
  // asignar valores a cliente
  cliente = {...cliente, mesa, hora};

  // ocultar modal
  const modalFormulario = document.querySelector('#formulario');
  const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario);
  modalBootstrap.hide();

  mostarSecciones();
  obtenerPlatillos()
  
}

function mostarSecciones() {
  document.querySelectorAll(".d-none").forEach(seccion => seccion.classList.remove("d-none"));

}
function mostrarAlerta(mensaje){
  
  const existe = document.querySelector(".invalid-feedback");

  if (!existe) {
    const alerta = document.createElement("div");
    alerta.classList.add('invalid-feedback','text-center','d-block');
    alerta.textContent = mensaje;
    document.querySelector(".modal-body form").appendChild(alerta);
    setTimeout(() => {
      alerta.remove();
    }, 3000);
  }

}
async function obtenerPlatillos() {
  const url = '../db.json';
  try {
    const respuesta = await fetch(url);
    const data = await respuesta.json();
    mostrarPlatillos(data);
  } catch (error) {
    console.log(error);
  }

}
    
function mostrarPlatillos(platillos) {
  const contenido = document.querySelector(".contenido");
  platillos.forEach(platillo => {
    const {nombre,precio,categoria,id} = platillo;
    const row = document.createElement("div");
    row.classList.add("row",'py-3','border-top');
    
    const nombrePlatillo = document.createElement("div");
    nombrePlatillo.classList.add("col-md-4");
    nombrePlatillo.textContent = nombre;
    row.appendChild(nombrePlatillo);

    const precioPlatillo = document.createElement("div");
    precioPlatillo.classList.add("col-md-3",'fw-bold');
    precioPlatillo.textContent = `RD$ ${precio}`;
    row.appendChild(precioPlatillo);
    
    const categoriaPlatillo = document.createElement("div");
    categoriaPlatillo.classList.add("col-md-3");
    categoriaPlatillo.textContent = categorias[categoria];
    row.appendChild(categoriaPlatillo);
    
    const cantidadPlatillo = document.createElement("input");
    cantidadPlatillo.classList.add("form-control");    
    cantidadPlatillo.type = "number";
    cantidadPlatillo.min = 0;
    cantidadPlatillo.id = `producto-${id}`;
    cantidadPlatillo.value = 0;
    cantidadPlatillo.onchange = function (){
      const cantidad = cantidadPlatillo.value;
      agregarPlatillo({...platillo,cantidad});
    } 

    const agregar = document.createElement("div");
    agregar.classList.add("col-md-2");

    agregar.appendChild(cantidadPlatillo);
    row.appendChild(agregar);
    contenido.appendChild(row);
  });
}

function agregarPlatillo(producto) {
  
  let {pedido} = cliente;

  // si el pedido no existe, crear uno
  if(producto.cantidad > 0){
    // revisar si el pedido ya existe
    if(pedido.some(articulo => articulo.id === producto.id)){

      // si el pedido ya existe, actualizar cantidad
      const pedidoActualizado = pedido.map( articulo =>{
        if( articulo.id === producto.id){
          articulo.cantidad = producto.cantidad;
        }
        
        return articulo; // retorna el articulo modificado
      })
      cliente.pedido =[...pedidoActualizado]; // actualizar el pedido
    }else{

      cliente.pedido =[...pedido,producto];
    }
  }else{
    // eliminar el articulo del pedido si es cero
    const resultado = pedido.filter(articulo => articulo.id !== producto.id);
    cliente.pedido = [...resultado];
  }
  // limpiar resumen
  limparResumen();   

  if(cliente.pedido.length){

    // actualizar resumen
    actualizarResumen();
  }else{
    mensajePedidoVacio()
  }
}

function actualizarResumen() {
  const contenido = document.querySelector("#resumen .contenido");
  const resumen = document.createElement("div");
  resumen.classList.add('col-md-6');

  const divResumen = document.createElement("div");
  divResumen.classList.add('card','py-2','px-3','shadow');

  // informacion de la mesa
  const mesa = document.createElement("p");
  mesa.classList.add('fw-bold');
  mesa.textContent = "Mesa: ";

  const mesaSpan = document.createElement("span");
  mesaSpan.textContent = cliente.mesa;
  mesaSpan.classList.add('fw-normal');
  mesa.appendChild(mesaSpan);

  // informacion de la hora
  const hora = document.createElement("p");
  hora.classList.add('fw-bold');
  hora.textContent = "Hora: ";

  const horaSpan = document.createElement("span");
  horaSpan.textContent = cliente.hora;
  horaSpan.classList.add('fw-normal');
  hora.appendChild(horaSpan);

  const heading = document.createElement("h3");
  heading.classList.add('my-4','text-center');
  heading.textContent = "Platillos consumidos";


  const grupo = document.createElement("UL");
  grupo.classList.add('list-group');

  const {pedido} = cliente;
  pedido.forEach(platillo => {
    const {nombre,cantidad,precio,id} = platillo;

    const lista = document.createElement("LI");
    lista.classList.add('list-group-item');

    const nombreEl = document.createElement("h4");
    nombreEl.textContent = nombre;
    nombreEl.classList.add('my-2');

    const cantidadEl = document.createElement("p");
    cantidadEl.textContent = 'Cantidad: ';
    cantidadEl.classList.add('fw-bold');

    const cantidadSpan = document.createElement("span");
    cantidadSpan.textContent = cantidad;
    cantidadSpan.classList.add('fw-normal');
    cantidadEl.appendChild(cantidadSpan);


    const precioEl = document.createElement("p");
    precioEl.textContent = 'Precio: ';
    precioEl.classList.add('fw-bold');

    const precioSpan = document.createElement("span");
    precioSpan.textContent = `RD$${precio}`;
    precioSpan.classList.add('fw-normal');
    precioEl.appendChild(precioSpan);
    

    const subtotalEl = document.createElement("p");
    subtotalEl.textContent = 'Subtotal: ';
    subtotalEl.classList.add('fw-bold');

    const subtotalSpan = document.createElement("span");
    subtotalSpan.textContent = calcullarSubtotal(precio,cantidad);
    subtotalSpan.classList.add('fw-normal');
    subtotalEl.appendChild(subtotalSpan);
    
    const btnEliminar = document.createElement("button");
    btnEliminar.classList.add('btn','btn-danger','btn-sm');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.onclick = function(){

      eliminarPlatillo(id); // eliminar platillo
    }
    
    lista.appendChild(nombreEl);
    lista.appendChild(cantidadEl);
    lista.appendChild(precioEl);
    lista.appendChild(subtotalEl);
    lista.appendChild(btnEliminar);

    grupo.appendChild(lista);
  });

  // agregar informacion al contenido
  divResumen.appendChild(heading);
  divResumen.appendChild(mesa);
  divResumen.appendChild(hora);
  divResumen.appendChild(grupo);
  
  resumen.appendChild(divResumen)
  contenido.appendChild(resumen);
  forularioPropinas()
  
}

function calcullarSubtotal(precio,cantidad) {
  return `RD$${precio * cantidad}`;
}

function limparResumen() {

  while (contenido.firstChild) {
    contenido.removeChild(contenido.firstChild);
  }
}
function eliminarPlatillo(id) {
  const {pedido} = cliente;
  const resultado = pedido.filter(articulo => articulo.id !== id);
  cliente.pedido = [...resultado];
  limparResumen();
  if(cliente.pedido.length){
    actualizarResumen();
  }else{
    mensajePedidoVacio()
  }
 const productoEliminado = document.querySelector(`#producto-${id}`).value = 0;

}
function mensajePedidoVacio(){

  const mensaje = document.createElement("P");
  mensaje.classList.add('text-center','my-4');
  mensaje.textContent = "Añade los elementos del pedido";
  contenido.appendChild(mensaje);

}

function forularioPropinas(){
  const forulario = document.createElement("div");
  forulario.classList.add('col-md-6','formulario');

  const divFormulario  = document.createElement("div");
  divFormulario.classList.add('card','py-2','px-3','shadow')

  const heading = document.createElement("h3");
  heading.classList.add('my-4','text-center');
  heading.textContent = "Propinas";

  const radio10Div =document.createElement("div");
  radio10Div.classList.add('form-check')

  const radio25Div =document.createElement("div");
  radio25Div.classList.add('form-check')

  const radio50Div =document.createElement("div");
  radio50Div.classList.add('form-check')

  const radio10Label = document.createElement("label");
  radio10Label.classList.add('form-check-label');
  radio10Label.textContent = "10%";

  const radio10Input = document.createElement("input");
  radio10Input.classList.add('form-check-input');
  radio10Input.type = "radio";
  radio10Input.name = "propinas";
  radio10Input.value = "10";
  radio10Input.onclick = calculatrPropinas;

  const radio25Label = document.createElement("label");
  radio25Label.classList.add('form-check-label');
  radio25Label.textContent = "25%";

  const radio25Input = document.createElement("input");
  radio25Input.classList.add('form-check-input');
  radio25Input.type = "radio";
  radio25Input.name = "propinas";
  radio25Input.value = "25";
  radio25Input.onclick = calculatrPropinas;

  const radio50Label = document.createElement("label");
  radio50Label.classList.add('form-check-label');
  radio50Label.textContent = "50%";

  const radio50Input = document.createElement("input");
  radio50Input.classList.add('form-check-input');
  radio50Input.type = "radio";
  radio50Input.name = "propinas";
  radio50Input.value = "50";
  radio50Input.onclick = calculatrPropinas;

  radio10Div.appendChild(radio10Input);
  radio10Div.appendChild(radio10Label);
  radio25Div.appendChild(radio25Input);
  radio25Div.appendChild(radio25Label);
  radio50Div.appendChild(radio50Input);
  radio50Div.appendChild(radio50Label);

  divFormulario.appendChild(heading);
  divFormulario.appendChild(radio10Div);
  divFormulario.appendChild(radio25Div);
  divFormulario.appendChild(radio50Div);
  forulario.appendChild(divFormulario);

  contenido.appendChild(forulario);
} 

function calculatrPropinas(e){
  
  const {pedido} = cliente;
  let subtotal = 0;
  pedido.forEach(articulo => {
    
    subtotal  += articulo.precio *articulo.cantidad;
    
  });
  const propina =(subtotal * parseInt(e.target.value))  / 100;

  const total = propina + subtotal;
  mostrarTotal(propina,subtotal,total);
}

function mostrarTotal(propina,subtotal,total){

  const totalDiv = document.createElement("div");
  totalDiv.classList.add('my-4','total');

  const totalSubtotal = document.createElement("p");
  totalSubtotal.classList.add('fw-bold','fs-4','mt-2');
  totalSubtotal.textContent = `Subtotal consumido: `;
  
  const totalSubtotaSpan = document.createElement("span");
  totalSubtotaSpan.classList.add('fw-normal');
  totalSubtotaSpan.textContent = `RD$${subtotal}`;

  const totalPropina = document.createElement("p");
  totalPropina.classList.add('fw-bold','fs-4','mt-2');
  totalPropina.textContent = `Propina: `;

  const totalPropinaSpan = document.createElement("span");
  totalPropinaSpan.classList.add('fw-normal');
  totalPropinaSpan.textContent = `RD$${propina}`;

  const totalTotal = document.createElement("p");
  totalTotal.classList.add('fw-bold','fs-4','mt-2');
  totalTotal.textContent = `Total a pagar: `;

  const totalTotalSpan = document.createElement("span");
  totalTotalSpan.classList.add('fw-normal','fs-4','mt-2');
  totalTotalSpan.textContent = `RD$${total}`;

  totalSubtotal.appendChild(totalSubtotaSpan);
  totalPropina.appendChild(totalPropinaSpan);
  totalTotal.appendChild(totalTotalSpan);

  const totalPrevious = document.querySelector(".total");
  if(totalPrevious){
    totalPrevious.remove();
  }
  const formulario = document.querySelector(".formulario > div");
  totalDiv.appendChild(totalSubtotal);
  totalDiv.appendChild(totalPropina);
  totalDiv.appendChild(totalTotal);
  formulario.appendChild(totalDiv);

}