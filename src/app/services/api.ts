import axios from 'axios';


const api = axios.create({

  baseURL: import.meta.env.VITE_API_URL,

  headers: {

    'Content-Type': 'application/json',

  },

});





api.interceptors.request.use(

  (config) => {


    const token =
      localStorage.getItem('token');



    if (token) {

      // Não enviar token de colaborador nas rotas públicas do wizard
      const isWizardRoute = config.url && (
        config.url.includes('/companies/landing') ||
        (config.url.match(/\/companies\/\d+$/) && config.method === 'patch') ||
        config.url.includes('/company-contacts') ||
        config.url.includes('/company-disclosures') ||
        config.url.includes('/social-networks') ||
        config.url.includes('/company-solutions') ||
        config.url.includes('/documents') ||
        config.url.includes('/terms-acceptance')
      );

      // Só envia token se não for rota do wizard OU se o usuário for do tipo COMPANY
      let isCollaboratorToken = false;
      try {
        const user = localStorage.getItem('user');
        if (user) {
          const u = JSON.parse(user);
          isCollaboratorToken = !!u.role;
        }
      } catch {}

      if (!isWizardRoute || !isCollaboratorToken) {
        config.headers =
          config.headers || {};

        config.headers.Authorization =
          `Bearer ${token}`;
      }


    }



    return config;


  },



  (error) => {


    return Promise.reject(error);


  }

);





export default api;