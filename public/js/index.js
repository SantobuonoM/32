const socket = io.connect();

//------------------------------------------------------------------------------------

const inputNombre = document.getElementById('nombre')
const inputPrecio = document.getElementById('precio')
const inputFoto = document.getElementById('foto')

const formAgregarProducto = document.getElementById('formAgregarProducto')
formAgregarProducto.addEventListener('submit', e => {
    e.preventDefault()
    const newProduct = {
        nombre: inputNombre.value,
        precio: inputPrecio.value,
        foto: inputFoto.value
    };
    socket.emit('new-product', newProduct);
    inputNombre.value='';
    inputPrecio.value=0;
    inputFoto.value='';
})
socket.on('products', productos => {
    console.log('products', productos)
    makeHtmlTable(productos).then(html =>{
        document.getElementById('productos').innerHTML=html;
    });
});

// const getProducts = async () => {
//     const products = await fetch('/api/products-test').then(res => res.json()).catch(err => { throw err });    
//     return products
// }

// const products = async () => {
//     const data = await getProducts()
//     makeHtmlTable(data).then(html =>{
//         document.getElementById('productos').innerHTML=html;
//     });
// }

// products()

const makeHtmlTable = (productos)  =>{
    const html = fetch('templates/table.hbs')
        .then(respuesta => respuesta.text())
        .then(plantilla => {
            const template = Handlebars.compile(plantilla);
            const html = template({ productos })
            return html
        })
    return html;
}

//-------------------------------------------------------------------------------------

const inputUsername = document.getElementById('inputUsername')
const inputName = document.getElementById('inputName')
const inputLastname = document.getElementById('inputLastname')
const inputAge = document.getElementById('inputAge')
const inputAlias = document.getElementById('inputAlias')
const inputAvatar = document.getElementById('inputAvatar')
const inputMensaje = document.getElementById('inputMensaje')
const btnEnviar = document.getElementById('btnEnviar')

const formPublicarMensaje = document.getElementById('formPublicarMensaje')
formPublicarMensaje.addEventListener('submit', e => {
    e.preventDefault()
    const newMessage = {
        author: {
            email: inputUsername.value,
            nombre: inputName.value,
            apellido: inputLastname.value,
            edad: inputAge.value,
            alias: inputAlias.value,
            avatar: inputAvatar.value
        },
        text: inputMensaje.value,
        date: new Date().toLocaleString('es-AR'),
    }
    socket.emit('new-message',newMessage);
    formPublicarMensaje.reset()
    inputMensaje.focus()
})

socket.on('messages', mensajes => {
    let mensajesNsize = JSON.stringify(mensajes).length
    console.log(mensajes, mensajesNsize);

    let mensajesD = normalizr.denormalize(mensajes.result, schemaMensajes, mensajes.entities)

    let mensajesDsize = JSON.stringify(mensajesD).length
    console.log(mensajesD, mensajesDsize);

    let porcentajeC = parseInt((mensajesNsize * 100) / mensajesDsize)
    console.log(`Porcentaje de compresión ${porcentajeC}%`)
    document.getElementById('compresion-info').innerText = porcentajeC
    const html = generateMessages(mensajesD.data)
    document.getElementById('mensajes').innerHTML = html;
})

/* --------------------- DESNORMALIZACIÓN DE MENSAJES ---------------------------- */
// Definimos un esquema de autor
const schemaAuthor = new normalizr.schema.Entity('author', {}, { idAttribute: 'email' });

// Definimos un esquema de mensaje
const schemaMensaje = new normalizr.schema.Entity('post', { author: schemaAuthor }, { idAttribute: 'id' })

// Definimos un esquema de posts
const schemaMensajes = new normalizr.schema.Entity('posts', { mensajes: [schemaMensaje] }, { idAttribute: 'id' })

function generateMessages(messages) {
    const html = messages.map(msg => {
        return (`<div>
                <strong style='color: blue;'>${msg.author.email}</strong>
                <em style='color: brown;'>[${msg.date}]</em>: 
                <a style='color: green;font-style: italic;'>${msg.text}</a>
                <img src="${msg.author.avatar}" alt="avatar" width="50" height="50"/>
            </div>`)
    }).join(" ");
    return html;
}

inputUsername.addEventListener('input', () => {
    const hayEmail = inputUsername.value.length
    const hayTexto = inputMensaje.value.length
    inputMensaje.disabled = !hayEmail
    btnEnviar.disabled = !hayEmail || !hayTexto
})

inputMensaje.addEventListener('input', () => {
    const hayTexto = inputMensaje.value.length
    btnEnviar.disabled = !hayTexto
})