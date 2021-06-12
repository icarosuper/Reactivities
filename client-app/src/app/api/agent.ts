import axios, {AxiosError} from 'axios';
import {Activity} from "../models/activity";
import {toast} from "react-toastify";
import {history} from "../../index";
import {store} from "../stores/store";

const api = axios.create({
	baseURL: 'http://localhost:5000/api',
})

axios.interceptors.response.use(async response => {
	await new Promise(resolve => setTimeout(resolve, 500));
	return response;
}, (error: AxiosError) => {
	const {data, status, config} = error.response!;

	switch(status) {
		case 400:
			if(typeof data === 'string')
				toast.error(data);

			if(config.method === 'get' && data.errors.hasOwnProperty('id'))
				history.push('/not-found');

			if(data.errors) {
				const modalStateErrors = [];
				for (const key in data.errors) {
					if(data.errors[key])
						modalStateErrors.push(data.errors[key]);
				}

				throw modalStateErrors.flat();
			}
			break;
		case 401:
			toast.error('Unauthorized');
			break;
		case 404:
			history.push('/not-found');
			break;
		case 500:
			store.commonStore.setServerError(data);
			history.push('/server-error');
			break;
	}

	return Promise.reject(error);
})

const Activities = {
	getAll: () => api.get<Activity[]>('/activities').then(res => res.data),
	getOne: (id: string) => api.get<Activity>(`/activities/${id}`).then(res => res.data),
	create: (activity: Activity) => api.post<void>(`/activities`, activity).then(res => res.data),
	update: (activity: Activity) => api.put<void>(`/activities/${activity.id}`, activity).then(res => res.data),
	delete: (id: string) => api.delete<void>(`/activities/${id}`).then(res => res.data),
}

export default Activities;
