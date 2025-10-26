const BASE_API = process.env.BACKEND_URI;

export const API_ROUTES = {
    BASE_PATH: BASE_API,
    AUTH: {
        LOGIN: `${BASE_API}/api/auth/sign-in`,
        REGISTER: `${BASE_API}/api/auth/sign-up`,
        UPDATE: `${BASE_API}/api/auth/update`,
        PROFILE: `${BASE_API}/api/auth/profile`,
    },
    CONTACTS: {
        ADDTAGS: `${BASE_API}/api/contacts/tags`,
        FETCHALLTAGS: `${BASE_API}/api/contacts/all/tags`,
        CREATECONTACTLIST: `${BASE_API}/api/contacts/add`,
        GETCONTACTLIST: `${BASE_API}/api/contacts//all`,
    },
    TEMPLATE: {
        ADDTEMPLATES: `${BASE_API}/api/templates`,
        GETALLTEMPLATES: `${BASE_API}/api/templates/all`,
        GETTEMPLATEBYID: (id) => `${BASE_API}/api/templates/${id}`,
    },
    CAMPAIGN: {
        GETCONTACTLISTNAME: `${BASE_API}/api/campaigns/listNames`,
        GETALLSENDERS: `${BASE_API}/api/campaigns/sendersNames`,
        GETALLTEMPLATES: `${BASE_API}/api/campaigns/templates`,
        LAUNCHCAMPAIGN: `${BASE_API}/api/campaigns/launch`,
        FETCHALLCAMPS: `${BASE_API}/api/campaigns/get/all`,
    },
};

export const API_KEYS = {
    CONTACTS: {
        FETCHTAGS: ['fetch_tags'],
        GETCONTACTLIST: ['contact_list'],
    },
    TEMPLATES: {
        GETALLTEMPLATES: ['all_templates'],
    },
    CAMPAIGN: {
        GETCONTACTLIST: ['camp_contact_list'],
        GETSENDERNAMES: ['camp_sender_names'],
        GETALLTEMPLATES: ['camp_email_templates'],
        GETALLCAMPAIGNS: ['all_campaigns'],
    },
};

export default API_ROUTES;
