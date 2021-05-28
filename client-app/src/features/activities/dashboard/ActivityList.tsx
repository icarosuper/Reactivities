import React, {SyntheticEvent, useState} from 'react';
import {Button, Item, Label, Segment} from "semantic-ui-react";
import {useStore} from "../../../app/stores/store";
import {observer} from "mobx-react-lite";

const ActivityList = () => {
	const {activityStore: {selectActivity, deleteActivity, activitiesByDate, loading}} = useStore();

	const [target, setTarget] = useState('');

	const handleDelete = async (e: SyntheticEvent<HTMLButtonElement>, id: string) => {
		setTarget(e.currentTarget.name);
		await deleteActivity(id);
	}

	return (
		<Segment>
			<Item.Group divided>
				{activitiesByDate.map(activity => (
					<Item key={activity.id}>
						<Item.Content>
							<Item.Header as='a'>{activity.title}</Item.Header>
							<Item.Meta>{activity.date}</Item.Meta>
							<Item.Description>
								<div>{activity.description}</div>
								<div>{activity.city}, {activity.venue}</div>
							</Item.Description>
							<Item.Extra>
								<Button
									floated='right'
									content='View'
									color='blue'
									onClick={() => selectActivity(activity.id)}
								/>
								<Button
									name={activity.id}
									floated='right'
									content='Delete'
									color='red'
									loading={loading && target === activity.id}
									onClick={e => handleDelete(e, activity.id)}
								/>
								<Label basic content={activity.category}/>
							</Item.Extra>
						</Item.Content>
					</Item>
				))}
			</Item.Group>
		</Segment>
	);
}

export default observer(ActivityList);
