import React, {useEffect, useState} from 'react';
import './styles.css';
import axios from 'axios';
import {Container} from 'semantic-ui-react';
import {Activity} from "../models/activity";
import NavBar from "./navbar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import {v4 as uuid} from 'uuid';

function App() {
	const [activities, setActivities] = useState<Activity[]>([]);
	const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
	const [editMode, setEditMode] = useState(false);

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
		axios.get<Activity[]>('http://localhost:5000/api/activities')
			.then(res => {
				setActivities(res.data);
			});
	}, []);

	const handleChangeActivity = (activity: Activity) => {
		activity.id
			? setActivities([...activities.filter(x => x.id !== activity.id), activity])
			: setActivities([...activities, {...activity, id: uuid()}]);

		setEditMode(false);
		setSelectedActivity(activity);
	}

	const handleDeleteActivity = (id: string) => {
		setActivities([...activities.filter(x => x.id !== id)]);
	}

	return (
		<>
			<NavBar openForm={openForm}/>
			<Container style={{marginTop: '7em'}}>
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
				/>
			</Container>
		</>
	);
}

export default App;
