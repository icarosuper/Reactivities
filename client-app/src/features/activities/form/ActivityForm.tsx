import React, {ChangeEvent, useEffect, useState} from 'react';
import {Button, Form, Segment} from "semantic-ui-react";
import {useStore} from "../../../app/stores/store";
import {observer} from "mobx-react-lite";
import {Link, useHistory, useParams} from "react-router-dom";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import {v4 as uuid} from 'uuid';

const ActivityForm = () => {
	const history = useHistory();

	const {activityStore: {
		createActivity, updateActivity,
		loading, loadActivity, loadingInitial,
	}} = useStore();

	const {id} = useParams<{id: string}>();

	const [activity, setActivity] = useState({
		id: '',
		title: '',
		date: '',
		description: '',
		category: '',
		city: '',
		venue: '',
	});

	useEffect(() => {
		if(id) loadActivity(id).then(activity => setActivity(activity!));
	}, [id, loadActivity]);

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		if (activity.id.length === 0) {
			let newActivity = {
				...activity,
				id: uuid(),
			};

			await createActivity(newActivity);
			history.push(`/activities/${newActivity.id}`);
		} else {
			await updateActivity(activity);
			history.push(`/activities/${activity.id}`);
		}
	}

	const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const {name, value} = e.target;
		setActivity({...activity, [name]: value});
	}

	if(loadingInitial) return <LoadingComponent content='Loading activity...'/>

	return (
		<Segment clearing>
			<Form onSubmit={handleSubmit} autoComplete='off'>
				<Form.Input placeholder='Title' value={activity.title} name='title' onChange={handleInputChange}/>
				<Form.TextArea placeholder='Description' value={activity.description} name='description' onChange={handleInputChange}/>
				<Form.Input placeholder='Category' value={activity.category} name='category' onChange={handleInputChange}/>
				<Form.Input type='date' placeholder='Date' value={activity.date} name='date' onChange={handleInputChange}/>
				<Form.Input placeholder='City' value={activity.city} name='city' onChange={handleInputChange}/>
				<Form.Input placeholder='Venue' value={activity.venue} name='venue' onChange={handleInputChange}/>
				<Button
					loading={loading}
					floated='right'
					positive
					type='submit'
					content='Submit'
				/>
				<Button
					loading={loading}
					floated='right'
					type='button'
					content='Cancel'
					as={Link}
					to='/activities'
				/>
			</Form>
		</Segment>
	);
}

export default observer(ActivityForm);
