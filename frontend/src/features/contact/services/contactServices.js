import api from "../../../services/api"

const contactUsServices = {
    async sendInquiry(contactUsData){
        try {
            // api.post returns parsed response.data for 2xx
            const data = await api.post("api/contact/sendEmail", contactUsData, "");
            return { ok: true, data };
        } catch (err) {
            // normalize axios error into a consistent object
            const responseData = err?.response?.data || { message: 'Unknown error', errors: [] };
            return { ok: false, ...responseData };
        }
    },
}

export default contactUsServices;
