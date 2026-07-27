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

      // Não enviar token de colaborador nas rotas do wizard (/cadastro/*)
      let isCollaboratorToken = false;
      try {
        const user = localStorage.getItem('user');
        if (user) {
          const u = JSON.parse(user);
          isCollaboratorToken = !!u.role;
        }
      } catch {}

      const isAdminEdit = localStorage.getItem('adminEdit') === '1';
      const isInWizard = window.location.pathname.startsWith('/cadastro') && !isAdminEdit;

      if (!isInWizard || !isCollaboratorToken) {
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