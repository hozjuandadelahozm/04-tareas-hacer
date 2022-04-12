require('colors');

const { guardarDB, leerDB } = require('./helpers/crearArchivo');
const { inquirerMenu,
        pausa,
        leerInput,
        listadoTareasBorrar,
        confirmar,
        mostrarListadoChecklist
} = require('./helpers/inquirer');

const Tareas = require('./models/tareas');

const main = async() => {

    let opt = '';
    const tareas = new Tareas();

    const tareasDB = leerDB();

    if ( tareasDB ){
        tareas.cargarTareasFromArray( tareasDB )
    }

    do {
        opt = await inquirerMenu();
        
        switch (opt) {
            case '1':
                // crear opcion
                const desc = await leerInput('Descripcion:');
                tareas.crearTarea( desc );
            break;

            case '2':
                tareas.listadoCompleto();
            break;

            case '3': // Listar Completadas
                tareas.listarPendientesCompletadas(true);
            break;

            case '4': // Listar Pendiente
                tareas.listarPendientesCompletadas(false);
            break;

            case '5': // Completado | Pendiente
                const ids = await mostrarListadoChecklist( tareas.listadoArr );
                tareas.toggleCompletadas( ids )
            break;

            case '6': 
                const id = await listadoTareasBorrar( tareas.listadoArr );
                if( id != '0' ){
                    const ok = await confirmar( '¿Está seguro?' );
                    if (ok) {
                        tareas.borrarTarea( id );
                        console.log('Tarea borrada');
                    }
                }
                
            break;
        }

        guardarDB( tareas.listadoArr );

        await pausa();

    } while ( opt !== '0' );

    // pausa();
}

main();
