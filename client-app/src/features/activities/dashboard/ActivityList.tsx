import React from 'react';
import {Header} from "semantic-ui-react";
import {useStore} from "../../../app/stores/store";
import {observer} from "mobx-react-lite";
import ActivityListItem from "./ActivityListItem";
import { Fragment } from 'react';

const ActivityList = () => {
	const {activityStore: {groupedActivities}} = useStore();

	return (
		<>
			{groupedActivities.map(([group, activities]) => (
				<Fragment key={group}>
					<Header sub color='teal'>
						{group}
					</Header>
					{activities.map(activity => (
						<ActivityListItem activity={activity} key={activity.id}/>
					))}
				</Fragment>
			))}
		</>
	);
}

export default observer(ActivityList);
