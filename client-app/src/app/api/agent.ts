import axios from 'axios';
import {Activity} from "../models/activity";

const api = axios.create({
	baseURL: 'http://localhost:5000/api',
})

// api.interceptors.response.use(async res => {
// 	try {
// 		await new Promise(resolve => setTimeout(resolve, 500));
// 		return res;
// 	} catch (e) {
// 		console.log(e);
// 		return await Promise.reject(e);
// 	}
// })

const Activities = {
	getAll: () => api.get<Activity[]>('/activities').then(res => res.data),
	getOne: (id: string) => api.get<Activity>(`/activities/${id}`).then(res => res.data),
	create: (activity: Activity) => api.post<void>(`/activities`, activity).then(res => res.data),
	update: (activity: Activity) => api.put<void>(`/activities/${activity.id}`, activity).then(res => res.data),
	delete: (id: string) => api.delete<void>(`/activities/${id}`).then(res => res.data),
}

export default Activities;
