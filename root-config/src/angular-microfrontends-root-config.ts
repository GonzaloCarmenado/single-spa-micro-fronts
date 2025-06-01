import { registerApplication, start } from "single-spa"
import { constructApplications, constructRoutes, constructLayoutEngine } from "single-spa-layout"
async function waitForLayout(): Promise<HTMLTemplateElement> {
  return new Promise((resolve) => {
    const check = () => {
      const layout = document.querySelector("#single-spa-layout") as HTMLTemplateElement
      if (layout) resolve(layout)
      else setTimeout(check, 50)
    }
    check()
  })
}
async function bootstrap() {
  const layoutEl = await waitForLayout()
  const routes = constructRoutes(layoutEl)
  const applications = constructApplications({
    routes,
    loadApp({ name }) {
      // @ts-ignore
      return System.import(name)
    },
  })

  const layoutEngine = constructLayoutEngine({ routes, applications })
  applications.forEach(registerApplication)
  layoutEngine.activate()
  start()
}

bootstrap()
