import React, {useEffect} from 'react';
import './styles.css';
import {Container} from 'semantic-ui-react';
import NavBar from "./navbar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import LoadingComponent from "./LoadingComponent";
import {useStore} from "../stores/store";
import {observer} from "mobx-react-lite";

function App() {
	const {activityStore} = useStore();
	const {loadingInitial, loadActivities} = activityStore;

	useEffect(() => {
		(async () => await loadActivities())();
	}, [activityStore, loadActivities]);

	return (
		<>
			<NavBar/>
			<Container style={{marginTop: '7em'}}>
				{ loadingInitial ? <LoadingComponent/> : <ActivityDashboard/> }
			</Container>
		</>
	);
}

export default observer(App);
