import React, {useEffect} from 'react';
import {Button, Card, Image} from "semantic-ui-react";
import {useStore} from "../../../app/stores/store";
import {Link, useParams} from 'react-router-dom';
import LoadingComponent from "../../../app/layout/LoadingComponent";
import {observer} from "mobx-react-lite";

const ActivityDetails = () => {
	const {activityStore: {selectedActivity: activity, loadActivity, loadingInitial}} = useStore();
	const {id} = useParams<{id: string}>();

	useEffect(() => {
		(async () => id ? loadActivity(id) : null)();
	}, [id, loadActivity])

	if(loadingInitial || !activity) return <LoadingComponent/>

	return (
		<Card fluid>
			<Image src={`/assets/categoryImages/${activity.category}.jpg`}/>
			<Card.Content>
				<Card.Header>{activity.title}</Card.Header>
				<Card.Meta>
					<span>{activity.date}</span>
				</Card.Meta>
				<Card.Description>
					{activity.description}
				</Card.Description>
			</Card.Content>
			<Card.Content extra>
				<Button.Group widths='2'>
					<Button
						basic
						color='blue'
						content='Edit'
						as={Link}
						to={`/manage/${activity.id}`}
					/>
					<Button
						basic
						color='grey'
						content='Cancel'
						as={Link}
						to='/activities'
					/>
				</Button.Group>
			</Card.Content>
		</Card>
	);
}

export default observer(ActivityDetails);
