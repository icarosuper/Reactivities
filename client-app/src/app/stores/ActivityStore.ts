import {makeAutoObservable, runInAction} from 'mobx';
import {Activity} from "../models/activity";
import Activities from "../api/agent";
import {v4 as uuid} from 'uuid';

export default class ActivityStore {
	activities = new Map<string, Activity>();
	selectedActivity: Activity | undefined = undefined;
	editMode = false;
	loading = false;
	loadingInitial = true;

	constructor () {
		makeAutoObservable(this)
	}

	get activitiesByDate() {
		return Array.from(this.activities.values()).sort((a,b) => {
			return Date.parse(a.date) - Date.parse(b.date);
		})
	}

	loadActivities = async () => {
		try {
			const activities = await Activities.getAll();

			activities.forEach(activity => {
				activity.date = activity.date.split('T')[0];
				this.activities.set(activity.id, activity);
			});

			this.setLoadingInitial(false);
		} catch (e) {
			console.log(e);
			this.setLoadingInitial(false);
		}
	}

	setLoadingInitial = (state: boolean) => {
		this.loadingInitial = state;
	}

	selectActivity = (id: string) => {
		this.selectedActivity = this.activities.get(id);
	}

	cancelActivity = () => {
		this.selectedActivity = undefined;
	}

	openForm = (id?: string) => {
		id ? this.selectActivity(id) : this.cancelActivity();
		this.editMode = true;
	}

	closeForm = () => {
		this.editMode = false;
	}

	createActivity = async (activity: Activity) => {
		this.loading = true;
		activity.id = uuid();

		try {
			await Activities.create(activity);
			runInAction(() => {
				this.activities.set(activity.id, activity);
				this.selectedActivity = activity;
				this.editMode = false;
				this.loading = false;
			})
		} catch (e) {
			console.log(e);
			runInAction(() => {
				this.loading = false;
			})
		}
	}

	updateActivity = async (activity: Activity) => {
		this.loading = true;

		try {
			await Activities.update(activity);
			runInAction(() => {
				this.activities.set(activity.id, activity);
				this.selectedActivity = activity;
				this.editMode = false;
				this.loading = false;
			});
		} catch (e) {
			console.log(e);
			runInAction(() => {
				this.loading = false;
			});
		}
	}

	deleteActivity = async (id: string) => {
		this.loading = true;

		try {
			await Activities.delete(id);
			runInAction(() => {
				this.activities.delete(id);
				if(this.selectedActivity?.id === id)
					this.cancelActivity();

				this.editMode = false;
				this.loading = false;
			});
		} catch (e) {
			console.log(e);
			runInAction(() => {
				this.loading = false;
			});
		}
	}
}
