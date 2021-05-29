import React, {useEffect} from 'react';
import {Grid} from "semantic-ui-react";
import ActivityList from "./ActivityList";
import {useStore} from "../../../app/stores/store";
import {observer} from "mobx-react-lite";
import LoadingComponent from "../../../app/layout/LoadingComponent";

const ActivityDashboard = () => {
	const {activityStore} = useStore();
	const {loadingInitial, loadActivities, activities} = activityStore;

	useEffect(() => {
		(async () => {
			if(activities.size <= 1)
				await loadActivities();
		})();
	}, [activities.size, loadActivities]);

	if(loadingInitial) return <LoadingComponent/>;

	return (
		<Grid>
			<Grid.Column width='10'>
				<ActivityList/>
			</Grid.Column>
			<Grid.Column width='6'>
				<h2>Activity Filters</h2>
			</Grid.Column>
		</Grid>
	);
}

export default observer(ActivityDashboard);
