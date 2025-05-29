const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-ts");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (webpackConfigEnv, argv) => {
  const orgName = "angular-microfrontends";

  // Genera la configuración base con opciones específicas del proyecto
  const defaultConfig = singleSpaDefaults({
    orgName, // nombre de la organización, usado como prefijo en los nombres de los módulos
    projectName: "root-config", // nombre del microfrontend
    webpackConfigEnv,
    argv,
    disableHtmlGeneration: true, // desactiva la generación automática del HTML (porque usamos HtmlWebpackPlugin manualmente)
  });

  // Mezclamos la configuración base con personalizaciones adicionales
  return merge(defaultConfig, {
    // Configuración del servidor de desarrollo
    devServer: {
      historyApiFallback: true, // redirige cualquier ruta al index.html (necesario para SPA)
      headers: {
        // Evita problemas de CORS cuando los microfrontales se sirven desde distintos puertos
        "Access-Control-Allow-Origin": "*",
      },
    },
    plugins: [
      // Genera el archivo HTML final a partir de la plantilla `src/index.ejs`
      new HtmlWebpackPlugin({
        inject: false, // no inyecta automáticamente los scripts en el HTML (lo manejamos en la plantilla)
        template: "src/index.ejs",
        templateParameters: {
          isLocal: webpackConfigEnv && webpackConfigEnv.isLocal, // permite añadir condiciones en la plantilla
          orgName, // pasa el nombre de la organización a la plantilla
        },
      }),
    ],
  });
};
