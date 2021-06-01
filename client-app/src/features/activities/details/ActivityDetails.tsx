import React, {useEffect} from 'react';
import {Grid} from "semantic-ui-react";
import {useStore} from "../../../app/stores/store";
import {useParams} from 'react-router-dom';
import LoadingComponent from "../../../app/layout/LoadingComponent";
import {observer} from "mobx-react-lite";
import ActivityDetailedHeader from "./ActivityDetailedHeader";
import ActivityDetailedInfo from "./ActivityDetailedInfo";
import ActivityDetailedChat from "./ActivityDetailedChat";
import ActivityDetailedSideBar from "./ActivityDetailedSideBar";

const ActivityDetails = () => {
	const {activityStore: {selectedActivity: activity, loadActivity, loadingInitial}} = useStore();
	const {id} = useParams<{id: string}>();

	useEffect(() => {
		(async () => id ? loadActivity(id) : null)();
	}, [id, loadActivity])

	if(loadingInitial || !activity) return <LoadingComponent/>

	return (
		<Grid>
			<Grid.Column width={10}>
				<ActivityDetailedHeader activity={activity}/>
				<ActivityDetailedInfo activity={activity}/>
				<ActivityDetailedChat/>
			</Grid.Column>
			<Grid.Column width={6}>
				<ActivityDetailedSideBar/>
			</Grid.Column>
		</Grid>
	);
}

export default observer(ActivityDetails);
