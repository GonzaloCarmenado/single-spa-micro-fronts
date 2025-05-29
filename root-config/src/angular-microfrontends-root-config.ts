import { registerApplication, start } from "single-spa"
import { constructApplications, constructRoutes, constructLayoutEngine } from "single-spa-layout"

// Espera a que el layout (estructura HTML declarativa con <template>) esté presente en el DOM
async function waitForLayout(): Promise<HTMLTemplateElement> {
  return new Promise((resolve) => {
    const check = () => {
      // Busca el <template id="single-spa-layout"> donde se define la estructura de zonas (header, main, etc)
      const layout = document.querySelector("#single-spa-layout") as HTMLTemplateElement
      if (layout) resolve(layout)
      else setTimeout(check, 50) // Reintenta cada 50ms hasta que aparezca. Esto es útil en entornos donde el DOM se carga de forma asíncrona o si la
      //Conexión es lenta
    }
    check()
  })
}

// Función principal que arranca el sistema de microfrontends
async function bootstrap() {
  // Espera a que el layout esté en el DOM antes de continuar
  const layoutEl = await waitForLayout()

  // Crea el sistema de rutas basado en el template HTML y los atributos route/path
  const routes = constructRoutes(layoutEl)

  // Define qué aplicaciones se montan en cada ruta
  const applications = constructApplications({
    routes,
    loadApp({ name }) {
      // Carga dinámica del microfrontend usando SystemJS (nombre del módulo en import-map)
      // @ts-ignore porque TS no conoce el tipo global de System.import
      return System.import(name)
    },
  })

  // Crea el motor de layout, que se encargará de coordinar el montaje del DOM según las zonas definidas
  const layoutEngine = constructLayoutEngine({ routes, applications })

  // Registra todas las aplicaciones en single-spa para que las controle según la URL activa
  applications.forEach(registerApplication)

  // Activa el sistema de layout (gestión de zonas y orden de montaje)
  layoutEngine.activate()

  // Inicia single-spa: empieza a escuchar cambios de ruta y cargar aplicaciones según corresponda
  start()
}

// Arranca el sistema
bootstrap()
