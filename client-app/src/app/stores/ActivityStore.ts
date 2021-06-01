import {makeAutoObservable, runInAction} from 'mobx';
import {Activity} from "../models/activity";
import Activities from "../api/agent";

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

	get groupedActivities() {
		return Object.entries(
			this.activitiesByDate.reduce((activities, activity) => {
				const date = activity.date;
				activities[date] = activities[date]
					? [...activities[date], activity]
					: [activity];

				return activities;
			}, {} as {[key: string]: Activity[]})
		)
	}

	loadActivities = async () => {
		this.setLoadingInitial(true);

		try {
			const activities = await Activities.getAll();
			activities.forEach(activity => this.setActivity(activity));
		} catch (e) {
			console.log(e);
		}

		this.setLoadingInitial(false);
	}

	loadActivity = async (id: string) => {
		let activity = this.getActivity(id);

		if(activity) {
			this.selectedActivity = activity;
			return activity;
		}

		else {
			this.loadingInitial = true;

			try {
				activity = await Activities.getOne(id);
				this.setActivity(activity);
				runInAction(() => {
					this.selectedActivity = activity;
				});
				this.setLoadingInitial(false);
				return activity;
			} catch (e) {
				console.log(e);
				this.setLoadingInitial(false);
			}
		}
	}

	private setActivity = (activity: Activity) => {
		activity.date = activity.date.split('T')[0];
		this.activities.set(activity.id, activity);
	}

	private getActivity = (id: string) => this.activities.get(id);

	setLoadingInitial = (state: boolean) => {
		this.loadingInitial = state;
	}

	createActivity = async (activity: Activity) => {
		this.loading = true;

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
