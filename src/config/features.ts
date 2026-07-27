export const features = {
  associateArea: import.meta.env.VITE_ASSOCIATE_AREA !== 'false',
  homePassword: import.meta.env.VITE_HOME_PASSWORD !== 'false',
  cadastroEmpresaPassword: import.meta.env.VITE_CADASTRO_EMPRESA_PASSWORD !== 'false',
};