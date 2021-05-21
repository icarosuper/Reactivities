import React, {useEffect, useState} from 'react';
import './styles.css';
import {Container} from 'semantic-ui-react';
import {Activity} from "../models/activity";
import NavBar from "./navbar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import {v4 as uuid} from 'uuid';
import Activities from "../api/agent";
import LoadingComponent from "./LoadingComponent";

function App() {
	const [activities, setActivities] = useState<Activity[]>([]);
	const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
	const [editMode, setEditMode] = useState(false);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);

	const selectActivity = (id: string) => {
		setSelectedActivity(activities.find(x => x.id === id));
	}

	const cancelActivity = () => {
		setSelectedActivity(undefined);
	}

	const openForm = (id?: string) => {
		id ? selectActivity(id) : cancelActivity();
		setEditMode(true);
	}

	const closeForm = () => {
		setEditMode(false);
	}

	useEffect(() => {
		Activities.getAll().then(res => {
			res.forEach(item => item.date = item.date.split('T')[0]);
			setActivities(res);
			setLoading(false);
		});
	}, []);

	const handleChangeActivity = async (activity: Activity) => {
		setSubmitting(true);

		if(activity.id) {
			await Activities.update(activity);
			setActivities([...activities.filter(x => x.id !== activity.id), activity]);

			setEditMode(false);
			setSelectedActivity(activity);
			setSubmitting(false);
		} else {
			activity.id = uuid();
			await Activities.create(activity);
			setActivities([...activities, activity]);

			setEditMode(false);
			setSelectedActivity(activity);
			setSubmitting(false);
		}
	}

	const handleDeleteActivity = async (id: string) => {
		setSubmitting(true);

		await Activities.delete(id);
		setActivities([...activities.filter(x => x.id !== id)]);
		setSubmitting(false);
	}

	return (
		<>
			<NavBar openForm={openForm}/>
			<Container style={{marginTop: '7em'}}>
				{
					loading ? (
						<LoadingComponent/>
					) : (
						<ActivityDashboard
							activities={activities}
							selectedActivity={selectedActivity}
							selectActivity={selectActivity}
							cancelActivity={cancelActivity}
							editMode={editMode}
							openForm={openForm}
							closeForm={closeForm}
							changeActivity={handleChangeActivity}
							deleteActivity={handleDeleteActivity}
							submitting={submitting}
						/>
					)
				}
			</Container>
		</>
	);
}

export default App;
